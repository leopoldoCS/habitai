import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import type { CheckIn } from '../types/models';

const STATUS_CONFIG: Record<string, { icon: string; color: string; label: string }> = {
  draft:   { icon: 'create-outline', color: '#718096', label: 'Draft' },
  sent:    { icon: 'send-outline', color: '#4299e1', label: 'Sent' },
  viewed:  { icon: 'eye-outline', color: '#48bb78', label: 'Viewed' },
  reacted: { icon: 'heart-outline', color: '#ed64a6', label: 'Reacted' },
};

export default function CheckInCard({ checkIn }: { checkIn: CheckIn }) {
  const cfg = STATUS_CONFIG[checkIn.status] ?? STATUS_CONFIG.draft;
  const weekDate = new Date(checkIn.weekStart).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <Ionicons name={cfg.icon as any} size={20} color={cfg.color} />
        <View>
          <Text style={styles.recipient}>To: {checkIn.recipientName}</Text>
          <Text style={styles.week}>Week of {weekDate}</Text>
        </View>
      </View>
      <View style={[styles.statusBadge, { backgroundColor: cfg.color + '22' }]}>
        <Text style={[styles.statusText, { color: cfg.color }]}>{cfg.label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  recipient: { fontSize: 14, fontWeight: '600', color: '#2d3748' },
  week: { fontSize: 12, color: '#718096', marginTop: 1 },
  statusBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  statusText: { fontSize: 12, fontWeight: '600' },
});
