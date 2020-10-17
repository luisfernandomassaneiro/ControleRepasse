import { Component, Input, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { FilteredTableWrapper } from '@shared/utils/filtered-table.wrapper';

type FieldCount = 0 | 1 | 2 | 3;

@Component({
  selector: 'app-filter-layout',
  templateUrl: 'filter-layout.component.html',
  styleUrls: ['./filter-layout.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FilterFieldComponent implements OnInit {

  @Input() advanced: TemplateRef<void>;
  @Input() grid: FilteredTableWrapper<any>;
  @Input() size: FieldCount = 3;
  container = 18;

  ngOnInit(): void {
    this.container = 6 * this.size;
    if (this.container === 0) {
      this.container = 6;
    }
  }
}
