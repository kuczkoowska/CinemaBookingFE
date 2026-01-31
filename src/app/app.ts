import {Component, inject, OnInit, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class AppComponent implements OnInit {
  protected readonly title = signal('CinemaBookingFE');
  private translate = inject(TranslateService);

  public ngOnInit(): void {
    this.translate.use('pl');
  }
}
