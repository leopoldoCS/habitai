import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore';
import { getDbInstance } from './config';
import type { WeekEvent, Template, CheckIn } from '../../types/models';

function getDb() {
  const db = getDbInstance();
  if (!db) throw new Error('Firebase is not configured. Add your credentials to .env');
  return db;
}

const EVENTS_COL = 'events';
const TEMPLATES_COL = 'templates';
const CHECKINS_COL = 'checkins';

// ── Events ──────────────────────────────────────────────────────────────

export async function syncEventsUp(userId: string, events: WeekEvent[]): Promise<void> {
  const db = getDb();
  for (const event of events) {
    await setDoc(doc(db, EVENTS_COL, `${userId}_${event.id}`), { ...event, userId });
  }
}

export async function fetchEvents(userId: string): Promise<WeekEvent[]> {
  const db = getDb();
  const q = query(collection(db, EVENTS_COL), where('userId', '==', userId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    const { userId: _uid, ...rest } = data;
    return rest as WeekEvent;
  });
}

// ── Templates ───────────────────────────────────────────────────────────

export async function syncTemplatesUp(userId: string, templates: Template[]): Promise<void> {
  const db = getDb();
  for (const t of templates) {
    await setDoc(doc(db, TEMPLATES_COL, `${userId}_${t.id}`), { ...t, userId });
  }
}

export async function fetchTemplates(userId: string): Promise<Template[]> {
  const db = getDb();
  const q = query(collection(db, TEMPLATES_COL), where('userId', '==', userId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    const { userId: _uid, ...rest } = data;
    return rest as Template;
  });
}

// ── Check-ins ───────────────────────────────────────────────────────────

export async function saveCheckIn(userId: string, checkIn: CheckIn): Promise<void> {
  const db = getDb();
  await setDoc(doc(db, CHECKINS_COL, `${userId}_${checkIn.id}`), { ...checkIn, userId });
}

export async function fetchCheckIns(userId: string): Promise<CheckIn[]> {
  const db = getDb();
  const q = query(collection(db, CHECKINS_COL), where('userId', '==', userId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    const { userId: _uid, ...rest } = data;
    return rest as CheckIn;
  });
}

export async function deleteCheckIn(userId: string, checkInId: string): Promise<void> {
  const db = getDb();
  await deleteDoc(doc(db, CHECKINS_COL, `${userId}_${checkInId}`));
}
