import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import type { InsightCard } from '../types/models';

const SEVERITY_CONFIG = {
  info:     { color: '#4299e1', bg: '#ebf8ff', icon: 'information-circle' as const },
  warning:  { color: '#ed8936', bg: '#fffaf0', icon: 'warning' as const },
  critical: { color: '#e53e3e', bg: '#fff5f5', icon: 'alert-circle' as const },
};

export default function InsightCardView({ insight }: { insight: InsightCard }) {
  const cfg = SEVERITY_CONFIG[insight.severity];

  return (
    <View style={[styles.card, { backgroundColor: cfg.bg, borderLeftColor: cfg.color }]}>
      <View style={styles.header}>
        <Ionicons name={cfg.icon} size={20} color={cfg.color} />
        <Text style={[styles.title, { color: cfg.color }]}>{insight.title}</Text>
      </View>
      <Text style={styles.message}>{insight.message}</Text>
      <View style={styles.suggestion}>
        <Ionicons name="bulb-outline" size={14} color="#718096" />
        <Text style={styles.suggestionText}>{insight.suggestion}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderLeftWidth: 4,
    padding: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  message: {
    fontSize: 14,
    color: '#4a5568',
    lineHeight: 20,
    marginBottom: 10,
  },
  suggestion: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    backgroundColor: '#f7fafc',
    padding: 10,
    borderRadius: 8,
  },
  suggestionText: {
    fontSize: 13,
    color: '#718096',
    flex: 1,
    lineHeight: 18,
  },
});
