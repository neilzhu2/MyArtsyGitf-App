import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Header } from '../../components/common/Header';
import { OccasionCard } from '../../components/gifts/OccasionCard';
import { ProductCard } from '../../components/products/ProductCard';
import { FloatingAIButton } from '../../components/common/FloatingAIButton';
import { DesignTokens } from '../../constants/DesignTokens';
import { giftRepository } from '../../services/repositories/GiftRepository';
import { productRepository } from '../../services/repositories/ProductRepository';
import { GiftOccasion } from '../../types/gift';
import { Product } from '../../types/product';
import { useAiStore } from '../../stores/useAiStore';

export default function GiftsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const openAiAssistant = useAiStore(state => state.openAiAssistant);
  const [occasions, setOccasions] = useState<GiftOccasion[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeBudgetFilter, setActiveBudgetFilter] = useState<number | null>(null);

  useEffect(() => {
    async function loadGifts() {
      const occs = await giftRepository.getOccasions();
      const prods = await productRepository.getAll();
      setOccasions(occs);
      setProducts(prods);
    }
    loadGifts();
  }, []);

  const filteredProducts = activeBudgetFilter 
    ? products.filter(p => p.basePriceCad <= activeBudgetFilter)
    : products;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header />
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={{ paddingBottom: 90 }}
        showsVerticalScrollIndicator={false}
      >

        {/* AI Concierge Intent Banner */}
        <View style={styles.aiBanner}>
          <View style={styles.aiBannerHeader}>
            <View style={styles.sparkleBadge}>
              <Ionicons name="sparkles" size={16} color="#FFFFFF" />
            </View>
            <Text style={styles.aiBannerTitle}>{t('gifts.aiTitle')}</Text>
          </View>

          <Text style={styles.aiBannerText}>{t('gifts.aiDesc')}</Text>

          <TouchableOpacity 
            style={styles.aiBannerBtn}
            onPress={() => openAiAssistant({ role: 'concierge', entityTitle: 'Gifts Finder' })}
            activeOpacity={0.85}
          >
            <Ionicons name="chatbubbles-outline" size={16} color="#141414" />
            <Text style={styles.aiBannerBtnText}>{t('gifts.findGiftAi')}</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Budget Filters */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('gifts.shopBudget')}</Text>
        </View>
        <View style={styles.budgetRow}>
          <TouchableOpacity 
            style={[styles.budgetChip, activeBudgetFilter === 50 && styles.activeBudgetChip]}
            onPress={() => setActiveBudgetFilter(activeBudgetFilter === 50 ? null : 50)}
          >
            <Text style={[styles.budgetChipText, activeBudgetFilter === 50 && styles.activeBudgetChipText]}>
              {t('gifts.under50')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.budgetChip, activeBudgetFilter === 100 && styles.activeBudgetChip]}
            onPress={() => setActiveBudgetFilter(activeBudgetFilter === 100 ? null : 100)}
          >
            <Text style={[styles.budgetChipText, activeBudgetFilter === 100 && styles.activeBudgetChipText]}>
              {t('gifts.under100')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Occasions List */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('gifts.browseOccasion')}</Text>
          <Text style={styles.sectionSubtitle}>{t('gifts.browseOccasionSub')}</Text>
        </View>

        <View style={styles.occasionsList}>
          {occasions.map(occ => (
            <OccasionCard key={occ.id} occasion={occ} />
          ))}
        </View>

        {/* Physical Gift Product Catalog */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('gifts.productCatalog')}</Text>
          <Text style={styles.sectionSubtitle}>{t('gifts.productCatalogSub')}</Text>
        </View>

        <View style={styles.productList}>
          {filteredProducts.map(prod => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </View>
      </ScrollView>

      <FloatingAIButton 
        label={t('gifts.findRightGift')} 
        context={{ role: 'concierge', entityTitle: 'Gifts Finder' }} 
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
  aiBanner: {
    marginHorizontal: DesignTokens.spacing.lg,
    marginTop: DesignTokens.spacing.md,
    backgroundColor: '#141414',
    padding: DesignTokens.spacing.lg,
    borderRadius: DesignTokens.radius.lg,
    borderWidth: 1,
    borderColor: '#C48B47',
    gap: 8,
    ...DesignTokens.shadows.md,
  },
  aiBannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sparkleBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#C48B47',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiBannerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  aiBannerText: {
    fontSize: 13,
    color: '#D4CFC4',
    lineHeight: 18,
  },
  aiBannerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAF8F5',
    paddingVertical: 10,
    borderRadius: DesignTokens.radius.md,
    gap: 6,
    marginTop: 6,
  },
  aiBannerBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#141414',
  },
  sectionHeader: {
    paddingHorizontal: DesignTokens.spacing.lg,
    marginTop: DesignTokens.spacing.xl,
    marginBottom: DesignTokens.spacing.xs,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: DesignTokens.colors.text.primary,
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: DesignTokens.colors.text.secondary,
    marginTop: 2,
  },
  budgetRow: {
    flexDirection: 'row',
    paddingHorizontal: DesignTokens.spacing.lg,
    gap: 10,
    marginTop: 8,
  },
  budgetChip: {
    backgroundColor: DesignTokens.colors.paper,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: DesignTokens.radius.round,
    borderWidth: 1,
    borderColor: DesignTokens.colors.cardBorder,
  },
  activeBudgetChip: {
    backgroundColor: '#C48B47',
    borderColor: '#C48B47',
  },
  budgetChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: DesignTokens.colors.text.primary,
  },
  activeBudgetChipText: {
    color: '#FFFFFF',
  },
  occasionsList: {
    paddingHorizontal: DesignTokens.spacing.lg,
    marginTop: DesignTokens.spacing.md,
  },
  productList: {
    paddingHorizontal: DesignTokens.spacing.lg,
    marginTop: DesignTokens.spacing.md,
  },
});
