import {Component, inject, input, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {GenreNamePipe} from '@cinemabooking/pipes/genre-name.pipe';
import {
  MovieDescriptionComponent
} from '@cinemabooking/core/home-routing/views/home-view/views/movie-details-view/components/movie-description/movie-description.component';
import {
  ScreeningDatesComponent
} from '@cinemabooking/core/home-routing/views/home-view/views/movie-details-view/components/screening-dates/screening-dates.component';
import {movieStore} from '@cinemabooking/stores/movie.store';
import {screeningStore} from '@cinemabooking/stores/screening.store';
import {Button} from 'primeng/button';
import {Tag} from 'primeng/tag';
import {Message} from 'primeng/message';
import {SpinnerComponent} from '@cinemabooking/ui/spinner/spinner.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-movie-details-view',
  imports: [
    GenreNamePipe,
    MovieDescriptionComponent,
    ScreeningDatesComponent,
    Button,
    Tag,
    Message,
    SpinnerComponent
  ],
  templateUrl: './movie-details-view.component.html',
})
export class MovieDetailsViewComponent implements OnInit {
  public readonly id = input.required<number, string>({
    transform: (value) => Number(value)
  });
  protected readonly movieStore = inject(movieStore);
  protected readonly screeningStore = inject(screeningStore);
  private readonly location = inject(Location);
  private readonly router = inject(Router);

  public ngOnInit(): void {
    this.movieStore.loadMovieById(this.id());
    this.screeningStore.loadScreeningsByMovieId(this.id());
  }

  protected goBack(): void {
    this.location.back();
  }

  public handleScreeningSelect(screeningId: number): void {
    this.router.navigate(['/booking', screeningId]);

  }
}
