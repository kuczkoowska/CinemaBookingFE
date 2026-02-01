import {BookingStepRoute} from '@cinemabooking/enums/booking-steps.enum';

export interface BookingStepConfig {
  label: string;
  route: BookingStepRoute;
}

export const BOOKING_STEPS_CONFIG: BookingStepConfig[] = [
  {label: 'Wybór miejsc', route: BookingStepRoute.SEATS},
  {label: 'Bilety', route: BookingStepRoute.TICKETS},
  {label: 'Dane kontaktowe', route: BookingStepRoute.CONTACT},
  {label: 'Płatność', route: BookingStepRoute.SUMMARY}
];
