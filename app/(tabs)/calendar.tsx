import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ScreenLayout from '../../components/ScreenLayout';
import EventCard from '../../components/EventCard';
import { useApp } from '../../context/AppContext';
import { COLORS } from '../../constants/colors';
import {
  formatDayShort,
  formatWeekRange,
  getWeekDays,
  isSameDay,
  shiftWeek,
} from '../../lib/date/week-utils';
import type { WeekEvent } from '../../types/models';

export default function Calendar() {
  const { events, currentWeek, setWeek, templates, addFromTemplate } = useApp();
  const router = useRouter();
  const weekDays = getWeekDays(currentWeek);

  const handleEventPress = (event: WeekEvent) => {
    router.push({ pathname: '/event-modal', params: { eventJson: JSON.stringify(event) } });
  };

  const handleAddOnDay = (day: Date) => {
    router.push({ pathname: '/event-modal', params: { dateIso: day.toISOString() } });
  };

  const today = new Date();

  return (
    <ScreenLayout title="Weekly Timeline">
      <View style={styles.navRow}>
        <TouchableOpacity onPress={() => setWeek(shiftWeek(currentWeek, -1))} style={styles.navBtn}>
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setWeek(new Date())} style={styles.todayBtn}>
          <Text style={styles.weekLabel}>{formatWeekRange(currentWeek)}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setWeek(shiftWeek(currentWeek, 1))} style={styles.navBtn}>
          <Ionicons name="chevron-forward" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {weekDays.map((day) => {
          const dayEvents = events
            .filter((e) => isSameDay(new Date(e.startAt), day))
            .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());
          const isToday = isSameDay(day, today);

          return (
            <View key={day.toISOString()} style={styles.daySection}>
              <View style={styles.dayHeader}>
                <View style={[styles.dayDot, isToday && styles.dayDotToday]} />
                <Text style={[styles.dayLabel, isToday && styles.dayLabelToday]}>
                  {formatDayShort(day)}
                </Text>
                <TouchableOpacity onPress={() => handleAddOnDay(day)} style={styles.addDayBtn}>
                  <Ionicons name="add" size={18} color={COLORS.primary} />
                </TouchableOpacity>
              </View>

              {dayEvents.length === 0 ? (
                <View style={styles.emptyDay}>
                  <Text style={styles.emptyText}>No events</Text>
                  {templates.length > 0 && (
                    <TouchableOpacity
                      style={styles.templateSuggest}
                      onPress={() => addFromTemplate(templates[0], day)}
                    >
                      <Ionicons name="flash-outline" size={14} color={COLORS.primary} />
                      <Text style={styles.templateSuggestText}>
                        Quick add "{templates[0].name}"
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              ) : (
                dayEvents.map((ev) => (
                  <EventCard key={ev.id} event={ev} onPress={handleEventPress} />
                ))
              )}
            </View>
          );
        })}
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginBottom: 4,
    width: '100%',
  },
  navBtn: { padding: 8 },
  todayBtn: { paddingVertical: 6, paddingHorizontal: 12 },
  weekLabel: { fontSize: 14, fontWeight: '600', color: '#ffffffcc' },
  scroll: { flex: 1, width: '100%' },
  content: { padding: 14, paddingBottom: 40 },
  daySection: { marginBottom: 18 },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  dayDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffffffaa',
  },
  dayDotToday: { backgroundColor: '#48bb78', width: 10, height: 10, borderRadius: 5 },
  dayLabel: { fontSize: 15, fontWeight: '700', color: '#ffffffcc', flex: 1 },
  dayLabelToday: { color: '#fff' },
  addDayBtn: {
    backgroundColor: '#ffffff22',
    borderRadius: 14,
    padding: 4,
  },
  emptyDay: {
    backgroundColor: '#ffffff11',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  emptyText: { fontSize: 13, color: '#ffffff88' },
  templateSuggest: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
    backgroundColor: '#ffffff22',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  templateSuggestText: { fontSize: 12, color: '#ffffffcc' },
});
