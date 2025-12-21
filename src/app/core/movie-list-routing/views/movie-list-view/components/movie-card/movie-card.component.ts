import {Component, input} from '@angular/core';
import {Movie} from '@cinemabooking/interfaces/movie';
import {GenreNamePipe} from '@cinemabooking/pipes/genre-name.pipe';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-movie-card',
  imports: [GenreNamePipe, RouterLink],
  templateUrl: './movie-card.component.html',
})
export class MovieCardComponent {
  public movie = input.required<Movie>();
}
