import {Component, input, output} from '@angular/core';
import {Tooltip} from 'primeng/tooltip';
import {NgClass} from '@angular/common';
import {SeatWithStatus} from '@cinemabooking/interfaces/models/seat';

@Component({
  selector: 'app-seat',
  imports: [
    Tooltip,
    NgClass
  ],
  templateUrl: './seat.component.html',
})
export class SeatComponent {
  public seat = input.required<SeatWithStatus>();
  public seatToggle = output<number>();
}
