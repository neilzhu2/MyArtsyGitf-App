import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
      {/* Side-by-side Dual Image Preview: Artwork + Product Mockup */}
      <View style={styles.previewContainer}>
        <View style={styles.artFrame}>
          <Image source={{ uri: artwork.imageUrl }} style={styles.previewImage} contentFit="cover" />
          <View style={styles.imageTag}>
            <Text style={styles.imageTagText}>ARTWORK</Text>
          </View>
        </View>

        <Ionicons name="add" size={16} color="#9E988F" style={styles.plusIcon} />

        <View style={styles.productFrame}>
          <Image source={{ uri: product.mockupImageUrl }} style={styles.previewImage} contentFit="cover" />
          <View style={styles.imageTag}>
            <Text style={styles.imageTagText}>{product.title.toUpperCase()}</Text>
          </View>
        </View>
      </View>

      <View style={styles.details}>
        <Text style={styles.title}>{concept.title}</Text>
        <Text style={styles.artistName}>{t('artwork.artBy', { name: artwork.artistName })}</Text>
        
        <View style={styles.reasonBox}>
          <Ionicons name="sparkles-outline" size={12} color="#C48B47" />
          <Text style={styles.reasonText}>"{concept.reason}"</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.price}>{t('common.priceCad', { price: concept.estimatedPriceCad })}</Text>
          
          <TouchableOpacity style={styles.customizeBtn} onPress={handleCustomize} activeOpacity={0.85}>
            <Ionicons name="sparkles" size={14} color="#FFFFFF" />
            <Text style={styles.customizeBtnText}>{t('common.customize')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: DesignTokens.colors.paper,
    borderRadius: DesignTokens.radius.lg,
    borderWidth: 1,
    borderColor: DesignTokens.colors.cardBorder,
    overflow: 'hidden',
    marginTop: 8,
    marginBottom: 4,
    width: '100%',
    ...DesignTokens.shadows.sm,
  },
  previewContainer: {
    flexDirection: 'row',
    height: 120,
    backgroundColor: '#FAF8F5',
    padding: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: DesignTokens.colors.cardBorder,
  },
  artFrame: {
    flex: 1,
    height: '100%',
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  plusIcon: {
    marginHorizontal: 6,
  },
  productFrame: {
    flex: 1,
    height: '100%',
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#F4F1EA',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  imageTag: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: 'rgba(20, 20, 20, 0.75)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  imageTagText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.5,
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
  reasonBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    backgroundColor: '#F7EFE6',
    padding: 8,
    borderRadius: DesignTokens.radius.sm,
    marginVertical: 4,
  },
  reasonText: {
    flex: 1,
    fontSize: 11,
    color: '#66615B',
    lineHeight: 15,
    fontStyle: 'italic',
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
    borderRadius: DesignTokens.radius.md,
    gap: 6,
  },
  customizeBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
