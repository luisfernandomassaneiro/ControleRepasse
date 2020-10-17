import { Injectable } from '@angular/core';
import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { EnvService } from '../../env.service';


@Injectable()
export class UrlInterceptor implements HttpInterceptor {

  private readonly IGNORED_PATHS = ['assets/'];

  constructor(
    public env: EnvService,
  ) {
  }

  shouldIntercept(url: string): boolean {
    if (!this.env.apiUrl) {
      return false;
    }
    for (const path of this.IGNORED_PATHS) {
      if (url.startsWith(path) || url.startsWith(`/${path}`)) {
        return false;
      }
    }
    return true;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (this.shouldIntercept(req.url)) {
      req = req.clone({
        url: this.env.apiUrl + req.url,
      });
    }
    return next.handle(req);
  }
}
