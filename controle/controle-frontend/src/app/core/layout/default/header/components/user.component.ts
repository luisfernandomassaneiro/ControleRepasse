import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SubjectModel } from '@shared/models/subject.model';
import { SecurityService } from '@shared/services/security.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'header-user',
  template: `
    <a nz-dropdown nzTrigger="click" nzPlacement="bottomRight" [nzDropdownMenu]="menu" [nzClickHide]="false"
       class="application-nav-item d-flex align-items-center px-sm">
      <nz-avatar [nzSrc]="subject.avatar" nzSize="small" style="margin-right: 8px !important;"></nz-avatar>
      <span class="hidden-sm">{{ subject.firstName }}</span>
    </a>
    <nz-dropdown-menu #menu="nzDropdownMenu" class="width-sm">
      <ul nz-menu>
        <li nz-menu-item [routerLink]="['/security/usuario/profile']">
          <i nz-icon nzType="user" class="mr-sm"></i>{{ 'layout.header.menu.account.center' | translate }}
        </li>
        <li nz-menu-divider></li>
        <li nz-menu-item>
          <app-i18n-language-selection></app-i18n-language-selection>
        </li>
        <li nz-menu-item class="hidden-xs">
          <header-fullscreen></header-fullscreen>
        </li>
        <li nz-menu-divider *ngIf="signOutAllowed"></li>
        <li nz-menu-item (click)="logout()" *ngIf="signOutAllowed">
          <i nz-icon nzType="logout" class="mr-sm"></i>
          {{ 'layout.header.menu.account.logout' | translate }}
        </li>
      </ul>
    </nz-dropdown-menu>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderUserComponent implements OnDestroy {

  subject: SubjectModel;
  subscription: Subscription;
  signOutAllowed = true;

  constructor(private readonly security: SecurityService, private readonly router: Router, private readonly cdr: ChangeDetectorRef) {
    this.subject = security.subject;
    if (this.subject.signOutAllowed != null) {
      this.signOutAllowed = this.subject.signOutAllowed;
    }
    this.subscription = security.updated.subscribe(value => {
      cdr.detectChanges();
    });
  }

  logout() {
    this.router.navigate(['/auth/login']);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }
}
