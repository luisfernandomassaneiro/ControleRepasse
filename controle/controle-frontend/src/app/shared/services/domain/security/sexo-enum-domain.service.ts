import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SexoEnumDomainService {

  constructor(private http: HttpClient) {
  }

  public list(): Observable<string[]> {
    return this.http.get<string[]>('api/dominio/sexo');
  }
}
