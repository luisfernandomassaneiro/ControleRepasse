import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ListaPaginadaModel } from '@shared/models/lista-paginada.model';
import { QueryStringUtils } from '@shared/utils/querystring.utils';
import { ReportTypeEnum } from '@shared/enum/report-type.enum';
import { FileDownloadUtils } from '@shared/utils/file-download.utils';
import { MessagesService } from '@shared/services/message.service';

export abstract class QueryService<TResumo> {

  protected constructor(protected http: HttpClient, protected message: MessagesService) {
  }

  abstract baseUrl(): string;

  public list(filtro: any): Observable<ListaPaginadaModel<TResumo>> {
    const params = QueryStringUtils.buildQueryParams(filtro);
    return this.http.get<ListaPaginadaModel<TResumo>>(this.baseUrl(), { params: params });
  }

  public export(type: ReportTypeEnum, filtro: any, name: string): void {
    filtro.format = type.toString();
    const params = QueryStringUtils.buildQueryParams(filtro);
    this.http.get(this.baseUrl() + '/export', {
      responseType: 'arraybuffer',
      params: params,
    }).subscribe(data => FileDownloadUtils.download(data, type, name));
  }

  public get<T>(id: number | bigint): Observable<T> {
    const url = this.baseUrl() + '/' + id;
    return this.http.get<T>(url);
  }
}
