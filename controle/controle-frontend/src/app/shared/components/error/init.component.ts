import { Component } from '@angular/core';
import { InitializationService } from '@shared/services/initialization.service';
import { TranslationService } from '@shared/services/translation.service';

@Component({
  template: '<app-exception code="500" [title]="title" [redirect]="false"></app-exception>',
})
export class ExceptionInitComponent {

  title: string;

  constructor(initErrors: InitializationService, translate: TranslationService) {
    this.title = translate.translate('error.init.title') + ': ' + initErrors.errors.join(', ');
  }
}
