import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PersistentFilterService {

  constructor(private router: Router) {
    this.clear();
  }

  get(def?: any): any {
    const key = window.sessionStorage.getItem('FILTER_KEY');
    if (!key) {
      return def;
    }
    if (key !== this.router.url) {
      this.clear();
      return def;
    }
    const object = window.sessionStorage.getItem('FILTER_OBJECT');
    return object ? JSON.parse(object) : def;
  }

  set(filter: any): void {
    if (!filter) {
      window.sessionStorage.removeItem('FILTER_KEY');
      window.sessionStorage.removeItem('FILTER_OBJECT');
    } else {
      window.sessionStorage.setItem('FILTER_KEY', this.router.url);
      window.sessionStorage.setItem('FILTER_OBJECT', JSON.stringify(filter));
    }
  }

  clear(): void {
    this.set(null);
  }
}
