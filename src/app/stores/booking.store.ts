import {computed, inject} from '@angular/core';
import {patchState, signalStore, withComputed, withMethods, withState} from '@ngrx/signals';
import {BookingService} from '@cinemabooking/services/booking.service';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {catchError, delay, EMPTY, pipe, switchMap, tap} from 'rxjs';
import {BookingDto} from '@cinemabooking/interfaces/dto/booking-dto';
import {TicketType} from '@cinemabooking/enums/ticket-type';
import {withRequestStatus} from '@cinemabooking/stores/features/request-status.store';
import {tapResponse} from '@ngrx/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {BookingContactDetails} from '@cinemabooking/interfaces/form/booking-contact.form';
import {UpdateTicketTypeDto} from '@cinemabooking/interfaces/dto/ticket-dto';
import {Movie} from '@cinemabooking/interfaces/models/movie';
import {Screening} from '@cinemabooking/interfaces/models/screening';
import {Seat, SeatWithStatus} from '@cinemabooking/interfaces/models/seat';
import {Booking} from '@cinemabooking/interfaces/models/booking';

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
  contactDetails: BookingContactDetails | null;
  items: BookingDto[];
  totalRecords: number;
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
  contactDetails: null,
  items: [],
  totalRecords: 0,
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

  withMethods((store) => ({
    resetBookingState(): void {
      patchState(store, {
        activeBooking: null,
        selectedSeatIds: [],
        ticketSelections: {},
        expirationTime: null,
        isPaymentProcessing: false,
        isPaymentSuccess: false,
        isFinished: false,
        contactDetails: null,
        movie: null,
        screening: null,
        seats: []
      });
    },

    markAsFinished() {
      patchState(store, {isFinished: true});
    },

    saveContactDetails(details: BookingContactDetails): void {
      patchState(store, {contactDetails: details});
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
  })),

  withMethods((store, bookingService = inject(BookingService)) => ({

    loadBookingData: rxMethod<number>(
      pipe(
        tap(() => {
          store.resetBookingState();
          store.setLoading();
        }),
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

    cancelBookingOnExit: rxMethod<number>(
      pipe(switchMap((id) => bookingService.cancelBooking(id).pipe(catchError(() => EMPTY)))),
    ),

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
          const screening = store.screening();

          if (!booking) {
            patchState(store, {
              activeBooking: null,
              ticketSelections: {},
              expirationTime: null,
              isPaymentProcessing: false,
            });
            store.setLoaded();

            return EMPTY;
          }

          return bookingService.cancelBooking(booking.id).pipe(
            switchMap(() => (screening ? bookingService.getBookingData(screening.id) : EMPTY)),
            tapResponse({
              next: (data: Booking) => {
                const currentSelectedIds = store.selectedSeatIds();
                const availableSelectedIds = currentSelectedIds.filter((seatId) => {
                  const seat = data.seats.find((s) => s.id === seatId);

                  return seat && seat.available;
                });

                patchState(store, {
                  activeBooking: null,
                  ticketSelections: {},
                  expirationTime: null,
                  isPaymentProcessing: false,
                  seats: data.seats,
                  prices: data.prices,
                  selectedSeatIds: availableSelectedIds,
                });
                store.setLoaded();
              },
              error: (err: HttpErrorResponse | Error) => store.setError(err),
            }),
            catchError((err: HttpErrorResponse) => {
              store.setError(err);

              return EMPTY;
            })
          );
        })
      )
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

          const updates = mapTicketsToUpdates(booking, store.ticketSelections());

          return bookingService.updateTicketTypes(booking.id, updates).pipe(
            switchMap((updatedBooking) => {
              patchState(store, {activeBooking: updatedBooking});

              return bookingService.confirmBooking(updatedBooking.id, store.contactDetails());
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
                payload?.onSuccess?.();
              },
              error: (err: HttpErrorResponse) => {
                patchState(store, {isPaymentProcessing: false});
                store.setError(err);
              },
            }),
          );
        }),
      ),
    ),

    loadBookings: rxMethod<{ page: number; rows: number }>(
      pipe(
        tap(() => store.setLoading()),
        switchMap(({page, rows}) =>
          bookingService.getMyBookings(page, rows).pipe(
            tapResponse({
              next: (response) => {
                patchState(store, {
                  items: response.content,
                  totalRecords: response.totalElements,
                });
                store.setLoaded();
              },
              error: () => {
                patchState(store, {items: []});
                store.setLoaded();
              },
            }),
          ),
        ),
      ),
    ),

    loadBookingById: rxMethod<number>(
      pipe(
        tap(() => store.setLoading()),
        switchMap((id) =>
          bookingService.getBookingById(id).pipe(
            tapResponse({
              next: (booking) => {
                patchState(store, {activeBooking: booking});
                store.setLoaded();
              },
              error: (err: HttpErrorResponse | Error) => store.setError(err),
            }),
          ),
        ),
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

function mapTicketsToUpdates(
  booking: BookingDto,
  selections: Record<number, string>,
): UpdateTicketTypeDto[] {
  return booking.tickets.map((ticket) => ({
    ticketId: ticket.id,
    newType: (selections[ticket.id] || ticket.type) as TicketType,
  }));
}
