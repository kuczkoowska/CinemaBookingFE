import {Component, inject, OnInit, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {authStore} from '@cinemabooking/stores/auth.store';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  protected readonly title = signal('CinemaBookingFE');
  public auth = inject(authStore);

  public ngOnInit(): void {
    this.auth.checkAuth();
  }
}
