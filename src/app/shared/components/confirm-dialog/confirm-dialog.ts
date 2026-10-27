import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

export type ConfirmDialogData = {
  title: string;
  message: string;
  /** Text of the confirm button; "Bestätigen" by default. */
  confirmLabel?: string;
};

/**
 * Asks the user to confirm an action. Closes with `true` when confirmed, otherwise with nothing.
 * Usage: `dialog.open(ConfirmDialog, { data }).afterClosed()`.
 */
@Component({
  selector: 'app-confirm-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.scss',
})
export class ConfirmDialog {
  protected readonly data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);
}
