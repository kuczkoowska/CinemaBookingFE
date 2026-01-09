import {Component, effect, inject, input, output} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {debounceTime, map} from 'rxjs';
import {MovieFilters} from '@cinemabooking/interfaces/movie-filters';
import {MovieGenre} from '@cinemabooking/enums/movie-genre';
import {GenreNamePipe} from '@cinemabooking/pipes/genre-name.pipe';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-movie-filter',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    GenreNamePipe
  ],
  templateUrl: './movie-filter.component.html',
})
export class MovieFilterComponent {
  public currentFilters = input<MovieFilters>();

  public genreCodes = Object.values(MovieGenre);

  public filterChange = output<MovieFilters>();

  private fb = inject(FormBuilder);

  public filterForm = this.fb.group({
    searchQuery: [''],
    genre: [''],
    hideAdult: [false]
  });

  public constructor() {
    effect(() => {
      const filters = this.currentFilters();
      if (filters) {
        this.filterForm.patchValue({
          searchQuery: filters.searchQuery,
          genre: filters.genre,
          hideAdult: filters.hideAdult
        }, {emitEvent: false});
      }
    });

    this.filterForm.valueChanges
      .pipe(
        debounceTime(300),
        takeUntilDestroyed(),
        map((values) => ({
          searchQuery: values.searchQuery ?? '',
          genre: values.genre ?? '',
          hideAdult: values.hideAdult ?? false
        } as MovieFilters))
      )
      .subscribe((cleanValues) => {
        this.filterChange.emit(cleanValues);
      });
  }
}
