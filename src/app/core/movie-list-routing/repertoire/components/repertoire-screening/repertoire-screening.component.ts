import { Component, computed, inject, input } from '@angular/core';
import { ButtonDirective } from 'primeng/button';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { Screening } from '@cinemabooking/interfaces/screening';
import { Ripple } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { AuthStore } from '@cinemabooking/stores/auth.store';

@Component({
  selector: 'app-repertoire-screening',
  imports: [ButtonDirective, DatePipe, Ripple, TooltipModule],
  templateUrl: './repertoire-screening.component.html',
})
export class RepertoireScreeningComponent {
  private readonly router = inject(Router);
  private readonly authStore = inject(AuthStore);

  public readonly screening = input.required<Screening>();

  public readonly isPast = computed(() => new Date(this.screening().startTime) < new Date());

  public readonly isSoldOut = computed(() => this.screening().availableSeats === 0);

  public readonly isLowSeats = computed(
    () => this.screening().availableSeats <= 10 && this.screening().availableSeats > 0,
  );

  public readonly isDisabled = computed(() => this.isPast() || this.isSoldOut());

  public readonly tooltipText = computed(() => {
    if (this.isPast()) return 'Seans zakończony';
    if (this.isSoldOut()) return 'Brak wolnych miejsc';
    if (this.isLowSeats()) return `Ostatnie ${this.screening().availableSeats} miejsc!`;

    return `${this.screening().availableSeats}/${this.screening().totalSeats} miejsc`;
  });

  public onClick(): void {
    if (this.isDisabled()) return;

    const screeningId = this.screening().id;

    if (!this.authStore.isAuthenticated()) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: `/booking/${screeningId}` },
      });

      return;
    }

    const user = this.authStore.user();
    if (user && user.isActive === false) {
      this.router.navigate(['/account-suspended']);

      return;
    }

    this.router.navigate(['/booking', screeningId]);
  }
}
