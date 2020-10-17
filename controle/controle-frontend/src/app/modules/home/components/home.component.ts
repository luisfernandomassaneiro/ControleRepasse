import { Component } from '@angular/core';
import { SystemSettingsService } from '@shared/services/system-settings.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  title: string;

  constructor(set: SystemSettingsService) {
    this.title = set.settings.appName;
  }
}
