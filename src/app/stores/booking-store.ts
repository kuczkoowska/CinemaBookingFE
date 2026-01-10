import {patchState, signalStore, withComputed, withMethods, withState} from '@ngrx/signals';
import {Movie} from '@cinemabooking/interfaces/movie';
import {Screening} from '@cinemabooking/interfaces/screening';
import {SeatWithStatus} from '@cinemabooking/interfaces/seat';
import {computed, inject} from '@angular/core';
import {pipe, switchMap, tap} from 'rxjs';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {BookingService} from '@cinemabooking/services/booking.service';

interface BookingState {
  movie: Movie | null;
  screening: Screening | null;
  seats: SeatWithStatus[];
  isLoading: boolean;
}

const initialState: BookingState = {
  movie: null,
  screening: null,
  seats: [],
  isLoading: true,
};

export const bookingStore = signalStore(
  withState(initialState),

  withComputed(({seats}) => ({
    selectedSeats: computed(() => seats().filter((s) => s.isSelected)),
    totalPrice: computed(() => seats().filter((s) => s.isSelected).length * 25), //ustawic potem na cene biletu normalnego
  })),

  withMethods((store, bookingService = inject(BookingService)) => ({

    toggleSeat(seatId: number) {
      patchState(store, (state) => ({
        seats: state.seats.map((seat) => {
          if (seat.id === seatId && seat.available) {
            return {...seat, isSelected: !seat.isSelected};
          }

          return seat;
        })
      }));
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
