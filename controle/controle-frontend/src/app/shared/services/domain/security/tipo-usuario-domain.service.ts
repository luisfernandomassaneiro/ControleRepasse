import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

export enum TipoUsuarioEnum {
  LOCAL = 'LOCAL',
  AD = 'AD'
}

@Injectable({
  providedIn: 'root',
})
export class TipoUsuarioDomainService {

  constructor(private http: HttpClient) {
  }

  public list(): Observable<string[]> {
    return this.http.get<string[]>('api/dominio/tipo-usuario');
  }
}
