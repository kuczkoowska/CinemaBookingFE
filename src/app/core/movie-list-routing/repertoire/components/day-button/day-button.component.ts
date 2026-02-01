import {Component, computed, input, output} from '@angular/core';
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
  protected readonly buttonClasses = computed(() => ({
    'flex flex-col items-center justify-center min-w-[4.5rem] py-2 px-3 rounded-xl border transition-all duration-200 cursor-pointer': true,
    'bg-primary border-primary text-white shadow-lg scale-105': this.isSelected(),
    'bg-element border-app-border text-app-muted hover:border-primary hover:text-primary': !this.isSelected()
  }));

  protected handleClick(): void {
    this.selectDay.emit(this.day());
  }


}
