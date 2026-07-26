import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../../components/common/Header';
import { VisualRecommendationCard } from '../../components/ai/VisualRecommendationCard';
import { DesignTokens } from '../../constants/DesignTokens';
import { giftRepository } from '../../services/repositories/GiftRepository';
import { GiftOccasion, GiftConcept, OccasionType } from '../../types/gift';
import { useAiStore } from '../../stores/useAiStore';

export default function GiftOccasionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const openAiAssistant = useAiStore(state => state.openAiAssistant);

  const [occasion, setOccasion] = useState<GiftOccasion | undefined>(undefined);
  const [concepts, setConcepts] = useState<GiftConcept[]>([]);

  useEffect(() => {
    async function loadOccasionData() {
      if (!id) return;
      const occs = await giftRepository.getOccasions();
      const matchOcc = occs.find(o => o.slug === id || o.id === id);
      setOccasion(matchOcc);

      if (matchOcc) {
        const matchingConcepts = await giftRepository.getConceptsByOccasion(matchOcc.slug as OccasionType);
        const fallbackConcepts = matchingConcepts.length > 0 
          ? matchingConcepts 
          : (await giftRepository.getConcepts()).slice(0, 3);
        setConcepts(fallbackConcepts);
      }
    }
    loadOccasionData();
  }, [id]);

  if (!occasion) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header showBack />
        <View style={styles.centerBox}><Text>Loading gift collection...</Text></View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header showBack title={occasion.title} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* Hero Cover Banner */}
        <View style={styles.heroContainer}>
          <Image source={{ uri: occasion.coverImageUrl }} style={styles.heroImage} contentFit="cover" />
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <View style={styles.tagBadge}>
              <Text style={styles.tagText}>{occasion.recommendedTag}</Text>
            </View>
            <Text style={styles.heroTitle}>{occasion.title}</Text>
            <Text style={styles.heroSubtitle}>{occasion.subtitle}</Text>
          </View>
        </View>

        {/* AI Assistance CTA for Occasion */}
        <View style={styles.aiBox}>
          <Text style={styles.aiTitle}>Need help matching art for {occasion.title}?</Text>
          <Text style={styles.aiDesc}>
            Our AI Concierge can suggest specific artists, color themes, or personalized text ideas for this occasion.
          </Text>
          
          <TouchableOpacity 
            style={styles.aiBtn}
            onPress={() => openAiAssistant({ role: 'concierge', entityTitle: occasion.title })}
          >
            <Ionicons name="sparkles" size={16} color="#FFFFFF" />
            <Text style={styles.aiBtnText}>Ask AI Concierge for Recommendations</Text>
          </TouchableOpacity>
        </View>

        {/* Curated Concepts List */}
        <View style={styles.conceptsSection}>
          <Text style={styles.sectionTitle}>Curated Gift Concepts for {occasion.title}</Text>
          <Text style={styles.sectionSub}>Pre-matched artwork and physical product combinations</Text>

          <View style={styles.conceptsList}>
            {concepts.map(concept => (
              <VisualRecommendationCard key={concept.id} concept={concept} />
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
  heroContainer: {
    height: 200,
    position: 'relative',
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
    padding: DesignTokens.spacing.lg,
    gap: 4,
  },
  tagBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#C48B47',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },
  heroSubtitle: {
    color: '#E0E0E0',
    fontSize: 13,
  },
  aiBox: {
    backgroundColor: '#FAF8F5',
    marginHorizontal: DesignTokens.spacing.lg,
    marginTop: DesignTokens.spacing.lg,
    padding: DesignTokens.spacing.lg,
    borderRadius: DesignTokens.radius.lg,
    borderWidth: 1,
    borderColor: DesignTokens.colors.cardBorder,
    gap: 8,
  },
  aiTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#141414',
  },
  aiDesc: {
    fontSize: 13,
    color: DesignTokens.colors.text.secondary,
    lineHeight: 18,
  },
  aiBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#141414',
    paddingVertical: 12,
    borderRadius: DesignTokens.radius.md,
    gap: 6,
    marginTop: 4,
  },
  aiBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  conceptsSection: {
    paddingHorizontal: DesignTokens.spacing.lg,
    marginTop: DesignTokens.spacing.xl,
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
    marginBottom: 14,
  },
  conceptsList: {
    gap: 12,
  },
});
