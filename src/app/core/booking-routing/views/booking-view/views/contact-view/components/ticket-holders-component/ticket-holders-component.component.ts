import {Component, input} from '@angular/core';
import {FormArray, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {HolderForm} from '@cinemabooking/interfaces/form/contact-view-form';

@Component({
  selector: 'app-ticket-holders-component',
  imports: [ReactiveFormsModule, InputText],
  templateUrl: './ticket-holders-component.component.html',
})
export class TicketHoldersComponentComponent {
  public holdersArray = input.required<FormArray<FormGroup<HolderForm>>>();
}
