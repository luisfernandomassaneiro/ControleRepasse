import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { CarroModel } from '../models/carro.model';
import { CarroResumoModel } from '../models/carro-resumo.model';

import { MessagesService } from '@shared/services/message.service';
import { CrudService } from '@shared/services/base/crud.service';
import { HashService } from '@shared/services/hash.service';

import { Observable } from 'rxjs';
import { CarroTotaisModel } from '../models/carro-totais.model';
import { QueryStringUtils } from '@shared/utils/querystring.utils';

@Injectable()
export class CarroService extends CrudService<CarroResumoModel> implements Resolve<CarroModel> {

  constructor(http: HttpClient, message: MessagesService, private hash: HashService) {
    super(http, message);
  }

  baseUrl(): string {
    return 'api/security/carro';
  }

  resolve(route: ActivatedRouteSnapshot): Observable<CarroModel> {
    return this.get(this.hash.decode(route.params.id));
  }

  buscaTotais(filtro: any): Observable<CarroTotaisModel> {
    const params = QueryStringUtils.buildQueryParams(filtro);
    return this.http.get<CarroTotaisModel>(this.baseUrl() + '/totais', { params: params });
  }

}
