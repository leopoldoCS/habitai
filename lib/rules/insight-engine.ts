import type { InsightCard, WeekEvent } from '../../types/models';
import { getWeekDays, isSameDay, durationHours } from '../date/week-utils';

type Rule = (events: WeekEvent[], weekOf: Date) => InsightCard | null;

let counter = 0;
const uid = () => `insight-${++counter}`;

const overloadedDay: Rule = (events, weekOf) => {
  const days = getWeekDays(weekOf);
  for (const day of days) {
    const dayEvents = events.filter((e) => isSameDay(new Date(e.startAt), day));
    const totalHours = dayEvents.reduce((sum, e) => sum + durationHours(e.startAt, e.endAt), 0);
    if (totalHours >= 12) {
      const dayName = day.toLocaleDateString('en-US', { weekday: 'long' });
      return {
        id: uid(),
        ruleId: 'overloaded-day',
        title: 'Overloaded Day',
        message: `You have ${Math.round(totalHours)} hours of activities on ${dayName}. That leaves very little room for rest or unexpected tasks.`,
        severity: 'warning',
        suggestion: 'Try moving one block to a lighter day, or shorten a session by 30 minutes.',
        evidenceEventIds: dayEvents.map((e) => e.id),
      };
    }
  }
  return null;
};

const longStretchNoBreak: Rule = (events, weekOf) => {
  const days = getWeekDays(weekOf);
  for (const day of days) {
    const dayEvents = events
      .filter((e) => isSameDay(new Date(e.startAt), day))
      .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());

    for (const ev of dayEvents) {
      const hrs = durationHours(ev.startAt, ev.endAt);
      if (hrs >= 4) {
        return {
          id: uid(),
          ruleId: 'long-stretch',
          title: 'Long Stretch Without Break',
          message: `"${ev.title}" runs for ${Math.round(hrs)} hours straight. Extended focus without breaks reduces productivity.`,
          severity: 'warning',
          suggestion: 'Add a 15-minute break every 90 minutes inside this block.',
          evidenceEventIds: [ev.id],
        };
      }
    }
  }
  return null;
};

const tooManyContextSwitches: Rule = (events, weekOf) => {
  const days = getWeekDays(weekOf);
  for (const day of days) {
    const dayEvents = events
      .filter((e) => isSameDay(new Date(e.startAt), day))
      .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());

    if (dayEvents.length < 2) continue;

    let switches = 0;
    for (let i = 1; i < dayEvents.length; i++) {
      if (dayEvents[i].category !== dayEvents[i - 1].category) switches++;
    }
    if (switches >= 4) {
      const dayName = day.toLocaleDateString('en-US', { weekday: 'long' });
      return {
        id: uid(),
        ruleId: 'context-switches',
        title: 'Too Many Context Switches',
        message: `You switch between ${switches + 1} different activity types on ${dayName}. Frequent context switching drains mental energy.`,
        severity: 'info',
        suggestion: 'Try batching similar activities together — e.g. all study blocks back-to-back.',
        evidenceEventIds: dayEvents.map((e) => e.id),
      };
    }
  }
  return null;
};

const lateNightWorkload: Rule = (events) => {
  const lateEvents = events.filter((e) => {
    const h = new Date(e.startAt).getHours();
    return h >= 22 && e.category !== 'sleep' && e.category !== 'leisure';
  });
  if (lateEvents.length >= 2) {
    return {
      id: uid(),
      ruleId: 'late-nights',
      title: 'Late-Night Workload',
      message: `You have ${lateEvents.length} productive sessions starting after 10 PM this week. Late work affects sleep quality.`,
      severity: 'critical',
      suggestion: 'Shift one late session earlier, or cap work at 9:30 PM and use the evening for wind-down.',
      evidenceEventIds: lateEvents.map((e) => e.id),
    };
  }
  return null;
};

const unbalancedWeekend: Rule = (events, weekOf) => {
  const days = getWeekDays(weekOf);
  const sat = days[5];
  const sun = days[6];
  const weekendEvents = events.filter(
    (e) => isSameDay(new Date(e.startAt), sat) || isSameDay(new Date(e.startAt), sun),
  );
  const leisureHours = weekendEvents
    .filter((e) => e.category === 'leisure' || e.category === 'sleep')
    .reduce((s, e) => s + durationHours(e.startAt, e.endAt), 0);
  const workHours = weekendEvents
    .filter((e) => e.category === 'work' || e.category === 'study')
    .reduce((s, e) => s + durationHours(e.startAt, e.endAt), 0);

  if (workHours > leisureHours && workHours >= 6) {
    return {
      id: uid(),
      ruleId: 'unbalanced-weekend',
      title: 'Low Weekend Recovery',
      message: `You have ${Math.round(workHours)} hours of work/study on the weekend but only ${Math.round(leisureHours)} hours of downtime. Rest is fuel, not laziness.`,
      severity: 'info',
      suggestion: 'Protect at least one half-day as fully unscheduled recovery time.',
      evidenceEventIds: weekendEvents.map((e) => e.id),
    };
  }
  return null;
};

const ALL_RULES: Rule[] = [
  overloadedDay,
  longStretchNoBreak,
  tooManyContextSwitches,
  lateNightWorkload,
  unbalancedWeekend,
];

export function generateInsights(events: WeekEvent[], weekOf: Date): InsightCard[] {
  counter = 0;
  return ALL_RULES.map((rule) => rule(events, weekOf)).filter(Boolean) as InsightCard[];
}
