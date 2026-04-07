import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { CATEGORIES, CATEGORY_CONFIG, type Category, type WeekEvent } from '../types/models';
import { useApp } from '../context/AppContext';
import { COLORS } from '../constants/colors';

export default function EventModal() {
  const router = useRouter();
  const params = useLocalSearchParams<{ eventJson?: string; dateIso?: string }>();
  const { addEvent, updateEvent, deleteEvent } = useApp();

  const existing: WeekEvent | null = params.eventJson ? JSON.parse(params.eventJson) : null;
  const defaultDate = params.dateIso ? new Date(params.dateIso) : new Date();

  const [title, setTitle] = useState(existing?.title ?? '');
  const [category, setCategory] = useState<Category>(existing?.category ?? 'other');
  const [startHour, setStartHour] = useState(existing ? new Date(existing.startAt).getHours().toString() : '9');
  const [startMin, setStartMin] = useState(existing ? new Date(existing.startAt).getMinutes().toString().padStart(2, '0') : '00');
  const [endHour, setEndHour] = useState(existing ? new Date(existing.endAt).getHours().toString() : '10');
  const [endMin, setEndMin] = useState(existing ? new Date(existing.endAt).getMinutes().toString().padStart(2, '0') : '00');
  const [notes, setNotes] = useState(existing?.notes ?? '');

  const buildDate = (h: string, m: string) => {
    const d = existing ? new Date(existing.startAt) : new Date(defaultDate);
    d.setHours(parseInt(h) || 0, parseInt(m) || 0, 0, 0);
    return d.toISOString();
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Missing title', 'Please enter a title for this event.');
      return;
    }

    if (existing) {
      await updateEvent({
        ...existing,
        title: title.trim(),
        category,
        startAt: buildDate(startHour, startMin),
        endAt: buildDate(endHour, endMin),
        notes: notes.trim(),
      });
    } else {
      await addEvent({
        title: title.trim(),
        category,
        startAt: buildDate(startHour, startMin),
        endAt: buildDate(endHour, endMin),
        notes: notes.trim(),
        source: 'manual',
      });
    }
    router.back();
  };

  const handleDelete = () => {
    if (!existing) return;
    Alert.alert('Delete Event', `Remove "${existing.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteEvent(existing.id);
          router.back();
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{existing ? 'Edit Event' : 'New Event'}</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveBtn}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. Study Session"
          placeholderTextColor="#a0aec0"
        />

        <Text style={styles.label}>Category</Text>
        <View style={styles.catRow}>
          {CATEGORIES.map((c) => {
            const cfg = CATEGORY_CONFIG[c];
            const selected = c === category;
            return (
              <TouchableOpacity
                key={c}
                style={[styles.catChip, selected && { backgroundColor: cfg.color + '33', borderColor: cfg.color }]}
                onPress={() => setCategory(c)}
              >
                <Ionicons name={cfg.icon as any} size={16} color={selected ? cfg.color : '#a0aec0'} />
                <Text style={[styles.catLabel, selected && { color: cfg.color }]}>{cfg.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.label}>Start Time</Text>
        <View style={styles.timeRow}>
          <TextInput style={styles.timeInput} value={startHour} onChangeText={setStartHour} keyboardType="number-pad" maxLength={2} placeholder="HH" placeholderTextColor="#a0aec0" />
          <Text style={styles.colon}>:</Text>
          <TextInput style={styles.timeInput} value={startMin} onChangeText={setStartMin} keyboardType="number-pad" maxLength={2} placeholder="MM" placeholderTextColor="#a0aec0" />
        </View>

        <Text style={styles.label}>End Time</Text>
        <View style={styles.timeRow}>
          <TextInput style={styles.timeInput} value={endHour} onChangeText={setEndHour} keyboardType="number-pad" maxLength={2} placeholder="HH" placeholderTextColor="#a0aec0" />
          <Text style={styles.colon}>:</Text>
          <TextInput style={styles.timeInput} value={endMin} onChangeText={setEndMin} keyboardType="number-pad" maxLength={2} placeholder="MM" placeholderTextColor="#a0aec0" />
        </View>

        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={[styles.input, styles.notesInput]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Optional notes..."
          placeholderTextColor="#a0aec0"
          multiline
        />

        {existing && (
          <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
            <Ionicons name="trash-outline" size={18} color="#e53e3e" />
            <Text style={styles.deleteText}>Delete Event</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#1a202c' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 56 : 40,
    paddingBottom: 14,
    backgroundColor: COLORS.gradientStart,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  saveBtn: { fontSize: 16, fontWeight: '700', color: '#fff' },
  body: { flex: 1, backgroundColor: '#f7fafc' },
  bodyContent: { padding: 20, paddingBottom: 60 },
  label: { fontSize: 14, fontWeight: '700', color: '#4a5568', marginBottom: 6, marginTop: 16 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2d3748',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  notesInput: { height: 100, textAlignVertical: 'top' },
  catRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    backgroundColor: '#fff',
  },
  catLabel: { fontSize: 13, fontWeight: '600', color: '#a0aec0' },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  timeInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 20,
    fontWeight: '700',
    color: '#2d3748',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    textAlign: 'center',
    width: 70,
  },
  colon: { fontSize: 24, fontWeight: '700', color: '#4a5568' },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 30,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#fff5f5',
    borderWidth: 1,
    borderColor: '#fed7d7',
  },
  deleteText: { fontSize: 15, fontWeight: '600', color: '#e53e3e' },
});
