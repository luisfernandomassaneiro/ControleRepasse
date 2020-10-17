import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';

export interface MenuIcon {
  type: 'class' | 'icon' | 'iconfont' | 'img';
  value?: string;
  theme?: 'outline' | 'twotone' | 'fill';
  spin?: boolean;
  twoToneColor?: string;
  iconfont?: string;
}

export interface MenuItem {
  text?: string;
  i18n?: string;
  link?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  icon?: string | MenuIcon | null;
  children?: MenuItem[];
}

@Component({
  selector: 'app-sidebar-item',
  templateUrl: './sidebar-item.component.html',
  styleUrls: ['./sidebar-item.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarItemComponent implements OnInit {
  @Input()
  root = true;
  @Input()
  level = 0;
  padding: number;
  @Output()
  menuSelected: EventEmitter<MenuItem> = new EventEmitter<MenuItem>();

  private _items: MenuItem[];

  get items(): MenuItem[] {
    return this._items;
  }

  @Input()
  set items(value: MenuItem[]) {
    this._items = value;
    SidebarItemComponent.ajustaIcones(this._items);
  }

  private static ajustaIcones(itens: MenuItem[]) {
    itens.forEach(item => {
      // icon
      if (typeof item.icon === 'string') {
        let type = 'class';
        let value = item.icon;
        // compatible `anticon anticon-user`
        if (~item.icon.indexOf(`anticon-`)) {
          type = 'icon';
          value = value
            .split('-')
            .slice(1)
            .join('-');
        } else if (/^https?:\/\//.test(item.icon)) {
          type = 'img';
        }
        item.icon = { type, value } as any;
      }
      if (item.icon != null) {
        item.icon = { theme: 'outline', spin: false, ...(item.icon as MenuIcon) };
      }
    });
  }

  onItemClick(item: MenuItem): void {
    if (!item.link) {
      return;
    }
    this.menuSelected.emit(item);
  }

  ngOnInit(): void {
    this.padding = 15 + (this.level * 25);
  }
}
