import { Injectable } from '@angular/core';
import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';

import { Router } from '@angular/router';
import { catchError } from 'rxjs/internal/operators';
import { throwError } from 'rxjs';
import { SecurityService } from '@shared/services/security.service';

const TOKEN_HEADER_KEY = 'Authorization';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private readonly router: Router) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    let authReq = req;
    const token = SecurityService.getToken();
    if (token != null) {
      authReq = req.clone({ headers: req.headers.set(TOKEN_HEADER_KEY, `Bearer ${token}`) });
    }
    return next.handle(authReq).pipe(catchError(err => {
      if (err.status === 401) {
        this.router.navigate(['auth/login']);
        return null;
      }
      return throwError(err);
    }));
  }
}
