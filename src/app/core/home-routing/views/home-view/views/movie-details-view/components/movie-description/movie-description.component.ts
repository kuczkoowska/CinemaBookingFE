import {Component, input} from '@angular/core';
import {Movie} from '@cinemabooking/interfaces/movie';

@Component({
  selector: 'app-movie-description',
  imports: [],
  templateUrl: './movie-description.component.html',
})
export class MovieDescriptionComponent {
  public movie = input.required<Movie>();
}
