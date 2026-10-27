import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, distinctUntilChanged, map, Subject } from 'rxjs';

/** Pill-shaped search input that reports the text once typing has paused for 300 ms. */
@Component({
  selector: 'app-search-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatFormFieldModule, MatIconModule, MatInputModule],
  templateUrl: './search-field.html',
  styleUrl: './search-field.scss',
})
export class SearchField {
  readonly value = input('');
  readonly placeholder = input('');

  private readonly typed = new Subject<string>();

  readonly searchChange = outputFromObservable(
    this.typed.pipe(
      debounceTime(300),
      map((search) => search.trim()),
      distinctUntilChanged(),
    ),
  );

  protected onInput(search: string): void {
    this.typed.next(search);
  }
}
