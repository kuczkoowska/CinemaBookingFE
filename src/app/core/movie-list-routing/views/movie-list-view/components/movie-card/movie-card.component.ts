import {Component, input} from '@angular/core';
import {Movie} from '@cinemabooking/interfaces/movie';
import {TitleCasePipe} from '@angular/common';

@Component({
  selector: 'app-movie-card',
  imports: [TitleCasePipe],
  templateUrl: './movie-card.component.html',
})
export class MovieCardComponent {
  public movie = input.required<Movie>();
}
