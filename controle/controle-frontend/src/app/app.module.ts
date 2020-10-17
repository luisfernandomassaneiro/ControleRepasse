import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NZ_I18N } from 'ng-zorro-antd';
import { registerLocaleData } from '@angular/common';
import { AppComponent } from './app.component';
import { I18nProviderFactory, I18nStartupService } from '@core/initializers/i18n.startup.service';
import { AppProviderFactory, AppStartupService } from '@core/initializers/app.startup.service';
import { ErrorInterceptor } from '@core/interceptors/error.interceptor';
import { LangInterceptor } from '@core/interceptors/lang.interceptor';
import { UrlInterceptor } from '@core/interceptors/url.interceptor';
import { SubjectProviderFactory, SubjectStartupService } from '@core/initializers/subject.startup.service';
import { AuthInterceptor } from '@core/interceptors/auth.interceptor';
import { AppRoutingModule } from './app.routing';
import { Exception403Component } from '@shared/components/error/403.component';
import { Exception500Component } from '@shared/components/error/500.component';
import { Exception404Component } from '@shared/components/error/404.component';
import { HomeModule } from './modules/home/home.module';
import { DEFAULT_LANGUAGE_CONFIG } from '@shared/configs/i18n/i18n.languages.const';
import { ExceptionComponent } from '@shared/components/error/exception/exception.component';
import { SharedModule } from '@shared/shared.module';
import { LayoutModule } from '@core/layout/layout.module';
import { EnvServiceProvider } from './env.service.provider';
import { TimezoneInterceptor } from '@core/interceptors/timezone.interceptor';
import { ExceptionOfflineComponent } from '@shared/components/error/offline.component';
import { ExceptionInitComponent } from '@shared/components/error/init.component';
import { InitializationService } from '@shared/services/initialization.service';

registerLocaleData(DEFAULT_LANGUAGE_CONFIG.ng, DEFAULT_LANGUAGE_CONFIG.abbr);

export function I18nHttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, `assets/i18n/`, '.json');
}

const I18NSERVICE_MODULES = [
  TranslateModule.forRoot({
    loader: {
      provide: TranslateLoader,
      useFactory: I18nHttpLoaderFactory,
      deps: [HttpClient],
    },
  }),
];

const LANG_PROVIDES = [
  { provide: LOCALE_ID, useValue: DEFAULT_LANGUAGE_CONFIG.abbr },
  { provide: NZ_I18N, useValue: DEFAULT_LANGUAGE_CONFIG.zorro },
];

const GLOBAL_THIRD_MODULES = [];

const APPINIT_PROVIDES = [
  I18nStartupService,
  AppStartupService,
  InitializationService,
  SubjectStartupService,
  { provide: APP_INITIALIZER, useFactory: I18nProviderFactory, deps: [I18nStartupService], multi: true },
  { provide: APP_INITIALIZER, useFactory: AppProviderFactory, deps: [AppStartupService], multi: true },
  { provide: APP_INITIALIZER, useFactory: SubjectProviderFactory, deps: [SubjectStartupService], multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: UrlInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: LangInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: TimezoneInterceptor, multi: true },
];

@NgModule({
  declarations: [
    AppComponent,
    Exception403Component,
    Exception500Component,
    Exception404Component,
    ExceptionOfflineComponent,
    ExceptionInitComponent,
    ExceptionComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    LayoutModule,
    AppRoutingModule,
    HomeModule,
    ...I18NSERVICE_MODULES,
    ...GLOBAL_THIRD_MODULES,
  ],
  providers: [
    EnvServiceProvider,
    ...LANG_PROVIDES,
    ...APPINIT_PROVIDES,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
