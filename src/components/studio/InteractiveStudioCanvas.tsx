import React from 'react';
import { View, StyleSheet, Text, ImageStyle } from 'react-native';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import { DesignTokens } from '../../constants/DesignTokens';
import { useCustomizationStore } from '../../stores/useCustomizationStore';

export const InteractiveStudioCanvas: React.FC = () => {
  const { t } = useTranslation();
  const selectedProduct = useCustomizationStore(state => state.selectedProduct);
  const selectedColor = useCustomizationStore(state => state.selectedColor);
  const selectedArtwork = useCustomizationStore(state => state.selectedArtwork);
  const uploadedImageUrl = useCustomizationStore(state => state.uploadedImageUrl);
  const transform = useCustomizationStore(state => state.transform);
  const customText = useCustomizationStore(state => state.customText);
  const isEditMode = useCustomizationStore(state => state.isEditMode);

  const displayArtUrl = uploadedImageUrl || selectedArtwork?.imageUrl;

  const artworkTransformStyle: ImageStyle = {
    transform: [
      { scale: transform.scale },
      { rotate: `${transform.rotationDeg}deg` },
      { scaleX: transform.mirrorX ? -1 : 1 },
    ],
  };

  return (
    <View style={styles.canvasContainer}>
      {/* Product Canvas Background with Color Overlay */}
      <View style={[styles.productBase, { backgroundColor: selectedColor.hex }]}>
        <Image 
          source={{ uri: selectedProduct.mockupImageUrl }} 
          style={styles.productImage}
          contentFit="contain"
        />

        {/* Dynamic Print Overlay Bounds */}
        <View style={styles.printAreaContainer}>
          {displayArtUrl ? (
            <Image 
              source={{ uri: displayArtUrl }} 
              style={[styles.artworkOverlay, artworkTransformStyle]}
              contentFit="contain"
            />
          ) : (
            <View style={styles.placeholderBox}>
              <Text style={styles.placeholderText}>Select Artwork or Upload Photo</Text>
            </View>
          )}

          {/* Optional Inscription Text Layer */}
          {customText.length > 0 && (
            <View style={styles.textLayer}>
              <Text style={styles.customInscriptionText}>{customText}</Text>
            </View>
          )}

          {/* Edit Mode Guidelines */}
          {isEditMode && (
            <View style={styles.editGuideBorder}>
              <Text style={styles.editGuideTag}>{t('studioModal.printBounds')}</Text>
              <View style={[styles.lBracket, styles.topLeft]} />
              <View style={[styles.lBracket, styles.topRight]} />
              <View style={[styles.lBracket, styles.bottomLeft]} />
              <View style={[styles.lBracket, styles.bottomRight]} />
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  canvasContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: DesignTokens.spacing.md,
  },
  productBase: {
    width: '90%',
    height: 320,
    borderRadius: DesignTokens.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    ...DesignTokens.shadows.md,
  },
  productImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  printAreaContainer: {
    width: '60%',
    height: '60%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  artworkOverlay: {
    width: '100%',
    height: '100%',
  },
  placeholderBox: {
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 8,
  },
  placeholderText: {
    fontSize: 12,
    color: '#66615B',
    textAlign: 'center',
  },
  textLayer: {
    position: 'absolute',
    bottom: 8,
    backgroundColor: 'rgba(20, 20, 20, 0.65)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  customInscriptionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  editGuideBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 1,
    borderColor: '#C48B47',
    borderStyle: 'dashed',
  },
  editGuideTag: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: '#141414',
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '700',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 2,
  },
  lBracket: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderColor: '#C48B47',
  },
  topLeft: {
    top: -2,
    left: -2,
    borderTopWidth: 2,
    borderLeftWidth: 2,
  },
  topRight: {
    top: -2,
    right: -2,
    borderTopWidth: 2,
    borderRightWidth: 2,
  },
  bottomLeft: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
  },
  bottomRight: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 2,
    borderRightWidth: 2,
  },
});
