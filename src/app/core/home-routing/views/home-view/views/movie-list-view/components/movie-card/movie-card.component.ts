import {Component, input} from '@angular/core';
import {Movie} from '@cinemabooking/interfaces/movie';
import {GenreNamePipe} from '@cinemabooking/pipes/genre-name.pipe';
import {RouterLink} from '@angular/router';
import {Button} from 'primeng/button';
import {Card} from 'primeng/card';
import {PrimeTemplate} from 'primeng/api';
import {Tag} from 'primeng/tag';

@Component({
  selector: 'app-movie-card',
  imports: [GenreNamePipe, RouterLink, Button, Card, PrimeTemplate, Tag],
  templateUrl: './movie-card.component.html',
})
export class MovieCardComponent {
  public readonly movie = input.required<Movie>();
}
