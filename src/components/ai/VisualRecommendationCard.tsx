import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { GiftConcept } from '../../types/gift';
import { DesignTokens } from '../../constants/DesignTokens';
import { MOCK_ARTWORKS, MOCK_PRODUCTS } from '../../constants/mockData';
import { useCustomizationStore } from '../../stores/useCustomizationStore';
import { useAiStore } from '../../stores/useAiStore';

interface VisualRecommendationCardProps {
  concept: GiftConcept;
}

export const VisualRecommendationCard: React.FC<VisualRecommendationCardProps> = ({ concept }) => {
  const router = useRouter();
  const initCustomization = useCustomizationStore(state => state.initCustomization);
  const closeAiAssistant = useAiStore(state => state.closeAiAssistant);

  const artwork = MOCK_ARTWORKS.find(a => a.id === concept.artworkId) || MOCK_ARTWORKS[0];
  const product = MOCK_PRODUCTS.find(p => p.id === concept.productId) || MOCK_PRODUCTS[0];

  const handleCustomize = () => {
    initCustomization({
      sourceType: 'artwork',
      artwork,
      product,
      customText: concept.suggestedText,
    });
    closeAiAssistant();
    router.push('/(modals)/customize');
  };

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: artwork.imageUrl }} style={styles.artworkPreview} contentFit="cover" />
        <View style={styles.productBadge}>
          <Text style={styles.productBadgeText}>{product.title}</Text>
        </View>
      </View>

      <View style={styles.details}>
        <Text style={styles.title}>{concept.title}</Text>
        <Text style={styles.artistName}>Art by {artwork.artistName}</Text>
        <Text style={styles.reasonText}>"{concept.reason}"</Text>

        <View style={styles.footer}>
          <Text style={styles.price}>CAD ${concept.estimatedPriceCad}</Text>
          
          <TouchableOpacity style={styles.customizeBtn} onPress={handleCustomize} activeOpacity={0.8}>
            <Ionicons name="sparkles" size={14} color="#FFFFFF" />
            <Text style={styles.customizeBtnText}>Customize</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: DesignTokens.colors.paper,
    borderRadius: DesignTokens.radius.md,
    borderWidth: 1,
    borderColor: DesignTokens.colors.cardBorder,
    overflow: 'hidden',
    marginBottom: DesignTokens.spacing.md,
    width: '100%',
    ...DesignTokens.shadows.sm,
  },
  imageContainer: {
    height: 140,
    position: 'relative',
  },
  artworkPreview: {
    width: '100%',
    height: '100%',
  },
  productBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(20, 20, 20, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  productBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  details: {
    padding: DesignTokens.spacing.md,
    gap: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: DesignTokens.colors.text.primary,
  },
  artistName: {
    fontSize: 12,
    color: DesignTokens.colors.accent.bronze,
    fontWeight: '600',
  },
  reasonText: {
    fontSize: 12,
    fontStyle: 'italic',
    color: DesignTokens.colors.text.secondary,
    lineHeight: 16,
    marginVertical: 4,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: DesignTokens.colors.canvas,
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: DesignTokens.colors.text.primary,
  },
  customizeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#141414',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: DesignTokens.radius.sm,
    gap: 6,
  },
  customizeBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
