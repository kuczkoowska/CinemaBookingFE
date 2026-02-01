import {Component, inject, input} from '@angular/core';
import {GenreNamePipe} from '@cinemabooking/pipes/genre-name.pipe';
import {Button} from 'primeng/button';
import {Card} from 'primeng/card';
import {PrimeTemplate} from 'primeng/api';
import {Tag} from 'primeng/tag';
import {Router, RouterLink} from '@angular/router';
import {Movie} from '@cinemabooking/interfaces/models/movie';

@Component({
  selector: 'app-movie-card',
  imports: [GenreNamePipe, Button, Card, PrimeTemplate, Tag, RouterLink],
  templateUrl: './movie-card.component.html',
})
export class MovieCardComponent {
  private readonly router = inject(Router);
  public readonly movie = input.required<Movie>();

  protected goToMovie(): void {
    const id = this.movie().id;
    this.router.navigate(['movie', id]);
  }
}
