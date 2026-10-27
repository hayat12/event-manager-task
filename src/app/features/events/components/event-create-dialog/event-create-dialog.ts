import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Datepicker } from '@shared/components/datepicker/datepicker';
import { Dropdown, toOptions } from '@shared/components/dropdown/dropdown';
import { futureDate, toIsoDate, tomorrow } from '@shared/utils/date';
import { STATUS_LABELS } from '../../constants/constants';
import { EventStatus, NewEvent } from '../../models/event.model';

export type EventCreateDialogData = {
  locations: string[];
};

@Component({
  selector: 'app-event-create-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MatButtonModule, MatDialogModule, Datepicker, Dropdown],
  templateUrl: './event-create-dialog.html',
  styleUrl: './event-create-dialog.scss',
})
export class EventCreateDialog {
  private readonly dialogRef = inject<MatDialogRef<EventCreateDialog, NewEvent>>(MatDialogRef);
  protected readonly data = inject<EventCreateDialogData>(MAT_DIALOG_DATA);

  protected readonly minDate = toIsoDate(tomorrow());
  protected readonly statusOptions = toOptions(STATUS_LABELS);
  protected readonly locationOptions = this.data.locations.map((location) => ({ value: location, label: location }));

  protected readonly dateErrors = {
    required: $localize`:@@events.create.errors.dateRequired:Datum ist erforderlich.`,
    futureDate: $localize`:@@events.create.errors.dateFuture:Das Datum muss in der Zukunft liegen.`,
  };
  protected readonly locationErrors = {
    required: $localize`:@@events.create.errors.locationRequired:Ort ist erforderlich.`,
  };

  protected readonly form = new FormGroup({
    date: new FormControl<string | null>(null, { validators: [Validators.required, futureDate] }),
    location: new FormControl<string | null>(null, { validators: [Validators.required] }),
    status: new FormControl<EventStatus>('planned', { nonNullable: true, validators: [Validators.required] }),
  });

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { date, location, status } = this.form.getRawValue();
    this.dialogRef.close({ date: date!, location: location!, status });
  }
}
