import { ChangeDetectionStrategy, Component, inject, LOCALE_ID } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-menu-setting',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, MatMenuModule],
  templateUrl: './menu-setting.html',
  styleUrl: './menu-setting.scss',
})
export class MenuSetting {
  private readonly router = inject(Router);

  protected readonly languages = [
    { code: 'de', label: 'Deutsch' },
    { code: 'en', label: 'English' },
  ];
  protected readonly currentLanguage = inject(LOCALE_ID).slice(0, 2);
  protected readonly currentPath = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );
}
