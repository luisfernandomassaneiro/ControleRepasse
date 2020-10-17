import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password-recover',
  templateUrl: './password-recover.component.html',
  styles: [],
})
export class PasswordRecoverComponent {

  sent = false;

  constructor(private readonly router: Router) {
  }

  onCancel(): void {
    this.router.navigate(['auth', 'login']);
  }
}
