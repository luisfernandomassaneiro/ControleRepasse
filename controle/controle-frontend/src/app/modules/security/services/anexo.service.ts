import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { CrudService } from '@shared/services/base/crud.service';
import { MessagesService } from '@shared/services/message.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AnexoModel } from '../models/anexo.model';

@Injectable({
  providedIn: 'root'
})
export class AnexoService extends CrudService<AnexoModel> implements Resolve<AnexoModel> {

  private headers: HttpHeaders = new HttpHeaders(
    {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
      'Access-Control-Allow-Credentials': 'true'
    }
  );

  constructor(http: HttpClient, message: MessagesService) {
    super(http, message);
  }

  baseUrl(): string {
    return 'api/shared/anexo';
  }

  resolve(route: ActivatedRouteSnapshot): Observable<AnexoModel> {
    return this.get(route.params.id);
  }

  salvar(formData: any): Observable<any> {
    return this.http.post(this.baseUrl() + '/salvar', formData);
  }

  download(anexoId: any): Observable<any> {
    return this.getBlob('/donwload/' + anexoId);
  }

  getBlob(endpoint: string, params?: HttpParams, options?: HttpHeaders): Observable<any> {
    const url = this.baseUrl() + endpoint;
    const op: any = { headers: this.getOptions(options), responseType: 'blob' };

    if (params) {
      op['params'] = params;
    }
    return this.http.get(url, op);
  }

  downloadFile(data: any, fileName: string) {
    const blob = new Blob([data], { type: data.type });
    const blobUrl = window.URL.createObjectURL(blob);
    return blobUrl;
    /*
    if (typeof navigator.msSaveOrOpenBlob !== 'undefined') {
      return navigator.msSaveOrOpenBlob(blob, fileName);
    } else if (typeof navigator.msSaveBlob !== 'undefined') {
      return navigator.msSaveBlob(blob, fileName);
    }

    const a = document.createElement('a');
    a.target = '_blank';
    a.href = blobUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);*/
  }

  getOptions(options?: HttpHeaders): HttpHeaders {
    let headers = this.headers;
    if (options) {
      options.keys().forEach(key => {
        headers = headers.append(key, options.get(key));
      });
    }
    return headers;
  }

  buscaImagens(carroId: number): Observable<AnexoModel[]> {
    return this.http.get<AnexoModel[]>(this.baseUrl() + '/busca-imagens/' + carroId);
  }
}
