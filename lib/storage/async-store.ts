import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  events: '@habitai/events',
  templates: '@habitai/templates',
  checkins: '@habitai/checkins',
  profile: '@habitai/profile',
} as const;

export async function loadJson<T>(key: string): Promise<T | null> {
  const raw = await AsyncStorage.getItem(key);
  return raw ? JSON.parse(raw) : null;
}

export async function saveJson<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export { KEYS };
