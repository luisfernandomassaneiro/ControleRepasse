import { Directive, OnInit, Optional } from '@angular/core';
import { NgControl } from '@angular/forms';
import { TimePickerComponent } from '@shared/components/form/time-picker/time-picker.component';
import { padStart } from 'ng-zorro-antd';

@Directive({
  // A Validação está atachada ao componente, em razão disso não será usada como atributo
  // tslint:disable-next-line:directive-selector
  selector: 'app-time-picker',
})
export class TimePickerValidationDirective implements OnInit {

  private static completeDurationRegex = new RegExp('^([0-9][0-9]):[0-5][0-9]$');
  private static completeTimeRegex = new RegExp('^(([0-1][0-9]?)|(2[0-3]?)):[0-5][0-9]$');
  private component: TimePickerComponent;

  constructor(@Optional() private ngControl: NgControl) {
  }

  public static validate(value: string, component: TimePickerComponent): { error: string, params?: any } {
    if (component.values && component.values.length) {
      return this.validateIsInList(value, component);
    } else {
      return this.evalPartialTime(value, component);
    }
  }

  public static eval(control, component: TimePickerComponent) {
    if (!control.value) {
      return null;
    }
    const validation = TimePickerValidationDirective.validate(control.value, component);
    if (!validation) {
      return null;
    }
    const error = {};
    if (validation.params == null) {
      validation.params = true;
    }
    error[validation.error] = validation.params;
    return error;
  }

  public static complete(control, component: TimePickerComponent) {
    if (!control.value) {
      return null;
    }
    const regex = component.durationmode ? TimePickerValidationDirective.completeDurationRegex : TimePickerValidationDirective.completeTimeRegex;
    if (!regex.test(control.value)) {
      if (component.focused) {
        return { empty: true };
      } else {
        return { invalid_time: true };
      }
    }
    return null;
  }

  private static bounds(str: string): { min: number, max: number } {
    const res = { min: 0, max: 24 };
    if (!str) {
      return res;
    }
    if (str.length === 1) {
      res.min = parseInt(str[0] + '0', 10);
      res.max = str === '2' ? 24 : res.min + 9;
    } else {
      res.min = parseInt(str, 10);
      res.max = res.min;
    }
    return res;
  }

  private static format(hora: number, minuto: number): string {
    return padStart(hora + '', 2, '0') + ':' + padStart(minuto + '', 2, '0');
  }

  private static validateIsInList(value: string, component: TimePickerComponent): { error: string, params?: any } {
    for (const item of component.values) {
      if (item.representation.startsWith(value)) {
        return null;
      }
    }
    return { error: 'invalid_time_option' };
  }

  private static evalPartialTime(value: string, component: TimePickerComponent): { error: string, params?: any } {
    const str = value.split(':');
    const hr = TimePickerValidationDirective.bounds(str[0]);
    const invalidInterval = {
      error: 'invalid_time_period', params: {
        min: TimePickerValidationDirective.format(component.min.hora, component.min.minuto),
        max: TimePickerValidationDirective.format(component.max.hora, component.max.minuto),
      },
    };

    if (hr.max < component.min.hora || hr.min > component.max.hora) {
      return invalidInterval;
    }
    if (str.length > 1) {
      // se chegou aqui, hr.min e hr.max são iguais
      const min = TimePickerValidationDirective.bounds(str[1]);
      if (component.min.hora === hr.min && min.max < component.min.minuto) {
        return invalidInterval;
      }
      if (component.max.hora === hr.max && min.min > component.max.minuto) {
        return invalidInterval;
      }
    }
    return null;
  }

  ngOnInit() {
    if (this.ngControl && this.ngControl.control) {
      this.component = this.ngControl.valueAccessor as TimePickerComponent;
      const validators = [this.ngControl.control.validator];
      validators.push((control) => TimePickerValidationDirective.eval(control, this.component));
      validators.push((control) => TimePickerValidationDirective.complete(control, this.component));
      this.ngControl.control.setValidators(validators.filter(v => v != null));
    }
  }
}
