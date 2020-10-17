import { enableProdMode, ViewEncapsulation } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from '@env/environment';

if (environment.production) {
  enableProdMode();
}

const bootstrap = () => {
  return platformBrowserDynamic().bootstrapModule(AppModule, {
    defaultEncapsulation: ViewEncapsulation.Emulated,
  }).then((res) => {
    const wd: any = window;
    if (wd.appBootstrap) {
      wd.appBootstrap();
    }
    document.getElementById('preloader').remove();
    return res;
  });
};

bootstrap();
