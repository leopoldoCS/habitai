export type Category = 'study' | 'work' | 'leisure' | 'sleep' | 'exercise' | 'other';

export type EventSource = 'manual' | 'template' | 'imported';

export interface WeekEvent {
  id: string;
  title: string;
  category: Category;
  startAt: string; // ISO 8601
  endAt: string;   // ISO 8601
  notes: string;
  source: EventSource;
  importMetadata?: {
    originalSummary?: string;
    calendarName?: string;
    uid?: string;
  };
}

export interface Template {
  id: string;
  name: string;
  defaultTitle: string;
  category: Category;
  startHour: number;   // 0-23
  startMinute: number; // 0-59
  endHour: number;
  endMinute: number;
  notes: string;
}

export type InsightSeverity = 'info' | 'warning' | 'critical';

export interface InsightCard {
  id: string;
  ruleId: string;
  title: string;
  message: string;
  severity: InsightSeverity;
  suggestion: string;
  evidenceEventIds: string[];
}

export type CheckInStatus = 'draft' | 'sent' | 'viewed' | 'reacted';

export interface CheckIn {
  id: string;
  weekStart: string; // ISO date of Monday
  recipientName: string;
  recipientEmail: string;
  summary: string;
  status: CheckInStatus;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  timezone: string;
  accountabilityPartner?: {
    name: string;
    email: string;
  };
}

export const CATEGORY_CONFIG: Record<Category, { label: string; color: string; icon: string }> = {
  study:    { label: 'Study',    color: '#6C63FF', icon: 'book' },
  work:     { label: 'Work',     color: '#FF6B6B', icon: 'briefcase' },
  leisure:  { label: 'Leisure',  color: '#4ECDC4', icon: 'game-controller' },
  sleep:    { label: 'Sleep',    color: '#45B7D1', icon: 'moon' },
  exercise: { label: 'Exercise', color: '#96CEB4', icon: 'fitness' },
  other:    { label: 'Other',    color: '#DDA0DD', icon: 'ellipsis-horizontal' },
};

export const CATEGORIES: Category[] = ['study', 'work', 'leisure', 'sleep', 'exercise', 'other'];
