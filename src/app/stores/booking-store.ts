import {computed, inject} from '@angular/core';
import {patchState, signalStore, withComputed, withMethods, withState} from '@ngrx/signals';
import {Movie} from '@cinemabooking/interfaces/movie';
import {Screening} from '@cinemabooking/interfaces/screening';
import {Seat, SeatWithStatus} from '@cinemabooking/interfaces/seat';
import {BookingService} from '@cinemabooking/services/booking.service';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {pipe, switchMap, tap} from 'rxjs';
import {BookingDto} from '@cinemabooking/interfaces/dto/booking-dto';
import {UpdateTicketTypeDto} from '@cinemabooking/interfaces/dto/ticket-dto';
import {AuthStore} from '@cinemabooking/stores/auth.store';

interface BookingState {
  activeBooking: BookingDto | null;
  movie: Movie | null;
  screening: Screening | null;
  seats: Seat[];
  selectedSeatIds: number[];
  ticketSelections: Record<number, string>;
  isLoading: boolean;
  error: string | null;
  expirationTime: null | string;
}

const initialState: BookingState = {
  activeBooking: null,
  movie: null,
  screening: null,
  seats: [],
  selectedSeatIds: [],
  ticketSelections: {},
  isLoading: true,
  error: null,
  expirationTime: null
};

export const BookingStore = signalStore(
  withState(initialState),

  withComputed(({seats, selectedSeatIds, activeBooking, ticketSelections, expirationTime}) => ({

    seatsWithStatus: computed(() => {
      const selectedSet = new Set(selectedSeatIds());
      return seats().map(seat => ({
        ...seat,
        isSelected: selectedSet.has(seat.id)
      } as SeatWithStatus));
    }),

    rows: computed(() => {
      const selectedSet = new Set(selectedSeatIds());

      const rowNumbers = [...new Set(seats().map(s => s.rowNumber))].sort((a, b) => a - b);

      return rowNumbers.map(rowNum => {
        const seatsInRow = seats()
          .filter(s => s.rowNumber === rowNum)
          .sort((a, b) => a.seatNumber - b.seatNumber)
          .map(seat => ({
            ...seat,
            isSelected: selectedSet.has(seat.id)
          } as SeatWithStatus));

        return {rowNumber: rowNum, seats: seatsInRow};
      });
    }),

    totalPrice: computed(() => {
      const basePrice = 25;
      const reducedPrice = basePrice - 7;

      let total = 0;
      for (const seatId of selectedSeatIds()) {
        const type = ticketSelections()[seatId] || 'NORMAL';
        total += (type === 'NORMAL' ? basePrice : reducedPrice);
      }
      return total;
    }),

    selectedSeatsDetails: computed(() => {
      return seats()
        .filter(s => selectedSeatIds().includes(s.id))
        .sort((a, b) => a.rowNumber === b.rowNumber ? a.seatNumber - b.seatNumber : a.rowNumber - b.rowNumber);
    }),

    canProceed: computed(() => selectedSeatIds().length > 0),
    ticketsToDisplay: computed(() => {
      const booking = activeBooking();
      if (!booking) return [];

      return [...booking.tickets].sort((a, b) =>
        a.row === b.row ? a.seatNumber - b.seatNumber : a.row - b.row
      );
    }),

    estimatedTotal: computed(() => {
      const booking = activeBooking();
      if (!booking) return 0;
      return booking.totalAmount;
    }),

    isExpired: computed(() => {
      const exp = expirationTime();
      if (!exp) return false;

      return new Date().getTime() > new Date(exp).getTime();
    }),
  })),

  withMethods((store, bookingService = inject(BookingService), authStore = inject(AuthStore)) => ({

    toggleSeat(seatId: number) {
      const currentIds = store.selectedSeatIds();
      const seat = store.seats().find(s => s.id === seatId);

      if (!seat || !seat.available) return;

      if (currentIds.includes(seatId)) {
        patchState(store, {selectedSeatIds: currentIds.filter(id => id !== seatId)});
      } else {
        patchState(store, {selectedSeatIds: [...currentIds, seatId]});
      }
    },

    lockSeats() {
      const seatIds = store.selectedSeatIds();
      const screening = store.screening();
      const userId = authStore.user()?.id;

      if (seatIds.length === 0 || !screening) {
        return;
      }

      const lockDto = {
        screeningId: screening.id,
        userId: userId,
        seatIds: seatIds
      };

      patchState(store, {isLoading: true});

      bookingService.lockSeats(lockDto).subscribe({
        next: (bookingDto) => {
          patchState(store, {
            isLoading: false,
            activeBooking: bookingDto,
            expirationTime: bookingDto.expirationTime
          });
        },
        error: () => {
          patchState(store, {error: "nie udalo sie"})
        }
      })
    },

    updateLocalTicketType(ticketId: number, newType: any) {
      const current = {...store.ticketSelections()};
      current[ticketId] = newType;
      patchState(store, {ticketSelections: current});
    },

    submitTicketTypesAndPay() {
      const booking = store.activeBooking();
      if (!booking) return;

      const updates: UpdateTicketTypeDto[] = booking.tickets.map(ticket => {
        const selectedType = store.ticketSelections()[ticket.id] || ticket.type;

        return {
          ticketId: ticket.id,
          newType: selectedType
        };
      });

      patchState(store, {isLoading: true});

      bookingService.updateTicketTypes(booking.id, updates).subscribe({
        next: (updatedBooking) => {
          patchState(store, {
            activeBooking: updatedBooking,
            isLoading: false
          });
        },
        error: () => {
          patchState(store, {isLoading: false, error: 'Błąd aktualizacji cen'});
        }
      });
    },

    confirmBooking() {
      const booking = store.activeBooking();

      if (!booking) {
        return;
      }

      const bookingId = booking.id;

      patchState(store, {isLoading: true});
      bookingService.confirmBooking(bookingId).subscribe({
        next: () => {
          patchState(store, {isLoading: false});
        }
      })
    },


    loadBookingData: rxMethod<number>(
      pipe(
        tap(() => patchState(store, {isLoading: true})),
        switchMap((screeningId) => {
          return bookingService.getBookingData(screeningId).pipe(
            tap((data) => {
              patchState(store, {
                movie: data.movie,
                screening: data.screening,
                seats: data.seats,
                isLoading: false
              });
            })
          );
        })
      )
    )
  }))
);
