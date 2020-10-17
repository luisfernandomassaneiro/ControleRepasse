import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthenticationRoutes } from './authentication.routes';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { SharedModule } from '@shared/shared.module';
import { AuthenticationLayout } from './layout/authentication.layout';
import { PasswordRecoverComponent } from './components/password-recover/password-recover.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { PasswordRecoverFeedbackComponent } from './components/password-recover/password-recover-feedback/password-recover-feedback.component';
import { PasswordRecoverFormComponent } from './components/password-recover/password-recover-form/password-recover-form.component';
import { AuthenticationHeaderComponent } from './components/authentication-header/authentication-header.component';

@NgModule({
  declarations: [
    SignInComponent,
    AuthenticationLayout,
    PasswordResetComponent,
    PasswordRecoverComponent,
    PasswordRecoverFormComponent,
    PasswordRecoverFeedbackComponent,
    AuthenticationHeaderComponent,
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(AuthenticationRoutes),
  ],
})
export class AuthenticationModule {
}
