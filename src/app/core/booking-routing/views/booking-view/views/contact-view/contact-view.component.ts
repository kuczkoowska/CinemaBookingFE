import {Component, effect, inject, OnInit} from '@angular/core';
import {FormArray, FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {BookingStore} from '@cinemabooking/stores/booking.store';
import {ActivatedRoute, Router} from '@angular/router';
import {Button} from 'primeng/button';
import {InputText} from 'primeng/inputtext';
import {AuthStore} from '@cinemabooking/stores/auth.store';
import {Checkbox} from 'primeng/checkbox';

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
  private fb = inject(FormBuilder);
  public store = inject(BookingStore);
  public authStore = inject(AuthStore);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  public form = this.fb.group({
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

  public constructor() {
    effect(() => {
      const user = this.authStore.user();
      if (user) {
        this.form.controls.contact.patchValue({
          email: user.email
        });
      }
    });
  }

  protected get holdersArray(): FormArray {
    return this.form.get('holders') as FormArray;
  }

  public ngOnInit(): void {
    const tickets = this.store.ticketsToDisplay();
    tickets.forEach(t => {
      this.holdersArray.push(this.fb.group({
        seatNumber: [t.seatNumber],
        name: ['']
      }));
    });
  }


  protected goBack(): void {
    this.router.navigate(['../tickets'], {relativeTo: this.route});
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.router.navigate(['../summary'], {relativeTo: this.route});
  }
}

