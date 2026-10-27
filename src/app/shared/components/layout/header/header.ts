import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { SearchField } from '../../search-field/search-field';
import { SearchStore } from '../../../state/search.store';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, MatIconModule, SearchField],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  protected readonly store = inject(SearchStore);
}
