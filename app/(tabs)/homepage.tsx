import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ScreenLayout from '../../components/ScreenLayout';
import InsightCardView from '../../components/InsightCardView';
import { useApp } from '../../context/AppContext';
import { COLORS } from '../../constants/colors';
import { formatWeekRange, getWeekDays, isSameDay, durationHours } from '../../lib/date/week-utils';
import { CATEGORY_CONFIG } from '../../types/models';

export default function Homepage() {
  const { events, insights, templates, currentWeek, addFromTemplate } = useApp();
  const router = useRouter();

  const weekDays = getWeekDays(currentWeek);
  const weekEvents = events.filter((e) => {
    const d = new Date(e.startAt);
    return d >= weekDays[0] && d <= new Date(weekDays[6].getTime() + 86400000);
  });

  const totalHours = weekEvents.reduce((s, e) => s + durationHours(e.startAt, e.endAt), 0);
  const daysWithEvents = new Set(weekEvents.map((e) => new Date(e.startAt).toDateString())).size;

  const categorySummary = weekEvents.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] ?? 0) + durationHours(e.startAt, e.endAt);
    return acc;
  }, {});
  const topCategory = Object.entries(categorySummary).sort((a, b) => b[1] - a[1])[0];

  return (
    <ScreenLayout title="Your Week">
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.weekRange}>{formatWeekRange(currentWeek)}</Text>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="time-outline" size={22} color={COLORS.primary} />
            <Text style={styles.statNum}>{Math.round(totalHours)}h</Text>
            <Text style={styles.statLabel}>Tracked</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="calendar-outline" size={22} color={COLORS.success} />
            <Text style={styles.statNum}>{daysWithEvents}/7</Text>
            <Text style={styles.statLabel}>Active Days</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="list-outline" size={22} color={COLORS.warning} />
            <Text style={styles.statNum}>{weekEvents.length}</Text>
            <Text style={styles.statLabel}>Events</Text>
          </View>
        </View>

        {topCategory && (
          <View style={[styles.topCatCard, { borderLeftColor: CATEGORY_CONFIG[topCategory[0] as keyof typeof CATEGORY_CONFIG]?.color ?? '#ccc' }]}>
            <Text style={styles.topCatLabel}>Top category this week</Text>
            <Text style={styles.topCatValue}>
              {CATEGORY_CONFIG[topCategory[0] as keyof typeof CATEGORY_CONFIG]?.label ?? topCategory[0]} — {Math.round(topCategory[1])}h
            </Text>
          </View>
        )}

        {/* Quick actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => router.push({ pathname: '/event-modal', params: { dateIso: new Date().toISOString() } })}
          >
            <Ionicons name="add-circle" size={28} color={COLORS.primary} />
            <Text style={styles.actionText}>Add Event</Text>
          </TouchableOpacity>

          {templates.slice(0, 3).map((t) => (
            <TouchableOpacity
              key={t.id}
              style={styles.actionBtn}
              onPress={() => addFromTemplate(t, new Date())}
            >
              <Ionicons name={CATEGORY_CONFIG[t.category].icon as any} size={24} color={CATEGORY_CONFIG[t.category].color} />
              <Text style={styles.actionText} numberOfLines={1}>{t.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Insight preview */}
        {insights.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Insights</Text>
            {insights.slice(0, 2).map((ins) => (
              <InsightCardView key={ins.id} insight={ins} />
            ))}
            {insights.length > 2 && (
              <TouchableOpacity onPress={() => router.push('/ai')}>
                <Text style={styles.seeAll}>See all {insights.length} insights →</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, width: '100%' },
  content: { padding: 16, paddingBottom: 40 },
  weekRange: { fontSize: 15, color: '#ffffffcc', textAlign: 'center', marginBottom: 16 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  statNum: { fontSize: 22, fontWeight: '800', color: '#2d3748', marginTop: 4 },
  statLabel: { fontSize: 11, color: '#718096', marginTop: 2 },
  topCatCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderLeftWidth: 4,
    padding: 14,
    marginBottom: 16,
  },
  topCatLabel: { fontSize: 12, color: '#718096' },
  topCatValue: { fontSize: 16, fontWeight: '700', color: '#2d3748', marginTop: 2 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#fff', marginBottom: 10, marginTop: 8 },
  actionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  actionBtn: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    minWidth: 75,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  actionText: { fontSize: 11, color: '#4a5568', marginTop: 4, fontWeight: '600', textAlign: 'center' },
  seeAll: { fontSize: 14, color: '#fff', fontWeight: '600', textAlign: 'center', marginTop: 4 },
});
