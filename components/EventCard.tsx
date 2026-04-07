import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CATEGORY_CONFIG, type WeekEvent } from '../types/models';
import { formatTime } from '../lib/date/week-utils';

interface Props {
  event: WeekEvent;
  onPress: (event: WeekEvent) => void;
}

export default function EventCard({ event, onPress }: Props) {
  const config = CATEGORY_CONFIG[event.category];
  const start = formatTime(new Date(event.startAt));
  const end = formatTime(new Date(event.endAt));

  return (
    <TouchableOpacity
      style={[styles.card, { borderLeftColor: config.color }]}
      onPress={() => onPress(event)}
      activeOpacity={0.7}
    >
      <View style={styles.timeCol}>
        <Text style={styles.time}>{start}</Text>
        <Text style={styles.timeSep}>to</Text>
        <Text style={styles.time}>{end}</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>{event.title}</Text>
        <View style={styles.meta}>
          <Ionicons name={config.icon as any} size={12} color={config.color} />
          <Text style={[styles.cat, { color: config.color }]}>{config.label}</Text>
          {event.source !== 'manual' && (
            <View style={styles.sourceBadge}>
              <Text style={styles.sourceText}>{event.source}</Text>
            </View>
          )}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={16} color="#cbd5e0" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderLeftWidth: 4,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  timeCol: {
    alignItems: 'center',
    width: 60,
    marginRight: 10,
  },
  time: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4a5568',
  },
  timeSep: {
    fontSize: 9,
    color: '#a0aec0',
  },
  body: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: 3,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cat: {
    fontSize: 11,
    fontWeight: '600',
  },
  sourceBadge: {
    backgroundColor: '#edf2f7',
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 1,
    marginLeft: 6,
  },
  sourceText: {
    fontSize: 9,
    color: '#718096',
    fontWeight: '600',
  },
});
