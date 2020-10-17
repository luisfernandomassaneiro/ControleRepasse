import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { navItems } from '@shared/constants/menu_itens.const';
import { SecurityService } from '@shared/services/security.service';
import { SubjectModel } from '@shared/models/subject.model';
import { PersistentFilterService } from '@shared/services/persistent-filter.service';
import { SystemSettingsService } from '@shared/services/system-settings.service';
import { MenuItem } from '@core/layout/default/sidebar/sidebar-item.component';

@Component({
  selector: 'layout-sidebar',
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {

  subject: SubjectModel;
  fixed = false;
  menu: MenuItem[];

  constructor(
    private readonly settings: SystemSettingsService,
    private readonly cdr: ChangeDetectorRef,
    private readonly securityService: SecurityService,
    private readonly persistentFilter: PersistentFilterService) {

    this.subject = securityService.subject;
    securityService.permissions.subscribe(() => {
      this.menu = this.itens();
      this.cdr.markForCheck();
    });
    this.menu = this.itens();

    this.fixed = this.settings.layout.navbar.fixed;
    this.settings.layout.navbar.collapsed = !this.fixed;
  }

  onMenuSelect() {
    if (this.settings.layout.small) {
      this.settings.layout.navbar.collapsed = true;
    }
    this.persistentFilter.clear();
  }

  toggleCollapsedSidebar() {
    this.fixed = !this.fixed;
    this.settings.layout.navbar.fixed = this.fixed;
    if (this.fixed && this.settings.layout.navbar.collapsed) {
      this.settings.layout.navbar.collapsed = false;
    }
    if (!this.fixed && !this.settings.layout.navbar.collapsed) {
      this.settings.layout.navbar.collapsed = true;
    }
  }

  openMenu() {
    if (this.settings.layout.small) {
      return;
    }
    if (!this.settings.layout.navbar.fixed) {
      this.settings.layout.navbar.collapsed = false;
    }
  }

  closeMenu() {
    if (this.settings.layout.small) {
      return;
    }
    if (!this.settings.layout.navbar.fixed) {
      this.settings.layout.navbar.collapsed = true;
    }
  }

  private itens() {
    let its = [];
    if (navItems) {
      its = navItems.map(value => {
        return JSON.parse(JSON.stringify(value));
      });
    }
    return its;
  }

}
