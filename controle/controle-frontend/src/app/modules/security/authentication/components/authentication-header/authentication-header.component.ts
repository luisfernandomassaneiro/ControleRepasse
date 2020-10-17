import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-authentication-header',
  templateUrl: './authentication-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthenticationHeaderComponent {
  @Input()
  title: string;
  @Input()
  description: string;
}
