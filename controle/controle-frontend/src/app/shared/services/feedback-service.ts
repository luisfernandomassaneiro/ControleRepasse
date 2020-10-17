import { Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { MessagesService, NotificationType } from '@shared/services/message.service';
import { filter } from 'rxjs/operators';

export interface ErrorObserver {
  error(err: MessageModel);
}

export class MessageModel {
  title?: string;
  message: string;
}

class ToastErrorObserver implements ErrorObserver {

  constructor(private messagesService: MessagesService) {
  }

  error(value: MessageModel) {
    this.messagesService.notify(value.message, NotificationType.Error);
  }
}

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {

  private fallback: ErrorObserver;
  private active: ErrorObserver[] = [];
  private pending: ErrorObserver[];

  constructor(router: Router, messagesService: MessagesService) {
    this.fallback = new ToastErrorObserver(messagesService);
    router.events.pipe(filter(evt => evt instanceof NavigationStart)).subscribe(() => {
      this.active = [];
      this.pending = null;
    });
  }

  public error(message: string, title?: string) {
    const erro: MessageModel = { message: message, title: title };
    if (this.active.length) {
      this.active.forEach(value => value.error(erro));
    } else {
      this.fallback.error(erro);
    }
  }

  public subscribe(observer: ErrorObserver, primary = false): void {
    if (primary) {
      this.pending = this.active;
      this.active = [];
    }
    this.active.push(observer);
  }

  public unsubscribe(observer: ErrorObserver): void {
    if (this.active.indexOf(observer) >= 0) {
      this.active.splice(this.active.indexOf(observer), 1);
      if (!this.active.length && this.pending != null) {
        this.active = this.pending;
        this.pending = null;
      }
    } else {
      if (this.pending && this.pending.indexOf(observer) >= 0) {
        this.pending.splice(this.pending.indexOf(observer), 1);
      }
    }
  }
}
