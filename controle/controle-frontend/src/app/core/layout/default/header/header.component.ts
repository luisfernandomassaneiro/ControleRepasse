import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { SystemSettingsService } from '@shared/services/system-settings.service';

@Component({
  selector: 'layout-header',
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  constructor(public settings: SystemSettingsService, private readonly cdr: ChangeDetectorRef) {
    this.settings.layout.navbar.changed.subscribe(() => {
      cdr.markForCheck();
    });
  }

  toggleCollapsedSidebar() {
    this.settings.layout.navbar.collapsed = !this.settings.layout.navbar.collapsed;
  }
}
