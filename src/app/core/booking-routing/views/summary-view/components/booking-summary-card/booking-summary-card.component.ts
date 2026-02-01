import {Component, input} from '@angular/core';
import {Movie} from '@cinemabooking/interfaces/movie';
import {Screening} from '@cinemabooking/interfaces/screening';
import {TicketDto} from '@cinemabooking/interfaces/dto/ticket-dto';
import {DatePipe, DecimalPipe} from '@angular/common';

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

  public readonly selections = input<Record<number, string>>({});

  public getTicketType(ticket: TicketDto): string {
    const type = this.selections()[ticket.id] || ticket.type;
    
    return type === 'NORMALNY' ? 'NORMALNY' : 'ULGOWY';
  }
}
