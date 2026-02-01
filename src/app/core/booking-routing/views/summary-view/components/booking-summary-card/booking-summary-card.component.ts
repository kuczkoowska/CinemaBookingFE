import {Component, input} from '@angular/core';
import {TicketDto} from '@cinemabooking/interfaces/dto/ticket-dto';
import {DatePipe, DecimalPipe} from '@angular/common';
import {Screening} from '@cinemabooking/interfaces/models/screening';
import {Movie} from '@cinemabooking/interfaces/models/movie';

@Component({
  selector: 'app-booking-summary-card',
  imports: [
    DatePipe,
    DecimalPipe
  ],
  templateUrl: './booking-summary-card.component.html',
})
export class BookingSummaryCardComponent {
  public readonly movie = input.required<Movie>();
  public readonly screening = input.required<Screening>();
  public readonly tickets = input.required<TicketDto[]>();
  public readonly totalAmount = input.required<number>();
  public readonly prices = input.required<Record<string, number>>();
  public readonly selections = input<Record<number, string>>({});

  public getTicketType(ticket: TicketDto): string {
    const type = this.selections()[ticket.id] || ticket.type;

    return type === 'NORMALNY' ? 'NORMALNY' : 'ULGOWY';
  }

  public getTicketPrice(ticket: TicketDto): number {
    const type = this.getTicketType(ticket);
    const priceList = this.prices();

    return priceList[type] ?? ticket.price;
  }
}
