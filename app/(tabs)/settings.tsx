import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import ScreenLayout from '../../components/ScreenLayout';
import CategoryBadge from '../../components/CategoryBadge';
import { useApp } from '../../context/AppContext';
import { COLORS } from '../../constants/colors';
import { parseIcs, eventsOverlap } from '../../lib/import/ics-parser';
import { signOut } from '../../lib/firebase/auth';
import { syncEventsUp, syncTemplatesUp } from '../../lib/firebase/firestore';
import { CATEGORY_CONFIG, type Category, type Template } from '../../types/models';

export default function Settings() {
  const {
    user,
    events,
    templates,
    importEvents,
    addTemplate,
    deleteTemplate,
  } = useApp();
  const router = useRouter();
  const [importing, setImporting] = useState(false);

  // ── ICS Import ──────────────────────────────────────────────────────

  const handleImportIcs = async () => {
    try {
      setImporting(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets?.[0]) {
        setImporting(false);
        return;
      }

      const file = result.assets[0];
      const content = await FileSystem.readAsStringAsync(file.uri);
      const parsed = await parseIcs(content);

      if (parsed.length === 0) {
        Alert.alert('No Events', 'No events were found in this file.');
        setImporting(false);
        return;
      }

      // Check for conflicts with existing events
      const conflicts = parsed.filter((imp) =>
        events.some((existing) => eventsOverlap(imp, existing)),
      );

      if (conflicts.length > 0) {
        Alert.alert(
          'Import Conflicts',
          `${conflicts.length} imported event(s) overlap with existing events. Import anyway?`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Keep Both',
              onPress: async () => {
                await importEvents(parsed);
                Alert.alert('Imported', `${parsed.length} events imported.`);
              },
            },
            {
              text: 'Skip Conflicts',
              onPress: async () => {
                const safe = parsed.filter(
                  (imp) => !events.some((existing) => eventsOverlap(imp, existing)),
                );
                await importEvents(safe);
                Alert.alert('Imported', `${safe.length} events imported (${conflicts.length} skipped).`);
              },
            },
          ],
        );
      } else {
        await importEvents(parsed);
        Alert.alert('Imported', `${parsed.length} events imported successfully.`);
      }
    } catch (err: any) {
      Alert.alert('Import Error', err.message ?? 'Failed to import file.');
    } finally {
      setImporting(false);
    }
  };

  // ── Cloud Sync ────────────────────────────────────────────────────

  const handleSync = async () => {
    if (!user) {
      Alert.alert('Sign In Required', 'Please sign in first to sync your data.');
      return;
    }
    try {
      await syncEventsUp(user.uid, events);
      await syncTemplatesUp(user.uid, templates);
      Alert.alert('Synced', 'Your data has been uploaded to the cloud.');
    } catch (err: any) {
      Alert.alert('Sync Error', err.message ?? 'Failed to sync.');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      Alert.alert('Signed Out', 'You have been signed out.');
    } catch (err: any) {
      Alert.alert('Error', err.message ?? 'Failed to sign out.');
    }
  };

  return (
    <ScreenLayout title="Settings">
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Account section */}
        <Text style={styles.sectionTitle}>Account</Text>
        {user ? (
          <View style={styles.card}>
            <View style={styles.cardRow}>
              <Ionicons name="person-circle" size={24} color={COLORS.primary} />
              <Text style={styles.cardText}>{user.email}</Text>
            </View>
            <View style={styles.cardActions}>
              <TouchableOpacity style={styles.cardBtn} onPress={handleSync}>
                <Ionicons name="cloud-upload-outline" size={18} color="#fff" />
                <Text style={styles.cardBtnText}>Sync to Cloud</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.cardBtn, styles.cardBtnSecondary]} onPress={handleSignOut}>
                <Ionicons name="log-out-outline" size={18} color={COLORS.error} />
                <Text style={[styles.cardBtnText, { color: COLORS.error }]}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity style={styles.card} onPress={() => router.push('/sign-up')}>
            <View style={styles.cardRow}>
              <Ionicons name="log-in-outline" size={24} color={COLORS.primary} />
              <Text style={styles.cardText}>Sign in to sync your data</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#a0aec0" />
          </TouchableOpacity>
        )}

        {/* Import section */}
        <Text style={styles.sectionTitle}>Calendar Import</Text>
        <TouchableOpacity style={styles.card} onPress={handleImportIcs} disabled={importing}>
          <View style={styles.cardRow}>
            <Ionicons name="download-outline" size={24} color={COLORS.primary} />
            <View>
              <Text style={styles.cardText}>
                {importing ? 'Importing...' : 'Import ICS File'}
              </Text>
              <Text style={styles.cardSubText}>
                Import events from a .ics calendar file
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#a0aec0" />
        </TouchableOpacity>

        {/* Templates section */}
        <Text style={styles.sectionTitle}>Templates</Text>
        {templates.map((t) => (
          <View key={t.id} style={styles.templateCard}>
            <View style={styles.templateInfo}>
              <Ionicons
                name={CATEGORY_CONFIG[t.category].icon as any}
                size={20}
                color={CATEGORY_CONFIG[t.category].color}
              />
              <View>
                <Text style={styles.templateName}>{t.name}</Text>
                <Text style={styles.templateTime}>
                  {t.startHour}:{String(t.startMinute).padStart(2, '0')} – {t.endHour}:{String(t.endMinute).padStart(2, '0')}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                Alert.alert('Delete Template', `Remove "${t.name}"?`, [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Delete', style: 'destructive', onPress: () => deleteTemplate(t.id) },
                ]);
              }}
            >
              <Ionicons name="trash-outline" size={18} color={COLORS.error} />
            </TouchableOpacity>
          </View>
        ))}

        {/* About */}
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Ionicons name="information-circle-outline" size={24} color={COLORS.primary} />
            <View>
              <Text style={styles.cardText}>Your Week on One Screen</Text>
              <Text style={styles.cardSubText}>COMP 583 Group 10 — MVP v1.0</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, width: '100%' },
  content: { padding: 16, paddingBottom: 40 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#fff', marginBottom: 10, marginTop: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  cardText: { fontSize: 15, fontWeight: '600', color: '#2d3748' },
  cardSubText: { fontSize: 12, color: '#718096', marginTop: 2 },
  cardActions: { flexDirection: 'row', gap: 8, marginTop: 12 },
  cardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  cardBtnSecondary: { backgroundColor: '#fff5f5' },
  cardBtnText: { fontSize: 13, fontWeight: '600', color: '#fff' },
  templateCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  templateInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  templateName: { fontSize: 14, fontWeight: '600', color: '#2d3748' },
  templateTime: { fontSize: 12, color: '#718096', marginTop: 2 },
});
