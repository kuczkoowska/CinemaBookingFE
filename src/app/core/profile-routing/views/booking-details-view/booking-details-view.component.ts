import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BookingService} from '@cinemabooking/services/booking.service';
import {BookingDto} from '@cinemabooking/interfaces/dto/booking-dto';
import {Button} from 'primeng/button';
import {DatePipe, DecimalPipe} from '@angular/common';
import {SpinnerComponent} from '@cinemabooking/ui/spinner/spinner.component';
import {Tag} from 'primeng/tag';
import {Divider} from 'primeng/divider';

@Component({
  selector: 'app-booking-details-view',
  imports: [Button, DatePipe, DecimalPipe, SpinnerComponent, Tag, Divider],
  templateUrl: './booking-details-view.component.html',
})
export class BookingDetailsViewComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly bookingService = inject(BookingService);

  public booking = signal<BookingDto | null>(null);
  public isLoading = signal(true);
  public error = signal<string | null>(null);

  public statusSeverity = computed(() => {
    const status = this.booking()?.status;
    switch (status) {
      case 'POTWIERDZONA':
        return 'success';
      case 'OCZEKUJE':
        return 'warn';
      case 'ANULOWANA':
        return 'danger';
      default:
        return 'info';
    }
  });

  public statusLabel = computed(() => {
    const status = this.booking()?.status;
    switch (status) {
      case 'POTWIERDZONA':
        return 'Potwierdzona';
      case 'OCZEKUJE':
        return 'Oczekuje na płatność';
      case 'ANULOWANA':
        return 'Anulowana';
      default:
        return status;
    }
  });

  public ngOnInit(): void {
    const bookingId = Number(this.route.snapshot.paramMap.get('bookingId'));
    if (bookingId) {
      this.loadBooking(bookingId);
    } else {
      this.error.set('Nieprawidłowy identyfikator rezerwacji');
      this.isLoading.set(false);
    }
  }

  private loadBooking(bookingId: number): void {
    this.bookingService.getBookingById(bookingId).subscribe({
      next: (booking) => {
        this.booking.set(booking);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Nie udało się pobrać szczegółów rezerwacji');
        this.isLoading.set(false);
      },
    });
  }

  public goBack(): void {
    this.router.navigate(['/profile']);
  }

  public getTicketTypeLabel(type: string): string {
    switch (type) {
      case 'NORMALNY':
        return 'Normalny';
      case 'ULGOWY':
        return 'Ulgowy';
      default:
        return type;
    }
  }
}
