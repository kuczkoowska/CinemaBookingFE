import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthStore } from '@cinemabooking/stores/auth.store';
import { BookingService } from '@cinemabooking/services/booking.service';
import { BookingDto } from '@cinemabooking/interfaces/dto/booking-dto';
import { Button } from 'primeng/button';
import { DatePipe, DecimalPipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { Router, RouterLink } from '@angular/router';
import { Tooltip } from 'primeng/tooltip';

@Component({
  selector: 'app-profile-view',
  imports: [Button, DatePipe, DecimalPipe, TableModule, RouterLink, Tooltip],
  templateUrl: './profile-view.component.html',
})
export class ProfileViewComponent implements OnInit {
  public auth = inject(AuthStore);
  private bookingService = inject(BookingService);
  private router = inject(Router);

  public bookings = signal<BookingDto[]>([]);
  public totalRecords = signal(0);
  public loading = signal(true);

  ngOnInit() {
    this.loadBookings({ first: 0, rows: 5 });
  }

  loadBookings(event: any) {
    this.loading.set(true);
    const page = event.first / event.rows;
    const size = event.rows;

    this.bookingService.getMyBookings(page, size).subscribe({
      next: (response) => {
        this.bookings.set(response.content);
        this.totalRecords.set(response.totalElements);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  goToDetails(bookingId: number) {
    this.router.navigate(['/profile/booking', bookingId]);
  }
}
