import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../../components/common/Header';
import { ArtworkCard } from '../../components/gallery/ArtworkCard';
import { DesignTokens } from '../../constants/DesignTokens';
import { artistRepository } from '../../services/repositories/ArtistRepository';
import { artworkRepository } from '../../services/repositories/ArtworkRepository';
import { Artist, Artwork } from '../../types/artwork';

export default function ArtistDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [artist, setArtist] = useState<Artist | undefined>(undefined);
  const [artworks, setArtworks] = useState<Artwork[]>([]);

  useEffect(() => {
    async function loadArtist() {
      if (!id) return;
      const artObj = await artistRepository.getById(id);
      setArtist(artObj);
      if (artObj) {
        const arts = await artworkRepository.getByArtistId(artObj.id);
        setArtworks(arts);
      }
    }
    loadArtist();
  }, [id]);

  if (!artist) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header showBack />
        <View style={styles.centerBox}><Text>Loading artist profile...</Text></View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header showBack title={artist.name} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* Cover Header Banner */}
        <View style={styles.coverBox}>
          <Image source={{ uri: artist.coverUrl }} style={styles.coverImage} contentFit="cover" />
          <View style={styles.avatarWrapper}>
            <Image source={{ uri: artist.avatarUrl }} style={styles.avatar} contentFit="cover" />
          </View>
        </View>

        {/* Artist Profile Info */}
        <View style={styles.profileHeader}>
          <Text style={styles.name}>{artist.name}</Text>
          <Text style={styles.handle}>{artist.handle}</Text>
          <Text style={styles.location}>{artist.location}</Text>

          <View style={styles.badgeRow}>
            <View style={styles.badgePill}>
              <Text style={styles.badgeText}>VERIFIED LICENSED ARTIST</Text>
            </View>
            <View style={styles.badgePillGold}>
              <Text style={styles.badgeTextGold}>{artist.totalArtworks} Artworks</Text>
            </View>
          </View>

          {/* Social Links */}
          {artist.socialLinks.instagram && (
            <TouchableOpacity 
              style={styles.socialBtn}
              onPress={() => Linking.openURL(artist.socialLinks.instagram!)}
            >
              <Ionicons name="logo-instagram" size={16} color="#141414" />
              <Text style={styles.socialText}>Instagram Portfolio</Text>
            </TouchableOpacity>
          )}

          {/* Artist Bio & Full Story */}
          <Text style={styles.bio}>{artist.bio}</Text>

          <View style={styles.storyCard}>
            <Text style={styles.storyTitle}>ARTIST BACKGROUND & PHILOSOPHY</Text>
            <Text style={styles.storyText}>{artist.story}</Text>
          </View>
        </View>

        {/* Associated Artworks Gallery */}
        <View style={styles.gallerySection}>
          <Text style={styles.sectionTitle}>Artworks by {artist.name}</Text>
          <Text style={styles.sectionSub}>All works licensed for custom gifts & fine prints</Text>

          <View style={styles.artworksGrid}>
            {artworks.map(art => (
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
  coverBox: {
    height: 140,
    position: 'relative',
    marginBottom: 30,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  avatarWrapper: {
    position: 'absolute',
    bottom: -24,
    left: 20,
    backgroundColor: DesignTokens.colors.paper,
    borderRadius: 34,
    padding: 3,
    ...DesignTokens.shadows.md,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  profileHeader: {
    paddingHorizontal: DesignTokens.spacing.lg,
    gap: 6,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#141414',
  },
  handle: {
    fontSize: 14,
    fontWeight: '600',
    color: DesignTokens.colors.accent.bronze,
  },
  location: {
    fontSize: 12,
    color: DesignTokens.colors.text.muted,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 4,
  },
  badgePill: {
    backgroundColor: '#EBE5D8',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#141414',
  },
  badgePillGold: {
    backgroundColor: '#C48B47',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  badgeTextGold: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: DesignTokens.colors.paper,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: DesignTokens.radius.round,
    borderWidth: 1,
    borderColor: DesignTokens.colors.cardBorder,
    gap: 6,
    marginVertical: 4,
  },
  socialText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#141414',
  },
  bio: {
    fontSize: 14,
    color: DesignTokens.colors.text.secondary,
    lineHeight: 20,
    marginTop: 4,
  },
  storyCard: {
    backgroundColor: '#FAF8F5',
    borderRadius: DesignTokens.radius.md,
    borderWidth: 1,
    borderColor: DesignTokens.colors.cardBorder,
    padding: DesignTokens.spacing.md,
    marginTop: 8,
    gap: 4,
  },
  storyTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: DesignTokens.colors.text.muted,
    letterSpacing: 0.5,
  },
  storyText: {
    fontSize: 13,
    color: DesignTokens.colors.text.primary,
    lineHeight: 19,
  },
  gallerySection: {
    paddingHorizontal: DesignTokens.spacing.lg,
    marginTop: DesignTokens.spacing.xl,
    paddingBottom: 60,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#141414',
  },
  sectionSub: {
    fontSize: 12,
    color: DesignTokens.colors.text.secondary,
    marginBottom: 14,
  },
  artworksGrid: {
    gap: 12,
  },
});
