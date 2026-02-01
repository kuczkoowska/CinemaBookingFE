import { Component, inject, input } from '@angular/core';
import { Movie } from '@cinemabooking/interfaces/movie';
import { GenreNamePipe } from '@cinemabooking/pipes/genre-name.pipe';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { PrimeTemplate } from 'primeng/api';
import { Tag } from 'primeng/tag';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movie-card',
  imports: [GenreNamePipe, Button, Card, PrimeTemplate, Tag],
  templateUrl: './movie-card.component.html',
})
export class MovieCardComponent {
  private readonly router = inject(Router);
  public readonly movie = input.required<Movie>();

  protected goToMovie(): void {
    const id = this.movie().id;
    if (id == null) return;
    this.router.navigate(['movie', id]);
  }
}
