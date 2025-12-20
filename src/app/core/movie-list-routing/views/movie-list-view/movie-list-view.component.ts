import {Component, inject, OnInit} from '@angular/core';
import {MovieService} from '@cinemabooking/services/movie.service';
import {Observable} from 'rxjs';
import {Movie} from '@cinemabooking/interfaces/movie';
import {AsyncPipe} from '@angular/common';
import {
  MovieCardComponent
} from '@cinemabooking/core/movie-list-routing/views/movie-list-view/components/movie-card/movie-card.component';

@Component({
  selector: 'app-movie-list-view',
  imports: [
    AsyncPipe,
    MovieCardComponent
  ],
  templateUrl: './movie-list-view.component.html',
})
export class MovieListViewComponent implements OnInit {
  public movies$!: Observable<Movie[]>;

  private movieService = inject(MovieService);

  public ngOnInit(): void {
    this.movies$ = this.movieService.getMovies();
    console.log(this.movies$);
  }
}
