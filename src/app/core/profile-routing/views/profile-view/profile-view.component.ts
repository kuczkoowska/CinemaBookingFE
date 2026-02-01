import {Component, inject, OnInit, signal} from '@angular/core';
import {AuthStore} from '@cinemabooking/stores/auth.store';
import {BookingService} from '@cinemabooking/services/booking.service';
import {BookingDto} from '@cinemabooking/interfaces/dto/booking-dto';
import {Button} from 'primeng/button';
import {DatePipe, DecimalPipe} from '@angular/common';
import {TableLazyLoadEvent, TableModule} from 'primeng/table';
import {Router, RouterLink} from '@angular/router';
import {Tooltip} from 'primeng/tooltip';
import {finalize} from 'rxjs';

@Component({
  selector: 'app-profile-view',
  imports: [Button, DatePipe, DecimalPipe, TableModule, RouterLink, Tooltip],
  templateUrl: './profile-view.component.html',
})
export class ProfileViewComponent implements OnInit {
  protected readonly authStore = inject(AuthStore);
  private readonly bookingService = inject(BookingService);
  private readonly router = inject(Router);
  protected readonly bookings = signal<BookingDto[]>([]);
  protected readonly totalRecords = signal<number>(0);
  protected readonly loading = signal<boolean>(true);

  public ngOnInit(): void {
  }

  protected loadBookings(event: TableLazyLoadEvent): void {
    this.loading.set(true);

    const first = event.first ?? 0;
    const rows = event.rows ?? 5;
    const page = first / rows;

    this.bookingService.getMyBookings(page, rows)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          this.bookings.set(response.content);
          this.totalRecords.set(response.totalElements);
        },
        error: () => {
          this.bookings.set([]);
        }
      });
  }

  protected goToDetails(bookingId: number): void {
    this.router.navigate(['/profile/booking', bookingId]);
  }
}
