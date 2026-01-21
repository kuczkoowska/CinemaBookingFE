import {Component, inject, OnInit, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {AuthStore} from '@cinemabooking/stores/auth.store';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  protected readonly title = signal('CinemaBookingFE');
  public auth = inject(AuthStore);
  private translate = inject(TranslateService);

  public ngOnInit(): void {
    this.auth.checkAuth();
    this.translate.use('pl');
  }
}
