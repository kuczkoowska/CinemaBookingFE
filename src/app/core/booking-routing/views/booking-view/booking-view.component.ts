import {Component, inject, OnInit} from '@angular/core';
import {
  MovieCardBookingComponent
} from '@cinemabooking/core/booking-routing/views/booking-view/components/movie-card-booking/movie-card-booking.component';
import {ActivatedRoute, Router, RouterOutlet} from '@angular/router';
import {BookingStore} from '@cinemabooking/stores/booking.store';
import {SpinnerComponent} from '@cinemabooking/ui/spinner/spinner.component';
import {AppRoute} from '@cinemabooking/enums/app-routes';
import {
  BookingStepperComponent
} from '@cinemabooking/core/booking-routing/views/booking-view/components/booking-stepper/booking-stepper.component';
import {ConfirmationService} from 'primeng/api';
import {ConfirmDialog} from 'primeng/confirmdialog';

@Component({
  selector: 'app-booking-view',
  imports: [
    MovieCardBookingComponent,
    RouterOutlet,
    SpinnerComponent,
    BookingStepperComponent,
    ConfirmDialog,
  ],
  providers: [ConfirmationService],
  templateUrl: './booking-view.component.html',
})
export class BookingViewComponent implements OnInit {
  protected readonly store = inject(BookingStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly confirmationService = inject(ConfirmationService);

  public ngOnInit(): void {
    const screeningId = Number(this.route.snapshot.paramMap.get('screeningId'));
    this.store.loadBookingData(screeningId);
  }

  public cancelAndGoHome(): void {
    this.confirmationService.confirm({
      message: 'Czy na pewno chcesz anulować rezerwację i wrócić do strony głównej?',
      header: 'Anuluj rezerwację',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Tak, anuluj',
      rejectLabel: 'Nie, kontynuuj',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        const bookingId = this.store.activeBooking()?.id;
        if (bookingId) {
          this.store.cancelAndGoBack();
        }
        this.router.navigate([AppRoute.HOME]);
      },
    });
  }

  public changeScreening(): void {
    this.confirmationService.confirm({
      message: 'Zmiana seansu anuluje obecną rezerwację. Czy chcesz kontynuować?',
      header: 'Zmiana seansu',
      icon: 'pi pi-info-circle',
      acceptLabel: 'Tak, zmień seans',
      rejectLabel: 'Anuluj',
      accept: () => {
        const bookingId = this.store.activeBooking()?.id;
        if (bookingId) {
          this.store.cancelBookingSilent(bookingId);
        }
        this.router.navigate([AppRoute.MOVIES]);
      },
    });
  }
}
