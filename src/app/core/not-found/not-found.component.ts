import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {ButtonModule} from 'primeng/button';

@Component({
  selector: 'app-not-found',
  imports: [ButtonModule],
  templateUrl: './not-found.component.html',
})
export class NotFoundComponent {
  private readonly location = inject(Location);
  private readonly router = inject(Router);

  protected goToHome(): void {
    this.router.navigate(['/']);
  }

  protected goBack(): void {
    this.location.back();
  }
}
