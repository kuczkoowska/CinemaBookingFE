import {Component, computed, effect, inject, input, output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {debounceTime, distinctUntilChanged, map} from 'rxjs';
import {isEqual} from 'lodash-es';
import {InputTextModule} from 'primeng/inputtext';
import {CheckboxModule} from 'primeng/checkbox';
import {ButtonModule} from 'primeng/button';
import {SelectModule} from 'primeng/select';
import {MovieFilters} from '@cinemabooking/interfaces/filters/movie-filters';
import {GENRE_SELECT_OPTIONS} from '@cinemabooking/const/movie-genre.constants';
import {MovieFilterForm} from '@cinemabooking/interfaces/form/movie-filter-form';
import {Badge} from 'primeng/badge';

@Component({
  selector: 'app-movie-filter',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    CheckboxModule,
    ButtonModule,
    SelectModule,
    Badge,
  ],
  templateUrl: './movie-filter.component.html',
})
export class MovieFilterComponent {
  private readonly fb = inject(FormBuilder);
  protected readonly genreOptions = GENRE_SELECT_OPTIONS;

  public readonly currentFilters = input<MovieFilters>();
  public readonly filterChange = output<MovieFilters>();

  protected readonly filterForm: FormGroup<MovieFilterForm> = this.fb.group({
    searchQuery: new FormControl('', {nonNullable: true}),
    genre: new FormControl(''),
    hideAdult: new FormControl(false, {nonNullable: true}),
  });

  protected readonly activeFiltersCount = computed(() => {
    const filters = this.currentFilters();
    if (!filters) return 0;

    let count = 0;
    if (filters.searchQuery && filters.searchQuery.trim() !== '') count++;
    if (filters.genre && filters.genre !== '') count++;
    if (filters.hideAdult) count++;

    return count;
  });

  public constructor() {
    effect((): void => {
      const filters = this.currentFilters();
      if (filters) {
        this.filterForm.patchValue(filters, {emitEvent: false});
      }
    });

    this.filterForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged((prev, curr) => isEqual(prev, curr)),
        map((val): MovieFilters => {
          return {
            searchQuery: val.searchQuery ?? '',
            genre: val.genre ?? '',
            hideAdult: val.hideAdult ?? false
          };
        }),
        takeUntilDestroyed()
      )
      .subscribe((val) => this.filterChange.emit(val));
  }
}
