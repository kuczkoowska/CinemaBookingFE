import {Component, input, output} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Image} from 'primeng/image';
import {Card} from 'primeng/card';
import {Divider} from 'primeng/divider';
import {Button} from 'primeng/button';
import {Movie} from '@cinemabooking/interfaces/models/movie';
import {Screening} from '@cinemabooking/interfaces/models/screening';

@Component({
  selector: 'app-movie-card-booking',
  imports: [DatePipe, Image, Card, Divider, Button],
  templateUrl: './movie-card-booking.component.html',
})
export class MovieCardBookingComponent {
  public readonly movie = input.required<Movie>();
  public readonly screening = input.required<Screening>();
  public readonly changeDate = output<void>();

  protected onChangeDate(): void {
    this.changeDate.emit();
  }
}
