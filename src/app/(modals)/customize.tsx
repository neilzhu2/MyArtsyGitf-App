import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Alert 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { DesignTokens } from '../../constants/DesignTokens';
import { useCustomizationStore } from '../../stores/useCustomizationStore';
import { useStudioStore } from '../../stores/useStudioStore';
import { InteractiveStudioCanvas } from '../../components/studio/InteractiveStudioCanvas';
import { MOCK_PRODUCTS } from '../../constants/mockData';

export default function CustomizationStudioModal() {
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const selectedProduct = useCustomizationStore(state => state.selectedProduct);
  const selectedColor = useCustomizationStore(state => state.selectedColor);
  const transform = useCustomizationStore(state => state.transform);
  const customText = useCustomizationStore(state => state.customText);
  const isEditMode = useCustomizationStore(state => state.isEditMode);
  
  const setProduct = useCustomizationStore(state => state.setProduct);
  const setColor = useCustomizationStore(state => state.setColor);
  const updateTransform = useCustomizationStore(state => state.updateTransform);
  const resetTransform = useCustomizationStore(state => state.resetTransform);
  const setCustomText = useCustomizationStore(state => state.setCustomText);
  const setEditMode = useCustomizationStore(state => state.setEditMode);
  const exportAsDesign = useCustomizationStore(state => state.exportAsDesign);

  const saveDesign = useStudioStore(state => state.saveDesign);
  const addToCart = useStudioStore(state => state.addToCart);

  const [activeTab, setActiveTab] = useState<'product' | 'art' | 'text'>('product');
  const [activeSide, setActiveSide] = useState<'front' | 'back'>('front');

  const topInsetPadding = Math.max(insets.top, 16);

  const handleSaveToStudio = async () => {
    const design = exportAsDesign();
    await saveDesign(design);
    Alert.alert(t('studioModal.savedTitle'), t('studioModal.savedDesc'), [
      { text: t('studioModal.viewStudio'), onPress: () => { router.back(); router.push('/(tabs)/studio'); } },
      { text: t('studioModal.keepEditing'), style: 'cancel' }
    ]);
  };

  const handleAddToCart = () => {
    const design = exportAsDesign();
    addToCart(design, 1);
    router.push('/(modals)/cart');
  };

  return (
    <View style={styles.outerWrapper}>
      {/* Studio Header Bar - Clears iOS Status Bar & Dynamic Island */}
      <View style={[styles.headerBar, { paddingTop: topInsetPadding + 6 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn} activeOpacity={0.7}>
          <Ionicons name="close" size={24} color="#141414" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{t('studioModal.headerTitle')}</Text>

        <TouchableOpacity 
          style={[styles.modeToggle, isEditMode && styles.activeModeToggle]}
          onPress={() => setEditMode(!isEditMode)}
          activeOpacity={0.8}
        >
          <Text style={[styles.modeToggleText, isEditMode && styles.activeModeToggleText]}>
            {isEditMode ? t('studioModal.editMode') : t('studioModal.preview')}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Status & Side Selector Sub-header */}
        <View style={styles.subHeaderRow}>
          {/* Side Selector (Front / Back / Site 1 / Site 2) */}
          <View style={styles.sideSelector}>
            <TouchableOpacity 
              style={[styles.sideBtn, activeSide === 'front' && styles.activeSideBtn]}
              onPress={() => setActiveSide('front')}
            >
              <Text style={[styles.sideBtnText, activeSide === 'front' && styles.activeSideBtnText]}>
                Side 1 (Front)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.sideBtn, activeSide === 'back' && styles.activeSideBtn]}
              onPress={() => setActiveSide('back')}
            >
              <Text style={[styles.sideBtnText, activeSide === 'back' && styles.activeSideBtnText]}>
                Side 2 (Back)
              </Text>
            </TouchableOpacity>
          </View>

          {/* Print Quality Indicator */}
          <View style={styles.qualityBadge}>
            <Ionicons name="checkmark-circle" size={14} color="#4E8765" />
            <Text style={styles.qualityBadgeText}>Print Quality: Excellent</Text>
          </View>
        </View>

        {/* Central Live Interactive Canvas */}
        <InteractiveStudioCanvas />

        {/* Action Toolbar Tabs */}
        <View style={styles.tabRow}>
          <TouchableOpacity 
            style={[styles.toolTab, activeTab === 'product' && styles.activeToolTab]}
            onPress={() => setActiveTab('product')}
          >
            <Ionicons name="cube-outline" size={16} color={activeTab === 'product' ? '#FFFFFF' : '#141414'} />
            <Text style={[styles.toolTabText, activeTab === 'product' && styles.activeToolTabText]}>
              {t('studioModal.productAndColor')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.toolTab, activeTab === 'art' && styles.activeToolTab]}
            onPress={() => setActiveTab('art')}
          >
            <Ionicons name="move" size={16} color={activeTab === 'art' ? '#FFFFFF' : '#141414'} />
            <Text style={[styles.toolTabText, activeTab === 'art' && styles.activeToolTabText]}>
              {t('studioModal.scaleAndPosition')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.toolTab, activeTab === 'text' && styles.activeToolTab]}
            onPress={() => setActiveTab('text')}
          >
            <Ionicons name="text-outline" size={16} color={activeTab === 'text' ? '#FFFFFF' : '#141414'} />
            <Text style={[styles.toolTabText, activeTab === 'text' && styles.activeToolTabText]}>
              {t('studioModal.personalize')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab 1: Product Type & Color Palette Selector */}
        {activeTab === 'product' && (
          <View style={styles.panelBox}>
            <Text style={styles.panelTitle}>{t('studioModal.productType')}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
              {MOCK_PRODUCTS.map(p => (
                <TouchableOpacity 
                  key={p.id}
                  style={[styles.productChip, selectedProduct.id === p.id && styles.activeProductChip]}
                  onPress={() => setProduct(p)}
                >
                  <Text style={[styles.productChipText, selectedProduct.id === p.id && styles.activeProductChipText]}>
                    {p.title} (${p.basePriceCad})
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={[styles.panelTitle, { marginTop: 14 }]}>{t('studioModal.colorVariant')}</Text>
            <View style={styles.colorsGrid}>
              {selectedProduct.availableColors.map((colorItem, idx) => (
                <TouchableOpacity 
                  key={idx}
                  style={[
                    styles.colorOption,
                    { backgroundColor: colorItem.hex },
                    selectedColor.name === colorItem.name && styles.selectedColorOption
                  ]}
                  onPress={() => setColor(colorItem)}
                >
                  {selectedColor.name === colorItem.name && (
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.colorNameLabel}>{t('studioModal.selectedColor', { name: selectedColor.name })}</Text>
          </View>
        )}

        {/* Tab 2: Scale, Move & Rotation Controls */}
        {activeTab === 'art' && (
          <View style={styles.panelBox}>
            <View style={styles.panelHeaderRow}>
              <Text style={styles.panelTitle}>{t('studioModal.artworkAdjustments')}</Text>
              <TouchableOpacity onPress={resetTransform}>
                <Text style={styles.resetText}>{t('studioModal.resetTransform')}</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sliderLabel}>{t('studioModal.scaleZoom', { val: transform.scale.toFixed(2) })}</Text>
            <View style={styles.controlBtnRow}>
              <TouchableOpacity 
                style={styles.adjustBtn} 
                onPress={() => updateTransform({ scale: Math.max(0.5, transform.scale - 0.1) })}
              >
                <Ionicons name="remove" size={18} color="#141414" />
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.adjustBtn} 
                onPress={() => updateTransform({ scale: Math.min(2.5, transform.scale + 0.1) })}
              >
                <Ionicons name="add" size={18} color="#141414" />
              </TouchableOpacity>
            </View>

            <Text style={styles.sliderLabel}>{t('studioModal.rotationAngle', { val: transform.rotationDeg })}</Text>
            <View style={styles.controlBtnRow}>
              <TouchableOpacity 
                style={styles.adjustBtn} 
                onPress={() => updateTransform({ rotationDeg: (transform.rotationDeg - 45 + 360) % 360 })}
              >
                <Ionicons name="refresh-outline" size={16} color="#141414" />
                <Text style={styles.btnLabelText}>-45°</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.adjustBtn} 
                onPress={() => updateTransform({ rotationDeg: (transform.rotationDeg + 45) % 360 })}
              >
                <Ionicons name="refresh-outline" size={16} color="#141414" />
                <Text style={styles.btnLabelText}>+45°</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.adjustBtn, transform.mirrorX && styles.activeAdjustBtn]} 
                onPress={() => updateTransform({ mirrorX: !transform.mirrorX })}
              >
                <Ionicons name="swap-horizontal" size={16} color={transform.mirrorX ? '#FFFFFF' : '#141414'} />
                <Text style={[styles.btnLabelText, transform.mirrorX && styles.activeBtnLabelText]}>
                  {t('studioModal.mirror')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Tab 3: Personalization Text */}
        {activeTab === 'text' && (
          <View style={styles.panelBox}>
            <Text style={styles.panelTitle}>{t('studioModal.addText')}</Text>
            <TextInput 
              style={styles.textInput}
              placeholder={t('studioModal.textPlaceholder')}
              placeholderTextColor="#9E988F"
              value={customText}
              onChangeText={setCustomText}
              maxLength={40}
            />
            <Text style={styles.charCount}>{customText.length}/40</Text>
          </View>
        )}

      </ScrollView>

      {/* Studio Bottom Bar */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 14) }]}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>{t('studioModal.estimatedPrice')}</Text>
          <Text style={styles.priceValue}>CAD ${selectedProduct.basePriceCad}</Text>
        </View>

        <View style={styles.bottomActions}>
          <TouchableOpacity style={styles.saveDraftBtn} onPress={handleSaveToStudio}>
            <Ionicons name="bookmark-outline" size={16} color="#141414" />
            <Text style={styles.saveDraftBtnText}>{t('common.saveDraft')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.addToCartBtn} onPress={handleAddToCart}>
            <Ionicons name="bag-handle" size={16} color="#FFFFFF" />
            <Text style={styles.addToCartBtnText}>{t('common.addToCart')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerWrapper: {
    flex: 1,
    backgroundColor: DesignTokens.colors.canvas,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: DesignTokens.spacing.lg,
    paddingBottom: DesignTokens.spacing.sm,
    backgroundColor: DesignTokens.colors.canvas,
    borderBottomWidth: 1,
    borderBottomColor: DesignTokens.colors.cardBorder,
  },
  iconBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: DesignTokens.colors.text.primary,
  },
  modeToggle: {
    backgroundColor: DesignTokens.colors.paper,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: DesignTokens.radius.round,
    borderWidth: 1,
    borderColor: DesignTokens.colors.cardBorder,
  },
  activeModeToggle: {
    backgroundColor: '#141414',
    borderColor: '#141414',
  },
  modeToggleText: {
    fontSize: 11,
    fontWeight: '700',
    color: DesignTokens.colors.text.primary,
  },
  activeModeToggleText: {
    color: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  subHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: DesignTokens.spacing.lg,
    paddingTop: DesignTokens.spacing.sm,
  },
  sideSelector: {
    flexDirection: 'row',
    backgroundColor: DesignTokens.colors.paper,
    borderRadius: DesignTokens.radius.round,
    padding: 2,
    borderWidth: 1,
    borderColor: DesignTokens.colors.cardBorder,
  },
  sideBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: DesignTokens.radius.round,
  },
  activeSideBtn: {
    backgroundColor: '#141414',
  },
  sideBtnText: {
    fontSize: 10,
    fontWeight: '600',
    color: DesignTokens.colors.text.secondary,
  },
  activeSideBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  qualityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EBF3ED',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  qualityBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4E8765',
  },
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: DesignTokens.spacing.lg,
    gap: 8,
    marginVertical: DesignTokens.spacing.sm,
  },
  toolTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: DesignTokens.radius.md,
    backgroundColor: DesignTokens.colors.paper,
    borderWidth: 1,
    borderColor: DesignTokens.colors.cardBorder,
    gap: 4,
  },
  activeToolTab: {
    backgroundColor: '#141414',
    borderColor: '#141414',
  },
  toolTabText: {
    fontSize: 11,
    fontWeight: '600',
    color: DesignTokens.colors.text.primary,
  },
  activeToolTabText: {
    color: '#FFFFFF',
  },
  panelBox: {
    backgroundColor: DesignTokens.colors.paper,
    marginHorizontal: DesignTokens.spacing.lg,
    padding: DesignTokens.spacing.lg,
    borderRadius: DesignTokens.radius.lg,
    borderWidth: 1,
    borderColor: DesignTokens.colors.cardBorder,
    marginBottom: 100,
  },
  panelHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  panelTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: DesignTokens.colors.text.primary,
    marginBottom: 8,
  },
  resetText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#C53B3B',
  },
  horizontalScroll: {
    gap: 8,
  },
  productChip: {
    backgroundColor: DesignTokens.colors.canvas,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: DesignTokens.radius.round,
    borderWidth: 1,
    borderColor: DesignTokens.colors.cardBorder,
  },
  activeProductChip: {
    backgroundColor: '#C48B47',
    borderColor: '#C48B47',
  },
  productChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: DesignTokens.colors.text.primary,
  },
  activeProductChipText: {
    color: '#FFFFFF',
  },
  colorsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 6,
  },
  colorOption: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedColorOption: {
    borderWidth: 3,
    borderColor: '#141414',
  },
  colorNameLabel: {
    fontSize: 12,
    color: DesignTokens.colors.text.secondary,
    marginTop: 4,
  },
  sliderLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: DesignTokens.colors.text.secondary,
    marginTop: 12,
    marginBottom: 6,
  },
  controlBtnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  adjustBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DesignTokens.colors.canvas,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: DesignTokens.radius.md,
    borderWidth: 1,
    borderColor: DesignTokens.colors.cardBorder,
    gap: 4,
  },
  activeAdjustBtn: {
    backgroundColor: '#141414',
  },
  btnLabelText: {
    fontSize: 12,
    fontWeight: '600',
    color: DesignTokens.colors.text.primary,
  },
  activeBtnLabelText: {
    color: '#FFFFFF',
  },
  textInput: {
    backgroundColor: DesignTokens.colors.canvas,
    borderWidth: 1,
    borderColor: DesignTokens.colors.cardBorder,
    borderRadius: DesignTokens.radius.md,
    padding: DesignTokens.spacing.md,
    fontSize: 14,
    color: DesignTokens.colors.text.primary,
  },
  charCount: {
    fontSize: 11,
    color: DesignTokens.colors.text.muted,
    textAlign: 'right',
    marginTop: 4,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAF8F5',
    paddingHorizontal: DesignTokens.spacing.lg,
    paddingTop: DesignTokens.spacing.md,
    borderTopWidth: 1,
    borderTopColor: DesignTokens.colors.cardBorder,
  },
  priceContainer: {
    gap: 2,
  },
  priceLabel: {
    fontSize: 11,
    color: DesignTokens.colors.text.muted,
  },
  priceValue: {
    fontSize: 18,
    fontWeight: '700',
    color: DesignTokens.colors.text.primary,
  },
  bottomActions: {
    flexDirection: 'row',
    gap: 8,
  },
  saveDraftBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DesignTokens.colors.paper,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: DesignTokens.radius.md,
    borderWidth: 1,
    borderColor: DesignTokens.colors.cardBorder,
    gap: 6,
  },
  saveDraftBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#141414',
  },
  addToCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#141414',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: DesignTokens.radius.md,
    gap: 6,
  },
  addToCartBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
