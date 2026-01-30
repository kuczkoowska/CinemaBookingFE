import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NavbarComponent} from '@cinemabooking/shell/components/navbar/navbar.component';
import {ToastModule} from 'primeng/toast';

@Component({
  selector: 'app-shell',
  imports: [
    RouterOutlet,
    NavbarComponent,
    ToastModule
  ],
  templateUrl: './shell.component.html',
})
export class ShellComponent {

}
