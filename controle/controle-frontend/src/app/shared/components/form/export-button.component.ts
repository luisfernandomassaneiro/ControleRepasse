import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReportTypeEnum } from '@shared/enum/report-type.enum';

@Component({
  selector: 'app-export-button',
  template: `
      <button nz-button nz-dropdown [nzDropdownMenu]="menu" nzTrigger="click" nzPlacement="bottomRight">
          <span translate="general.buttons.export"></span>
          <i nz-icon nzType="export" nzTheme="outline"></i>
      </button>
      <nz-dropdown-menu #menu="nzDropdownMenu">
          <ul nz-menu>
              <li nz-menu-item *ngFor="let i of options">
                  <a (click)="export.emit(i);" [translate]="'general.buttons.export.' + i.toString()"></a>
              </li>
          </ul>
      </nz-dropdown-menu>`,
})
export class ExportButtonComponent {

  @Input() options: ReportTypeEnum[] = [ReportTypeEnum.XLSX, ReportTypeEnum.CSV];

  @Output() export: EventEmitter<ReportTypeEnum> = new EventEmitter();

  constructor() {
  }
}
