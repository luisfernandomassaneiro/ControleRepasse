import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioModel } from '../model/usuario.model';

@Injectable()
export class CurrentService implements Resolve<UsuarioModel> {

  constructor(private http: HttpClient) {
  }

  static baseUrl(): string {
    return 'api/current';
  }

  resolve(route: ActivatedRouteSnapshot): Observable<UsuarioModel> {
    return this.http.get<UsuarioModel>(CurrentService.baseUrl() + '/user');
  }

  save(user: UsuarioModel): Observable<UsuarioModel> {
    return this.http.post<UsuarioModel>(CurrentService.baseUrl() + '/user', user);
  }

  changePassword(body: { senhaAtual: string, novaSenha: string }): Observable<void> {
    const url = CurrentService.baseUrl() + '/password';
    return this.http.post<void>(url, body);
  }
}
