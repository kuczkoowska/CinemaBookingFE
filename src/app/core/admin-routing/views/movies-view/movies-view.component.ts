import { Component, inject, OnInit, signal } from '@angular/core';
import { Movie } from '@cinemabooking/interfaces/movie';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { MovieDialogComponent } from '@cinemabooking/core/admin-routing/views/movies-view/components/movie-dialog/movie-dialog.component';
import { MoviesTableComponent } from '@cinemabooking/core/admin-routing/views/movies-view/components/movies-table/movies-table.component';
import { movieStore } from '@cinemabooking/stores/movie.store';

@Component({
  selector: 'app-movies-view',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    TextareaModule,
    InputNumberModule,
    FormsModule,
    MovieDialogComponent,
    MoviesTableComponent,
  ],
  templateUrl: './movies-view.component.html',
})
export class MoviesViewComponent implements OnInit {
  public readonly store = inject(movieStore);

  public isDialogVisible = signal(false);
  public movieToEdit = signal<Movie | null>(null);

  public ngOnInit(): void {
    this.store.loadMovies();
  }

  public openAdd(): void {
    this.movieToEdit.set(null);
    this.isDialogVisible.set(true);
  }

  public openEdit(movie: Movie): void {
    this.movieToEdit.set(movie);
    this.isDialogVisible.set(true);
  }
}
