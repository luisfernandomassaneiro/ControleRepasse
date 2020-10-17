import { Injectable } from '@angular/core';
import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';

import { Router } from '@angular/router';
import { catchError } from 'rxjs/internal/operators';
import { throwError } from 'rxjs';
import { FeedbackService } from '@shared/services/feedback-service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private readonly router: Router, private readonly feedback: FeedbackService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {

    return next.handle(req).pipe(catchError(error => {
      const handle = !req.headers.get('ignore-error-handler');
      if (!handle) {
        return throwError(error);
      }
      switch (error.status) {
        case 400: {
          if (error.error.validations && error.error.validations.length) {
            for (const value of error.error.validations) {
              this.feedback.error(value);
            }
          } else {
            this.feedback.error(error.error.message);
          }
          break;
        }
        case 404: {
          this.router.navigate(['error/404']);
          break;
        }
        case 403: {
          this.router.navigate(['error/403']);
          break;
        }
        case 500: {
          this.router.navigate(['error/500'], { queryParams: { code: error.error.hash } });
          break;
        }
        case 0: {
          this.router.navigate(['error/offline'], { skipLocationChange: true });
          break;
        }
      }
      return throwError(error);
    }));
  }
}
