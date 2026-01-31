import {Component} from '@angular/core';
import {Button} from "primeng/button";
import {RouterLink} from "@angular/router";
import {Tooltip} from "primeng/tooltip";

@Component({
  selector: 'app-back-dashboard',
  imports: [
    Button,
    RouterLink,
    Tooltip
  ],
  templateUrl: './back-dashboard.component.html',
})
export class BackDashboardComponent {

}
