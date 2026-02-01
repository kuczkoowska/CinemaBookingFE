export interface BookingContactDetails {
  contact: {
    email: string;
    phone: string;
  };
  wantsInvoice: boolean;
  invoice?: {
    companyName: string;
    nip: string;
    address: string;
  };
  holders: {
    seatNumber: number;
    name: string;
  }[];
}
