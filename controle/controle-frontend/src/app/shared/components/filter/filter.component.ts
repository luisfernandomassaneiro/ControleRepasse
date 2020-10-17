import { Component, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ opacity: '0' }),
        animate('250ms ease-in', style({ opacity: '1' })),
      ]),
      transition(':leave', [
        animate('250ms ease-in', style({ opacity: '0' })),
      ]),
    ]),
  ],
})
export class FilterComponent implements OnInit {

  visible = false;

  @Output()
  search = new Subject<any>();

  @Output()
  clear = new Subject<any>();

  @Input()
  show = null;

  constructor() {
  }

  ngOnInit() {
  }

  toggle() {
    this.visible = !this.visible;
  }
}
