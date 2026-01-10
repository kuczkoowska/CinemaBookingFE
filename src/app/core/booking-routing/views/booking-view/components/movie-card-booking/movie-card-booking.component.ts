import {Component, input} from '@angular/core';
import {Screening} from '@cinemabooking/interfaces/screening';
import {Movie} from '@cinemabooking/interfaces/movie';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-movie-card-booking',
  imports: [
    DatePipe
  ],
  templateUrl: './movie-card-booking.component.html',
})
export class MovieCardBookingComponent {
  public movie = input.required<Movie>();
  public screening = input.required<Screening>();
}
