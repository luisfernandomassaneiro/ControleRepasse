import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { NzModalService } from 'ng-zorro-antd';
import { first } from 'rxjs/operators';
import { ValidationService } from '@shared/services/validation.service';
import { ReactiveFormsUtils } from '@shared/utils/reactive-forms.utils';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss'],
})
export class PasswordResetComponent implements OnInit {

  form: FormGroup;
  changed = false;
  valido = true;
  private token: string;

  constructor(public router: Router,
              private readonly authService: AuthService,
              private readonly formBuilder: FormBuilder,
              private readonly route: ActivatedRoute,
              modalSrv: NzModalService) {
    this.route.params.pipe(first()).subscribe(value => {
      this.token = value.token;
      this.authService.checkToken(this.token).subscribe(value1 => {
        this.valido = value1.valido;
      });
    });
    modalSrv.closeAll();
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      novaSenha: ['', Validators.required],
      passwordConfirm: ['', Validators.required],
    }, {
      validator: ValidationService.mustMatch('novaSenha', 'passwordConfirm', 'security.usuario.change_password.error.password_dont_match'),
    });
  }

  update(model) {
    if (!ReactiveFormsUtils.eval(this.form)) {
      return;
    }
    model.recoveryToken = this.token;
    this.authService.updatePasswordByToken(model).subscribe(value => {
      this.changed = true;
    });
  }

  goToLogin() {
    this.router.navigate(['/auth/login']);
  }
}
