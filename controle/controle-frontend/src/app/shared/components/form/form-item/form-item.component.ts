import { Component, Input, OnInit, Optional } from '@angular/core';
import { AbstractControl, FormGroupDirective } from '@angular/forms';
import { NzTSType } from 'ng-zorro-antd';

@Component({
  selector: 'app-form-item',
  templateUrl: './form-item.component.html',
})
export class FormItemComponent implements OnInit {
  @Input() formItemClass: string | string[] | { [klass: string]: any; };
  @Input() label: string;
  @Input() required = false;
  @Input() controlName: string;
  @Input() explain: NzTSType;

  control: AbstractControl;

  constructor(@Optional() private form: FormGroupDirective) {
  }

  ngOnInit(): void {
    if (this.form && this.controlName) {
      this.control = this.form.control.get(this.controlName);
    }
  }
}
