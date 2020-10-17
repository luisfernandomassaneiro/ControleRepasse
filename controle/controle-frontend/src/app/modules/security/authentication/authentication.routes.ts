import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { AuthenticationLayout } from './layout/authentication.layout';
import { PasswordRecoverComponent } from './components/password-recover/password-recover.component';
import { SignInComponent } from './components/sign-in/sign-in.component';

const ROUTES = [
  {
    path: '',
    component: AuthenticationLayout,
    children: [
      { path: 'login', component: SignInComponent, data: { title: 'Autenticação' } },
      { path: 'recovery', component: PasswordRecoverComponent, data: { title: 'Recuperar Senha' } },
      { path: 'recovery/:token', component: PasswordResetComponent, data: { title: 'Resetar Senha' } },
    ],
  },
];

export const AuthenticationRoutes = ROUTES;
