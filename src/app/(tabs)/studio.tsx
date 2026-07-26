import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Header } from '../../components/common/Header';
import { ArtworkCard } from '../../components/gallery/ArtworkCard';
import { DesignTokens } from '../../constants/DesignTokens';
import { useStudioStore } from '../../stores/useStudioStore';
import { useCustomizationStore } from '../../stores/useCustomizationStore';
import { artworkRepository } from '../../services/repositories/ArtworkRepository';
import { Artwork } from '../../types/artwork';
import { MOCK_PRODUCTS } from '../../constants/mockData';

export default function StudioScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const savedDesigns = useStudioStore(state => state.savedDesigns);
  const favoriteArtworkIds = useStudioStore(state => state.favoriteArtworkIds);
  const orders = useStudioStore(state => state.orders);
  const loadStudioData = useStudioStore(state => state.loadStudioData);
  const deleteDesign = useStudioStore(state => state.deleteDesign);
  const initCustomization = useCustomizationStore(state => state.initCustomization);

  const [activeSegment, setActiveSegment] = useState<'saved' | 'favorites' | 'orders'>('saved');
  const [favoriteArtworks, setFavoriteArtworks] = useState<Artwork[]>([]);

  useEffect(() => {
    loadStudioData();
  }, []);

  useEffect(() => {
    async function loadFavs() {
      const allArts = await artworkRepository.getAll();
      setFavoriteArtworks(allArts.filter(a => favoriteArtworkIds.includes(a.id)));
    }
    loadFavs();
  }, [favoriteArtworkIds]);

  const handleOpenDesign = (design: any) => {
    const product = MOCK_PRODUCTS.find(p => p.id === design.productId) || MOCK_PRODUCTS[0];
    initCustomization({
      sourceType: design.sourceType,
      uploadedImageUrl: design.uploadedImageUrl,
      product,
      color: design.selectedColor,
      customText: design.customText,
    });
    router.push('/(modals)/customize');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header title={t('studio.headerTitle')} />
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={{ paddingBottom: 110 + insets.bottom }}
        showsVerticalScrollIndicator={false}
      >

        {/* Studio Header Banner */}
        <View style={styles.studioHeader}>
          <Text style={styles.studioTitle}>{t('studio.headerTitle')}</Text>
          <Text style={styles.studioDesc}>{t('studio.headerDesc')}</Text>
        </View>

        {/* Studio Navigation Segment Control */}
        <View style={styles.segmentRow}>
          <TouchableOpacity 
            style={[styles.segmentBtn, activeSegment === 'saved' && styles.activeSegmentBtn]}
            onPress={() => setActiveSegment('saved')}
          >
            <Text style={[styles.segmentText, activeSegment === 'saved' && styles.activeSegmentText]} numberOfLines={1}>
              {t('studio.savedDesigns', { count: savedDesigns.length })}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.segmentBtn, activeSegment === 'favorites' && styles.activeSegmentBtn]}
            onPress={() => setActiveSegment('favorites')}
          >
            <Text style={[styles.segmentText, activeSegment === 'favorites' && styles.activeSegmentText]} numberOfLines={1}>
              {t('studio.favorites', { count: favoriteArtworks.length })}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.segmentBtn, activeSegment === 'orders' && styles.activeSegmentBtn]}
            onPress={() => setActiveSegment('orders')}
          >
            <Text style={[styles.segmentText, activeSegment === 'orders' && styles.activeSegmentText]} numberOfLines={1}>
              {t('studio.orders', { count: orders.length })}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Segment 1: Saved Designs */}
        {activeSegment === 'saved' && (
          <View style={styles.contentSection}>
            {savedDesigns.length === 0 ? (
              <View style={styles.emptyBox}>
                <Ionicons name="folder-open-outline" size={42} color="#9E988F" />
                <Text style={styles.emptyTitle}>{t('studio.emptySavedTitle')}</Text>
                <Text style={styles.emptyDesc}>{t('studio.emptySavedDesc')}</Text>
                <TouchableOpacity 
                  style={styles.emptyBtn} 
                  onPress={() => router.push('/(tabs)/create')}
                >
                  <Text style={styles.emptyBtnText}>{t('studio.startCreating')}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.designGrid}>
                {savedDesigns.map(design => (
                  <View key={design.id} style={styles.designCard}>
                    <Image source={{ uri: design.previewUrl }} style={styles.designPreview} contentFit="cover" />
                    <View style={styles.designInfo}>
                      <Text style={styles.designTitle} numberOfLines={1}>{design.title}</Text>
                      <Text style={styles.designDate}>CAD ${design.priceCad} • {new Date(design.updatedAt).toLocaleDateString()}</Text>

                      <View style={styles.designActions}>
                        <TouchableOpacity 
                          style={styles.editBtn} 
                          onPress={() => handleOpenDesign(design)}
                        >
                          <Ionicons name="pencil" size={12} color="#FFFFFF" />
                          <Text style={styles.editBtnText}>{t('common.edit')}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                          style={styles.deleteBtn} 
                          onPress={() => deleteDesign(design.id)}
                        >
                          <Ionicons name="trash-outline" size={14} color="#C53B3B" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Segment 2: Favorites */}
        {activeSegment === 'favorites' && (
          <View style={styles.contentSection}>
            {favoriteArtworks.length === 0 ? (
              <View style={styles.emptyBox}>
                <Ionicons name="heart-outline" size={42} color="#9E988F" />
                <Text style={styles.emptyTitle}>{t('studio.emptyFavTitle')}</Text>
                <Text style={styles.emptyDesc}>{t('studio.emptyFavDesc')}</Text>
              </View>
            ) : (
              <View style={styles.favGrid}>
                {favoriteArtworks.map(art => (
                  <ArtworkCard key={art.id} artwork={art} variant="grid" />
                ))}
              </View>
            )}
          </View>
        )}

        {/* Segment 3: Orders */}
        {activeSegment === 'orders' && (
          <View style={styles.contentSection}>
            {orders.length === 0 ? (
              <View style={styles.emptyBox}>
                <Ionicons name="bag-outline" size={42} color="#9E988F" />
                <Text style={styles.emptyTitle}>{t('studio.emptyOrdersTitle')}</Text>
                <Text style={styles.emptyDesc}>{t('studio.emptyOrdersDesc')}</Text>
              </View>
            ) : (
              <View style={styles.ordersList}>
                {orders.map(order => (
                  <View key={order.id} style={styles.orderCard}>
                    <View style={styles.orderHeader}>
                      <Text style={styles.orderNumber}>{order.orderNumber}</Text>
                      <View style={styles.statusBadge}>
                        <Text style={styles.statusText}>{order.status.toUpperCase()}</Text>
                      </View>
                    </View>

                    <Text style={styles.orderDate}>
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </Text>

                    {order.items.map((item, idx) => (
                      <View key={idx} style={styles.orderItemRow}>
                        <Image source={{ uri: item.design.previewUrl }} style={styles.orderThumb} />
                        <View style={styles.orderItemDetails}>
                          <Text style={styles.orderItemTitle}>{item.design.title}</Text>
                          <Text style={styles.orderItemQty}>Qty: {item.quantity} × CAD ${item.unitPriceCad}</Text>
                        </View>
                      </View>
                    ))}

                    <View style={styles.orderFooter}>
                      <Text style={styles.orderTotal}>Total: CAD ${order.totalCad}</Text>
                      <Text style={styles.shipAddr} numberOfLines={1}>{order.shippingAddress}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Future Creator Section Placeholder */}
        <View style={styles.futureCreatorCard}>
          <View style={styles.creatorBadge}>
            <Ionicons name="sparkles" size={12} color="#141414" />
            <Text style={styles.creatorBadgeText}>{t('studio.creatorComingSoon')}</Text>
          </View>
          <Text style={styles.futureTitle}>{t('studio.creatorTitle')}</Text>
          <Text style={styles.futureDesc}>{t('studio.creatorDesc')}</Text>
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
  studioHeader: {
    paddingHorizontal: DesignTokens.spacing.lg,
    paddingTop: DesignTokens.spacing.md,
    paddingBottom: DesignTokens.spacing.sm,
  },
  studioTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: DesignTokens.colors.text.primary,
    letterSpacing: -0.4,
  },
  studioDesc: {
    fontSize: 13,
    color: DesignTokens.colors.text.secondary,
    marginTop: 4,
  },
  segmentRow: {
    flexDirection: 'row',
    paddingHorizontal: DesignTokens.spacing.lg,
    marginTop: DesignTokens.spacing.md,
    gap: 6,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: DesignTokens.radius.md,
    backgroundColor: DesignTokens.colors.paper,
    borderWidth: 1,
    borderColor: DesignTokens.colors.cardBorder,
    alignItems: 'center',
  },
  activeSegmentBtn: {
    backgroundColor: '#141414',
    borderColor: '#141414',
  },
  segmentText: {
    fontSize: 11,
    fontWeight: '600',
    color: DesignTokens.colors.text.secondary,
  },
  activeSegmentText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  contentSection: {
    paddingHorizontal: DesignTokens.spacing.lg,
    marginTop: DesignTokens.spacing.lg,
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: DesignTokens.colors.text.primary,
  },
  emptyDesc: {
    fontSize: 13,
    color: DesignTokens.colors.text.secondary,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  emptyBtn: {
    marginTop: 12,
    backgroundColor: '#141414',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: DesignTokens.radius.md,
  },
  emptyBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  designGrid: {
    gap: 12,
  },
  designCard: {
    flexDirection: 'row',
    backgroundColor: DesignTokens.colors.paper,
    borderRadius: DesignTokens.radius.md,
    borderWidth: 1,
    borderColor: DesignTokens.colors.cardBorder,
    overflow: 'hidden',
    height: 100,
    ...DesignTokens.shadows.sm,
  },
  designPreview: {
    width: 100,
    height: '100%',
  },
  designInfo: {
    flex: 1,
    padding: DesignTokens.spacing.sm,
    justifyContent: 'space-between',
  },
  designTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: DesignTokens.colors.text.primary,
  },
  designDate: {
    fontSize: 11,
    color: DesignTokens.colors.text.muted,
  },
  designActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#141414',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  editBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  deleteBtn: {
    padding: 4,
  },
  favGrid: {
    gap: 12,
  },
  ordersList: {
    gap: 14,
  },
  orderCard: {
    backgroundColor: DesignTokens.colors.paper,
    borderRadius: DesignTokens.radius.md,
    borderWidth: 1,
    borderColor: DesignTokens.colors.cardBorder,
    padding: DesignTokens.spacing.md,
    gap: 8,
    ...DesignTokens.shadows.sm,
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  orderNumber: {
    fontSize: 15,
    fontWeight: '700',
    color: DesignTokens.colors.text.primary,
  },
  statusBadge: {
    backgroundColor: '#4E8765',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  orderDate: {
    fontSize: 11,
    color: DesignTokens.colors.text.muted,
  },
  orderItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 4,
  },
  orderThumb: {
    width: 40,
    height: 40,
    borderRadius: 6,
  },
  orderItemDetails: {
    flex: 1,
  },
  orderItemTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: DesignTokens.colors.text.primary,
  },
  orderItemQty: {
    fontSize: 11,
    color: DesignTokens.colors.text.secondary,
  },
  orderFooter: {
    borderTopWidth: 1,
    borderTopColor: DesignTokens.colors.canvas,
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderTotal: {
    fontSize: 14,
    fontWeight: '700',
    color: DesignTokens.colors.text.primary,
  },
  shipAddr: {
    fontSize: 11,
    color: DesignTokens.colors.text.muted,
    maxWidth: 180,
  },
  futureCreatorCard: {
    marginHorizontal: DesignTokens.spacing.lg,
    marginTop: DesignTokens.spacing.xl,
    backgroundColor: '#F7EFE6',
    borderRadius: DesignTokens.radius.lg,
    padding: DesignTokens.spacing.lg,
    borderWidth: 1,
    borderColor: '#C48B47',
    gap: 6,
  },
  creatorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#EBE5D8',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    gap: 4,
  },
  creatorBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#141414',
  },
  futureTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#141414',
    marginTop: 4,
  },
  futureDesc: {
    fontSize: 12,
    color: '#66615B',
    lineHeight: 17,
  },
});
