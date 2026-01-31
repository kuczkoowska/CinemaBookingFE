import {computed, inject} from '@angular/core';
import {patchState, signalStore, withComputed, withMethods, withState} from '@ngrx/signals';
import {Movie} from '@cinemabooking/interfaces/movie';
import {Screening} from '@cinemabooking/interfaces/screening';
import {Seat, SeatWithStatus} from '@cinemabooking/interfaces/seat';
import {BookingService} from '@cinemabooking/services/booking.service';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {catchError, delay, EMPTY, pipe, switchMap, tap} from 'rxjs';
import {BookingDto} from '@cinemabooking/interfaces/dto/booking-dto';
import {UpdateTicketTypeDto} from '@cinemabooking/interfaces/dto/ticket-dto';
import {TicketType} from '@cinemabooking/enums/ticket-type';
import {withRequestStatus} from '@cinemabooking/stores/features/request-status.store';
import {tapResponse} from '@ngrx/operators';
import {Booking} from '@cinemabooking/interfaces/booking';
import {HttpErrorResponse} from '@angular/common/http';

interface BookingState {
  activeBooking: BookingDto | null;
  movie: Movie | null;
  screening: Screening | null;
  seats: Seat[];
  prices: Record<string, number>;
  selectedSeatIds: number[];
  ticketSelections: Record<number, string>;
  expirationTime: null | string;
  isPaymentProcessing: boolean;
  isPaymentSuccess: boolean;
  isFinished: boolean;
}

const initialState: BookingState = {
  activeBooking: null,
  movie: null,
  screening: null,
  seats: [],
  prices: {},
  selectedSeatIds: [],
  ticketSelections: {},
  expirationTime: null,
  isPaymentProcessing: false,
  isPaymentSuccess: false,
  isFinished: false,
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export const BookingStore = signalStore(
  withState(initialState),
  withRequestStatus(),
  withComputed(
    ({seats, selectedSeatIds, activeBooking, ticketSelections, expirationTime, prices}) => ({
      seatsWithStatus: computed(() => {
        const selectedSet = new Set(selectedSeatIds());

        return seats().map(
          (seat: Seat): SeatWithStatus =>
            ({
              ...seat,
              isSelected: selectedSet.has(seat.id),
            }) as SeatWithStatus,
        );
      }),

      rows: computed(() => groupSeatsByRows(seats(), selectedSeatIds())),

      totalPrice: computed(() => {
        const priceMap = prices();
        const selections = ticketSelections();

        return selectedSeatIds().reduce((total: number, seatId: number): number => {
          const type = selections[seatId] || TicketType.NORMALNY;
          const price = priceMap[type] || priceMap[TicketType.NORMALNY] || 0;

          return total + price;
        }, 0);
      }),

      ticketTypePrices: computed(() => {
        const priceMap = prices();
        const booking = activeBooking();

        if (!booking) return {};

        const result: Record<number, number> = {};
        booking.tickets.forEach((ticket) => {
          const currentType = ticketSelections()[ticket.id] || ticket.type;
          result[ticket.id] = priceMap[currentType] || ticket.price;
        });

        return result;
      }),

      selectedSeatsDetails: computed((): Seat[] => {
        return seats()
          .filter((s: Seat): boolean => selectedSeatIds().includes(s.id))
          .sort((a: Seat, b: Seat): number =>
            a.rowNumber === b.rowNumber ? a.seatNumber - b.seatNumber : a.rowNumber - b.rowNumber,
          );
      }),

      canProceed: computed((): boolean => selectedSeatIds().length > 0),

      ticketsToDisplay: computed(() => {
        const booking = activeBooking();
        if (!booking) return [];

        return [...booking.tickets].sort((a, b) =>
          a.row === b.row ? a.seatNumber - b.seatNumber : a.row - b.row,
        );
      }),

      estimatedTotal: computed((): number => {
        const booking = activeBooking();
        const priceMap = prices();
        const selections = ticketSelections();

        if (!booking) return 0;

        return booking.tickets.reduce((total, ticket) => {
          const currentType = selections[ticket.id] || ticket.type;
          const currentPrice = priceMap[currentType] || ticket.price;
          return total + currentPrice;
        }, 0);
      }),

      isExpired: computed((): boolean => {
        const exp = expirationTime();

        return exp ? new Date().getTime() > new Date(exp).getTime() : false;
      }),
    }),
  ),

  withMethods((store, bookingService = inject(BookingService)) => ({
    markAsFinished() {
      patchState(store, {isFinished: true});
    },

    cancelBookingOnExit(bookingId: number): void {
      bookingService.cancelBooking(bookingId).subscribe();
    },

    toggleSeat(seatId: number): void {
      const currentIds = store.selectedSeatIds();
      const seat = store.seats().find((s) => s.id === seatId);

      if (!seat || !seat.available) return;

      if (currentIds.includes(seatId)) {
        patchState(store, {selectedSeatIds: currentIds.filter((id) => id !== seatId)});
      } else {
        patchState(store, {selectedSeatIds: [...currentIds, seatId]});
      }
    },

    updateLocalTicketType(ticketId: number, newType: TicketType): void {
      patchState(store, (state) => ({
        ticketSelections: {...state.ticketSelections, [ticketId]: newType},
      }));
    },

    cancelBookingSilent: rxMethod<number>(
      pipe(
        switchMap((bookingId) =>
          bookingService.cancelBooking(bookingId).pipe(catchError(() => EMPTY)),
        ),
        tap(() =>
          patchState(store, {
            activeBooking: null,
            expirationTime: null,
            ticketSelections: {},
          }),
        ),
      ),
    ),

    cancelAndGoBack: rxMethod<void>(
      pipe(
        tap(() => store.setLoading()),
        switchMap(() => {
          const booking = store.activeBooking();
          if (!booking) return EMPTY;

          return bookingService.cancelBooking(booking.id).pipe(
            tapResponse({
              next: () => {
                patchState(store, {
                  activeBooking: null,
                  expirationTime: null,
                  ticketSelections: {},
                });
                store.setLoaded();
              },
              error: (err: HttpErrorResponse | Error) => store.setError(err),
            }),
          );
        }),
      ),
    ),

    lockSeats: rxMethod<void>(
      pipe(
        tap(() => store.setLoading()),
        switchMap(() => {
          const screening = store.screening();
          const seatIds = store.selectedSeatIds();

          if (!screening || seatIds.length === 0) {
            store.setLoaded();

            return EMPTY;
          }

          return bookingService.lockSeats({screeningId: screening.id, seatIds}).pipe(
            tapResponse({
              next: (bookingDto) => {
                patchState(store, {
                  activeBooking: bookingDto,
                  expirationTime: bookingDto.expirationTime,
                });
                store.setLoaded();
              },
              error: (err: HttpErrorResponse | Error) => store.setError(err),
            }),
          );
        }),
      ),
    ),

    submitTicketTypesAndPay: rxMethod<{ onSuccess?: () => void } | void>(
      pipe(
        tap(() => store.setLoading()),
        switchMap((payload) => {
          const booking = store.activeBooking();

          if (!booking) return EMPTY;

          const updates: UpdateTicketTypeDto[] = booking.tickets.map((ticket) => ({
            ticketId: ticket.id,
            newType: store.ticketSelections()[ticket.id] || ticket.type,
          }));

          return bookingService.updateTicketTypes(booking.id, updates).pipe(
            switchMap((updatedBooking) => {
              patchState(store, {activeBooking: updatedBooking});

              return bookingService.confirmBooking(updatedBooking.id);
            }),
            tap(() => patchState(store, {isPaymentProcessing: true})),
            delay(2000),
            tapResponse({
              next: () => {
                patchState(store, {
                  isPaymentProcessing: false,
                  isPaymentSuccess: true,
                  isFinished: true,
                });
                store.setLoaded();

                if (payload && typeof payload === 'object' && 'onSuccess' in payload && payload.onSuccess) {
                  payload.onSuccess();
                }
              },
              error: (err: HttpErrorResponse | Error) => {
                patchState(store, {isPaymentProcessing: false});
                store.setError(err);
              },
            }),
          );
        }),
      ),
    ),

    loadBookingData: rxMethod<number>(
      pipe(
        tap(() => store.setLoading()),
        switchMap((screeningId) => {
          return bookingService.getBookingData(screeningId).pipe(
            tapResponse({
              next: (data: Booking) => {
                patchState(store, {
                  movie: data.movie,
                  screening: data.screening,
                  seats: data.seats,
                  prices: data.prices,
                });
                store.setLoaded();
              },
              error: (err: HttpErrorResponse | Error) => store.setError(err),
            }),
          );
        }),
      ),
    ),
  })),
);

function groupSeatsByRows(
  seats: Seat[],
  selectedSeatIds: number[],
): { rowNumber: number; seats: SeatWithStatus[] }[] {
  const selectedSet = new Set(selectedSeatIds);

  const rowNumbers = [...new Set(seats.map((s) => s.rowNumber))].sort((a, b) => a - b);

  return rowNumbers.map((rowNum) => {
    const seatsInRow = seats
      .filter((s) => s.rowNumber === rowNum)
      .sort((a, b) => a.seatNumber - b.seatNumber);

    return {
      rowNumber: rowNum,
      seats: seatsInRow.map(
        (s): SeatWithStatus => ({
          ...s,
          isSelected: selectedSet.has(s.id),
        }),
      ),
    };
  });
}
