import {Component, effect, inject, OnInit, signal, untracked} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {movieStore} from '@cinemabooking/stores/movie.store';
import {MovieForm} from '@cinemabooking/interfaces/form/movie-form';
import {GENRE_SELECT_OPTIONS} from '@cinemabooking/const/movie-genre.constants';

import {InputTextModule} from 'primeng/inputtext';
import {TextareaModule} from 'primeng/textarea';
import {InputNumberModule} from 'primeng/inputnumber';
import {SelectModule} from 'primeng/select';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {CreateMovieDto} from '@cinemabooking/interfaces/dto/create-movie-dto';
import {Movie} from '@cinemabooking/interfaces/models/movie';

@Component({
  selector: 'app-movie-form',
  imports: [
    ReactiveFormsModule,
    InputTextModule, TextareaModule, InputNumberModule, SelectModule, ButtonModule, CardModule
  ],
  templateUrl: './movie-form.component.html'
})
export class MovieFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  public readonly store = inject(movieStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly isEditMode = signal(false);
  protected readonly movieId = signal<number | null>(null);
  protected readonly genreOptions = GENRE_SELECT_OPTIONS.filter((opt) => opt.value !== '');

  protected readonly form = this.fb.group<MovieForm>({
    title: this.fb.control('', {nonNullable: true, validators: [Validators.required]}),
    genre: this.fb.control('', {nonNullable: true, validators: [Validators.required]}),
    description: this.fb.control('', {nonNullable: true, validators: [Validators.required]}),
    durationMinutes: this.fb.control(90, {nonNullable: true, validators: [Validators.required, Validators.min(1)]}),
    director: this.fb.control('', {nonNullable: true, validators: [Validators.required]}),
    ageRating: this.fb.control(0, {nonNullable: true, validators: [Validators.required, Validators.min(0)]}),
    posterUrl: this.fb.control('', {nonNullable: true, validators: [Validators.required]}),
    trailerUrl: this.fb.control(null),
  });

  public constructor() {
    effect(() => {
      const movie = this.store.selectedMovie();

      if (this.isEditMode() && movie && movie.id === this.movieId()) {
        untracked(() => {
          this.form.patchValue(movie);
        });
      }
    });
  }

  public ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam && idParam !== 'new') {
      this.isEditMode.set(true);
      const id = Number(idParam);
      this.movieId.set(id);

      this.store.loadMovieById(id);

    } else {
      this.isEditMode.set(false);
      this.form.reset({durationMinutes: 90, ageRating: 0});
    }
  }

  protected onSave(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();

      return;
    }

    const formValue = this.form.getRawValue();

    const onSuccess = (): void => {
      void this.router.navigate(['/admin/movies']);
    };

    if (this.isEditMode() && this.movieId()) {
      this.store.updateMovie({
        movie: {...formValue, id: this.movieId()!} as Movie,
        onSuccess
      });
    } else {
      this.store.addMovie({
        movie: formValue as CreateMovieDto,
        onSuccess
      });
    }
  }

  protected onCancel(): void {
    this.router.navigate(['/admin/movies']);
  }
}
