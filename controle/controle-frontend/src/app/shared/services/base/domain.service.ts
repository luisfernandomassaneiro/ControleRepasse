import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ListaPaginadaModel } from '@shared/models/lista-paginada.model';
import { QueryStringUtils } from '@shared/utils/querystring.utils';

export class DominioPaginadoRequest {
  [key: string]: any;

  pageSize = 250;
  pageIndex = 0;
  search: string;
  paged = true;
}

export abstract class DomainService<T> {

  protected constructor(private http: HttpClient, private readonly url: string) {
    if (!this.url.endsWith('/')) {
      this.url += '/';
    }
  }

  protected get paged(): string {
    return 'paged';
  }

  private static params(filtro: any, loader: boolean) {
    const p: {
      headers?: HttpHeaders;
      params?: HttpParams
    } = {};
    if (filtro) {
      p.params = QueryStringUtils.buildQueryParams(filtro);
    }
    if (!loader) {
      p.headers = new HttpHeaders({ 'no-loader': 'true' });
    }
    return p;
  }

  public list(filtro?: any, loader = true): Observable<T[]> {
    return this.http.get<T[]>(this.url, DomainService.params(filtro, loader));
  }

  public page(filtro?: DominioPaginadoRequest, loader = true): Observable<ListaPaginadaModel<T>> {
    return this.http.get<ListaPaginadaModel<T>>(this.url + this.paged, DomainService.params(filtro, loader));
  }
}
