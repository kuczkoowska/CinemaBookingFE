import {Component, inject, output} from '@angular/core';
import {movieStore} from '@cinemabooking/stores/movie.store';
import {Movie} from '@cinemabooking/interfaces/movie';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {ConfirmationService} from 'primeng/api';

@Component({
  selector: 'app-movies-table',
  imports: [TableModule, ButtonModule],
  templateUrl: './movies-table.component.html',
})
export class MoviesTableComponent {
  public readonly store = inject(movieStore);
  private confirmationService = inject(ConfirmationService);

  public edit = output<Movie>();

  protected onEdit(movie: Movie): void {
    this.edit.emit(movie);
  }

  protected onDelete(movie: Movie): void {
    this.confirmationService.confirm({
      message: `Czy na pewno chcesz usunąć film "${movie.title}"?`,
      header: 'Potwierdzenie',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Tak',
      rejectLabel: 'Nie',
      accept: () => {
        this.store.deleteMovie({id: movie.id});
      },
    });
  }
}
