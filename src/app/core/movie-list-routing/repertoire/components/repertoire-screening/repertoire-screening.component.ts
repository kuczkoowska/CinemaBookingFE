import {Component, input} from '@angular/core';
import {ButtonDirective} from "primeng/button";
import {DatePipe} from "@angular/common";
import {RouterLink} from '@angular/router';
import {Screening} from '@cinemabooking/interfaces/screening';
import {Ripple} from 'primeng/ripple';

@Component({
  selector: 'app-repertoire-screening',
  imports: [
    ButtonDirective,
    DatePipe,
    RouterLink,
    Ripple
  ],
  templateUrl: './repertoire-screening.component.html',
})
export class RepertoireScreeningComponent {
  public screening = input.required<Screening>();
}
