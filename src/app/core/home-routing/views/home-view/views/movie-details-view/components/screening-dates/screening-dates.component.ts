import {Component, input, output} from '@angular/core';
import {DatePipe} from '@angular/common';
import {DatePickerModule} from 'primeng/datepicker';
import {FormsModule} from '@angular/forms';
import {Button} from 'primeng/button';
import {Ripple} from 'primeng/ripple';
import {TagModule} from 'primeng/tag';
import {Screening} from '@cinemabooking/interfaces/models/screening';

interface CalendarDay {
  label: string;
  date: string;
}

@Component({
  selector: 'app-screening-dates',
  imports: [DatePipe, DatePickerModule, FormsModule, Button, Ripple, TagModule],
  templateUrl: './screening-dates.component.html',
})
export class ScreeningDatesComponent {
  public readonly screenings = input.required<Screening[]>();
  public readonly days = input.required<CalendarDay[]>();
  public readonly selectedDate = input.required<string>();

  public readonly screeningSelect = output<number>();
  public readonly dateChange = output<string>();

  public onDayClick(date: string): void {
    this.dateChange.emit(date);
  }

  public onScreeningClick(screening: Screening): void {
    if (this.isScreeningDisabled(screening)) return;
    this.screeningSelect.emit(screening.id);
  }

  public isScreeningPast(screening: Screening): boolean {
    return new Date(screening.startTime) < new Date();
  }

  public isScreeningSoldOut(screening: Screening): boolean {
    return screening.availableSeats === 0;
  }

  public isScreeningDisabled(screening: Screening): boolean {
    return (
      this.isScreeningPast(screening) ||
      this.isScreeningSoldOut(screening)
    );
  }

  public getScreeningStatus(screening: Screening): { label: string; severity: 'danger' | 'warn' | 'success' } | null {
    if (this.isScreeningPast(screening)) return {label: 'Zakończony', severity: 'danger'};
    if (this.isScreeningSoldOut(screening)) return {label: 'Wyprzedany', severity: 'warn'};
    if (screening.availableSeats <= 10) return {label: `Ostatnie ${screening.availableSeats} miejsc`, severity: 'warn'};

    return null;
  }
}
