import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { GiftOccasion } from '../../types/gift';
import { DesignTokens } from '../../constants/DesignTokens';

interface OccasionCardProps {
  occasion: GiftOccasion;
}

export const OccasionCard: React.FC<OccasionCardProps> = ({ occasion }) => {
  const router = useRouter();

  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => router.push(`/gift/${occasion.slug}`)}
      activeOpacity={0.9}
    >
      <Image source={{ uri: occasion.coverImageUrl }} style={styles.image} contentFit="cover" />
      <View style={styles.overlay} />
      <View style={styles.content}>
        <View style={styles.tagBadge}>
          <Text style={styles.tagText}>{occasion.recommendedTag}</Text>
        </View>
        <Text style={styles.title}>{occasion.title}</Text>
        <Text style={styles.subtitle} numberOfLines={2}>{occasion.subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 160,
    borderRadius: DesignTokens.radius.lg,
    overflow: 'hidden',
    marginBottom: DesignTokens.spacing.md,
    position: 'relative',
    ...DesignTokens.shadows.md,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(20, 20, 20, 0.45)',
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: DesignTokens.spacing.md,
    gap: 4,
  },
  tagBadge: {
    alignSelf: 'flex-start',
    backgroundColor: DesignTokens.colors.accent.bronze,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    color: '#E0E0E0',
    fontSize: 12,
  },
});
