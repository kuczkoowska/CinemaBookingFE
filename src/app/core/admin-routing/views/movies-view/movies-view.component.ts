import { ActivatedRoute, Router } from '@angular/router';
import { MoviesTableComponent } from '@cinemabooking/core/admin-routing/views/movies-view/components/movies-table/movies-table.component';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { movieStore } from '@cinemabooking/stores/movie.store';
import { Movie } from '@cinemabooking/interfaces/movie';
import { BackDashboardComponent } from '@cinemabooking/core/admin-routing/components/back-dashboard/back-dashboard.component';

@Component({
  selector: 'app-movies-view',
  imports: [CommonModule, TableModule, ButtonModule, MoviesTableComponent, BackDashboardComponent],
  templateUrl: './movies-view.component.html',
})
export class MoviesViewComponent implements OnInit {
  public readonly store = inject(movieStore);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  public ngOnInit(): void {
    this.store.loadMovies();
  }

  public goToAdd(): void {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  public goToEdit(movie: Movie): void {
    this.router.navigate([movie.id], { relativeTo: this.route });
  }
}
