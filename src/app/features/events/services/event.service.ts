import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, map, Observable, shareReplay } from 'rxjs';
import {
  EventChanges,
  EventItem,
  EventsPage,
  EventsQuery,
  EventStatus,
  EventSummary,
  NewEvent,
  Participant,
  ParticipantChanges,
} from '../models/event.model';
import { findEvents, queryEvents, toSummary } from './event-query';

type EventRecord = {
  id: string;
  date: string;
  location: string;
  status: EventStatus;
  participants: (Omit<Participant, 'role'> & { role?: Participant['role'] })[];
};

const latency = <T>() => delay<T>(300);

@Injectable({ providedIn: 'root' })
export class EventService {
  private readonly http = inject(HttpClient);
  private readonly events$ = this.http.get<EventRecord[]>('mock/events.mock.json').pipe(
    map((records) => records.map(toEventItem)),
    shareReplay(1),
  );

  getEvents(query: EventsQuery): Observable<EventsPage> {
    return this.events$.pipe(
      map((events) => queryEvents(events, query)),
      latency(),
    );
  }
  exportEvents(query: EventsQuery): Observable<EventSummary[]> {
    return this.events$.pipe(
      map((events) => findEvents(events, query).map(toSummary)),
      latency(),
    );
  }
  createEvent(event: NewEvent): Observable<void> {
    return this.events$.pipe(
      map((events) => {
        events.unshift({ id: `event-${crypto.randomUUID()}`, ...event, participants: [] });
      }),
      latency(),
    );
  }
  deleteEvent(eventId: string): Observable<void> {
    return this.events$.pipe(
      map((events) => {
        const index = events.findIndex(({ id }) => id === eventId);
        if (index === -1) {
          throw new Error(`Event ${eventId} not found`);
        }
        events.splice(index, 1);
      }),
      latency(),
    );
  }
  updateEvent(eventId: string, changes: EventChanges): Observable<void> {
    return this.withEvent(eventId, (event) => {
      Object.assign(event, changes);
    });
  }
  getLocations(): Observable<string[]> {
    return this.events$.pipe(
      map((events) => [...new Set(events.map(({ location }) => location))].sort((a, b) => a.localeCompare(b, 'de'))),
      latency(),
    );
  }

  getParticipants(eventId: string): Observable<Participant[]> {
    return this.withEvent(eventId, (event) => [...event.participants]);
  }

  addParticipant(eventId: string, participant: Omit<Participant, 'id'>): Observable<void> {
    return this.withEvent(eventId, (event) => {
      event.participants.push({ id: crypto.randomUUID(), ...participant });
    });
  }

  removeParticipant(eventId: string, participantId: string): Observable<void> {
    return this.withEvent(eventId, (event) => {
      event.participants = event.participants.filter(({ id }) => id !== participantId);
    });
  }

  updateParticipant(eventId: string, participantId: string, changes: ParticipantChanges): Observable<void> {
    return this.withEvent(eventId, (event) => {
      const participant = event.participants.find(({ id }) => id === participantId);
      if (participant) {
        Object.assign(participant, changes);
      }
    });
  }

  private withEvent<T>(eventId: string, change: (event: EventItem) => T): Observable<T> {
    return this.events$.pipe(
      map((events) => {
        const event = events.find(({ id }) => id === eventId);
        if (!event) {
          throw new Error(`Event ${eventId} not found`);
        }
        return change(event);
      }),
      latency(),
    );
  }
}

function toEventItem({ id, date, location, status, participants }: EventRecord): EventItem {
  return {
    id,
    date,
    location,
    status,
    participants: participants.map((participant) => ({ ...participant, role: participant.role ?? 'guest' })),
  };
}
