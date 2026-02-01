import {Component, effect, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {BookingStore} from '@cinemabooking/stores/booking.store';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthStore} from '@cinemabooking/stores/auth.store';
import {CheckoutForm, HolderForm} from '@cinemabooking/interfaces/form/contact-view-form';
import {BookingContactDetails} from '@cinemabooking/interfaces/form/booking-contact.form';
import {
  InvoiceSectionComponentComponent
} from '@cinemabooking/core/booking-routing/views/booking-view/views/contact-view/components/invoice-section-component/invoice-section-component.component';
import {
  TicketHoldersComponentComponent
} from '@cinemabooking/core/booking-routing/views/booking-view/views/contact-view/components/ticket-holders-component/ticket-holders-component.component';
import {InputText} from 'primeng/inputtext';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-contact-view',
  imports: [
    ReactiveFormsModule,
    InvoiceSectionComponentComponent,
    TicketHoldersComponentComponent,
    InputText,
    Button
  ],
  templateUrl: './contact-view.component.html',
})
export class ContactViewComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  protected readonly store = inject(BookingStore);
  protected readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly form: FormGroup<CheckoutForm> = this.fb.group<CheckoutForm>({
    contact: this.fb.group({
      email: this.fb.nonNullable.control<string>('', [Validators.required, Validators.email]),
      phone: this.fb.nonNullable.control<string>('', [Validators.required, Validators.pattern(/^\d{9,15}$/)]),
    }),
    wantsInvoice: this.fb.nonNullable.control<boolean>(false),
    invoice: this.fb.group({
      companyName: this.fb.nonNullable.control<string>(''),
      nip: this.fb.nonNullable.control<string>(''),
      address: this.fb.nonNullable.control<string>('')
    }),
    holders: this.fb.array<FormGroup<HolderForm>>([])
  });

  public constructor() {
    effect(() => {
      const user = this.authStore.user();
      if (user && !this.form.controls.contact.controls.email.value) {
        this.form.controls.contact.patchValue({email: user.email});
      }
    });
  }

  public ngOnInit(): void {
    const savedDetails = this.store.contactDetails();
    if (savedDetails) {
      this.restoreSavedState(savedDetails);
    } else {
      this.initHoldersArray();
    }
  }

  protected goBack(): void {
    this.store.saveContactDetails(this.form.getRawValue());
    this.router.navigate(['../tickets'], {relativeTo: this.route});
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      
      return;
    }
    this.store.saveContactDetails(this.form.getRawValue());
    this.router.navigate(['../summary'], {relativeTo: this.route});
  }

  private initHoldersArray(): void {
    const tickets = this.store.ticketsToDisplay();
    this.form.controls.holders.clear();

    tickets.forEach((t) => {
      this.form.controls.holders.push(
        this.fb.group<HolderForm>({
          seatNumber: this.fb.nonNullable.control(t.seatNumber),
          name: this.fb.nonNullable.control('')
        })
      );
    });
  }

  private restoreSavedState(savedDetails: BookingContactDetails): void {
    const tickets = this.store.ticketsToDisplay();
    this.form.controls.holders.clear();

    tickets.forEach((t, index) => {
      const savedHolder = savedDetails.holders?.[index];
      this.form.controls.holders.push(
        this.fb.group<HolderForm>({
          seatNumber: this.fb.nonNullable.control(t.seatNumber),
          name: this.fb.nonNullable.control(savedHolder?.name || '')
        })
      );
    });

    this.form.patchValue({
      contact: savedDetails.contact,
      wantsInvoice: savedDetails.wantsInvoice,
      invoice: savedDetails.invoice
    });
  }
}

