import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {CommonModule, Location} from '@angular/common';
import {ButtonModule} from 'primeng/button';

@Component({
  selector: 'app-not-found',
  imports: [CommonModule, ButtonModule],
  templateUrl: './not-found.component.html',
})
export class NotFoundComponent {
  private location = inject(Location);
  private router = inject(Router);


  goToHome(): void {
    this.router.navigate(['/']);
  }

  goBack(): void {
    this.location.back();
  }
}
