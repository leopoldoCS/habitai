import type { Category, WeekEvent } from '../../types/models';
import * as Crypto from 'expo-crypto';

/**
 * Minimal ICS (iCalendar) parser for VEVENT blocks.
 * Handles DTSTART, DTEND, SUMMARY, DESCRIPTION, UID.
 */

interface RawVEvent {
  uid: string;
  summary: string;
  description: string;
  dtstart: string;
  dtend: string;
}

function parseIcsDate(val: string): string {
  // Handles both 20260406T090000Z and 20260406T090000
  const clean = val.replace(/[^0-9TZ]/g, '');
  const y = clean.slice(0, 4);
  const m = clean.slice(4, 6);
  const d = clean.slice(6, 8);
  const hh = clean.slice(9, 11) || '00';
  const mm = clean.slice(11, 13) || '00';
  const ss = clean.slice(13, 15) || '00';
  const isUtc = clean.endsWith('Z');
  return `${y}-${m}-${d}T${hh}:${mm}:${ss}${isUtc ? '.000Z' : ''}`;
}

function unfoldLines(text: string): string[] {
  return text.replace(/\r\n[ \t]/g, '').replace(/\r\n/g, '\n').split('\n');
}

function extractVEvents(icsText: string): RawVEvent[] {
  const lines = unfoldLines(icsText);
  const events: RawVEvent[] = [];
  let current: Partial<RawVEvent> | null = null;

  for (const line of lines) {
    if (line === 'BEGIN:VEVENT') {
      current = {};
    } else if (line === 'END:VEVENT' && current) {
      events.push({
        uid: current.uid ?? '',
        summary: current.summary ?? 'Untitled',
        description: current.description ?? '',
        dtstart: current.dtstart ?? '',
        dtend: current.dtend ?? current.dtstart ?? '',
      });
      current = null;
    } else if (current) {
      const colonIdx = line.indexOf(':');
      if (colonIdx === -1) continue;
      const key = line.slice(0, colonIdx).split(';')[0].toUpperCase();
      const value = line.slice(colonIdx + 1);
      switch (key) {
        case 'UID': current.uid = value; break;
        case 'SUMMARY': current.summary = value; break;
        case 'DESCRIPTION': current.description = value; break;
        case 'DTSTART': current.dtstart = value; break;
        case 'DTEND': current.dtend = value; break;
      }
    }
  }
  return events;
}

const CATEGORY_KEYWORDS: Record<Category, string[]> = {
  study: ['study', 'class', 'lecture', 'exam', 'homework', 'lab', 'tutorial', 'seminar', 'cs ', 'math'],
  work: ['work', 'meeting', 'standup', 'sync', 'sprint', 'shift', 'office'],
  exercise: ['gym', 'workout', 'run', 'yoga', 'fitness', 'swim', 'hike', 'sport'],
  sleep: ['sleep', 'nap', 'rest', 'bedtime'],
  leisure: ['movie', 'game', 'party', 'hangout', 'dinner', 'lunch', 'brunch', 'concert', 'show'],
  other: [],
};

function guessCategory(summary: string): Category {
  const lower = summary.toLowerCase();
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS) as [Category, string[]][]) {
    if (cat === 'other') continue;
    if (keywords.some((kw) => lower.includes(kw))) return cat;
  }
  return 'other';
}

export async function parseIcs(icsText: string): Promise<WeekEvent[]> {
  const raw = extractVEvents(icsText);
  const results: WeekEvent[] = [];

  for (const ev of raw) {
    if (!ev.dtstart) continue;
    const id = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      ev.uid + ev.dtstart,
    ).then((h) => h.slice(0, 12));

    results.push({
      id: `ics-${id}`,
      title: ev.summary,
      category: guessCategory(ev.summary),
      startAt: parseIcsDate(ev.dtstart),
      endAt: parseIcsDate(ev.dtend),
      notes: ev.description,
      source: 'imported',
      importMetadata: {
        originalSummary: ev.summary,
        uid: ev.uid,
      },
    });
  }
  return results;
}

/** Check if two events overlap in time */
export function eventsOverlap(a: WeekEvent, b: WeekEvent): boolean {
  return new Date(a.startAt) < new Date(b.endAt) && new Date(b.startAt) < new Date(a.endAt);
}
