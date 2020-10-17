import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import * as screenfull from 'screenfull';

@Component({
  selector: 'header-fullscreen',
  template: `
    <i nz-icon [nzType]="status ? 'fullscreen-exit' : 'fullscreen'"></i>
    {{ (status ? 'layout.header.menu.fullscreen.exit' : 'layout.header.menu.fullscreen') | translate }}
  `,
  host: {
    '[class.d-block]': 'true',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderFullScreenComponent {
  status = false;

  private static get sf(): any {
    return screenfull;
  }

  @HostListener('window:resize')
  _resize() {
    this.status = HeaderFullScreenComponent.sf.isFullscreen;
  }

  @HostListener('click')
  _click() {
    if (HeaderFullScreenComponent.sf.isEnabled) {
      HeaderFullScreenComponent.sf.toggle();
    }
  }
}
