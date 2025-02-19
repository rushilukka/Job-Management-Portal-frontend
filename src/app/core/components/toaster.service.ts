import { Injectable } from '@angular/core';

interface Toast {
  id: number;
  message: string;
  title: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

@Injectable({
  providedIn: 'root',
})
export class ToasterService {
  private toastCounter = 0; // Unique ID for each toast
  toasts: Toast[] = [];

  private generateId(): number {
    return ++this.toastCounter;
  }

  show(message: string, title: string, type: 'success' | 'error' | 'warning' | 'info') {
    const id = this.generateId();
    const toast: Toast = { id, message, title, type };
    this.toasts.push(toast);

    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      this.removeToast(id);
    }, 2000);
  }

  success(message: string, title: string = 'Success') {
    this.show(message, title, 'success');
  }

  error(message: string, title: string = 'Error') {
    this.show(message, title, 'error');
  }

  warning(message: string, title: string = 'Warning') {
    this.show(message, title, 'warning');
  }

  info(message: string, title: string = 'Info') {
    this.show(message, title, 'info');
  }

  removeToast(id: number) {
    this.toasts = this.toasts.filter(toast => toast.id !== id);
  }
}
