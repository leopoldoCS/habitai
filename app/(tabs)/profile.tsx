import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ScreenLayout from '../../components/ScreenLayout';
import CheckInCard from '../../components/CheckInCard';
import { useApp } from '../../context/AppContext';
import { COLORS } from '../../constants/colors';
import { CATEGORY_CONFIG, type Category } from '../../types/models';
import { durationHours, formatWeekRange, getMonday, getWeekDays, isSameDay } from '../../lib/date/week-utils';

export default function Profile() {
  const { events, currentWeek, user, checkIns } = useApp();
  const router = useRouter();

  const weekDays = getWeekDays(currentWeek);
  const weekEvents = events.filter((e) => {
    const d = new Date(e.startAt);
    return d >= weekDays[0] && d <= new Date(weekDays[6].getTime() + 86400000);
  });

  // Category breakdown for the week
  const catBreakdown: { cat: Category; hours: number }[] = [];
  const catMap: Record<string, number> = {};
  weekEvents.forEach((e) => {
    catMap[e.category] = (catMap[e.category] ?? 0) + durationHours(e.startAt, e.endAt);
  });
  Object.entries(catMap)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, hours]) => catBreakdown.push({ cat: cat as Category, hours }));

  // Streak: count consecutive days (backwards from today) that have at least one event
  const today = new Date();
  let streak = 0;
  for (let i = 0; i < 60; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const has = events.some((e) => isSameDay(new Date(e.startAt), d));
    if (has) streak++;
    else break;
  }

  // Heatmap dots for the past 28 days
  const heatmapDays: { date: Date; count: number }[] = [];
  for (let i = 27; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    d.setHours(0, 0, 0, 0);
    const count = events.filter((e) => isSameDay(new Date(e.startAt), d)).length;
    heatmapDays.push({ date: d, count });
  }

  const displayName = user?.displayName ?? user?.email?.split('@')[0] ?? 'Guest';

  return (
    <ScreenLayout title="Profile">
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Avatar & info */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={48} color={COLORS.primary} />
          </View>
          <Text style={styles.name}>{displayName}</Text>
          {user && <Text style={styles.email}>{user.email}</Text>}
          {!user && (
            <TouchableOpacity style={styles.signInBtn} onPress={() => router.push('/sign-up')}>
              <Text style={styles.signInText}>Sign in to sync</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Quick stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="flame" size={22} color={COLORS.warning} />
            <Text style={styles.statNum}>{streak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="calendar" size={22} color={COLORS.primary} />
            <Text style={styles.statNum}>{weekEvents.length}</Text>
            <Text style={styles.statLabel}>This Week</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="checkmark-done" size={22} color={COLORS.success} />
            <Text style={styles.statNum}>{checkIns.length}</Text>
            <Text style={styles.statLabel}>Check-ins</Text>
          </View>
        </View>

        {/* Category breakdown */}
        <Text style={styles.sectionTitle}>This Week by Category</Text>
        {catBreakdown.length === 0 ? (
          <Text style={styles.emptyText}>No events this week yet.</Text>
        ) : (
          catBreakdown.map(({ cat, hours }) => {
            const cfg = CATEGORY_CONFIG[cat];
            const pct = Math.min((hours / 40) * 100, 100);
            return (
              <View key={cat} style={styles.catRow}>
                <View style={styles.catInfo}>
                  <Ionicons name={cfg.icon as any} size={16} color={cfg.color} />
                  <Text style={styles.catLabel}>{cfg.label}</Text>
                </View>
                <View style={styles.barBg}>
                  <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: cfg.color }]} />
                </View>
                <Text style={styles.catHours}>{Math.round(hours)}h</Text>
              </View>
            );
          })
        )}

        {/* Activity heatmap */}
        <Text style={styles.sectionTitle}>Activity (Last 28 Days)</Text>
        <View style={styles.heatmap}>
          {heatmapDays.map(({ date, count }) => {
            const opacity = count === 0 ? 0.15 : Math.min(0.3 + count * 0.2, 1);
            return (
              <View
                key={date.toISOString()}
                style={[styles.heatDot, { backgroundColor: COLORS.primary, opacity }]}
              />
            );
          })}
        </View>
        <View style={styles.heatLegend}>
          <Text style={styles.legendText}>Less</Text>
          {[0.15, 0.3, 0.5, 0.7, 1].map((op) => (
            <View key={op} style={[styles.heatDot, { backgroundColor: COLORS.primary, opacity: op }]} />
          ))}
          <Text style={styles.legendText}>More</Text>
        </View>

        {/* Accountability check-ins */}
        <AccountabilitySection />
      </ScrollView>
    </ScreenLayout>
  );
}

function AccountabilitySection() {
  const { checkIns, addCheckIn, events, currentWeek } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const weekEvents = events.filter((e) => {
    const d = new Date(e.startAt);
    const weekDays = getWeekDays(currentWeek);
    return d >= weekDays[0] && d <= new Date(weekDays[6].getTime() + 86400000);
  });
  const totalHours = Math.round(weekEvents.reduce((s, e) => s + durationHours(e.startAt, e.endAt), 0));

  const handleSend = async () => {
    if (!name.trim()) {
      Alert.alert('Missing Name', 'Please enter your partner\'s name.');
      return;
    }
    const summary = `Week of ${formatWeekRange(currentWeek)}: ${weekEvents.length} events, ${totalHours} hours tracked.`;
    await addCheckIn({
      weekStart: getMonday(currentWeek).toISOString(),
      recipientName: name.trim(),
      recipientEmail: email.trim(),
      summary,
      status: 'sent',
    });
    setShowForm(false);
    setName('');
    setEmail('');
    Alert.alert('Check-in Sent', 'Your weekly summary has been recorded.');
  };

  return (
    <>
      <Text style={styles.sectionTitle}>Weekly Accountability</Text>

      {!showForm ? (
        <TouchableOpacity style={styles.sendBtn} onPress={() => setShowForm(true)}>
          <Ionicons name="send-outline" size={18} color="#fff" />
          <Text style={styles.sendBtnText}>Send Weekly Check-in</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.formCard}>
          <Text style={styles.formLabel}>Partner Name</Text>
          <TextInput
            style={styles.formInput}
            value={name}
            onChangeText={setName}
            placeholder="e.g. Study Buddy"
            placeholderTextColor="#a0aec0"
          />
          <Text style={styles.formLabel}>Email (optional)</Text>
          <TextInput
            style={styles.formInput}
            value={email}
            onChangeText={setEmail}
            placeholder="partner@email.com"
            placeholderTextColor="#a0aec0"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Text style={styles.formPreview}>
            Summary: {weekEvents.length} events, {totalHours}h tracked this week.
          </Text>
          <View style={styles.formActions}>
            <TouchableOpacity style={styles.formCancel} onPress={() => setShowForm(false)}>
              <Text style={styles.formCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.formSubmit} onPress={handleSend}>
              <Text style={styles.formSubmitText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {checkIns.length > 0 && (
        <View style={styles.checkInList}>
          {checkIns.slice().reverse().map((ci) => (
            <CheckInCard key={ci.id} checkIn={ci} />
          ))}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, width: '100%' },
  content: { padding: 16, paddingBottom: 40 },
  avatarSection: { alignItems: 'center', marginBottom: 20 },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  name: { fontSize: 22, fontWeight: '700', color: '#fff' },
  email: { fontSize: 13, color: '#ffffffaa', marginTop: 2 },
  signInBtn: {
    marginTop: 10,
    backgroundColor: '#ffffff22',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  signInText: { fontSize: 13, color: '#fff', fontWeight: '600' },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
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
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#fff', marginBottom: 10, marginTop: 8 },
  emptyText: { fontSize: 14, color: '#ffffff88' },
  catRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  catInfo: { flexDirection: 'row', alignItems: 'center', gap: 4, width: 80 },
  catLabel: { fontSize: 12, color: '#fff', fontWeight: '600' },
  barBg: {
    flex: 1,
    height: 10,
    backgroundColor: '#ffffff22',
    borderRadius: 5,
    overflow: 'hidden',
  },
  barFill: { height: '100%', borderRadius: 5 },
  catHours: { fontSize: 12, color: '#ffffffcc', fontWeight: '700', width: 30, textAlign: 'right' },
  heatmap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 8,
  },
  heatDot: {
    width: 18,
    height: 18,
    borderRadius: 4,
  },
  heatLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    justifyContent: 'center',
  },
  legendText: { fontSize: 10, color: '#ffffff88' },
  sendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 14,
    marginBottom: 12,
  },
  sendBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  formLabel: { fontSize: 13, fontWeight: '600', color: '#4a5568', marginBottom: 4, marginTop: 8 },
  formInput: {
    backgroundColor: '#f7fafc',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#2d3748',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  formPreview: { fontSize: 13, color: '#718096', marginTop: 10, fontStyle: 'italic' },
  formActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 14 },
  formCancel: { paddingVertical: 8, paddingHorizontal: 16 },
  formCancelText: { fontSize: 14, color: '#718096', fontWeight: '600' },
  formSubmit: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  formSubmitText: { fontSize: 14, color: '#fff', fontWeight: '700' },
  checkInList: { marginTop: 8 },
});
