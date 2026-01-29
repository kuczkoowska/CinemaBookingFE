import {inject, Injectable} from '@angular/core';
import {MessageService} from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {

  private messageService = inject(MessageService)

  showSuccess(summary: string, detail?: string) {
    this.messageService.add({
      severity: 'success',
      summary,
      detail: detail || '',
      life: 3000,
    });
  }

  showError(summary: string, detail?: string) {
    this.messageService.add({
      severity: 'error',
      summary,
      detail: detail || '',
      life: 5000,
    });
  }

  showInfo(summary: string, detail?: string) {
    this.messageService.add({
      severity: 'info',
      summary,
      detail: detail || '',
      life: 3000,
    });
  }

  showWarn(summary: string, detail?: string) {
    this.messageService.add({
      severity: 'warn',
      summary,
      detail: detail || '',
      life: 4000,
    });
  }
}
