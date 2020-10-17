import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtResponseModel } from '@shared/configs/security/jwt-response.model';
import { LoginRequestModel } from '../model/login-request.model';
import { RecoverPasswordModel } from '../model/recover-password.model';
import { UpdatePasswordByTokenModel } from '../model/update-password-by-token.model';
import { ValidadeTokenModel } from '../model/validade-token.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly loginUrl = 'api/auth/signin';

  constructor(private readonly http: HttpClient) {
  }

  attemptAuth(credentials: LoginRequestModel): Observable<JwtResponseModel> {
    return this.http.post<JwtResponseModel>(this.loginUrl, credentials, httpOptions);
  }

  recoverPassword(model: RecoverPasswordModel): Observable<ValidadeTokenModel> {
    return this.http.post<ValidadeTokenModel>('api/auth/recover', model, httpOptions);
  }

  updatePasswordByToken(model: UpdatePasswordByTokenModel) {
    return this.http.post('api/auth/change-by-token', model, httpOptions);
  }

  checkToken(token: string): Observable<ValidadeTokenModel> {
    return this.http.get<ValidadeTokenModel>(`api/auth/check-token/${token}`, httpOptions);
  }
}
