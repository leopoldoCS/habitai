import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { CATEGORY_CONFIG, type Category } from '../types/models';

interface Props {
  category: Category;
  size?: 'small' | 'medium';
}

export default function CategoryBadge({ category, size = 'small' }: Props) {
  const config = CATEGORY_CONFIG[category];
  const isSmall = size === 'small';

  return (
    <View style={[styles.badge, { backgroundColor: config.color + '22' }, isSmall && styles.badgeSmall]}>
      <Ionicons name={config.icon as any} size={isSmall ? 12 : 16} color={config.color} />
      <Text style={[styles.label, { color: config.color }, isSmall && styles.labelSmall]}>
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
  },
  badgeSmall: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
  labelSmall: {
    fontSize: 11,
  },
});
