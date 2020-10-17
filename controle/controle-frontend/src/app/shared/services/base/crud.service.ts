import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MessagesService, NotificationType } from '@shared/services/message.service';
import { QueryService } from '@shared/services/base/query.service';

export abstract class CrudService<TResumo> extends QueryService<TResumo> {

  protected constructor(http: HttpClient, message: MessagesService) {
    super(http, message);
  }

  public save<T>(entity: any, id?: number): Observable<T> {
    let url = this.baseUrl();
    if (id) {
      url += ('/' + id);
    }
    return this.http.post<T>(url, entity);
  }

  public delete<T>(id?: number): Observable<T> {
    let url = this.baseUrl();
    if (id) {
      url += ('/' + id);
    }
    return this.http.delete<T>(url);
  }

  public saveAndNotify<T>(entity: any, id?: number): Promise<T> {
    return new Promise((resolve) => {
      this.save<T>(entity, id).subscribe((n) => {
        if (id) {
          this.message.notifyI18n('general.messages.updated_record', NotificationType.Success);
        } else {
          this.message.notifyI18n('general.messages.inserted_record', NotificationType.Success);
        }
        resolve(n);
      });
    });
  }

  public confirmAndDelete(id: number) {
    return new Promise((resolve) => {
      this.message.confirmI18n('general.messages.cant_be_undone', 'general.messages.confirm_record_delete').then(() => {
        this.delete(id).subscribe(() => {
          this.message.notifyI18n('general.messages.deleted_record', NotificationType.Success);
          resolve(true);
        });
      });
    });
  }
}
