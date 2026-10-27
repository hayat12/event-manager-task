import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SideMenuItem } from './side-menu-item/side-menu-item';
import { MenuSetting } from './menu-setting/menu-setting';

@Component({
  selector: 'app-side-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SideMenuItem, MenuSetting],
  templateUrl: './side-menu.html',
  styleUrl: './side-menu.scss',
})
export class SideMenu {
  protected readonly menus = [
    { id: 'all-events', path: '/events', label: $localize`:@@layout.sideMenu.allEvents:Alle Events`, icon: 'calendar_month' },
  ];
}
