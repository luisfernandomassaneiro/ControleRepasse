import { Component, ElementRef, forwardRef, HostListener, Input, OnInit, TemplateRef } from '@angular/core';
import * as moment from 'moment';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FunctionProp } from 'ng-zorro-antd';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DatePickerComponent),
    multi: true,
  }],
})
export class DatePickerComponent implements OnInit, ControlValueAccessor {

  static readonly ISO = 'YYYY-MM-DD';
  state: { calendar: boolean, disabled: boolean } = { calendar: false, disabled: false };
  mdl: { iso?: string, format?: string } = {};
  formats: {
    mask: string,
    moment: string,
    regex: RegExp
  };
  @Input() nzFormat = 'dd/MM/yyyy';
  @Input() nzDateRender: FunctionProp<TemplateRef<Date> | string>;
  @Input() nzDisabledDate: (current: Date) => boolean;
  @Input() nzRenderExtraFooter: FunctionProp<TemplateRef<void> | string>;
  @Input() nzShowToday = true;
  @Input() nzPlaceHolder = '';
  @Input() disableUntil: string | Date;
  @Input() disableSince: string | Date;
  @Input() closeOnSelect = true;

  constructor(private eRef: ElementRef) {
  }

  private static toDate(value: any): Date {
    if (!value) {
      return null;
    }
    const m = moment(value);
    if (!m.isValid()) {
      throw Error('A data ' + value + ' é inválida.');
    }
    const dt: Date = m.toDate();
    dt.setHours(0, 0, 0, 0);
    return dt;
  }

  onChange: any = () => {
  };

  onTouch: any = () => {
  };

  ngOnInit() {
    this.formats = {
      moment: this.nzFormat.replace('dd', 'DD').replace('yyyy', 'YYYY'),
      mask: this.nzFormat.replace(/[a-zA-Z]/g, '0'),
      regex: new RegExp('^' + this.nzFormat.replace(/[a-zA-Z]/g, '[0-9]') + '$'),
    };
    this.disableUntil = DatePickerComponent.toDate(this.disableUntil);
    if (this.disableUntil) {
      this.disableUntil.setHours(23, 59, 59);
    }
    this.disableSince = DatePickerComponent.toDate(this.disableSince);
  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (this.eRef.nativeElement.contains(event.target)) {
      return;
    }
    let elem = event.target;
    while (elem) {
      if (elem.className && elem.className.indexOf && elem.className.indexOf('ant-calendar') >= 0) {
        return;
      }
      elem = elem.parentNode;
    }
    this.state.calendar = false;
  }

  disabledDateFn(): (d: Date) => boolean {
    return date => {
      if (this.nzDisabledDate) {
        return this.nzDisabledDate(date);
      }
      if (this.disableUntil) {
        return date <= this.disableUntil;
      }
      if (this.disableSince) {
        return date >= this.disableSince;
      }
      return false;
    };
  }

  onCalendarChanged(e: string): void {
    this.mdl.iso = e;
    if (this.closeOnSelect) {
      this.state.calendar = false;
    }
    this.mdl.format = null;
    if (this.mdl.iso) {
      this.mdl.format = moment(this.mdl.iso).format(this.formats.moment);
    }
    this.updateValue();
  }

  onInputChanged(e: string): void {
    this.mdl.format = e;
    this.mdl.iso = null;
    if (this.mdl.format && this.isValid(this.mdl.format)) {
      this.mdl.iso = moment(this.mdl.format, this.formats.moment)
        .format(DatePickerComponent.ISO) + 'T00:00:00.000';
    }
    this.updateValue();
  }

  onInputClick($event: Event): void {
    this.state.calendar = true;
    $event.stopPropagation();
  }

  onInputBlur(): void {
    if (this.mdl.format && !this.isValid(this.mdl.format)) {
      this.mdl.format = null;
    }
  }

  onKeyPress(e): void {
    if (e.keyCode === 9) {
      setTimeout(() => {
        this.state.calendar = false;
      });
    }
  }

  setDisabledState(isDisabled: boolean): void {
    this.state.disabled = isDisabled;
  }

  writeValue(val: any): void {
    if (!val) {
      this.mdl = {};
    } else {
      const m = moment(val);
      this.mdl = {
        iso: m.format(DatePickerComponent.ISO) + 'T00:00:00.000',
        format: m.format(this.formats.moment),
      };
    }
    this.updateValue();
  }

  updateValue(): void {
    let v = this.mdl.iso;
    if (v) {
      v = moment(v).format(DatePickerComponent.ISO);
    }
    this.onChange(v);
    this.onTouch();
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouch = fn;
  }

  private isValid(d: string): boolean {
    if (!d) {
      return true;
    }
    if (!this.formats.regex.test(d)) {
      return false;
    }
    return moment(d, this.formats.moment).isValid();
  }
}
