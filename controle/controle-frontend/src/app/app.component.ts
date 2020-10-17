import { Component, ElementRef, HostListener, OnInit, Renderer2 } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NzModalService, VERSION as VERSION_ZORRO } from 'ng-zorro-antd';
import { Spinkit } from 'ng-http-loader';
import { InitializationService } from '@shared/services/initialization.service';
import { SystemSettingsService } from '@shared/services/system-settings.service';

@Component({
  selector: 'app-root',
  template:
      `
    <ng-http-loader [filteredHeaders]="ignoreHeaders" [spinner]="spinkit.skThreeBounce"
                    [backgroundColor]="'#4287f5'" [debounceDelay]="300" [minDuration]="500"></ng-http-loader>
    <router-outlet></router-outlet>`,
})
export class AppComponent implements OnInit {

  public spinkit: any = Spinkit;
  public ignoreHeaders: string[] = ['Ignore-Loading', 'no-loader'];

  constructor(
    el: ElementRef,
    renderer: Renderer2,
    private readonly router: Router,
    private readonly modalSrv: NzModalService,
    private readonly init: InitializationService,
    private readonly settings: SystemSettingsService,
  ) {
    renderer.setAttribute(el.nativeElement, 'ng-zorro-version', VERSION_ZORRO.full);
    if (this.init.isFailed()) {
      router.navigate(['error/init']);
    }
  }

  ngOnInit() {
    this.router.events.pipe(filter(evt => evt instanceof NavigationEnd)).subscribe(() => {
      this.modalSrv.closeAll();
    });
    if (this.init.isFailed()) {
      this.router.navigate(['error/init']);
    }
    this.settings.layout.width = window.innerWidth;
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.settings.layout.width = window.innerWidth;
  }
}
