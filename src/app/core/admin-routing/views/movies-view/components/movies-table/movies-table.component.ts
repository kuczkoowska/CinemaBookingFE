import {Component, inject, output} from '@angular/core';
import {movieStore} from '@cinemabooking/stores/movie.store';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {ConfirmationService} from 'primeng/api';
import {ConfirmDialog} from 'primeng/confirmdialog';
import {TooltipModule} from 'primeng/tooltip';
import {Movie} from '@cinemabooking/interfaces/models/movie';

@Component({
  selector: 'app-movies-table',
  imports: [TableModule, ButtonModule, ConfirmDialog, TooltipModule],
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
