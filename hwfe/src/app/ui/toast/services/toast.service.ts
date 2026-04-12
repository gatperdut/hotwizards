import { Injectable, signal } from '@angular/core';

export interface ToastAction {
  label: string;
  callback: () => void;
  colorClass?: string;
}

export interface ToastCreate {
  message: string;
  duration?: number;
  actions?: ToastAction[];
}

interface Toast extends Required<ToastCreate> {
  id: number;
  timerId?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  public queue = signal<Toast[]>([]);

  public show(data: ToastCreate): void {
    const id = Date.now();
    const duration = data.duration ?? 4000;
    const actions = data.actions || [];

    const toast: Toast = { ...data, id, duration, actions };

    this.queue.update((toasts) => [...toasts, toast]);

    if (duration > 0) {
      this.startTimer(toast);
    }
  }

  public startTimer(toast: Toast): void {
    toast.timerId = setTimeout(() => this.remove(toast), toast.duration);
    this.updateToastTimer(toast);
  }

  public pauseTimer(toast: Toast): void {
    const snack = this.queue().find((s) => s.id === toast.id);
    if (snack?.timerId) {
      clearTimeout(snack.timerId);
      this.updateToastTimer(toast);
    }
  }

  private updateToastTimer(toast: Toast): void {
    this.queue.update((toasts) =>
      toasts.map((someToast) =>
        someToast.id === toast.id ? { ...someToast, timerId: toast.timerId } : someToast,
      ),
    );
  }

  public remove(toast: Toast): void {
    this.queue.update((toasts) => toasts.filter((someToast) => someToast.id !== toast.id));
  }
}
