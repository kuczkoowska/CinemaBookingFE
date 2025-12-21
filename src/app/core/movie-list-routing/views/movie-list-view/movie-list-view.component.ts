import {Component, inject, OnInit} from '@angular/core';
import {MovieService} from '@cinemabooking/services/movie.service';
import {BehaviorSubject, combineLatest, map, Observable} from 'rxjs';
import {Movie} from '@cinemabooking/interfaces/movie';
import {AsyncPipe} from '@angular/common';
import {
  MovieCardComponent
} from '@cinemabooking/core/movie-list-routing/views/movie-list-view/components/movie-card/movie-card.component';
import {ReactiveFormsModule} from '@angular/forms';
import {
  MovieFilterComponent
} from '@cinemabooking/core/movie-list-routing/views/movie-list-view/components/movie-filter/movie-filter.component';
import {MovieFilters} from '@cinemabooking/interfaces/movie-filters';

@Component({
  selector: 'app-movie-list-view',
  imports: [
    AsyncPipe,
    MovieCardComponent,
    ReactiveFormsModule,
    MovieFilterComponent
  ],
  templateUrl: './movie-list-view.component.html',
})
export class MovieListViewComponent implements OnInit {
  public filteredMovies$!: Observable<Movie[]>;
  private movieService = inject(MovieService);
  private filters$ = new BehaviorSubject<MovieFilters>({searchQuery: '', genre: '', hideAdult: false});

  public ngOnInit(): void {
    const movies$ = this.movieService.getMovies();

    this.filteredMovies$ = combineLatest([movies$, this.filters$]).pipe(
      map(([movies, filters]) => {
        return movies.filter((movie) => {
          const matchesTitle = movie.title.toLowerCase().includes((filters.searchQuery || '').toLowerCase());
          const matchesGenre = filters.genre ? movie.genre === filters.genre : true;
          const matchesAge = filters.hideAdult ? movie.ageRating < 16 : true;

          return matchesTitle && matchesGenre && matchesAge;
        });
      })
    );
  }

  public onFiltersChanged(filters: MovieFilters): void {
    this.filters$.next(filters);
  }
}
