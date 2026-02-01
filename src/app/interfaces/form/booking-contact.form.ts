export interface BookingContactDetails {
  readonly contact: {
    readonly email: string;
    readonly phone: string;
  };
  readonly wantsInvoice: boolean;
  readonly invoice?: {
    readonly companyName: string;
    readonly nip: string;
    readonly address: string;
  };
  readonly holders: {
    readonly seatNumber: number;
    readonly name: string;
  }[];
}
