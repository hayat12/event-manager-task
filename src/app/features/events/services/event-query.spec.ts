import { EventItem, EventsQuery, Participant } from '../models/event.model';
import { queryEvents } from './event-query';

const guest: Participant = { id: 'p', name: 'Anna Berg', email: 'anna.berg@example.com', role: 'guest', attendanceStatus: 'Confirmed' };

const event = (id: string, date: string, location: string, status: EventItem['status'], participants = 1): EventItem => ({
  id,
  date,
  location,
  status,
  participants: Array.from({ length: participants }, () => guest),
});

const events: EventItem[] = [
  event('1', '2026-12-01', 'Berlin', 'planned', 3),
  event('2', '2026-11-15', 'München', 'cancelled', 4),
  event('3', '2027-01-10', 'Berlin', 'done', 5),
  event('4', '2026-10-01', 'Köln', 'planned', 6),
];

const query = (changes: Partial<EventsQuery> = {}): EventsQuery => ({
  search: '',
  filters: { status: null, location: null, dateFrom: null, dateTo: null },
  sort: { active: 'date', direction: 'asc' },
  groupBy: null,
  pageIndex: 0,
  pageSize: 25,
  ...changes,
});

const ids = (changes: Partial<EventsQuery>) => queryEvents(events, query(changes)).items.map(({ id }) => id);

describe('queryEvents', () => {
  it('sorts by date and by location', () => {
    expect(ids({})).toEqual(['4', '2', '1', '3']);
    expect(ids({ sort: { active: 'location', direction: 'desc' } })).toEqual(['2', '4', '1', '3']);
  });

  it('cuts out one page but counts every match', () => {
    const page = queryEvents(events, query({ pageIndex: 1, pageSize: 3 }));
    expect(page.items.map(({ id }) => id)).toEqual(['3']);
    expect(page.total).toBe(4);
  });

  it('filters by status, location and date range together', () => {
    expect(ids({ filters: { status: 'planned', location: 'Berlin', dateFrom: null, dateTo: null } })).toEqual(['1']);
    expect(ids({ filters: { status: null, location: null, dateFrom: '2026-11-01', dateTo: '2026-12-31' } })).toEqual([
      '2',
      '1',
    ]);
  });

  it('searches location, status label and participants', () => {
    expect(ids({ search: 'münchen' })).toEqual(['2']);
    expect(ids({ search: 'abgesagt' })).toEqual(['2']);
    expect(ids({ search: 'anna.berg@' })).toEqual(['4', '2', '1', '3']);
  });

  it('counts statuses and sums participants per group over all matches', () => {
    const page = queryEvents(events, query({ groupBy: 'location', pageSize: 1 }));
    expect(page.statusCounts).toEqual({ planned: 2, cancelled: 1, done: 1 });
    expect(page.groups).toContain({ key: 'Berlin', eventCount: 2, participantCount: 8 });
    expect(page.items[0]?.participantCount).toBe(3);
  });
});
