import {Component, input} from '@angular/core';
import {ProgressSpinner} from "primeng/progressspinner";

@Component({
  selector: 'app-spinner',
  imports: [
    ProgressSpinner
  ],
  templateUrl: './spinner.component.html',
})
export class SpinnerComponent {
  public label = input.required<string>();
}
