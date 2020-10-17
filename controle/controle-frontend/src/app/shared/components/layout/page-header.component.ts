import { Component, Input, ViewEncapsulation } from '@angular/core';

export class BreadCrumbItem {
  label: string;
  route?: any[] | string;
  icon?: string;
}

@Component({
  selector: 'app-page-header',
  styleUrls: ['./page-header.component.scss'],
  encapsulation: ViewEncapsulation.None,
  template:
    `
    <div class="application-content-title">
      <nz-breadcrumb *ngIf="breabcrumb" class="hidden-xs">
        <nz-breadcrumb-item *ngFor="let item of breabcrumb">
          <a [routerLink]="item.route" *ngIf="item.route">
            <i nz-icon [nzType]="item.icon" *ngIf="item.icon"></i> {{item.label | translate}}
          </a>
          <span *ngIf="!item.route">
            <i nz-icon [nzType]="item.icon" *ngIf="item.icon"></i> {{item.label | translate}}
          </span>
        </nz-breadcrumb-item>
      </nz-breadcrumb>
      <h1 *ngIf="title" [translate]="title"></h1>
      <div class="page-header__desc" style="margin-bottom: 0; margin-top: 10px" *ngIf="description">
        {{description}}
      </div>
      <ng-content></ng-content>
    </div>`,
})
export class PageHeaderComponent {
  @Input() title: string;
  @Input() breabcrumb: BreadCrumbItem[];
  @Input() description: string;
}
