import { Injectable } from '@angular/core';
import Hashids from 'hashids';
import { SystemSettingsService } from '@shared/services/system-settings.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class HashService {

  private hashid: Hashids;

  constructor(settings: SystemSettingsService, private router: Router) {
    this.hashid = new Hashids(settings.settings.hashKey, 32);
  }

  encode(id: number): string {
    return this.hashid.encode(id);
  }

  decode(id: string): number | bigint {
    const dec = this.hashid.decode(id)[0];
    if (dec == null) {
      this.router.navigate(['/error/403']);
    }
    return dec;
  }
}
