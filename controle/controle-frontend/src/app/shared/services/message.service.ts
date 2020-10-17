import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { first, withLatestFrom } from 'rxjs/operators';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';

export enum NotificationType {
  Error = 'error',
  Info = 'info',
  Success = 'success',
  Warning = 'warning',
}

@Injectable({
  providedIn: 'root',
})
export class MessagesService {

  constructor(private translations: TranslateService,
              private modalService: NzModalService,
              private nzMessage: NzMessageService,
  ) {
  }

  public notifyI18n(message: string, type: NotificationType, msgParams?: object) {
    this.translations.get(message, msgParams).subscribe(m => {
      this.notify(m, type);
    });
  }

  public notify(message: string, type: NotificationType): void {
    this.nzMessage.create(type.toString(), message);
  }

  public confirmI18n(message: string, title: string): Promise<any> {
    return new Promise((resolve) => {
      this.translations.get(message).pipe(
        withLatestFrom(this.translations.get(title)),
        first(),
      ).subscribe(([m, t]) => {
        this.confirm(m, t).then((value => resolve(value)));
      });
    });
  }

  public confirm(message: string, title: string): Promise<any> {
    return new Promise((resolve) => {
      const ref = this.modalService.confirm({
        nzTitle: title,
        nzContent: message,
        nzOkText: this.translations.instant('general.buttons.ok'),
        nzCancelText: this.translations.instant('general.buttons.cancel'),
        nzOnOk: () => new Promise(() => {
          resolve(null);
          ref.close();
        }),
      });
    });
  }
}
