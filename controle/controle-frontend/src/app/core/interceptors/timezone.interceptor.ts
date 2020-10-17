import { Injectable } from '@angular/core';
import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { QueryStringUtils } from '@shared/utils/querystring.utils';

@Injectable()
export class TimezoneInterceptor implements HttpInterceptor {

  private static setTimeZone(body: any): any {
    if (!body) {
      return body;
    }
    if (Object.prototype.toString.call(body) === '[object Object]') {
      const nb = {};
      for (const bodyKey in body) {
        nb[bodyKey] = QueryStringUtils.handleDate(body[bodyKey]);
      }
      return nb;
    }
    return body;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    req = req.clone({
      body: TimezoneInterceptor.setTimeZone(req.body),
    });
    return next.handle(req);
  }
}
