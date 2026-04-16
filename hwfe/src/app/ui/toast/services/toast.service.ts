import { Injectable, signal } from '@angular/core';

interface ToastActionCreate {
  label: string;
  callback: () => void;
  color?: 'primary' | 'secondary' | 'warning';
}

type ToastAction = Required<ToastActionCreate>;

interface ToastCreate {
  message: string;
  duration?: number;
  color?: 'primary' | 'secondary' | 'warning';
  actions?: ToastActionCreate[];
}

type Toast = Required<ToastCreate> & {
  id: number;
  timerId?: number;
  actions: ToastAction[];
};

@Injectable({ providedIn: 'root' })
export class ToastService {
  public queue = signal<Toast[]>([]);

  public show(data: ToastCreate): void {
    const id = Date.now();
    const duration =
      data.duration === undefined ? 4000 : data.duration === Infinity ? 0 : data.duration;
    const color = data.color || 'primary';
    const actions = data.actions || [];

    const toast: Toast = {
      ...data,
      id,
      color: color,
      duration,
      actions: [...actions.map((action) => ({ ...action, color: action.color || 'primary' }))],
    };

    this.queue.update((items) => [...items, toast]);

    if (duration > 0) {
      this.startTimer(id, duration);
    }
  }

  public startTimer(id: number, duration: number): void {
    if (!duration) {
      return;
    }

    const timerId = setTimeout(() => this.remove(id), duration);
    this.updateTimer(id, timerId);
  }

  public pauseTimer(id: number): void {
    const toast = this.queue().find((s) => s.id === id);

    if (toast?.timerId) {
      clearTimeout(toast.timerId);
      this.updateTimer(id, undefined);
    }
  }

  private updateTimer(id: number, timerId?: number): void {
    this.queue.update((items) => items.map((s) => (s.id === id ? { ...s, timerId } : s)));
  }

  public remove(id: number): void {
    this.queue.update((items) => items.filter((s) => s.id !== id));
  }
}
