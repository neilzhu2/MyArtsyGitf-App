import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Artist } from '../../types/artwork';
import { DesignTokens } from '../../constants/DesignTokens';

interface ArtistCardProps {
  artist: Artist;
}

export const ArtistCard: React.FC<ArtistCardProps> = ({ artist }) => {
  const router = useRouter();

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => router.push(`/artist/${artist.id}`)}
      activeOpacity={0.9}
    >
      <Image source={{ uri: artist.coverUrl }} style={styles.coverImage} contentFit="cover" />
      <View style={styles.content}>
        <View style={styles.avatarWrapper}>
          <Image source={{ uri: artist.avatarUrl }} style={styles.avatar} contentFit="cover" />
        </View>
        <Text style={styles.name}>{artist.name}</Text>
        <Text style={styles.handle}>{artist.handle}</Text>
        <Text style={styles.location}>{artist.location}</Text>
        <Text style={styles.bio} numberOfLines={2}>{artist.bio}</Text>

        <View style={styles.footer}>
          <Text style={styles.artworkCount}>{artist.totalArtworks} Artworks</Text>
          <Text style={styles.viewStory}>View Story →</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 240,
    backgroundColor: DesignTokens.colors.paper,
    borderRadius: DesignTokens.radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: DesignTokens.colors.cardBorder,
    marginRight: DesignTokens.spacing.md,
    ...DesignTokens.shadows.sm,
  },
  coverImage: {
    height: 90,
    width: '100%',
  },
  content: {
    padding: DesignTokens.spacing.md,
    paddingTop: 0,
    alignItems: 'center',
  },
  avatarWrapper: {
    marginTop: -24,
    borderRadius: 26,
    padding: 3,
    backgroundColor: DesignTokens.colors.paper,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: DesignTokens.colors.text.primary,
    marginTop: 6,
  },
  handle: {
    fontSize: 12,
    color: DesignTokens.colors.accent.bronze,
    fontWeight: '600',
  },
  location: {
    fontSize: 11,
    color: DesignTokens.colors.text.muted,
    marginBottom: 6,
  },
  bio: {
    fontSize: 12,
    color: DesignTokens.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: DesignTokens.colors.canvas,
  },
  artworkCount: {
    fontSize: 11,
    color: DesignTokens.colors.text.muted,
  },
  viewStory: {
    fontSize: 11,
    fontWeight: '700',
    color: DesignTokens.colors.text.primary,
  },
});
