import {Component, input} from '@angular/core';
import {Card} from "primeng/card";
import {PrimeTemplate} from "primeng/api";
import {RouterLink} from '@angular/router';
import {AdminMenuItem} from '@cinemabooking/interfaces/other/admin-menu-item';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-menu-item',
  imports: [
    Card,
    PrimeTemplate,
    RouterLink,
    NgClass
  ],
  templateUrl: './menu-item.component.html',
})
export class MenuItemComponent {
  public readonly item = input.required<AdminMenuItem>();

}
