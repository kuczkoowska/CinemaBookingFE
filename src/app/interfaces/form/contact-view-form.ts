import {FormArray, FormControl, FormGroup} from '@angular/forms';

export interface HolderForm {
  seatNumber: FormControl<number>;
  name: FormControl<string>;
}

export interface InvoiceForm {
  companyName: FormControl<string>;
  nip: FormControl<string>;
  address: FormControl<string>;
}

export interface ContactDataForm {
  email: FormControl<string>;
  phone: FormControl<string>;
}

export interface CheckoutForm {
  contact: FormGroup<ContactDataForm>;
  wantsInvoice: FormControl<boolean>;
  invoice: FormGroup<InvoiceForm>;
  holders: FormArray<FormGroup<HolderForm>>;
}
