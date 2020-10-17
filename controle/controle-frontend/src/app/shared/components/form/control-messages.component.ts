import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { ValidationService } from '../../services/validation.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-control-messages',
  template: `
    <div style="line-height: 1; color: red; font-size: 12px !important;" *ngIf="errorMessage != null">
        {{ errorMessage }}
    </div>`,
  styles: [':host * {color: red; font-size: 12px !important }'],
})
export class ControlMessagesComponent {

  @Input() control: AbstractControl;

  constructor(private translate: TranslateService) {
  }

  get errorMessage() {
    if (this.control.dirty) {
      for (const propertyName in this.control.errors) {
        if (this.control.errors.hasOwnProperty(propertyName)) {
          return ValidationService.getValidatorErrorMessage(propertyName, this.control.errors[propertyName], this.translate);
        }
      }
    }
    return null;
  }
}
