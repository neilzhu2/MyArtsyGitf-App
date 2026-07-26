import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../../components/common/Header';
import { ArtworkCard } from '../../components/gallery/ArtworkCard';
import { DesignTokens } from '../../constants/DesignTokens';
import { productRepository } from '../../services/repositories/ProductRepository';
import { artworkRepository } from '../../services/repositories/ArtworkRepository';
import { Product } from '../../types/product';
import { Artwork } from '../../types/artwork';
import { useCustomizationStore } from '../../stores/useCustomizationStore';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [recommendedArtworks, setRecommendedArtworks] = useState<Artwork[]>([]);
  const initCustomization = useCustomizationStore(state => state.initCustomization);

  useEffect(() => {
    async function loadProduct() {
      if (!id) return;
      const prod = await productRepository.getById(id);
      setProduct(prod);
      if (prod) {
        const arts = await artworkRepository.getAll();
        setRecommendedArtworks(arts.slice(0, 4));
      }
    }
    loadProduct();
  }, [id]);

  if (!product) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header showBack />
        <View style={styles.centerBox}><Text>Loading product details...</Text></View>
      </SafeAreaView>
    );
  }

  const handleStartCustomize = () => {
    initCustomization({ sourceType: 'artwork', product });
    router.push('/(modals)/customize');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header showBack title={product.title} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* Product Mockup Display */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.mockupImageUrl }} style={styles.productImage} contentFit="cover" />
        </View>

        {/* Product Details Header */}
        <View style={styles.contentSection}>
          <Text style={styles.category}>{product.subcategory.toUpperCase()}</Text>
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.price}>CAD ${product.basePriceCad}</Text>

          <Text style={styles.description}>{product.description}</Text>

          {/* Product Specs Box */}
          <View style={styles.specsBox}>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Dimensions:</Text>
              <Text style={styles.specValue}>{product.dimensions}</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Material:</Text>
              <Text style={styles.specValue}>{product.material}</Text>
            </View>
          </View>

          {/* Color Palette Options */}
          <Text style={styles.colorsHeader}>Available Color Finishes</Text>
          <View style={styles.colorsRow}>
            {product.availableColors.map((c, idx) => (
              <View key={idx} style={styles.colorPill}>
                <View style={[styles.colorDot, { backgroundColor: c.hex }]} />
                <Text style={styles.colorName}>{c.name}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Primary Action CTA */}
        <View style={styles.ctaBox}>
          <TouchableOpacity style={styles.mainBtn} onPress={handleStartCustomize} activeOpacity={0.85}>
            <Ionicons name="sparkles" size={18} color="#FFFFFF" />
            <Text style={styles.mainBtnText}>Select Art & Customize This Product →</Text>
          </TouchableOpacity>
        </View>

        {/* Recommended Artworks for this Product */}
        <View style={styles.artSection}>
          <Text style={styles.sectionTitle}>Artworks Designed for this Product</Text>
          <Text style={styles.sectionSub}>Select any artwork below to apply to this {product.title}</Text>

          <View style={styles.artGrid}>
            {recommendedArtworks.map(art => (
              <ArtworkCard key={art.id} artwork={art} variant="grid" />
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: DesignTokens.colors.canvas,
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
  },
  imageContainer: {
    height: 280,
    backgroundColor: DesignTokens.colors.paper,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  contentSection: {
    padding: DesignTokens.spacing.lg,
    gap: 6,
  },
  category: {
    fontSize: 10,
    fontWeight: '700',
    color: DesignTokens.colors.accent.bronze,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#141414',
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: DesignTokens.colors.text.primary,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: DesignTokens.colors.text.secondary,
    lineHeight: 20,
  },
  specsBox: {
    backgroundColor: DesignTokens.colors.paper,
    borderRadius: DesignTokens.radius.md,
    borderWidth: 1,
    borderColor: DesignTokens.colors.cardBorder,
    padding: DesignTokens.spacing.md,
    marginTop: 10,
    gap: 6,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  specLabel: {
    fontSize: 12,
    color: DesignTokens.colors.text.muted,
    fontWeight: '600',
  },
  specValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#141414',
  },
  colorsHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: '#141414',
    marginTop: 12,
  },
  colorsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  colorPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DesignTokens.colors.paper,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: DesignTokens.radius.round,
    borderWidth: 1,
    borderColor: DesignTokens.colors.cardBorder,
    gap: 6,
  },
  colorDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#CCCCCC',
  },
  colorName: {
    fontSize: 12,
    color: '#141414',
    fontWeight: '500',
  },
  ctaBox: {
    paddingHorizontal: DesignTokens.spacing.lg,
    marginVertical: DesignTokens.spacing.md,
  },
  mainBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#141414',
    paddingVertical: 14,
    borderRadius: DesignTokens.radius.md,
    gap: 8,
    ...DesignTokens.shadows.md,
  },
  mainBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  artSection: {
    paddingHorizontal: DesignTokens.spacing.lg,
    marginTop: DesignTokens.spacing.md,
    paddingBottom: 60,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#141414',
  },
  sectionSub: {
    fontSize: 12,
    color: DesignTokens.colors.text.secondary,
    marginBottom: 12,
  },
  artGrid: {
    gap: 12,
  },
});
