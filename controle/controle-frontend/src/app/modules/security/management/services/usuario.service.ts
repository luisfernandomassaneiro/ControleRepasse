import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { UsuarioModel } from '../model/usuario.model';

import { MessagesService } from '@shared/services/message.service';
import { CrudService } from '@shared/services/base/crud.service';

import { Observable } from 'rxjs';
import { HashService } from '@shared/services/hash.service';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService extends CrudService<UsuarioModel> implements Resolve<UsuarioModel> {

  constructor(http: HttpClient, message: MessagesService, private hash: HashService) {
    super(http, message);
  }

  baseUrl(): string {
    return 'api/usuario';
  }

  resolve(route: ActivatedRouteSnapshot): Observable<UsuarioModel> {
    return this.get(this.hash.decode(route.params.id));
  }

  saveUser(user: UsuarioModel): Promise<UsuarioModel> {
    return this.saveAndNotify(user, null);
  }

  updateUser(user: UsuarioModel, id: number): Promise<UsuarioModel> {
    return this.saveAndNotify(user, id);
  }

  state(id: number, state: boolean) {
    return this.http.put(this.baseUrl() + '/' + id + '/activation?state=' + state, {});
  }
}
