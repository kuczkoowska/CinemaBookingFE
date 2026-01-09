import {Component, inject, input, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {GenreNamePipe} from '@cinemabooking/pipes/genre-name.pipe';
import {
  MovieDescriptionComponent
} from '@cinemabooking/core/home-routing/views/home-view/views/movie-details-view/components/movie-description/movie-description.component';
import {
  ScreeningDatesComponent
} from '@cinemabooking/core/home-routing/views/home-view/views/movie-details-view/components/screening-dates/screening-dates.component';
import {movieStore} from '@cinemabooking/stores/movie-store';
import {screeningStore} from '@cinemabooking/stores/screening-store';

@Component({
  selector: 'app-movie-details-view',
  imports: [
    GenreNamePipe,
    MovieDescriptionComponent,
    ScreeningDatesComponent
  ],
  templateUrl: './movie-details-view.component.html',
})
export class MovieDetailsViewComponent implements OnInit {
  public id = input.required<number, string>({
    transform: (value) => Number(value)
  });
  protected movieStore = inject(movieStore);
  protected screeningStore = inject(screeningStore);
  private location = inject(Location);

  public ngOnInit(): void {
    this.movieStore.loadMovieById(this.id());
    this.screeningStore.loadScreeningsByMovieId(this.id());
  }

  public goBack(): void {
    this.location.back();
  }

  public handleScreeningSelect(screeningId: number): void {
    console.log(screeningId);
  }
}
