import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class InitializationService {

  errors: string[] = [];

  error(err: string): void {
    this.errors.push(err);
  }

  isFailed(): boolean {
    return this.errors.length > 0;
  }
}
