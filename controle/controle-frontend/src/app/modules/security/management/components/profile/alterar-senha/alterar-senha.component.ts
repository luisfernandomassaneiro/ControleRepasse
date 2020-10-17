import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ValidationService } from '@shared/services/validation.service';
import { ReactiveFormsUtils } from '@shared/utils/reactive-forms.utils';
import { CurrentService } from '../../../services/current.service';
import { MessagesService, NotificationType } from '@shared/services/message.service';

@Component({
  selector: 'app-alterar-senha',
  templateUrl: './alterar-senha.component.html',
  styles: [],
})
export class AlterarSenhaComponent implements OnInit {

  visible = false;
  form: FormGroup;

  constructor(private formBuilder: FormBuilder, private userService: CurrentService, private message: MessagesService) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      senhaAtual: ['', Validators.required],
      novaSenha: ['', Validators.required],
      passwordConfirm: ['', Validators.required],
    }, {
      validator: ValidationService.mustMatch('novaSenha', 'passwordConfirm', 'security.usuario.change_password.error.password_dont_match'),
    });
  }

  show(): void {
    this.form.reset();
    this.visible = true;
  }

  update(model: any): void {
    if (!ReactiveFormsUtils.eval(this.form)) {
      return;
    }
    this.userService.changePassword({ senhaAtual: model.senhaAtual, novaSenha: model.novaSenha }).subscribe(() => {
      this.message.notifyI18n('general.messages.changed_password', NotificationType.Success);
      this.visible = false;
    });
  }
}
