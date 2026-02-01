import {Component, inject} from '@angular/core';
import {AuthStore} from '@cinemabooking/stores/auth.store';
import {Button} from 'primeng/button';
import {DatePipe, DecimalPipe} from '@angular/common';
import {TableLazyLoadEvent, TableModule} from 'primeng/table';
import {Router, RouterLink} from '@angular/router';
import {Tooltip} from 'primeng/tooltip';
import {BookingStore} from '@cinemabooking/stores/booking.store';

@Component({
  selector: 'app-profile-view',
  imports: [Button, DatePipe, DecimalPipe, TableModule, RouterLink, Tooltip],
  templateUrl: './profile-view.component.html',
})
export class ProfileViewComponent {
  protected readonly authStore = inject(AuthStore);
  protected readonly bookingStore = inject(BookingStore);
  private readonly router = inject(Router);

  protected onLazyLoad(event: TableLazyLoadEvent): void {
    const rows = event.rows ?? 5;
    const page = (event.first ?? 0) / rows;

    this.bookingStore.loadBookings({page, rows});
  }

  protected goToDetails(bookingId: number): void {
    this.router.navigate(['/profile/booking', bookingId]);
  }

}
