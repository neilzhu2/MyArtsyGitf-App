import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Header } from '../../components/common/Header';
import { ArtworkCard } from '../../components/gallery/ArtworkCard';
import { ArtistCard } from '../../components/gallery/ArtistCard';
import { FloatingAIButton } from '../../components/common/FloatingAIButton';
import { DesignTokens } from '../../constants/DesignTokens';
import { artworkRepository } from '../../services/repositories/ArtworkRepository';
import { artistRepository } from '../../services/repositories/ArtistRepository';
import { Artwork, Artist } from '../../types/artwork';

export default function GalleryScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('all');

  useEffect(() => {
    async function loadData() {
      const arts = await artworkRepository.getAll();
      const artsList = await artistRepository.getAll();
      setArtworks(arts);
      setArtists(artsList);
    }
    loadData();
  }, []);

  const featuredExhibitionArt = artworks[0];
  const tagsList = ['all', 'botanical', 'gold', 'abstract', 'ink', 'terracotta', 'impressionism'];

  const filteredArtworks = selectedTag === 'all'
    ? artworks
    : artworks.filter(a => a.tags.includes(selectedTag));

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header />
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={{ paddingBottom: 90 }}
        showsVerticalScrollIndicator={false}
      >
        
        {/* Exhibition Banner Hero */}
        {featuredExhibitionArt && (
          <View style={styles.heroContainer}>
            <Image source={{ uri: featuredExhibitionArt.imageUrl }} style={styles.heroImage} contentFit="cover" />
            <View style={styles.heroOverlay} />
            <View style={styles.heroContent}>
              <View style={styles.exhibitionTag}>
                <Ionicons name="sparkles" size={12} color="#FFFFFF" />
                <Text style={styles.exhibitionTagText}>{t('gallery.curatedExhibition')}</Text>
              </View>
              <Text style={styles.heroTitle}>{t('gallery.heroTitle')}</Text>
              <Text style={styles.heroSubtitle}>{t('gallery.heroSubtitle')}</Text>
              
              <TouchableOpacity 
                style={styles.heroButton} 
                onPress={() => router.push(`/artwork/${featuredExhibitionArt.id}`)}
                activeOpacity={0.85}
              >
                <Text style={styles.heroButtonText}>{t('gallery.exploreExhibition')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Featured Artists Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('gallery.featuredArtists')}</Text>
          <Text style={styles.sectionSubtitle}>{t('gallery.featuredArtistsSub')}</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.artistScroll}>
          {artists.map(artist => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </ScrollView>

        {/* Tag Palette Filter */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('gallery.digitalGallery')}</Text>
          <Text style={styles.sectionSubtitle}>{t('gallery.digitalGallerySub')}</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tagsScroll}>
          {tagsList.map(tag => (
            <TouchableOpacity 
              key={tag}
              style={[styles.tagPill, selectedTag === tag && styles.activeTagPill]}
              onPress={() => setSelectedTag(tag)}
            >
              <Text style={[styles.tagText, selectedTag === tag && styles.activeTagText]}>
                {tag === 'all' ? t('common.all') : `#${tag}`}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Artworks Grid */}
        <View style={styles.artworkGrid}>
          {filteredArtworks.map(art => (
            <ArtworkCard key={art.id} artwork={art} variant="grid" />
          ))}
        </View>
      </ScrollView>

      {/* Floating AI Curator Action Button */}
      <FloatingAIButton 
        label={t('gallery.askCurator')} 
        context={{ role: 'curator', entityTitle: 'Gallery Exhibition' }} 
      />
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
  heroContainer: {
    height: 220,
    marginHorizontal: DesignTokens.spacing.lg,
    marginTop: DesignTokens.spacing.sm,
    borderRadius: DesignTokens.radius.lg,
    overflow: 'hidden',
    position: 'relative',
    ...DesignTokens.shadows.md,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(20, 20, 20, 0.45)',
  },
  heroContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: DesignTokens.spacing.md,
    gap: 6,
  },
  exhibitionTag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: DesignTokens.colors.accent.bronze,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 4,
  },
  exhibitionTagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  heroSubtitle: {
    color: '#E0E0E0',
    fontSize: 12,
  },
  heroButton: {
    marginTop: 4,
    alignSelf: 'flex-start',
    backgroundColor: '#FAF8F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: DesignTokens.radius.md,
  },
  heroButtonText: {
    color: '#141414',
    fontSize: 12,
    fontWeight: '700',
  },
  sectionHeader: {
    paddingHorizontal: DesignTokens.spacing.lg,
    marginTop: 20,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: DesignTokens.colors.text.primary,
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: DesignTokens.colors.text.secondary,
    marginTop: 2,
  },
  artistScroll: {
    paddingLeft: DesignTokens.spacing.lg,
    paddingRight: DesignTokens.spacing.md,
    paddingVertical: 4,
  },
  tagsScroll: {
    paddingLeft: DesignTokens.spacing.lg,
    paddingRight: DesignTokens.spacing.md,
    paddingVertical: 6,
    gap: 8,
  },
  tagPill: {
    backgroundColor: DesignTokens.colors.paper,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: DesignTokens.radius.round,
    borderWidth: 1,
    borderColor: DesignTokens.colors.cardBorder,
  },
  activeTagPill: {
    backgroundColor: '#141414',
    borderColor: '#141414',
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
    color: DesignTokens.colors.text.secondary,
  },
  activeTagText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  artworkGrid: {
    paddingHorizontal: DesignTokens.spacing.lg,
    marginTop: DesignTokens.spacing.xs,
  },
});
