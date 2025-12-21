import {Component, inject, output} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {debounceTime, map} from 'rxjs';
import {MovieFilters} from '@cinemabooking/interfaces/movie-filters';
import {MovieGenre} from '@cinemabooking/enums/movie-genre';
import {GenreNamePipe} from '@cinemabooking/pipes/genre-name.pipe';

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
  public genreCodes = Object.values(MovieGenre);

  protected filterChange = output<MovieFilters>();

  private fb = inject(FormBuilder);

  public filterForm = this.fb.group({
    searchQuery: [''],
    genre: [''],
    hideAdult: [false]
  });

  public constructor() {
    this.filterForm.valueChanges
      .pipe(
        debounceTime(300),
        map((values) => {
          return {
            searchQuery: values.searchQuery ?? '',
            genre: values.genre ?? '',
            hideAdult: values.hideAdult ?? false
          } as MovieFilters;
        })
      )
      .subscribe((cleanValues) => {
        this.filterChange.emit(cleanValues);
      });
  }
}
