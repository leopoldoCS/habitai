import type { Template } from '../../types/models';
import { KEYS, loadJson, saveJson } from './async-store';

export async function loadTemplates(): Promise<Template[]> {
  return (await loadJson<Template[]>(KEYS.templates)) ?? getDefaultTemplates();
}

export async function saveTemplates(templates: Template[]): Promise<void> {
  await saveJson(KEYS.templates, templates);
}

export async function addTemplate(t: Template): Promise<Template[]> {
  const templates = await loadTemplates();
  templates.push(t);
  await saveTemplates(templates);
  return templates;
}

export async function deleteTemplate(id: string): Promise<Template[]> {
  let templates = await loadTemplates();
  templates = templates.filter((t) => t.id !== id);
  await saveTemplates(templates);
  return templates;
}

export function getDefaultTemplates(): Template[] {
  return [
    {
      id: 'tpl-study',
      name: 'Study Block',
      defaultTitle: 'Study Session',
      category: 'study',
      startHour: 9,
      startMinute: 0,
      endHour: 11,
      endMinute: 0,
      notes: '',
    },
    {
      id: 'tpl-work',
      name: 'Work Shift',
      defaultTitle: 'Work',
      category: 'work',
      startHour: 9,
      startMinute: 0,
      endHour: 17,
      endMinute: 0,
      notes: '',
    },
    {
      id: 'tpl-gym',
      name: 'Gym',
      defaultTitle: 'Gym Workout',
      category: 'exercise',
      startHour: 6,
      startMinute: 0,
      endHour: 7,
      endMinute: 30,
      notes: '',
    },
    {
      id: 'tpl-sleep',
      name: 'Sleep',
      defaultTitle: 'Sleep',
      category: 'sleep',
      startHour: 22,
      startMinute: 0,
      endHour: 6,
      endMinute: 0,
      notes: '',
    },
    {
      id: 'tpl-leisure',
      name: 'Free Time',
      defaultTitle: 'Free Time',
      category: 'leisure',
      startHour: 18,
      startMinute: 0,
      endHour: 20,
      endMinute: 0,
      notes: '',
    },
  ];
}
