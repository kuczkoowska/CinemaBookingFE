import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RepertoireScreeningComponent } from '@cinemabooking/core/movie-list-routing/repertoire/components/repertoire-screening/repertoire-screening.component';
import { Tag } from 'primeng/tag';
import { RepertoireItem } from '@cinemabooking/interfaces/repertoire-item';

@Component({
  selector: 'app-repertoire-movie-card',
  imports: [RepertoireScreeningComponent, Tag, RouterModule],
  templateUrl: './repertoire-movie-card.component.html',
})
export class RepertoireMovieCardComponent {
  public readonly item = input.required<RepertoireItem>();
}
