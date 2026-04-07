import type { WeekEvent } from '../../types/models';
import { getMonday, buildIso } from '../date/week-utils';

/** Generate a demo week of events for the current week. */
export function getSeedEvents(): WeekEvent[] {
  const mon = getMonday(new Date());
  const day = (offset: number) => {
    const d = new Date(mon);
    d.setDate(mon.getDate() + offset);
    return d;
  };

  return [
    // Monday
    { id: 'seed-1', title: 'Morning Study', category: 'study', startAt: buildIso(day(0), 8, 0), endAt: buildIso(day(0), 11, 0), notes: 'CS 583 review', source: 'manual' },
    { id: 'seed-2', title: 'Work Shift', category: 'work', startAt: buildIso(day(0), 12, 0), endAt: buildIso(day(0), 17, 0), notes: '', source: 'manual' },
    { id: 'seed-3', title: 'Gym', category: 'exercise', startAt: buildIso(day(0), 18, 0), endAt: buildIso(day(0), 19, 0), notes: 'Leg day', source: 'template' },

    // Tuesday
    { id: 'seed-4', title: 'Study Session', category: 'study', startAt: buildIso(day(1), 9, 0), endAt: buildIso(day(1), 13, 0), notes: 'Group project', source: 'manual' },
    { id: 'seed-5', title: 'Work Shift', category: 'work', startAt: buildIso(day(1), 14, 0), endAt: buildIso(day(1), 20, 0), notes: '', source: 'manual' },
    { id: 'seed-6', title: 'Late Night Coding', category: 'study', startAt: buildIso(day(1), 22, 0), endAt: buildIso(day(1), 23, 59), notes: 'Deadline cramming', source: 'manual' },

    // Wednesday
    { id: 'seed-7', title: 'Long Study Block', category: 'study', startAt: buildIso(day(2), 7, 0), endAt: buildIso(day(2), 13, 0), notes: 'Exam prep — no breaks taken', source: 'manual' },
    { id: 'seed-8', title: 'Errands', category: 'other', startAt: buildIso(day(2), 14, 0), endAt: buildIso(day(2), 15, 0), notes: '', source: 'manual' },
    { id: 'seed-9', title: 'Study Again', category: 'study', startAt: buildIso(day(2), 16, 0), endAt: buildIso(day(2), 20, 0), notes: '', source: 'manual' },
    { id: 'seed-10', title: 'Gaming', category: 'leisure', startAt: buildIso(day(2), 21, 0), endAt: buildIso(day(2), 23, 0), notes: '', source: 'manual' },

    // Thursday
    { id: 'seed-11', title: 'Work Shift', category: 'work', startAt: buildIso(day(3), 8, 0), endAt: buildIso(day(3), 16, 0), notes: '', source: 'imported' },
    { id: 'seed-12', title: 'Gym', category: 'exercise', startAt: buildIso(day(3), 17, 0), endAt: buildIso(day(3), 18, 30), notes: 'Upper body', source: 'template' },

    // Friday
    { id: 'seed-13', title: 'Study', category: 'study', startAt: buildIso(day(4), 9, 0), endAt: buildIso(day(4), 11, 0), notes: '', source: 'manual' },
    { id: 'seed-14', title: 'Work', category: 'work', startAt: buildIso(day(4), 12, 0), endAt: buildIso(day(4), 18, 0), notes: '', source: 'manual' },
    { id: 'seed-15', title: 'Movie Night', category: 'leisure', startAt: buildIso(day(4), 20, 0), endAt: buildIso(day(4), 23, 0), notes: '', source: 'manual' },

    // Saturday
    { id: 'seed-16', title: 'Sleep In', category: 'sleep', startAt: buildIso(day(5), 0, 0), endAt: buildIso(day(5), 10, 0), notes: '', source: 'manual' },
    { id: 'seed-17', title: 'Free Time', category: 'leisure', startAt: buildIso(day(5), 11, 0), endAt: buildIso(day(5), 17, 0), notes: 'Relaxing', source: 'manual' },

    // Sunday
    { id: 'seed-18', title: 'Sleep In', category: 'sleep', startAt: buildIso(day(6), 0, 0), endAt: buildIso(day(6), 9, 0), notes: '', source: 'manual' },
    { id: 'seed-19', title: 'Meal Prep', category: 'other', startAt: buildIso(day(6), 10, 0), endAt: buildIso(day(6), 12, 0), notes: '', source: 'manual' },
    { id: 'seed-20', title: 'Study', category: 'study', startAt: buildIso(day(6), 14, 0), endAt: buildIso(day(6), 18, 0), notes: 'Prep for Monday', source: 'manual' },
  ];
}
