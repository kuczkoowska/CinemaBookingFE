import {Component, computed, input, output, signal} from '@angular/core';
import {Screening} from '@cinemabooking/interfaces/screening';
import {DatePipe} from '@angular/common';
import {DatePickerModule} from 'primeng/datepicker';
import {FormsModule} from '@angular/forms';
import {Button} from 'primeng/button';
import {Ripple} from 'primeng/ripple';

@Component({
  selector: 'app-screening-dates',
  imports: [
    DatePipe, DatePickerModule, FormsModule, Button, Ripple
  ],
  templateUrl: './screening-dates.component.html',
})
export class ScreeningDatesComponent {
  public readonly screenings = input.required<Screening[]>();
  public readonly screeningSelect = output<number>();
  public readonly selectedDate = signal<string>(this.getLocalDateString(new Date()));
  public readonly days = this.generateDays(5);

  public readonly filteredScreenings = computed(() => {
    const allScreenings = this.screenings();
    const currentDay = this.selectedDate();

    if (!currentDay) return [];

    return allScreenings
      .filter((s) => s.startTime.startsWith(currentDay))
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  });

  public selectDay(date: string): void {
    this.selectedDate.set(date);
  }

  public onScreeningClick(screeningId: number): void {
    this.screeningSelect.emit(screeningId);
  }

  private generateDays(count: number): { label: string, date: string }[] {
    const dates = [];
    for (let i = 0; i < count; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);

      let label = '';
      if (i === 0) label = 'Dzisiaj';
      else {
        label = date.toLocaleDateString('pl-PL', {
          day: 'numeric',
          month: 'numeric'
        });
      }

      const dateString = date.toLocaleDateString('sv-SE');

      dates.push({label, date: dateString});
    }

    return dates;
  }

  private getLocalDateString(date: Date): string {
    const offset = date.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(date.getTime() - offset)).toISOString().slice(0, -1);
    return localISOTime.split('T')[0];
  }
}
