import {Component, effect, inject, input, output} from '@angular/core';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {debounceTime, distinctUntilChanged} from 'rxjs';
import {isEqual} from 'lodash-es';
import {InputTextModule} from 'primeng/inputtext';
import {CheckboxModule} from 'primeng/checkbox';
import {ButtonModule} from 'primeng/button';
import {SelectModule} from 'primeng/select';
import {MovieFilters} from '@cinemabooking/interfaces/filters/movie-filters';
import {GENRE_SELECT_OPTIONS} from '@cinemabooking/const/movie-genre.constants';

@Component({
  selector: 'app-movie-filter',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    CheckboxModule,
    ButtonModule,
    SelectModule
  ],
  templateUrl: './movie-filter.component.html',
})
export class MovieFilterComponent {
  private readonly fb = inject(FormBuilder);
  protected readonly genreOptions = GENRE_SELECT_OPTIONS;

  public readonly currentFilters = input<MovieFilters>();
  public readonly filterChange = output<MovieFilters>();

  protected readonly filterForm = this.fb.group({
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
