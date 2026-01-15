import {Component, inject, input} from '@angular/core';
import {Tooltip} from 'primeng/tooltip';
import {NgClass} from '@angular/common';
import {SeatWithStatus} from '@cinemabooking/interfaces/seat';
import {BookingStore} from '@cinemabooking/stores/booking-store';

@Component({
  selector: 'app-seat',
  imports: [
    Tooltip,
    NgClass
  ],
  templateUrl: './seat.component.html',
})
export class SeatComponent {
  public store = inject(BookingStore);
  public seat = input.required<SeatWithStatus>()
}
