import {Component, inject, input, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {GenreNamePipe} from '@cinemabooking/pipes/genre-name.pipe';
import {Screening} from '@cinemabooking/interfaces/screening';
import {
  MovieDescriptionComponent
} from '@cinemabooking/core/home-routing/views/home-view/views/movie-details-view/components/movie-description/movie-description.component';
import {
  ScreeningDatesComponent
} from '@cinemabooking/core/home-routing/views/home-view/views/movie-details-view/components/screening-dates/screening-dates.component';
import {movieStore} from '@cinemabooking/stores/movie-store';

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
  protected store = inject(movieStore);
  private location = inject(Location);
  public screenings: Screening[] = [];


  public ngOnInit(): void {
    this.store.loadMovieById(this.id());
  }

  public goBack(): void {
    this.location.back();
  }

  public handleScreeningSelect(screeningId: number): void {
    console.log(screeningId);
  }

  // private loadScreenings(movieId: number): void {
  //   this.movieService.getScreenings(movieId).subscribe({
  //     next: (data) => {
  //       this.screenings = data;
  //     },
  //     error: (err) => console.error('Błąd pobierania seansów', err)
  //   });
  // }
}
