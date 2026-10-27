import { ChangeDetectionStrategy, Component, input, viewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { BaseControl } from '../base-control';

/** Text field: `<app-text-input label="E-Mail" type="email" formControlName="email" />` */
@Component({
  selector: 'app-text-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatFormFieldModule, MatInputModule],
  templateUrl: './text-input.html',
  styleUrl: './text-input.scss',
})
export class TextInput extends BaseControl<string> {
  readonly label = input('');
  readonly type = input<'text' | 'email'>('text');
  readonly placeholder = input('');

  protected override readonly errorField = viewChild(MatInput);
}
