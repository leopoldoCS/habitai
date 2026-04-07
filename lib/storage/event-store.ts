import type { WeekEvent } from '../../types/models';
import { KEYS, loadJson, saveJson } from './async-store';

export async function loadEvents(): Promise<WeekEvent[]> {
  return (await loadJson<WeekEvent[]>(KEYS.events)) ?? [];
}

export async function saveEvents(events: WeekEvent[]): Promise<void> {
  await saveJson(KEYS.events, events);
}

export async function addEvent(event: WeekEvent): Promise<WeekEvent[]> {
  const events = await loadEvents();
  events.push(event);
  await saveEvents(events);
  return events;
}

export async function updateEvent(updated: WeekEvent): Promise<WeekEvent[]> {
  let events = await loadEvents();
  events = events.map((e) => (e.id === updated.id ? updated : e));
  await saveEvents(events);
  return events;
}

export async function deleteEvent(id: string): Promise<WeekEvent[]> {
  let events = await loadEvents();
  events = events.filter((e) => e.id !== id);
  await saveEvents(events);
  return events;
}
