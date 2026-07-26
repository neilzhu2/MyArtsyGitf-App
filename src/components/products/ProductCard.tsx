import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Product } from '../../types/product';
import { DesignTokens } from '../../constants/DesignTokens';
import { useCustomizationStore } from '../../stores/useCustomizationStore';
import { MOCK_ARTWORKS } from '../../constants/mockData';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const router = useRouter();
  const { t } = useTranslation();
  const initCustomization = useCustomizationStore(state => state.initCustomization);

  const handleCustomizeProduct = () => {
    initCustomization({
      sourceType: 'artwork',
      artwork: MOCK_ARTWORKS[0],
      product,
    });
    router.push('/(modals)/customize');
  };

  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => router.push(`/product/${product.id}`)}
      activeOpacity={0.9}
    >
      <Image source={{ uri: product.mockupImageUrl }} style={styles.productImage} contentFit="cover" />

      <View style={styles.infoContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={1}>{product.title}</Text>
          <Text style={styles.price}>{t('common.priceCad', { price: product.basePriceCad })}</Text>
        </View>

        <Text style={styles.description} numberOfLines={2}>{product.description}</Text>

        <View style={styles.actionsRow}>
          <View style={styles.colorsPreview}>
            {product.availableColors.slice(0, 4).map((c, idx) => (
              <View key={idx} style={[styles.colorDot, { backgroundColor: c.hex }]} />
            ))}
          </View>

          <TouchableOpacity style={styles.customizeBtn} onPress={handleCustomizeProduct} activeOpacity={0.85}>
            <Ionicons name="sparkles-outline" size={14} color="#FFFFFF" />
            <Text style={styles.customizeBtnText}>{t('products.chooseArtCta')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: DesignTokens.colors.paper,
    borderRadius: DesignTokens.radius.lg,
    borderWidth: 1,
    borderColor: DesignTokens.colors.cardBorder,
    overflow: 'hidden',
    marginBottom: DesignTokens.spacing.md,
    ...DesignTokens.shadows.sm,
  },
  productImage: {
    width: '100%',
    height: 180,
  },
  infoContainer: {
    padding: DesignTokens.spacing.md,
    gap: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: DesignTokens.colors.text.primary,
    flex: 1,
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: DesignTokens.colors.accent.bronze,
  },
  description: {
    fontSize: 13,
    color: DesignTokens.colors.text.secondary,
    lineHeight: 18,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  colorsPreview: {
    flexDirection: 'row',
    gap: 4,
  },
  colorDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: DesignTokens.colors.cardBorder,
  },
  customizeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#141414',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: DesignTokens.radius.md,
    gap: 4,
  },
  customizeBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
});
