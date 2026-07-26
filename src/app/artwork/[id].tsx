import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Header } from '../../components/common/Header';
import { ProductCard } from '../../components/products/ProductCard';
import { DesignTokens } from '../../constants/DesignTokens';
import { artworkRepository } from '../../services/repositories/ArtworkRepository';
import { artistRepository } from '../../services/repositories/ArtistRepository';
import { productRepository } from '../../services/repositories/ProductRepository';
import { Artwork, Artist } from '../../types/artwork';
import { Product } from '../../types/product';
import { useCustomizationStore } from '../../stores/useCustomizationStore';
import { useStudioStore } from '../../stores/useStudioStore';

export default function ArtworkDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  
  const initCustomization = useCustomizationStore(state => state.initCustomization);
  const favoriteArtworkIds = useStudioStore(state => state.favoriteArtworkIds);
  const toggleFavoriteArtwork = useStudioStore(state => state.toggleFavoriteArtwork);

  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [artist, setArtist] = useState<Artist | null>(null);
  const [matchingProducts, setMatchingProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadArtworkDetails() {
      if (!id) return;
      const art = await artworkRepository.getById(id);
      if (art) {
        setArtwork(art);
        const artst = await artistRepository.getById(art.artistId);
        setArtist(artst || null);
        const prods = await productRepository.getAll();
        setMatchingProducts(prods);
      }
    }
    loadArtworkDetails();
  }, [id]);

  if (!artwork) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header showBack />
        <View style={styles.centerLoading}>
          <Text>{t('artwork.loading')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isFav = favoriteArtworkIds.includes(artwork.id);

  const handleStartCustomization = (product?: Product) => {
    initCustomization({
      sourceType: 'artwork',
      artwork,
      product: product || matchingProducts[0],
    });
    router.push('/(modals)/customize');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header showBack title={artwork.title} />

      <ScrollView 
        style={styles.container} 
        contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        {/* High Res Artwork Canvas Display */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: artwork.imageUrl }} style={styles.artImage} contentFit="cover" />
          <TouchableOpacity 
            style={styles.favFloatingBtn} 
            onPress={() => toggleFavoriteArtwork(artwork.id)}
            activeOpacity={0.8}
          >
            <Ionicons name={isFav ? "heart" : "heart-outline"} size={22} color={isFav ? "#C53B3B" : "#141414"} />
          </TouchableOpacity>
        </View>

        {/* Artwork Header & Metadata */}
        <View style={styles.detailsBox}>
          <Text style={styles.title}>{artwork.title}</Text>
          <Text style={styles.metaYear}>{artwork.year} • {artwork.medium.toUpperCase()}</Text>

          {/* Artist Citation Box */}
          {artist && (
            <TouchableOpacity 
              style={styles.artistRow} 
              onPress={() => router.push(`/artist/${artist.id}`)}
              activeOpacity={0.85}
            >
              <Image source={{ uri: artist.avatarUrl }} style={styles.artistAvatar} />
              <View style={styles.artistInfo}>
                <Text style={styles.artistName}>{artist.name}</Text>
                <Text style={styles.artistMeta}>{artist.location} • {artist.handle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#9E988F" />
            </TouchableOpacity>
          )}

          {/* Story & Narrative */}
          <Text style={styles.sectionHeader}>{t('artwork.storyHeader')}</Text>
          <Text style={styles.storyText}>{artwork.description}</Text>

          {/* Color Palette Indicators */}
          <Text style={styles.sectionHeader}>{t('artwork.colorPalette')}</Text>
          <View style={styles.paletteRow}>
            {artwork.colorPalette.map((hex: string, idx: number) => (
              <View key={idx} style={[styles.colorDot, { backgroundColor: hex }]} />
            ))}
          </View>

          {/* Primary Action Button */}
          <TouchableOpacity 
            style={styles.primaryCta} 
            onPress={() => handleStartCustomization()}
            activeOpacity={0.85}
          >
            <Ionicons name="sparkles" size={18} color="#FFFFFF" />
            <Text style={styles.primaryCtaText}>{t('artwork.turnToGiftCta')}</Text>
          </TouchableOpacity>
        </View>

        {/* Physical Gift Objects Compatible with Artwork */}
        <View style={styles.productsSection}>
          <Text style={styles.productsSectionTitle}>{t('artwork.availableProductsTitle')}</Text>

          {matchingProducts.map(prod => (
            <ProductCard key={prod.id} product={prod} />
          ))}
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
  container: {
    flex: 1,
  },
  centerLoading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    width: '100%',
    height: 360,
    position: 'relative',
    backgroundColor: '#FAF8F5',
  },
  artImage: {
    width: '100%',
    height: '100%',
  },
  favFloatingBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FAF8F5',
    alignItems: 'center',
    justifyContent: 'center',
    ...DesignTokens.shadows.md,
  },
  detailsBox: {
    padding: DesignTokens.spacing.lg,
    backgroundColor: DesignTokens.colors.paper,
    borderBottomWidth: 1,
    borderBottomColor: DesignTokens.colors.cardBorder,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: DesignTokens.colors.text.primary,
    letterSpacing: -0.4,
  },
  metaYear: {
    fontSize: 12,
    fontWeight: '600',
    color: DesignTokens.colors.text.muted,
    marginTop: 4,
  },
  artistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DesignTokens.colors.canvas,
    padding: DesignTokens.spacing.md,
    borderRadius: DesignTokens.radius.md,
    marginTop: DesignTokens.spacing.md,
    borderWidth: 1,
    borderColor: DesignTokens.colors.cardBorder,
    gap: 12,
  },
  artistAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  artistInfo: {
    flex: 1,
  },
  artistName: {
    fontSize: 15,
    fontWeight: '700',
    color: DesignTokens.colors.text.primary,
  },
  artistMeta: {
    fontSize: 11,
    color: DesignTokens.colors.text.secondary,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: DesignTokens.colors.text.muted,
    marginTop: DesignTokens.spacing.lg,
    letterSpacing: 0.5,
  },
  storyText: {
    fontSize: 14,
    color: DesignTokens.colors.text.secondary,
    lineHeight: 22,
    marginTop: 6,
  },
  paletteRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  colorDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: DesignTokens.colors.cardBorder,
  },
  primaryCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#141414',
    paddingVertical: 14,
    borderRadius: DesignTokens.radius.md,
    marginTop: DesignTokens.spacing.xl,
    gap: 8,
  },
  primaryCtaText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  productsSection: {
    padding: DesignTokens.spacing.lg,
  },
  productsSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: DesignTokens.colors.text.primary,
    marginBottom: DesignTokens.spacing.md,
  },
});
