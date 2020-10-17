import { HttpParams } from '@angular/common/http';

export class QueryStringUtils {

  static addArray(target: HttpParams, key: string, value: Array<any>): HttpParams {
    value.forEach(v => {
      target = target.append(key, v.toString());
    });
    return target;
  }

  static handleDate(val: any): any {
    if (Object.prototype.toString.call(val) === '[object Date]') {
      const d: Date = val;
      const date = new Date();
      date.setUTCFullYear(d.getFullYear(), d.getMonth(), d.getDate());
      date.setUTCHours(d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
      return date.toISOString().replace('Z', '');
    }
    return val;
  }

  static buildQueryParams(source: object): HttpParams {
    return this.appendQueryParams(new HttpParams(), source);
  }

  static appendQueryParams(target: HttpParams, source: object): HttpParams {
    Object.keys(source).forEach((key: string) => {
      const value = source[key];
      if ((typeof value !== 'undefined') && (value !== null)) {
        if (Array.isArray(value)) {
          target = this.addArray(target, key, value);
        } else {
          target = target.append(key, value.toString());
        }
      }
    });
    return target;
  }
}
