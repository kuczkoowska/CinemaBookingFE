import {Component, effect, inject, OnInit} from '@angular/core';
import {FormArray, FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {BookingStore} from '@cinemabooking/stores/booking.store';
import {ActivatedRoute, Router} from '@angular/router';
import {Button} from 'primeng/button';
import {InputText} from 'primeng/inputtext';
import {AuthStore} from '@cinemabooking/stores/auth.store';
import {Checkbox} from 'primeng/checkbox';
import {BookingContactDetails} from '@cinemabooking/interfaces/form/booking-contact.form';

@Component({
  selector: 'app-contact-view',
  imports: [
    Button,
    ReactiveFormsModule,
    InputText,
    Checkbox
  ],
  templateUrl: './contact-view.component.html',
})
export class ContactViewComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  protected readonly store = inject(BookingStore);
  protected readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly form = this.fb.group({
    contact: this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]]
    }),
    wantsInvoice: [false],

    invoice: this.fb.group({
      companyName: [''],
      nip: [''],
      address: ['']
    }),

    holders: this.fb.array([])
  });

  public constructor() {
    effect(() => {
      const user = this.authStore.user();
      if (user && !this.form.controls.contact.controls.email.value) {
        this.form.controls.contact.patchValue({
          email: user.email
        });
      }
    });
  }

  public ngOnInit(): void {
    this.initHoldersArray();
    this.restoreSavedState();
  }

  protected get holdersArray(): FormArray {
    return this.form.get('holders') as FormArray;
  }

  protected toggleInvoiceValidators(): void {
    const wantsInvoice = this.form.controls.wantsInvoice.value;
    const invoiceGroup = this.form.controls.invoice;

    if (wantsInvoice) {
      invoiceGroup.controls.companyName.setValidators([Validators.required]);
      invoiceGroup.controls.nip.setValidators([Validators.required, Validators.minLength(10)]);
      invoiceGroup.controls.address.setValidators([Validators.required]);
    } else {
      invoiceGroup.controls.companyName.clearValidators();
      invoiceGroup.controls.nip.clearValidators();
      invoiceGroup.controls.address.clearValidators();
    }

    invoiceGroup.controls.companyName.updateValueAndValidity();
    invoiceGroup.controls.nip.updateValueAndValidity();
    invoiceGroup.controls.address.updateValueAndValidity();
  }

  protected goBack(): void {
    const formValue = this.form.getRawValue() as unknown as BookingContactDetails;
    this.store.saveContactDetails(formValue);

    this.router.navigate(['../tickets'], {relativeTo: this.route});
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const formValue = this.form.getRawValue() as unknown as BookingContactDetails;
    this.store.saveContactDetails(formValue);
    this.router.navigate(['../summary'], {relativeTo: this.route});
  }

  private initHoldersArray(): void {
    const tickets = this.store.ticketsToDisplay();
    this.holdersArray.clear();

    tickets.forEach(t => {
      this.holdersArray.push(this.fb.group({
        seatNumber: [t.seatNumber],
        name: ['']
      }));
    });
  }

  private restoreSavedState(): void {
    const savedDetails = this.store.contactDetails();

    if (savedDetails) {
      this.form.patchValue({
        contact: savedDetails.contact,
        wantsInvoice: savedDetails.wantsInvoice,
        invoice: savedDetails.invoice
      });

      if (savedDetails.holders && savedDetails.holders.length > 0) {
        this.holdersArray.patchValue(savedDetails.holders);
      }

      this.toggleInvoiceValidators();
    }
  }
}

