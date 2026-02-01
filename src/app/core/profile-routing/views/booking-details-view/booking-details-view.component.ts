import {Component, computed, effect, inject, input, numberAttribute, signal} from '@angular/core';
import {Router} from '@angular/router';
import {BookingService} from '@cinemabooking/services/booking.service';
import {BookingDto} from '@cinemabooking/interfaces/dto/booking-dto';
import {Button} from 'primeng/button';
import {DatePipe, DecimalPipe} from '@angular/common';
import {SpinnerComponent} from '@cinemabooking/ui/spinner/spinner.component';
import {Tag} from 'primeng/tag';
import {Divider} from 'primeng/divider';
import {finalize} from 'rxjs';

@Component({
  selector: 'app-booking-details-view',
  imports: [Button, DatePipe, DecimalPipe, SpinnerComponent, Tag, Divider],
  templateUrl: './booking-details-view.component.html',
})
export class BookingDetailsViewComponent {
  private readonly router = inject(Router);
  private readonly bookingService = inject(BookingService);

  public readonly bookingId = input.required<number, string>({
    transform: numberAttribute,
    alias: 'bookingId'
  });

  protected readonly booking = signal<BookingDto | null>(null);
  protected readonly isLoading = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);

  protected readonly statusSeverity = computed(() => {
    const status = this.booking()?.status;
    const map: Record<string, 'success' | 'warn' | 'danger' | 'info'> = {
      'POTWIERDZONA': 'success',
      'OCZEKUJE': 'warn',
      'ANULOWANA': 'danger'
    };

    return map[status as string] || 'info';
  });

  protected readonly statusLabel = computed(() => {
    const status = this.booking()?.status;
    const map: Record<string, string> = {
      'POTWIERDZONA': 'Potwierdzona',
      'OCZEKUJE': 'Oczekuje na płatność',
      'ANULOWANA': 'Anulowana'
    };

    return map[status as string] || status || '';
  });

  public constructor() {
    effect(() => {
      const id = this.bookingId();
      if (id) {
        this.loadBooking(id);
      }
    });
  }

  protected goBack(): void {
    this.router.navigate(['/profile']);
  }

  protected getTicketTypeLabel(type: string): string {
    const map: Record<string, string> = {
      'NORMALNY': 'Normalny',
      'ULGOWY': 'Ulgowy'
    };

    return map[type] || type;
  }

  private loadBooking(bookingId: number): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.bookingService.getBookingById(bookingId)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (booking) => this.booking.set(booking),
        error: () => this.error.set('Nie udało się pobrać szczegółów rezerwacji'),
      });
  }
}
