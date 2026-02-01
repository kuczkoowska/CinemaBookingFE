import {Component, input, output} from '@angular/core';
import {
  DayButtonComponent
} from '@cinemabooking/core/movie-list-routing/repertoire/components/day-button/day-button.component';
import {DatePicker} from 'primeng/datepicker';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-repertoire-calendar',
  imports: [
    DayButtonComponent,
    DatePicker,
    FormsModule
  ],
  templateUrl: './repertoire-calendar.component.html',
})
export class RepertoireCalendarComponent {
  public readonly weekDays = input.required<Date[]>();
  public readonly selectedDate = input.required<Date>();
  public readonly dateSelected = output<Date>();

  protected isSelected(day: Date): boolean {
    return day.toDateString() === this.selectedDate().toDateString();
  }
}
