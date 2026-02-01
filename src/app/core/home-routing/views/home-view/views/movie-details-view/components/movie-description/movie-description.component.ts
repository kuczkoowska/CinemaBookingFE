import {Component, computed, input} from '@angular/core';
import {Movie} from '@cinemabooking/interfaces/movie';
import {SafeUrlPipe} from '@cinemabooking/pipes/safe-url.pipe';

@Component({
  selector: 'app-movie-description',
  imports: [
    SafeUrlPipe
  ],
  templateUrl: './movie-description.component.html',
})
export class MovieDescriptionComponent {
  public movie = input.required<Movie>();

  public embedUrl = computed(() => {
    const url = this.movie().trailerUrl;
    if (!url) return null;

    const videoIdMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/)([\w-]{11}))/);

    return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}` : null;
  });
}
