import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Artwork } from '../../types/artwork';
import { DesignTokens } from '../../constants/DesignTokens';
import { useStudioStore } from '../../stores/useStudioStore';
import { useCustomizationStore } from '../../stores/useCustomizationStore';

interface ArtworkCardProps {
  artwork: Artwork;
  variant?: 'large' | 'grid' | 'horizontal';
}

export const ArtworkCard: React.FC<ArtworkCardProps> = ({ artwork, variant = 'grid' }) => {
  const router = useRouter();
  const favoriteIds = useStudioStore(state => state.favoriteArtworkIds);
  const toggleFavorite = useStudioStore(state => state.toggleFavoriteArtwork);
  const initCustomization = useCustomizationStore(state => state.initCustomization);

  const isFavorite = favoriteIds.includes(artwork.id);

  const handleCustomize = () => {
    initCustomization({ sourceType: 'artwork', artwork });
    router.push('/(modals)/customize');
  };

  const isLarge = variant === 'large';
  const isHorizontal = variant === 'horizontal';

  if (isHorizontal) {
    return (
      <TouchableOpacity 
        style={styles.horizontalCard} 
        onPress={() => router.push(`/artwork/${artwork.id}`)}
        activeOpacity={0.9}
      >
        <Image source={{ uri: artwork.imageUrl }} style={styles.horizontalImage} contentFit="cover" />
        <View style={styles.horizontalContent}>
          <Text style={styles.artworkTitle} numberOfLines={1}>{artwork.title}</Text>
          <Text style={styles.artistName} numberOfLines={1}>{artwork.artistName}</Text>
          <Text style={styles.mediumText}>{artwork.medium}</Text>
          
          <TouchableOpacity style={styles.miniBtn} onPress={handleCustomize} activeOpacity={0.8}>
            <Ionicons name="color-palette-outline" size={14} color="#FFFFFF" />
            <Text style={styles.miniBtnText}>Turn to Gift</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.card, isLarge ? styles.cardLarge : styles.cardGrid]}>
      <TouchableOpacity 
        onPress={() => router.push(`/artwork/${artwork.id}`)} 
        activeOpacity={0.9} 
        style={styles.imageContainer}
      >
        <Image 
          source={{ uri: artwork.imageUrl }} 
          style={isLarge ? styles.imageLarge : styles.imageGrid} 
          contentFit="cover" 
          transition={300}
        />
        
        <TouchableOpacity 
          style={styles.favBadge} 
          onPress={() => toggleFavorite(artwork.id)}
          activeOpacity={0.7}
        >
          <Ionicons 
            name={isFavorite ? "heart" : "heart-outline"} 
            size={18} 
            color={isFavorite ? "#C53B3B" : "#141414"} 
          />
        </TouchableOpacity>
      </TouchableOpacity>

      <View style={styles.detailsContainer}>
        <View style={styles.artistRow}>
          <Image source={{ uri: artwork.artistAvatar }} style={styles.avatar} />
          <Text style={styles.artistName} numberOfLines={1}>{artwork.artistName}</Text>
        </View>

        <TouchableOpacity onPress={() => router.push(`/artwork/${artwork.id}`)}>
          <Text style={styles.artworkTitle} numberOfLines={1}>{artwork.title}</Text>
        </TouchableOpacity>

        <View style={styles.tagsRow}>
          {artwork.tags.slice(0, 2).map((tag, idx) => (
            <View key={idx} style={styles.tagPill}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity 
          style={styles.customizeButton} 
          onPress={handleCustomize}
          activeOpacity={0.8}
        >
          <Ionicons name="sparkles-outline" size={15} color="#141414" />
          <Text style={styles.customizeButtonText}>Customize Gift</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: DesignTokens.colors.paper,
    borderRadius: DesignTokens.radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: DesignTokens.colors.cardBorder,
    ...DesignTokens.shadows.sm,
  },
  cardGrid: {
    width: '100%',
    marginBottom: DesignTokens.spacing.md,
  },
  cardLarge: {
    width: 280,
    marginRight: DesignTokens.spacing.md,
  },
  imageContainer: {
    position: 'relative',
  },
  imageGrid: {
    height: 180,
    width: '100%',
  },
  imageLarge: {
    height: 220,
    width: '100%',
  },
  favBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsContainer: {
    padding: DesignTokens.spacing.md,
    gap: 6,
  },
  artistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  avatar: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  artistName: {
    fontSize: 12,
    color: DesignTokens.colors.text.secondary,
    fontWeight: '500',
  },
  artworkTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: DesignTokens.colors.text.primary,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 4,
    marginVertical: 2,
  },
  tagPill: {
    backgroundColor: DesignTokens.colors.canvas,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 10,
    color: DesignTokens.colors.text.muted,
  },
  customizeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DesignTokens.colors.accent.sand,
    paddingVertical: 8,
    borderRadius: DesignTokens.radius.md,
    gap: 6,
    marginTop: 4,
  },
  customizeButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: DesignTokens.colors.text.primary,
  },

  // Horizontal variant
  horizontalCard: {
    flexDirection: 'row',
    backgroundColor: DesignTokens.colors.paper,
    borderRadius: DesignTokens.radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: DesignTokens.colors.cardBorder,
    marginBottom: DesignTokens.spacing.md,
    height: 110,
  },
  horizontalImage: {
    width: 110,
    height: '100%',
  },
  horizontalContent: {
    flex: 1,
    padding: DesignTokens.spacing.sm,
    justifyContent: 'space-between',
  },
  mediumText: {
    fontSize: 11,
    color: DesignTokens.colors.text.muted,
  },
  miniBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#141414',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  miniBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
});
