import { Injectable } from '@angular/core';
import { SecurityService } from '@shared/services/security.service';

@Injectable()
export class SubjectStartupService {

  constructor(private security: SecurityService) {
  }

  init(): Promise<any> {
    return new Promise((resolve) => {
      this.viaHttp(resolve);
    });
  }

  private viaHttp(resolve: any) {
    this.security.load()
      .subscribe(value => {
        this.security.subject = value;
        resolve(null);
      }, () => {
        resolve(null);
      });
  }
}

export function SubjectProviderFactory(provider: SubjectStartupService) {
  return () => provider.init();
}
