import {Component, input, output} from '@angular/core';
import {DatePipe, NgClass} from "@angular/common";

@Component({
  selector: 'app-day-button',
  imports: [
    DatePipe,
    NgClass
  ],
  templateUrl: './day-button.component.html',
})
export class DayButtonComponent {
  public readonly day = input.required<Date>();
  public readonly isSelected = input.required<boolean>();
  public readonly selectDay = output<Date>();

  protected handleClick(): void {
    this.selectDay.emit(this.day());
  }
}
