import {Component, inject, OnInit, signal} from '@angular/core';
import {LogsService} from '@cinemabooking/services/logs.service';
import {DatePipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {SelectModule} from 'primeng/select';
import {TagModule} from 'primeng/tag';
import {
  BackDashboardComponent
} from '@cinemabooking/core/admin-routing/components/back-dashboard/back-dashboard.component';
import {LogType, SystemLog} from '@cinemabooking/interfaces/api/system-log';

@Component({
  selector: 'app-logs-view',
  imports: [
    FormsModule,
    TableModule,
    ButtonModule,
    SelectModule,
    TagModule,
    BackDashboardComponent,
    DatePipe,
  ],
  templateUrl: './logs-view.component.html',
})
export class LogsViewComponent implements OnInit {
  private logsService = inject(LogsService);

  public logs = signal<SystemLog[]>([]);
  public selectedType = signal<LogType | undefined>(undefined);

  public logTypes = [
    {label: 'Wszystkie', value: undefined},
    {label: 'INFO', value: LogType.INFO},
    {label: 'WARNING', value: LogType.WARNING},
    {label: 'ERROR', value: LogType.ERROR},
  ];

  public ngOnInit(): void {
    this.loadLogs();
  }

  public loadLogs(): void {
    this.logsService.getSystemLogs(this.selectedType()).subscribe({
      next: (logs) => this.logs.set(logs),
      error: (err) => console.error('Błąd podczas ładowania logów', err),
    });
  }

  public onFilterChange(): void {
    this.loadLogs();
  }

  public getLogSeverity(type: LogType): 'success' | 'info' | 'warn' | 'danger' {
    switch (type) {
      case LogType.INFO:
        return 'info';
      case LogType.WARNING:
        return 'warn';
      case LogType.ERROR:
        return 'danger';
      default:
        return 'info';
    }
  }
}
