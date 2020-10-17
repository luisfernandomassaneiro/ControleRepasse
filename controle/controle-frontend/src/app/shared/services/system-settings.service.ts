import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

class NavBarStatus {
  public changed: Subject<NavBarStatus> = new Subject<NavBarStatus>();

  constructor() {
    const status = NavBarStatus.getStatus();
    this._fixed = status.fixed;
  }

  private _fixed: boolean;

  get fixed(): boolean {
    return this._fixed;
  }

  set fixed(value: boolean) {
    this._fixed = value;
    this.changed.next(this);
    this.saveStatus();
  }

  private _collapsed: boolean;

  get collapsed(): boolean {
    return this._collapsed;
  }

  set collapsed(value: boolean) {
    this._collapsed = value;
    this.changed.next(this);
  }

  private static getStatus(): { fixed?: boolean } {
    const str = localStorage.getItem('app.settings.layout.navbar');
    return str ? JSON.parse(str) : {};
  }

  private saveStatus(): void {
    localStorage.setItem('app.settings.layout.navbar', JSON.stringify({
      fixed: this._fixed,
    }));
  }
}

class Layout {
  public readonly navbar = new NavBarStatus();
  public resized: EventEmitter<number> = new EventEmitter<number>();

  private _width: number;

  set width(val: number) {
    this._width = val;
    this.resized.emit(val);
  }

  get mobile(): boolean {
    return this._width < 576;
  }

  get small(): boolean {
    return this._width < 768;
  }
}

class UserSettings {
  constructor() {
    const status = UserSettings.getStatus();
    this._language = status.language;
  }

  private _language: string;

  get language(): string {
    return this._language;
  }

  set language(value: string) {
    this._language = value;
  }

  private static getStatus(): { language?: string } {
    const str = localStorage.getItem('app.settings.user_settings');
    return str ? JSON.parse(str) : {};
  }

  private saveStatus(): void {
    localStorage.setItem('app.settings.user_settings', JSON.stringify({
      language: this._language,
    }));
  }
}

export class Settings {
  appName: string;
  hashKey: string;
  enableAd = false;
  enableLocal = false;
  alterarUsername = true;
  alterarTipoUsuario = true;
}

@Injectable({ providedIn: 'root' })
export class SystemSettingsService {

  public readonly layout: Layout = new Layout();
  public readonly user: UserSettings = new UserSettings();

  public settings: Settings;

  constructor(private http: HttpClient) {
  }

  get multitype() {
    return this.settings.enableLocal && this.settings.enableAd;
  }

  public load(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.http.get<Settings>('api/application/settings').subscribe(value => {
        this.settings = value;
        resolve(true);
      }, (e) => {
        reject(e);
      });
    });
  }

}
