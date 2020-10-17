import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { SecurityService } from '@shared/services/security.service';
import { FeedbackService, MessageModel } from '@shared/services/feedback-service';
import { TranslationService } from '@shared/services/translation.service';

@Component({
  templateUrl: './sign-in.component.html',
})
export class SignInComponent implements OnInit {

  form: FormGroup;
  returnUrl: string;
  keeplogged: boolean;
  valErr: string;

  constructor(public router: Router,
              private readonly authService: AuthService,
              private readonly subjectProvider: SecurityService,
              private readonly formBuilder: FormBuilder,
              route: ActivatedRoute,
              feedback: FeedbackService,
              private translation: TranslationService) {
    route.queryParams.subscribe(params => {
      this.returnUrl = params.returnUrl;
    });
    this.keeplogged = SecurityService.persistentOption();
    feedback.subscribe(this);
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      username: [''],
      password: [''],
    });
  }

  login(model) {

    let hasErrors = false;
    if (!model.username) {
      this.form.controls.username.setErrors({ invalid: true });
      hasErrors = true;
    }

    if (!model.password) {
      this.form.controls.password.setErrors({ invalid: true });
      hasErrors = true;
    }

    if (hasErrors) {
      this.valErr = this.translation.translate('authentication.login.error.required_fields');
      return;
    }

    this.authService.attemptAuth(model).subscribe(data => {
      SecurityService.saveToken(data.token, this.keeplogged);
      this.subjectProvider.subject = data.subject;
      const url = this.returnUrl || '/';
      this.router.navigate([url]);
    });
  }

  error(err: MessageModel) {
    this.valErr = err.message;
    this.form.controls.username.setErrors({ invalid: true });
    this.form.controls.password.setErrors({ invalid: true });
  }

}
