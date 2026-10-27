import { ChangeDetectionStrategy, Component, inject, input, output, signal, viewChild } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { ConfirmDialog, ConfirmDialogData } from '@shared/components/confirm-dialog/confirm-dialog';
import { Dropdown, toOptions } from '@shared/components/dropdown/dropdown';
import { TextInput } from '@shared/components/text-input/text-input';
import { TableSkeleton } from '@shared/components/skeleton/table-skeleton/table-skeleton';
import { Observable } from 'rxjs';
import { Participant, ParticipantChanges, ParticipantRole } from '../../models/event.model';
import { ATTENDANCE_LABELS, ATTENDANCE_STATUSES, ROLE_LABELS } from '../../constants/constants';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-event-details',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    Dropdown,
    TextInput,
    TableSkeleton,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
  ],
  templateUrl: './event-details.html',
  styleUrl: './event-details.scss',
})
export class EventDetails {
  private readonly api = inject(EventService);
  private readonly dialog = inject(MatDialog);

  readonly eventId = input.required<string>();
  readonly participantsChange = output<void>();

  protected readonly statuses = ATTENDANCE_STATUSES;
  protected readonly attendanceLabels = ATTENDANCE_LABELS;
  protected readonly roles = Object.entries(ROLE_LABELS) as [ParticipantRole, string][];
  protected readonly roleOptions = toOptions(ROLE_LABELS);
  protected readonly nameErrors = {
    required: $localize`:@@events.details.form.nameRequired:Name ist erforderlich.`,
  };
  protected readonly emailErrors = {
    required: $localize`:@@events.details.form.emailRequired:E-Mail ist erforderlich.`,
    email: $localize`:@@events.details.form.emailInvalid:Bitte eine gültige E-Mail eingeben.`,
  };
  protected readonly error = signal<string | null>(null);

  protected readonly participants = rxResource({
    request: () => this.eventId(),
    loader: ({ request }) => this.api.getParticipants(request),
  });

  protected readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    role: new FormControl<ParticipantRole>('guest', { nonNullable: true, validators: [Validators.required] }),
  });
  private readonly formDirective = viewChild(FormGroupDirective);

  protected add(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { name, email, role } = this.form.getRawValue();
    const participant = { name: name.trim(), email: email.trim(), role, attendanceStatus: 'Registered' as const };
    this.save(this.api.addParticipant(this.eventId(), participant), () => {
      this.formDirective()?.resetForm({ name: '', email: '', role: 'guest' });
      this.participantsChange.emit();
    });
  }

  protected remove(participant: Participant): void {
    const data: ConfirmDialogData = {
      title: $localize`:@@events.details.remove.title:Teilnehmer entfernen`,
      message: $localize`:@@events.details.remove.message:${participant.name}:name: wird aus dieser Veranstaltung entfernt.`,
      confirmLabel: $localize`:@@events.details.remove.confirm:Entfernen`,
    };
    this.dialog
      .open(ConfirmDialog, { data })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) {
          this.save(this.api.removeParticipant(this.eventId(), participant.id), () => this.participantsChange.emit());
        }
      });
  }

  protected change(participant: Participant, changes: ParticipantChanges): void {
    this.save(this.api.updateParticipant(this.eventId(), participant.id, changes));
  }

  private save(request: Observable<void>, done?: () => void): void {
    this.error.set(null);
    request.subscribe({
      next: () => {
        this.participants.reload();
        done?.();
      },
      error: () => this.error.set($localize`:@@shared.errors.saveFailed:Änderung konnte nicht gespeichert werden.`),
    });
  }
}
