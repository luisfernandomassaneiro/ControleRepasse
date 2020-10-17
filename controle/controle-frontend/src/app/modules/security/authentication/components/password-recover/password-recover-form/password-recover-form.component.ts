import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../../service/auth.service';
import { TranslationService } from '@shared/services/translation.service';

@Component({
  selector: 'app-password-recover-form',
  templateUrl: './password-recover-form.component.html',
  styles: [],
})
export class PasswordRecoverFormComponent implements OnInit {

  error: string;

  @Output()
  sent: EventEmitter<void> = new EventEmitter<void>();
  @Output()
  cancel: EventEmitter<void> = new EventEmitter();

  form: FormGroup;

  constructor(private readonly formBuilder: FormBuilder,
              private readonly service: AuthService,
              private readonly translation: TranslationService) {
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      username: [''],
    });
    this.form.get('username').valueChanges.subscribe(() => {
      this.error = '';
    });
  }

  send(model) {
    this.error = '';
    if (!model.username) {
      this.form.get('username').setErrors({ invalid: true });
      this.error = this.translation.translate('authentication.password-recovery.error.username-not-set');
      return;
    }

    this.service.recoverPassword(model).subscribe(value => {
      if (value.valido) {
        this.sent.emit();
      } else {
        this.error = value.message;
        this.form.controls.username.setErrors({ invalid: true });
      }
    });
  }
}
