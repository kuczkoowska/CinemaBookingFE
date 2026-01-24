import {Component, inject, OnInit} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MovieFilters} from '@cinemabooking/interfaces/filters/movie-filters';
import {
  MovieCardComponent
} from '@cinemabooking/core/home-routing/views/home-view/views/movie-list-view/components/movie-card/movie-card.component';
import {
  MovieFilterComponent
} from '@cinemabooking/core/home-routing/views/home-view/views/movie-list-view/components/movie-filter/movie-filter.component';
import {movieStore} from '@cinemabooking/stores/movie.store';
import {SpinnerComponent} from '@cinemabooking/ui/spinner/spinner.component';

@Component({
  selector: 'app-movie-list-view',
  imports: [
    MovieCardComponent,
    ReactiveFormsModule,
    MovieFilterComponent,
    SpinnerComponent
  ],
  templateUrl: './movie-list-view.component.html',
})
export class MovieListViewComponent implements OnInit {
  protected readonly store = inject(movieStore);

  protected onFiltersChanged(filters: MovieFilters): void {
    this.store.updateFilters(filters);
  }

  public ngOnInit(): void {
    this.store.loadMovies();
  }
}
