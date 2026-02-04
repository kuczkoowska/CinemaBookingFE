import {Component, input, model, output} from '@angular/core';
import {RadioButtonModule} from 'primeng/radiobutton';
import {FormsModule} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {Button} from 'primeng/button';
import {ClassNames} from 'primeng/classnames';

export type PaymentMethod = 'BLIK' | 'CARD';

@Component({
  selector: 'app-payment-method-selector',
  imports: [RadioButtonModule, FormsModule, InputTextModule, Button, ClassNames],
  templateUrl: './payment-method-selector.component.html',
})
export class PaymentMethodSelectorComponent {
  public readonly paymentMethod = model.required<PaymentMethod>();
  public readonly isProcessing = input.required<boolean>();
  public readonly pay = output<void>();

  protected readonly methods: { id: PaymentMethod; label: string; icon?: string }[] = [
    {id: 'BLIK', label: 'Kod BLIK'},
    {id: 'CARD', label: 'Karta płatnicza', icon: 'pi pi-credit-card'}
  ];

}
