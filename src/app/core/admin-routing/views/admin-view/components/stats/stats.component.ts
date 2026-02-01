import {Component, input} from '@angular/core';
import {Card} from 'primeng/card';
import {StatItem} from '@cinemabooking/interfaces/ui/stat-item';

@Component({
  selector: 'app-stats',
  imports: [
    Card
  ],
  templateUrl: './stats.component.html',
})
export class StatsComponent {
  public readonly stat = input.required<StatItem>();
}
