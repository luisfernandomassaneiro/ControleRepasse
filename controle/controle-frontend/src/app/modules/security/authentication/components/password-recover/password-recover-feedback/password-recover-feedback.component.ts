import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-password-recover-feedback',
  templateUrl: './password-recover-feedback.component.html',
})
export class PasswordRecoverFeedbackComponent {
  @Output()
  cancel: EventEmitter<void> = new EventEmitter();
}
