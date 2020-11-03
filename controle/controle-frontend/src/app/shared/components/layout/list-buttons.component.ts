import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReportTypeEnum } from '@shared/enum/report-type.enum';

@Component({
  selector: 'app-list-buttons',
  template: `
    <div style="margin-bottom: 20px">
      <a *ngIf="link" nz-button nzType="primary" [routerLink]="link"  style="margin-right: 10px">
        <span translate="general.buttons.add"></span><i nz-icon nzType="plus"></i>
      </a>
      <a *ngIf="imprimir" nz-button (click)="imprimirDireto()"  style="margin-right: 10px">
        <span translate="general.buttons.imprimir"></span><i nz-icon nzType="printer" nzTheme="outline"></i>
      </a>
      <app-export-button (export)="export.emit($event)" *ngIf="showExport"></app-export-button>
    </div>`,
})
export class ListButtonsComponent implements OnInit {
  @Input() link: any[] | string;
  @Input() resource: string;
  @Input() imprimir = false;
  @Output() export: EventEmitter<ReportTypeEnum> = new EventEmitter();
  showExport = false;

  ngOnInit(): void {
    this.showExport = !!this.export.observers.length;
  }

  imprimirDireto(): void {
    window.print();
  }
}
