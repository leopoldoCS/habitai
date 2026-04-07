import * as Crypto from 'expo-crypto';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import type { WeekEvent, Template, InsightCard, CheckIn, UserProfile, Category } from '../types/models';
import { loadEvents, saveEvents } from '../lib/storage/event-store';
import { loadTemplates, saveTemplates } from '../lib/storage/template-store';
import { generateInsights } from '../lib/rules/insight-engine';
import { getSeedEvents } from '../lib/storage/seed-data';
import { getMonday, buildIso } from '../lib/date/week-utils';
import { KEYS, loadJson, saveJson } from '../lib/storage/async-store';
import { onAuthChange } from '../lib/firebase/auth';
import type { User } from 'firebase/auth';

// ── State shape ─────────────────────────────────────────────────────────

interface AppState {
  events: WeekEvent[];
  templates: Template[];
  insights: InsightCard[];
  checkIns: CheckIn[];
  currentWeek: Date;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
}

type Action =
  | { type: 'SET_EVENTS'; events: WeekEvent[] }
  | { type: 'SET_TEMPLATES'; templates: Template[] }
  | { type: 'SET_INSIGHTS'; insights: InsightCard[] }
  | { type: 'SET_CHECKINS'; checkIns: CheckIn[] }
  | { type: 'SET_WEEK'; date: Date }
  | { type: 'SET_USER'; user: User | null }
  | { type: 'SET_PROFILE'; profile: UserProfile | null }
  | { type: 'SET_LOADING'; loading: boolean };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_EVENTS': return { ...state, events: action.events };
    case 'SET_TEMPLATES': return { ...state, templates: action.templates };
    case 'SET_INSIGHTS': return { ...state, insights: action.insights };
    case 'SET_CHECKINS': return { ...state, checkIns: action.checkIns };
    case 'SET_WEEK': return { ...state, currentWeek: action.date };
    case 'SET_USER': return { ...state, user: action.user };
    case 'SET_PROFILE': return { ...state, profile: action.profile };
    case 'SET_LOADING': return { ...state, loading: action.loading };
    default: return state;
  }
}

// ── Context value ───────────────────────────────────────────────────────

interface AppContextValue extends AppState {
  addEvent: (event: Omit<WeekEvent, 'id'>) => Promise<void>;
  updateEvent: (event: WeekEvent) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  addFromTemplate: (template: Template, date: Date) => Promise<void>;
  addTemplate: (template: Omit<Template, 'id'>) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  importEvents: (newEvents: WeekEvent[]) => Promise<void>;
  addCheckIn: (checkIn: Omit<CheckIn, 'id' | 'createdAt'>) => Promise<void>;
  setWeek: (date: Date) => void;
  refreshInsights: () => void;
  setUser: (user: User | null) => void;
  setProfile: (profile: UserProfile | null) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

// ── Provider ────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    events: [],
    templates: [],
    insights: [],
    checkIns: [],
    currentWeek: getMonday(new Date()),
    user: null,
    profile: null,
    loading: true,
  });

  // Load persisted data on mount
  useEffect(() => {
    (async () => {
      let events = await loadEvents();
      const templates = await loadTemplates();
      const checkIns = (await loadJson<CheckIn[]>(KEYS.checkins)) ?? [];

      if (events.length === 0) {
        events = getSeedEvents();
        await saveEvents(events);
      }

      dispatch({ type: 'SET_EVENTS', events });
      dispatch({ type: 'SET_TEMPLATES', templates });
      dispatch({ type: 'SET_CHECKINS', checkIns });
      dispatch({ type: 'SET_LOADING', loading: false });
    })();
  }, []);

  // Listen for Firebase auth changes
  useEffect(() => {
    const unsub = onAuthChange((u) => dispatch({ type: 'SET_USER', user: u }));
    return unsub;
  }, []);

  // Recompute insights whenever events or week changes
  useEffect(() => {
    const insights = generateInsights(state.events, state.currentWeek);
    dispatch({ type: 'SET_INSIGHTS', insights });
  }, [state.events, state.currentWeek]);

  const generateId = useCallback(async () => {
    const bytes = await Crypto.getRandomBytes(8);
    return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  }, []);

  const addEvent = useCallback(async (event: Omit<WeekEvent, 'id'>) => {
    const id = await generateId();
    const full: WeekEvent = { ...event, id };
    const next = [...state.events, full];
    dispatch({ type: 'SET_EVENTS', events: next });
    await saveEvents(next);
  }, [state.events, generateId]);

  const updateEvent = useCallback(async (event: WeekEvent) => {
    const next = state.events.map((e) => (e.id === event.id ? event : e));
    dispatch({ type: 'SET_EVENTS', events: next });
    await saveEvents(next);
  }, [state.events]);

  const deleteEvent = useCallback(async (id: string) => {
    const next = state.events.filter((e) => e.id !== id);
    dispatch({ type: 'SET_EVENTS', events: next });
    await saveEvents(next);
  }, [state.events]);

  const addFromTemplate = useCallback(async (template: Template, date: Date) => {
    const id = await generateId();
    const event: WeekEvent = {
      id,
      title: template.defaultTitle,
      category: template.category,
      startAt: buildIso(date, template.startHour, template.startMinute),
      endAt: buildIso(date, template.endHour, template.endMinute),
      notes: template.notes,
      source: 'template',
    };
    const next = [...state.events, event];
    dispatch({ type: 'SET_EVENTS', events: next });
    await saveEvents(next);
  }, [state.events, generateId]);

  const addTemplate = useCallback(async (template: Omit<Template, 'id'>) => {
    const id = await generateId();
    const full: Template = { ...template, id };
    const next = [...state.templates, full];
    dispatch({ type: 'SET_TEMPLATES', templates: next });
    await saveTemplates(next);
  }, [state.templates, generateId]);

  const deleteTemplate = useCallback(async (id: string) => {
    const next = state.templates.filter((t) => t.id !== id);
    dispatch({ type: 'SET_TEMPLATES', templates: next });
    await saveTemplates(next);
  }, [state.templates]);

  const importEvents = useCallback(async (newEvents: WeekEvent[]) => {
    const next = [...state.events, ...newEvents];
    dispatch({ type: 'SET_EVENTS', events: next });
    await saveEvents(next);
  }, [state.events]);

  const addCheckIn = useCallback(async (checkIn: Omit<CheckIn, 'id' | 'createdAt'>) => {
    const id = await generateId();
    const full: CheckIn = { ...checkIn, id, createdAt: new Date().toISOString() };
    const next = [...state.checkIns, full];
    dispatch({ type: 'SET_CHECKINS', checkIns: next });
    await saveJson(KEYS.checkins, next);
  }, [state.checkIns, generateId]);

  const setWeek = useCallback((date: Date) => {
    dispatch({ type: 'SET_WEEK', date: getMonday(date) });
  }, []);

  const refreshInsights = useCallback(() => {
    const insights = generateInsights(state.events, state.currentWeek);
    dispatch({ type: 'SET_INSIGHTS', insights });
  }, [state.events, state.currentWeek]);

  const setUser = useCallback((user: User | null) => {
    dispatch({ type: 'SET_USER', user });
  }, []);

  const setProfile = useCallback((profile: UserProfile | null) => {
    dispatch({ type: 'SET_PROFILE', profile });
  }, []);

  const value = useMemo<AppContextValue>(() => ({
    ...state,
    addEvent,
    updateEvent,
    deleteEvent,
    addFromTemplate,
    addTemplate,
    deleteTemplate,
    importEvents,
    addCheckIn,
    setWeek,
    refreshInsights,
    setUser,
    setProfile,
  }), [state, addEvent, updateEvent, deleteEvent, addFromTemplate, addTemplate, deleteTemplate, importEvents, addCheckIn, setWeek, refreshInsights, setUser, setProfile]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}
