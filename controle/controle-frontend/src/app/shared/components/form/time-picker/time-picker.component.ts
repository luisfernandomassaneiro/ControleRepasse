import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { padStart } from 'ng-zorro-antd';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

class Time {
  hora: number;
  minuto: number;
  readonly representation: string;

  constructor(hora?: number, minuto?: number) {
    this.hora = hora;
    this.minuto = minuto;
    this.representation = padStart(this.hora + '', 2, '0') + ':' + padStart(this.minuto + '', 2, '0');
  }

  public static parse(val: { hora: number, minuto: number } | number): Time {
    if (typeof val === 'number') {
      return new Time(val, 0);
    }
    return new Time(val.hora, val.minuto);
  }
}

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TimePickerComponent),
    multi: true,
  }],
})
export class TimePickerComponent implements OnInit, ControlValueAccessor {

  private static partialHourDurationRegex = new RegExp('^[0-9][0-9]?$');
  private static partialHourTimeRegex = new RegExp('^(([0-1][0-9]?)|(2[0-3]?))$');
  private static partialMinutesRegex = new RegExp('^[0-5][0-9]?$');
  focused: boolean;
  min: Time = new Time(0, 0);
  max: Time = new Time(23, 59);
  values: Time[] = [];
  durationmode: boolean;
  shown: Time[] = [];
  value: string;
  disabled: boolean;
  @Input() interval: number;
  @Input() placeholder = '';
  private prev = '';

  @Input()
  set start(val: { hora: number, minuto: number } | number) {
    this.min = Time.parse(TimePickerComponent.handleStr(val, 'start'));
  }

  @Input()
  set end(val: { hora: number, minuto: number } | number) {
    this.max = Time.parse(TimePickerComponent.handleStr(val, 'end'));
  }

  private static handleStr(value: any, field: string): any {
    if (typeof value === 'string' || value instanceof String) {
      const nb = parseInt(value.toString(), 10);
      if (isNaN(nb)) {
        throw new Error('O Valor do campo ' + field + ' não é um número válido.');
      }
      return nb;
    }
    return value;
  }

  onChange: any = () => {
  };

  onTouch: any = () => {
  };

  ngOnInit() {
    this.calculateValues();
  }

  modelChange() {
    this.onChange(this.value);
    this.onTouch();
  }

  onInput(target: any): void {
    try {
      if (!target.value) {
        this.prev = target.value;
        return;
      }
      target.value = this.fill(target.value);
      if (!this.isValidTime(target.value)) {
        target.value = this.prev;
        return;
      }
    } finally {
      this.prev = target.value;
      this.value = target.value;
      this.search();
      this.modelChange();
    }
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  writeValue(val: string): void {
    this.value = val;
    this.search();
  }

  blur(): void {
    this.focused = false;
    this.modelChange();
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouch = fn;
  }

  private search() {
    if (this.value) {
      this.shown = this.values.filter(value1 => {
        return value1.representation.startsWith(this.value);
      });
    } else {
      this.shown = this.values;
    }
  }

  private calculateValues(): void {
    this.interval = TimePickerComponent.handleStr(this.interval, 'interval');
    this.values = [];
    if (!this.interval) {
      return;
    }
    let tm = new Time(this.min.hora, this.min.minuto);
    while (true) {
      this.values.push(tm);
      tm = new Time(tm.hora, tm.minuto + this.interval);
      if (tm.minuto >= 60) {
        tm = new Time(tm.hora + 1, 60 - tm.minuto);
      }
      if (tm.hora < this.max.hora) {
        continue;
      }
      if (tm.hora > this.max.hora || tm.minuto > this.max.minuto) {
        break;
      }
    }

    this.durationmode = this.max.hora >= 24;
    this.search();
  }

  private isValidTime(value: string) {
    if (!value) {
      return true;
    }
    const splited = value.split(':');
    if (splited.length > 2) {
      return false;
    }
    const hrRegex = this.durationmode ? TimePickerComponent.partialHourDurationRegex : TimePickerComponent.partialHourTimeRegex;
    if (!hrRegex.test(splited[0])) {
      return false;
    }
    return splited.length === 1 || !splited[1] || TimePickerComponent.partialMinutesRegex.test(splited[1]);
  }

  private fill(value: string): string {
    if (value.length === 2) {
      if (value.length >= this.prev.length) {
        if (value.indexOf(':') < 0) {
          value += ':';
        } else {
          value = '0' + value;
        }
      }
    } else {
      if (value.length === 3 && value.indexOf(':') < 0) {
        const val = value;
        value = val[0] + val[1] + ':' + val[2];
      }
    }
    return value;
  }
}
