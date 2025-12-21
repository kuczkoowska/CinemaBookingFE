import {Component, input} from '@angular/core';
import {Movie} from '@cinemabooking/interfaces/movie';
import {GenreNamePipe} from '@cinemabooking/pipes/genre-name.pipe';

@Component({
  selector: 'app-movie-card',
  imports: [GenreNamePipe],
  templateUrl: './movie-card.component.html',
})
export class MovieCardComponent {
  public movie = input.required<Movie>();
}
