import {Component, computed, input, output} from '@angular/core';
import {ButtonDirective} from 'primeng/button';
import {DatePipe} from '@angular/common';
import {Screening} from '@cinemabooking/interfaces/screening';
import {Ripple} from 'primeng/ripple';
import {TooltipModule} from 'primeng/tooltip';

@Component({
  selector: 'app-repertoire-screening',
  imports: [ButtonDirective, DatePipe, Ripple, TooltipModule],
  templateUrl: './repertoire-screening.component.html',
})
export class RepertoireScreeningComponent {
  public readonly screening = input.required<Screening>();
  public readonly selectScreening = output<number>();

  protected readonly isPast = computed((): boolean => new Date(this.screening().startTime) < new Date());
  protected readonly isSoldOut = computed((): boolean => this.screening().availableSeats === 0);
  protected readonly isLowSeats = computed((): boolean => this.screening().availableSeats <= 10 && this.screening().availableSeats > 0);
  protected readonly isDisabled = computed((): boolean => this.isPast() || this.isSoldOut());

  protected readonly tooltipText = computed((): string => {
    if (this.isPast()) return 'Seans zakończony';
    if (this.isSoldOut()) return 'Brak wolnych miejsc';
    if (this.isLowSeats()) return `Ostatnie ${this.screening().availableSeats} miejsc!`;

    return `${this.screening().availableSeats}/${this.screening().totalSeats} miejsc`;
  });

  protected onClick(): void {
    if (this.isDisabled()) return;

    this.selectScreening.emit(this.screening().id);
  }
}
