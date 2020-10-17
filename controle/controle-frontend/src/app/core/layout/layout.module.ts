import { NgModule } from '@angular/core';

import { LayoutDefaultComponent } from './default/default.component';
import { LayoutFullScreenComponent } from './fullscreen/fullscreen.component';
import { HeaderComponent } from './default/header/header.component';
import { SidebarComponent } from './default/sidebar/sidebar.component';
import { HeaderFullScreenComponent } from './default/header/components/fullscreen.component';
import { HeaderUserComponent } from './default/header/components/user.component';
import { SharedModule } from '@shared/shared.module';
import { SidebarItemComponent } from './default/sidebar/sidebar-item.component';

const COMPONENTS = [
  LayoutDefaultComponent,
  LayoutFullScreenComponent,
  HeaderComponent,
  SidebarComponent,
  SidebarItemComponent,
];

const HEADERCOMPONENTS = [
  HeaderFullScreenComponent,
  HeaderUserComponent,
];

@NgModule({
  imports: [SharedModule],
  declarations: [
    ...COMPONENTS,
    ...HEADERCOMPONENTS,
  ],
  exports: [
    ...COMPONENTS,
  ],
})
export class LayoutModule {
}
