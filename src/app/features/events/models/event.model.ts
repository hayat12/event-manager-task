import { Page } from '@core/models/page';
import { Sort } from '@core/models/sort';
import type { ATTENDANCE_STATUSES } from '../constants/constants';

export type EventStatus = 'planned' | 'cancelled' | 'done';
export type StatisticTone = 'total' | 'planned' | 'cancelled' | 'done';

export type AttendanceStatus = (typeof ATTENDANCE_STATUSES)[number];

export type ParticipantRole = 'organizer' | 'speaker' | 'guest';

export type Statistic = {
  key: StatisticTone;
  label: string;
  icon: string;
};

export type Participant = {
  id: string;
  name: string;
  email: string;
  role: ParticipantRole;
  attendanceStatus: AttendanceStatus;
};

export type ParticipantChanges = Partial<Pick<Participant, 'role' | 'attendanceStatus'>>;

export type EventItem = {
  id: string;
  date: string;
  location: string;
  status: EventStatus;
  participants: Participant[];
};

export type NewEvent = Omit<EventItem, 'id' | 'participants'>;

export type EventChanges = Partial<Pick<EventItem, 'status' | 'location'>>;

export type EventSummary = Omit<EventItem, 'participants'> & { participantCount: number };

export type EventSortField = 'date' | 'location';

export type EventGroupField = 'status' | 'location';

export type EventFilters = {
  status: EventStatus | null;
  location: string | null;
  dateFrom: string | null;
  dateTo: string | null;
};

export type EventsQuery = {
  search: string;
  filters: EventFilters;
  sort: Sort<EventSortField>;
  groupBy: EventGroupField | null;
  pageIndex: number;
  pageSize: number;
};

export type EventGroup = {
  key: string;
  eventCount: number;
  participantCount: number;
};

export type EventsPage = Page<EventSummary> & {
  groups: EventGroup[];
  statusCounts: Record<EventStatus, number>;
};
