import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { TranslationService } from '@shared/services/translation.service';

@Injectable()
export class I18nStartupService {
  constructor(private readonly translate: TranslateService,
              private readonly i18n: TranslationService,
              private readonly httpClient: HttpClient) {
  }

  init(): Promise<any> {
    return new Promise((resolve) => {
      this.viaHttp(resolve);
    });
  }

  private viaHttp(resolve: any) {
    this.httpClient.get(`assets/i18n/${this.i18n.defaultLang}.json`).subscribe(langData => {
      this.translate.setTranslation(this.i18n.defaultLang, langData);
      this.translate.setDefaultLang(this.i18n.defaultLang);
      resolve(null);
    });
  }
}

export function I18nProviderFactory(provider: I18nStartupService) {
  return () => provider.init();
}
