import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

export class ValidationService {

  static getValidatorErrorMessage(validatorName: string, error: any, translate: TranslateService) {
    if (validatorName === 'mustMatch') {
      if (!error.message) {
        error.message = 'general.errors.validation.must_match';
      }
      return translate.instant(error.message, error);
    }
    return translate.instant('general.errors.validation.' + validatorName, error);
  }

  static creditCard(control) {
    const r = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/;
    // Visa, MasterCard, American Express, Diners Club, Discover, JCB
    if (control.value.match(r)) {
      return null;
    } else {
      return { credit_card: true };
    }
  }

  static email(control) {
    const r = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
    return ValidationService.validateRegex(control, r, 'email');
  }

  static telefone(control) {
    return ValidationService.validateRegex(control, /^\(\d{2}\)?\s*\d{4,5}\-?\d{4}$/, 'phone_number');
  }

  public static cpf(control) {
    return ValidationService.validateRegex(control, /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/, 'cpf');
  }

  public static cnpj(control) {
    return ValidationService.validateRegex(control, /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, 'cnpj');
  }

  public static date(control) {
    return ValidationService.validateRegex(control, /^\d{2}\/\d{2}\/\d{4}$/, 'date');
  }

  public static custom(control, regex) {
    return ValidationService.validateRegex(control, regex, 'regex');
  }

  static password(control) {
    // {6,100}           - Assert password is between 6 and 100 characters
    // (?=.*[0-9])       - Assert a string has at least one number
    if (control.value.match(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,100}$/)) {
      return null;
    } else {
      return { password: true };
    }
  }

  static mustMatch(controlName: string, matchingControlName: string, message?: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        return;
      }

      if (matchingControl.value && control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: { message: message } });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  private static getValue(control) {
    if (!control || !control.value) {
      return '';
    }
    if (control.value.value) {
      return control.value.value;
    }
    return control.value;
  }

  private static validateRegex(control, regex, validation) {
    const val = ValidationService.getValue(control);
    if (!val) {
      return null;
    }
    if (val.match(regex)) {
      return null;
    }

    const res = {};
    res[validation] = true;
    return res;
  }
}
