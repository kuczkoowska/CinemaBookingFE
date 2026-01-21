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

  public day = input.required<Date>();

  public isSelected = input.required<boolean>();

  public selectDay = output<Date>();

  protected handleClick(): void {
    this.selectDay.emit(this.day());
  }

}
