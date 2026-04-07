import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ScreenLayout from '../../components/ScreenLayout';
import InsightCardView from '../../components/InsightCardView';
import { useApp } from '../../context/AppContext';
import { formatWeekRange } from '../../lib/date/week-utils';
import { COLORS } from '../../constants/colors';

export default function Insights() {
  const { insights, refreshInsights, currentWeek, events } = useApp();

  return (
    <ScreenLayout title="Insights">
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.weekLabel}>{formatWeekRange(currentWeek)}</Text>
        <Text style={styles.subtitle}>
          Analyzing {events.length} events across your week
        </Text>

        <TouchableOpacity style={styles.refreshBtn} onPress={refreshInsights}>
          <Ionicons name="refresh" size={16} color="#fff" />
          <Text style={styles.refreshText}>Refresh Analysis</Text>
        </TouchableOpacity>

        {insights.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-circle" size={56} color="#48bb78" />
            <Text style={styles.emptyTitle}>Looking Good!</Text>
            <Text style={styles.emptyMsg}>
              No concerns detected for this week. Keep up the balanced schedule.
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.summaryRow}>
              <View style={[styles.summaryChip, { backgroundColor: '#fff5f5' }]}>
                <Text style={styles.summaryNum}>
                  {insights.filter((i) => i.severity === 'critical').length}
                </Text>
                <Text style={[styles.summaryLabel, { color: '#e53e3e' }]}>Critical</Text>
              </View>
              <View style={[styles.summaryChip, { backgroundColor: '#fffaf0' }]}>
                <Text style={styles.summaryNum}>
                  {insights.filter((i) => i.severity === 'warning').length}
                </Text>
                <Text style={[styles.summaryLabel, { color: '#ed8936' }]}>Warnings</Text>
              </View>
              <View style={[styles.summaryChip, { backgroundColor: '#ebf8ff' }]}>
                <Text style={styles.summaryNum}>
                  {insights.filter((i) => i.severity === 'info').length}
                </Text>
                <Text style={[styles.summaryLabel, { color: '#4299e1' }]}>Info</Text>
              </View>
            </View>

            {insights.map((ins) => (
              <InsightCardView key={ins.id} insight={ins} />
            ))}
          </>
        )}

        <View style={styles.footer}>
          <Ionicons name="information-circle-outline" size={16} color="#ffffff88" />
          <Text style={styles.footerText}>
            Insights are generated from simple rules, not machine learning. They look for patterns like overloaded days, late-night work, and long stretches without breaks.
          </Text>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, width: '100%' },
  content: { padding: 16, paddingBottom: 40 },
  weekLabel: { fontSize: 15, color: '#ffffffcc', textAlign: 'center' },
  subtitle: { fontSize: 13, color: '#ffffff99', textAlign: 'center', marginTop: 4, marginBottom: 12 },
  refreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#ffffff22',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'center',
    marginBottom: 16,
  },
  refreshText: { fontSize: 14, color: '#fff', fontWeight: '600' },
  emptyState: { alignItems: 'center', marginTop: 40, gap: 10 },
  emptyTitle: { fontSize: 22, fontWeight: '700', color: '#fff' },
  emptyMsg: { fontSize: 14, color: '#ffffffaa', textAlign: 'center', maxWidth: 260 },
  summaryRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  summaryChip: {
    flex: 1,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  summaryNum: { fontSize: 24, fontWeight: '800', color: '#2d3748' },
  summaryLabel: { fontSize: 11, fontWeight: '600', marginTop: 2 },
  footer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 24,
    backgroundColor: '#ffffff11',
    borderRadius: 12,
    padding: 14,
  },
  footerText: { fontSize: 12, color: '#ffffff88', flex: 1, lineHeight: 18 },
});
