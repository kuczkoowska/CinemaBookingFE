import {Component, effect, inject, input, output} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {debounceTime, distinctUntilChanged} from 'rxjs';
import {MovieFilters} from '@cinemabooking/interfaces/movie-filters';
import {MovieGenre} from '@cinemabooking/enums/movie-genre';
import {GenreNamePipe} from '@cinemabooking/pipes/genre-name.pipe';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {isEqual} from 'lodash-es';

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
        this.filterForm.patchValue(filters, {emitEvent: false});
      }
    });

    this.filterForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged((a, b) => isEqual(a, b)),
        takeUntilDestroyed()
      )
      .subscribe((val) => this.filterChange.emit(val as MovieFilters));
  }
}
