import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './header/header';
import { SideMenu } from './side-menu/side-menu';

@Component({
  selector: 'app-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, Header, SideMenu],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {

}
