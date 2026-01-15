import {Component, input} from '@angular/core';

@Component({
  selector: 'app-row-numbers',
  imports: [],
  templateUrl: './row-numbers.component.html',
})
export class RowNumbersComponent {
  public row = input.required<number>();
}
