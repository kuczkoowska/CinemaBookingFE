import {Component, computed, inject, input, output, signal} from '@angular/core';
import {Screening} from '@cinemabooking/interfaces/screening';
import {DatePipe} from '@angular/common';
import {DatePickerModule} from 'primeng/datepicker';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-screening-dates',
  imports: [
    DatePipe, DatePickerModule, FormsModule
  ],
  templateUrl: './screening-dates.component.html',
})
export class ScreeningDatesComponent {
  private router = inject(Router);

  public screenings = input.required<Screening[]>();
  public screeningSelect = output<number>();
  public selectedDate = signal<string>(new Date().toISOString().split('T')[0]);
  public readonly days = this.generateDays(4);

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
    this.router.navigate(['/booking', screeningId]);
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
}
