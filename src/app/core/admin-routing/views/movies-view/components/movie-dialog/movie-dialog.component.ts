import {Component, inject, input, model} from '@angular/core';
import {Dialog} from 'primeng/dialog';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {ButtonDirective} from 'primeng/button';
import {PrimeTemplate} from 'primeng/api';
import {InputText} from 'primeng/inputtext';
import {movieStore} from '@cinemabooking/stores/movie.store';
import {Movie} from '@cinemabooking/interfaces/movie';
import {TextareaModule} from 'primeng/textarea';
import {InputNumber} from 'primeng/inputnumber';
import {Select} from 'primeng/select';
import {GENRE_SELECT_OPTIONS} from '@cinemabooking/const/movie-genre.constants';
import {MovieForm} from '@cinemabooking/interfaces/form/movie-form';

@Component({
  selector: 'app-movie-dialog',
  imports: [
    Dialog,
    ReactiveFormsModule,
    ButtonDirective,
    PrimeTemplate,
    InputText,
    TextareaModule,
    InputNumber,
    Select,
  ],
  templateUrl: './movie-dialog.component.html',
})
export class MovieDialogComponent {
  public store = inject(movieStore);
  private fb = inject(FormBuilder);

  public visible = model.required<boolean>();
  public movie = input<Movie | null>(null);

  public readonly genreOptions = GENRE_SELECT_OPTIONS.filter((opt) => opt.value !== '');

  public form = this.fb.group<MovieForm>({
    title: this.fb.control('', {nonNullable: true, validators: [Validators.required]}),
    genre: this.fb.control('', {nonNullable: true, validators: [Validators.required]}),
    description: this.fb.control('', {nonNullable: true, validators: [Validators.required]}),

    durationMinutes: this.fb.control(90, {nonNullable: true, validators: [Validators.required, Validators.min(1)]}),
    director: this.fb.control('', {nonNullable: true, validators: [Validators.required]}),
    ageRating: this.fb.control(0, {nonNullable: true, validators: [Validators.required, Validators.min(0)]}),
    posterUrl: this.fb.control('', {nonNullable: true, validators: [Validators.required]}),

    trailerUrl: this.fb.control(null),
  });

  protected initForm(): void {
    const movieData = this.movie();

    if (movieData) {
      this.form.patchValue(movieData);
    } else {
      this.form.reset({
        durationMinutes: 90,
        ageRating: 0,
        title: '', genre: '', director: '', description: '', posterUrl: '', trailerUrl: ''
      });
    }
  }

  protected onSave(): void {
    if (this.form.invalid) return;

    const formValue = this.form.getRawValue();
    const closeDialog = () => this.visible.set(false);

    if (this.movie()) {
      this.store.updateMovie({
        movie: {...formValue, id: this.movie()!.id} as Movie,
        onSuccess: closeDialog,
      });
    } else {
      this.store.addMovie({
        movie: formValue as any,
        onSuccess: closeDialog,
      });
    }
  }
}
