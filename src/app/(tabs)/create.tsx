import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Header } from '../../components/common/Header';
import { DesignTokens } from '../../constants/DesignTokens';
import { useCustomizationStore } from '../../stores/useCustomizationStore';
import { useAiStore } from '../../stores/useAiStore';
import { MOCK_ARTWORKS, MOCK_PRODUCTS } from '../../constants/mockData';

export default function CreateScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const initCustomization = useCustomizationStore(state => state.initCustomization);
  const openAiAssistant = useAiStore(state => state.openAiAssistant);

  const handleStartWithArtwork = () => {
    initCustomization({ sourceType: 'artwork', artwork: MOCK_ARTWORKS[0] });
    router.push('/(modals)/customize');
  };

  const handleUploadPhoto = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      const samplePhoto = 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80';
      initCustomization({ sourceType: 'upload', uploadedImageUrl: samplePhoto, product: MOCK_PRODUCTS[0] });
      router.push('/(modals)/customize');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.9,
    });

    if (!pickerResult.canceled && pickerResult.assets?.[0]?.uri) {
      initCustomization({ sourceType: 'upload', uploadedImageUrl: pickerResult.assets[0].uri, product: MOCK_PRODUCTS[0] });
      router.push('/(modals)/customize');
    } else {
      const samplePhoto = 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80';
      initCustomization({ sourceType: 'upload', uploadedImageUrl: samplePhoto, product: MOCK_PRODUCTS[0] });
      router.push('/(modals)/customize');
    }
  };

  const handleAiFinder = () => {
    openAiAssistant({ role: 'assistant', entityTitle: 'Creation Launcher' });
  };

  const handleStartWithProduct = () => {
    initCustomization({ sourceType: 'artwork', product: MOCK_PRODUCTS[1] });
    router.push('/(modals)/customize');
  };

  const handleContinueDraft = () => {
    router.push('/(tabs)/studio');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header title={t('create.title')} />
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.headerBox}>
          <Text style={styles.mainTitle}>{t('create.title')}</Text>
          <Text style={styles.subtitle}>{t('create.subtitle')}</Text>
        </View>

        <View style={styles.launcherList}>

          {/* Option 1: Start with Artwork */}
          <TouchableOpacity style={styles.card} onPress={handleStartWithArtwork} activeOpacity={0.85}>
            <View style={[styles.iconBox, { backgroundColor: '#F7EFE6' }]}>
              <Ionicons name="images" size={24} color="#C48B47" />
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>{t('create.option1Title')}</Text>
              <Text style={styles.cardDesc}>{t('create.option1Desc')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9E988F" />
          </TouchableOpacity>

          {/* Option 2: Upload My Own Image */}
          <TouchableOpacity style={styles.card} onPress={handleUploadPhoto} activeOpacity={0.85}>
            <View style={[styles.iconBox, { backgroundColor: '#EBE5D8' }]}>
              <Ionicons name="camera" size={24} color="#141414" />
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>{t('create.option2Title')}</Text>
              <Text style={styles.cardDesc}>{t('create.option2Desc')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9E988F" />
          </TouchableOpacity>

          {/* Option 3: Find a Gift with AI */}
          <TouchableOpacity style={[styles.card, styles.aiCard]} onPress={handleAiFinder} activeOpacity={0.85}>
            <View style={[styles.iconBox, { backgroundColor: '#141414' }]}>
              <Ionicons name="sparkles" size={22} color="#FFFFFF" />
            </View>
            <View style={styles.cardInfo}>
              <Text style={[styles.cardTitle, { color: '#FFFFFF' }]}>{t('create.option3Title')}</Text>
              <Text style={[styles.cardDesc, { color: '#D4CFC4' }]}>{t('create.option3Desc')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#C48B47" />
          </TouchableOpacity>

          {/* Option 4: Start with a Product */}
          <TouchableOpacity style={styles.card} onPress={handleStartWithProduct} activeOpacity={0.85}>
            <View style={[styles.iconBox, { backgroundColor: '#EBF3ED' }]}>
              <Ionicons name="gift" size={24} color="#4E8765" />
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>{t('create.option4Title')}</Text>
              <Text style={styles.cardDesc}>{t('create.option4Desc')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9E988F" />
          </TouchableOpacity>

          {/* Option 5: Continue Saved Draft */}
          <TouchableOpacity style={styles.card} onPress={handleContinueDraft} activeOpacity={0.85}>
            <View style={[styles.iconBox, { backgroundColor: '#F0EFF4' }]}>
              <Ionicons name="folder-open" size={24} color="#3B75C5" />
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>{t('create.option5Title')}</Text>
              <Text style={styles.cardDesc}>{t('create.option5Desc')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9E988F" />
          </TouchableOpacity>

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
  headerBox: {
    paddingHorizontal: DesignTokens.spacing.lg,
    paddingTop: DesignTokens.spacing.lg,
    paddingBottom: DesignTokens.spacing.md,
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: DesignTokens.colors.text.primary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: DesignTokens.colors.text.secondary,
    marginTop: 4,
  },
  launcherList: {
    paddingHorizontal: DesignTokens.spacing.lg,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DesignTokens.colors.paper,
    padding: DesignTokens.spacing.md,
    borderRadius: DesignTokens.radius.lg,
    borderWidth: 1,
    borderColor: DesignTokens.colors.cardBorder,
    gap: 14,
    ...DesignTokens.shadows.sm,
  },
  aiCard: {
    backgroundColor: '#141414',
    borderColor: '#C48B47',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: {
    flex: 1,
    gap: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: DesignTokens.colors.text.primary,
  },
  cardDesc: {
    fontSize: 12,
    color: DesignTokens.colors.text.secondary,
  },
});
