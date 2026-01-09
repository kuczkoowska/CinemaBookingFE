import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MovieService} from '@cinemabooking/services/movie.service';
import {Observable, switchMap} from 'rxjs';
import {Movie} from '@cinemabooking/interfaces/movie';
import {AsyncPipe, Location} from '@angular/common';
import {GenreNamePipe} from '@cinemabooking/pipes/genre-name.pipe';
import {Screening} from '@cinemabooking/interfaces/screening';
import {
  MovieDescriptionComponent
} from '@cinemabooking/core/home-routing/views/home-view/views/movie-details-view/components/movie-description/movie-description.component';
import {
  ScreeningDatesComponent
} from '@cinemabooking/core/home-routing/views/home-view/views/movie-details-view/components/screening-dates/screening-dates.component';

@Component({
  selector: 'app-movie-details-view',
  imports: [
    AsyncPipe,
    GenreNamePipe,
    MovieDescriptionComponent,
    ScreeningDatesComponent
  ],
  templateUrl: './movie-details-view.component.html',
})
export class MovieDetailsViewComponent implements OnInit {
  public movie$!: Observable<Movie | undefined>;
  public screenings: Screening[] = [];
  private route = inject(ActivatedRoute);
  private movieService = inject(MovieService);
  private location = inject(Location);

  public ngOnInit(): void {
    this.movie$ = this.route.paramMap.pipe(
      switchMap((params) => {
        const id = Number(params.get('id'));
        this.loadScreenings(id);

        return this.movieService.getMovieById(id);
      })
    );
  }

  public goBack(): void {
    this.location.back();
  }

  public handleScreeningSelect(screeningId: number): void {
    console.log(screeningId);
  }

  private loadScreenings(movieId: number): void {
    this.movieService.getScreenings(movieId).subscribe({
      next: (data) => {
        this.screenings = data;
      },
      error: (err) => console.error('Błąd pobierania seansów', err)
    });
  }
}
