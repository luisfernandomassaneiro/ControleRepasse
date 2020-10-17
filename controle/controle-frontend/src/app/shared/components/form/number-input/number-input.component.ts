import { Component, forwardRef, Input, OnInit } from '@angular/core';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { TranslationService } from '@shared/services/translation.service';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-number-input',
  templateUrl: './number-input.component.html',
  styles: [],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NumberInputComponent),
    multi: true,
  }],
})
export class NumberInputComponent implements OnInit, ControlValueAccessor {

  value: string;
  mask: any;
  disabled: boolean;
  @Input() prefix = '';
  @Input() suffix: string;
  @Input() includeThousandsSeparator = false;
  @Input() allowNegative = false;
  @Input() decimalLength: number;
  @Input() maxLength: number = null;
  private readonly decimalSymbol: string;
  private readonly thousandsSymbol: string;

  constructor(private translation: TranslationService) {
    this.decimalSymbol = translation.translate('general.formats.decimal_separator');
    this.thousandsSymbol = translation.translate('general.formats.thousand_separator');
  }

  private static replaceAll(target: string, search: string, replacement: string) {
    return target.split(search).join(replacement);
  }

  onChange: any = () => {
  };

  onTouch: any = () => {
  };

  ngOnInit() {
    const decimal = (parseInt(this.decimalLength + '', 10)) || 0;
    let integer = null;

    if (this.maxLength) {
      integer = this.maxLength - decimal;
      if (integer < 0) {
        integer = 0;
      }
    }

    this.mask = createNumberMask({
      allowDecimal: !!decimal,
      prefix: this.prefix,
      suffix: this.suffix,
      includeThousandsSeparator: this.includeThousandsSeparator,
      decimalLimit: decimal,
      integerLimit: integer,
      allowNegative: this.allowNegative,
      decimalSymbol: this.decimalSymbol,
      thousandsSeparatorSymbol: this.thousandsSymbol,
    });
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  changed(e: string) {
    this.value = e;
    let p = NumberInputComponent.replaceAll(this.value, this.thousandsSymbol, '');
    p = NumberInputComponent.replaceAll(p, this.decimalSymbol, '.');
    this.onChange(this.parse(p));
    this.onTouch();
  }

  writeValue(value: any): void {
    if (typeof value === 'number') {
      value = (value + '').replace('.', this.decimalSymbol);
    }
    this.value = value;
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouch = fn;
  }

  private parse(p: string): number {
    if (p && p.length) {
      if (this.decimalLength) {
        return parseFloat(p);
      } else {
        return parseInt(p, 10);
      }
    }
    return null;
  }
}
