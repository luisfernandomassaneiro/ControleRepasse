import { Injectable } from '@angular/core';
import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { TranslationService } from '@shared/services/translation.service';

const LOCALE_HEADER = 'app-locale';

@Injectable()
export class LangInterceptor implements HttpInterceptor {

  constructor(private readonly langService: TranslationService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    req = req.clone({ headers: req.headers.set(LOCALE_HEADER, this.langService.currentLang) });
    return next.handle(req);
  }
}
