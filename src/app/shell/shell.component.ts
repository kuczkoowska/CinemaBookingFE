import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NavbarComponent} from '@cinemabooking/shell/components/navbar/navbar.component';

@Component({
  selector: 'app-shell',
  imports: [
    RouterOutlet,
    NavbarComponent
  ],
  templateUrl: './shell.component.html',
})
export class ShellComponent {

}
