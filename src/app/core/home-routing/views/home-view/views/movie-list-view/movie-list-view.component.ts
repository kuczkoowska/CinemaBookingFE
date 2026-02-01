import {Component, inject} from '@angular/core';
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
import {PaginatorModule, PaginatorState} from 'primeng/paginator';

@Component({
  selector: 'app-movie-list-view',
  imports: [
    MovieCardComponent,
    ReactiveFormsModule,
    MovieFilterComponent,
    SpinnerComponent,
    PaginatorModule,
  ],
  templateUrl: './movie-list-view.component.html',
})
export class MovieListViewComponent {
  protected readonly store = inject(movieStore);

  protected onFiltersChanged(filters: MovieFilters): void {
    this.store.updateFilters(filters);
  }

  protected onPageChange(event: PaginatorState): void {
    if (event.rows && event.rows !== this.store.pageSize()) {
      this.store.setPageSize(event.rows);
      
      return;
    }

    if (event.first !== undefined && event.rows) {
      const newPage = Math.floor(event.first / event.rows) + 1;
      this.store.setPage(newPage);
    }
  }
}
