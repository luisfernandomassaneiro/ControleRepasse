import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-boolean-display',
  template: '<i *ngIf="value === true || value === false" nz-icon [nzType]="value ? \'check\' : \'close\'" nzTheme="outline"></i>',
  styles: [],
})
export class BooleanDisplayComponent implements OnInit {

  @Input()
  value: boolean;

  constructor() {
  }

  ngOnInit() {
  }

}
