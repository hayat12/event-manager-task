import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-side-menu-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './side-menu-item.html',
  styleUrl: './side-menu-item.scss',
})
export class SideMenuItem {
  readonly icon = input.required<string>();
  readonly label = input.required<string>();
  readonly path = input.required<string>()
}
