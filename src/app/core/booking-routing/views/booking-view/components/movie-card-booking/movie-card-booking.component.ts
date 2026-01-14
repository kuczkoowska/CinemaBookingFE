import {Component, input} from '@angular/core';
import {Screening} from '@cinemabooking/interfaces/screening';
import {Movie} from '@cinemabooking/interfaces/movie';
import {DatePipe} from '@angular/common';
import {Image} from 'primeng/image';
import {Card} from 'primeng/card';
import {Divider} from 'primeng/divider';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-movie-card-booking',
  imports: [
    DatePipe,
    Image,
    Card,
    Divider,
    Button
  ],
  templateUrl: './movie-card-booking.component.html',
})
export class MovieCardBookingComponent {
  public readonly movie = input.required<Movie>();
  public readonly screening = input.required<Screening>();
}
