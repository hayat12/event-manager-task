import { formatGermanDate } from '@shared/utils/date';
import { STATUS_LABELS } from '../constants/constants';
import {
  EventGroup,
  EventGroupField,
  EventItem,
  EventsPage,
  EventsQuery,
  EventStatus,
  EventSummary,
} from '../models/event.model';

export function queryEvents(events: EventItem[], query: EventsQuery): EventsPage {
  const matches = findEvents(events, query);
  const start = query.pageIndex * query.pageSize;
  return {
    items: matches.slice(start, start + query.pageSize).map(toSummary),
    total: matches.length,
    groups: query.groupBy ? groupTotals(matches, query.groupBy) : [],
    statusCounts: countByStatus(matches),
  };
}

export function findEvents(events: EventItem[], query: EventsQuery): EventItem[] {
  const matches = events.filter(
    (event) => matchesSearch(event, query.search) && matchesFilters(event, query),
  );
  return sortEvents(matches, query);
}

export function toSummary({ participants, ...event }: EventItem): EventSummary {
  return { ...event, participantCount: participants.length };
}

function matchesSearch(event: EventItem, search: string): boolean {
  const term = search.toLowerCase();
  // return (
  //   !term ||
  //   [formatGermanDate(event.date), event.location, STATUS_LABELS[event.status], String(event.participants.length)].some(
  //     (value) => value.toLowerCase().includes(term),
  //   )
  // );

  /** searchable by event status, location, participants name role and email */
  return (
    !term ||
    [
      event.location,
      STATUS_LABELS[event.status],
      event.participants
        .flatMap((f) => [f.email, f.name, f.role])
        .toLocaleString()
        .toLowerCase(),
    ].some((value) => value.toLowerCase().includes(term))
  );
}

function matchesFilters(event: EventItem, { filters }: EventsQuery): boolean {
  return (
    (!filters.status || event.status === filters.status) &&
    (!filters.location || event.location === filters.location) &&
    (!filters.dateFrom || event.date >= filters.dateFrom) &&
    (!filters.dateTo || event.date <= filters.dateTo)
  );
}

function countByStatus(events: EventItem[]): Record<EventStatus, number> {
  const counts: Record<EventStatus, number> = { planned: 0, cancelled: 0, done: 0 };
  for (const { status } of events) {
    counts[status]++;
  }
  return counts;
}

function groupTotals(events: EventItem[], field: EventGroupField): EventGroup[] {
  const groups = new Map<string, EventGroup>();
  for (const event of events) {
    const group = groups.get(event[field]) ?? {
      key: event[field],
      eventCount: 0,
      participantCount: 0,
    };
    group.eventCount++;
    group.participantCount += event.participants.length;
    groups.set(group.key, group);
  }
  return [...groups.values()];
}

function sortEvents(events: EventItem[], { sort, groupBy }: EventsQuery): EventItem[] {
  const direction = sort.direction === 'asc' ? 1 : -1;
  const groupDirection = groupBy === sort.active ? direction : 1;
  return [...events].sort(
    (a, b) =>
      (groupBy ? groupDirection * a[groupBy].localeCompare(b[groupBy]) : 0) ||
      direction * a[sort.active].localeCompare(b[sort.active]) ||
      a.id.localeCompare(b.id),
  );
}
