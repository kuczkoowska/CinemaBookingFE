import {Component, inject, OnInit} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MovieFilters} from '@cinemabooking/interfaces/movie-filters';
import {
  MovieCardComponent
} from '@cinemabooking/core/home-routing/views/home-view/views/movie-list-view/components/movie-card/movie-card.component';
import {
  MovieFilterComponent
} from '@cinemabooking/core/home-routing/views/home-view/views/movie-list-view/components/movie-filter/movie-filter.component';
import {MovieStore} from '@cinemabooking/stores/movie-store';

@Component({
  selector: 'app-movie-list-view',
  imports: [
    MovieCardComponent,
    ReactiveFormsModule,
    MovieFilterComponent
  ],
  templateUrl: './movie-list-view.component.html',
})
export class MovieListViewComponent implements OnInit {
  protected store = inject(MovieStore);

  public ngOnInit(): void {
    this.store.loadMovies();
  }

  public onFiltersChanged(filters: MovieFilters): void {
    this.store.updateFilters(filters);
  }
}
