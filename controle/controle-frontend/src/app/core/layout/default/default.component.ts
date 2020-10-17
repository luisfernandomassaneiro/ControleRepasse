import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { NavigationError, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SystemSettingsService } from '@shared/services/system-settings.service';

@Component({
  selector: 'layout-default',
  templateUrl: './default.component.html',
})
export class LayoutDefaultComponent implements OnInit, OnDestroy {
  private readonly unsubscribe$ = new Subject<void>();

  constructor(router: Router, message: NzMessageService, private readonly settings: SystemSettingsService, private readonly el: ElementRef) {
    router.events.pipe(takeUntil(this.unsubscribe$)).subscribe(evt => {
      if (evt instanceof NavigationError) {
        message.error(`Erro ao acessar a página ${evt.url}, verifique o log para mais detalhes..`, { nzDuration: 1000 * 3 });
        console.log(evt.error);
      }
    });
  }

  ngOnInit() {
    this.settings.layout.navbar.changed.pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.setClass());
    this.setClass();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private setClass() {
    let cl = this.el.nativeElement.className;
    cl = cl.replace('application-fixed', '');
    cl = cl.replace('application-collapsed', '');
    cl = cl.replace('application', '');
    cl += ' application';
    if (this.settings.layout.navbar.fixed) {
      cl += ' application-fixed';
    }
    if (this.settings.layout.navbar.collapsed) {
      cl += ' application-collapsed';
    }
    this.el.nativeElement.className = cl;
  }
}
