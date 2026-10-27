import { TableColumn } from '@shared/components/table-box/table-box.models';
import type { AttendanceStatus, EventStatus, ParticipantRole, Statistic } from '../models/event.model';

/** statuses, as stored in the data. */
export const ATTENDANCE_STATUSES = ['Registered', 'Confirmed', 'WaitingList'] as const;

export const STATUS_LABELS: Record<EventStatus, string> = {
  planned: $localize`:@@events.model.status.planned:Geplant`,
  cancelled: $localize`:@@events.model.status.cancelled:Abgesagt`,
  done: $localize`:@@events.model.status.done:Erledigt`,
};

export const ROLE_LABELS: Record<ParticipantRole, string> = {
  organizer: $localize`:@@events.model.role.organizer:Organisator`,
  speaker: $localize`:@@events.model.role.speaker:Referent`,
  guest: $localize`:@@events.model.role.guest:Gast`,
};

export const ATTENDANCE_LABELS: Record<AttendanceStatus, string> = {
  Registered: $localize`:@@events.model.attendance.registered:Angemeldet`,
  Confirmed: $localize`:@@events.model.attendance.confirmed:Bestätigt`,
  WaitingList: $localize`:@@events.model.attendance.waitingList:Warteliste`,
};

/** Columns of the list view. */
export const EVENT_COLUMNS: TableColumn[] = [
  { key: 'date', label: $localize`:@@events.list.columns.date:Datum`, sortable: true },
  { key: 'location', label: $localize`:@@events.list.columns.location:Ort`, sortable: true },
  { key: 'status', label: $localize`:@@events.list.columns.status:Status` },
  { key: 'participants', label: $localize`:@@events.list.columns.participants:Teilnehmer`, align: 'center' },
  { key: 'actions', label: $localize`:@@events.list.columns.details:Details`, align: 'end', hideLabel: true },
];

/** Tiles above the list; their numbers come from the store. */
export const EVENT_STATISTICS: Statistic[] = [
  { key: 'total', label: $localize`:@@events.list.statistics.total:Total`, icon: 'event' },
  { key: 'planned', label: $localize`:@@events.list.statistics.planned:Planned`, icon: 'schedule' },
  { key: 'cancelled', label: $localize`:@@events.list.statistics.cancelled:Cancelled`, icon: 'event_busy' },
  { key: 'done', label: $localize`:@@events.list.statistics.done:Done`, icon: 'task_alt' },
];

