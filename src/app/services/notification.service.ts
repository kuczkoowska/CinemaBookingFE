import {inject, Injectable} from '@angular/core';
import {MessageService} from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {

  private messageService = inject(MessageService);

  public showSuccess(summary: string, detail?: string): void {
    this.messageService.add({
      severity: 'success',
      summary,
      detail: detail || '',
      life: 3000,
    });
  }

  public showError(summary: string, detail?: string): void {
    this.messageService.add({
      severity: 'error',
      summary,
      detail: detail || '',
      life: 5000,
    });
  }

  public showInfo(summary: string, detail?: string): void {
    this.messageService.add({
      severity: 'info',
      summary,
      detail: detail || '',
      life: 3000,
    });
  }

  public showWarn(summary: string, detail?: string): void {
    this.messageService.add({
      severity: 'warn',
      summary,
      detail: detail || '',
      life: 4000,
    });
  }
}
