import { Component } from '@angular/core';

@Component({
  template: '<app-exception code="500" title="error.offline.title" description="error.offline.message" [redirect]="false"></app-exception>',
})
export class ExceptionOfflineComponent {
}
