import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {ButtonModule} from 'primeng/button';

@Component({
  selector: 'app-unauthorized',
  imports: [ButtonModule],
  templateUrl: './unauthorized.component.html',
})
export class UnauthorizedComponent {
  private readonly router = inject(Router);

  protected goHome(): void {
    this.router.navigate(['/']);
  }
}
