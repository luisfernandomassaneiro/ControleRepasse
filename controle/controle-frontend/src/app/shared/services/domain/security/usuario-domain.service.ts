import { Injectable } from '@angular/core';
import { DomainService } from '@shared/services/base/domain.service';
import { HttpClient } from '@angular/common/http';

export class UsuarioDominioModel {
  id: number;
  username: string;
  nome: string;
  active: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class UsuarioDomainService extends DomainService<UsuarioDominioModel> {
  constructor(http: HttpClient) {
    super(http, 'api/dominio/usuarios');
  }
}
