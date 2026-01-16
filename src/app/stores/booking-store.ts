import {computed, inject} from '@angular/core';
import {patchState, signalStore, withComputed, withMethods, withState} from '@ngrx/signals';
import {Movie} from '@cinemabooking/interfaces/movie';
import {Screening} from '@cinemabooking/interfaces/screening';
import {Seat, SeatWithStatus} from '@cinemabooking/interfaces/seat';
import {BookingService} from '@cinemabooking/services/booking.service';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {Observable, pipe, switchMap, tap, throwError} from 'rxjs';
import {BookingDto} from '@cinemabooking/interfaces/dto/booking-dto';
import {UpdateTicketTypeDto} from '@cinemabooking/interfaces/dto/ticket-dto';
import {HttpErrorResponse} from '@angular/common/http';

interface BookingState {
  activeBooking: BookingDto | null;
  movie: Movie | null;
  screening: Screening | null;
  seats: Seat[];
  prices: Record<string, number>;
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
  prices: {},
  selectedSeatIds: [],
  ticketSelections: {},
  isLoading: true,
  error: null,
  expirationTime: null
};

export const BookingStore = signalStore(
  withState(initialState),

  withComputed(({seats, selectedSeatIds, activeBooking, ticketSelections, expirationTime, prices}) => ({

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
      const priceMap = prices();
      let total = 0;

      for (const seatId of selectedSeatIds()) {
        const type = ticketSelections()[seatId] || 'NORMALNY';

        const price = priceMap[type];

        total += price;
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

  withMethods((store, bookingService = inject(BookingService)) => ({

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

      if (seatIds.length === 0 || !screening) {
        return;
      }

      const lockDto = {
        screeningId: screening.id,
        seatIds: seatIds
      };

      patchState(store, {isLoading: true});

      bookingService.lockSeats(lockDto).subscribe({
        next: (bookingDto) => {
          console.log(bookingDto)
          patchState(store, {
            isLoading: false,
            activeBooking: bookingDto,
            expirationTime: bookingDto.expirationTime
          });
        },
        error: () => {
          patchState(store, {error: "nie udalo sie", isLoading: false});
        }
      })
    },

    updateLocalTicketType(ticketId: number, newType: any) {
      const current = {...store.ticketSelections()};
      current[ticketId] = newType;
      patchState(store, {ticketSelections: current});
    },

    cancelAndGoBack() {
      const booking = store.activeBooking();

      if (!booking) {
        return;
      }

      patchState(store, {isLoading: true});

      bookingService.cancelBooking(booking.id).subscribe({
        next: () => {
          patchState(store, {
            activeBooking: null,
            expirationTime: null,
            isLoading: false,
            ticketSelections: {}
          });

        },
        error: (err) => {
          console.error('Błąd anulowania:', err);
          patchState(store, {activeBooking: null, isLoading: false});
        }
      });
    },

    cancelBookingSilent(bookingId: number) {
      bookingService.cancelBooking(bookingId).subscribe();

      patchState(store, {
        activeBooking: null,
        expirationTime: null,
        ticketSelections: {}
      });
    },

    submitTicketTypesAndPay(): Observable<any> {
      const booking = store.activeBooking();
      if (!booking) {
        return throwError(() => new Error('Brak aktywnej rezerwacji'));
      }

      // Mapowanie selekcji na DTO
      const updates: UpdateTicketTypeDto[] = booking.tickets.map(ticket => {
        // Jeśli user nic nie wybrał, zostaje typ domyślny biletu
        const selectedType = store.ticketSelections()[ticket.id] || ticket.type;
        return {ticketId: ticket.id, newType: selectedType};
      });

      patchState(store, {isLoading: true, error: null}); // Czyścimy poprzednie błędy

      return bookingService.updateTicketTypes(booking.id, updates).pipe(
        switchMap((updatedBooking) => {
          console.log("1. Typy biletów zaktualizowane. ID:", updatedBooking.id);
          // Aktualizujemy stan w store (np. nowa cena)
          patchState(store, {activeBooking: updatedBooking});
          // Dopiero teraz płacimy
          return bookingService.confirmBooking(updatedBooking.id);
        }),
        tap({
          next: () => {
            console.log("2. Płatność zakończona sukcesem");
            patchState(store, {isLoading: false});
          },
          error: (err: HttpErrorResponse) => {
            console.error("Błąd transakcji:", err);

            // Wyciągamy wiadomość z backendu (dzięki GlobalExceptionHandler)
            const serverMessage = err.error?.error || 'Wystąpił nieoczekiwany błąd';

            patchState(store, {
              isLoading: false,
              error: serverMessage // Zapisujemy to w store, żeby wyświetlić w HTML
            });
          }
        })
      );
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
                prices: data.prices,
                isLoading: false
              });
            })
          );
        })
      )
    )
  }))
);
