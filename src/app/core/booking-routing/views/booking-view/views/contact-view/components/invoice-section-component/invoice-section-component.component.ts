import {Component, DestroyRef, inject, input, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {Checkbox} from 'primeng/checkbox';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-invoice-section-component',
  imports: [ReactiveFormsModule, InputText, Checkbox],
  templateUrl: './invoice-section-component.component.html',
})
export class InvoiceSectionComponentComponent implements OnInit {
  public parentForm = input.required<FormGroup>();
  public wantsInvoiceControl = input.required<FormControl<boolean>>();

  private destroyRef = inject(DestroyRef);

  public ngOnInit(): void {
    this.toggleValidators(this.wantsInvoiceControl().value);

    this.wantsInvoiceControl().valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((wantsInvoice) => this.toggleValidators(wantsInvoice));
  }

  private toggleValidators(wantsInvoice: boolean): void {
    const invoiceGroup = this.parentForm().get('invoice') as FormGroup;

    if (wantsInvoice) {
      invoiceGroup.controls['companyName'].setValidators([Validators.required]);
      invoiceGroup.controls['nip'].setValidators([Validators.required, Validators.minLength(10)]);
      invoiceGroup.controls['address'].setValidators([Validators.required]);
    } else {
      invoiceGroup.controls['companyName'].clearValidators();
      invoiceGroup.controls['nip'].clearValidators();
      invoiceGroup.controls['address'].clearValidators();
    }

    Object.values(invoiceGroup.controls).forEach((c) => c.updateValueAndValidity());
  }
}
