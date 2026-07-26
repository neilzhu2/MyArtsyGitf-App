import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { DesignTokens } from '../../constants/DesignTokens';
import { useAiStore } from '../../stores/useAiStore';

interface FloatingAIButtonProps {
  label?: string;
  context?: { role?: string; entityTitle?: string; entityId?: string };
}

export const FloatingAIButton: React.FC<FloatingAIButtonProps> = ({ 
  label, 
  context 
}) => {
  const { t } = useTranslation();
  const openAiAssistant = useAiStore(state => state.openAiAssistant);
  
  const displayLabel = label || t('gallery.askCurator');

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={() => openAiAssistant(context)}
      activeOpacity={0.85}
    >
      <View style={styles.iconContainer}>
        <Ionicons name="sparkles" size={16} color="#FFFFFF" />
      </View>
      <Text style={styles.label}>{displayLabel}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 16,
    bottom: 14, // Expo Router Tab Screen bottom: 0 is at the top edge of the tab bar. 14pt anchors it cleanly right above the tab bar!
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#141414',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: DesignTokens.radius.round,
    borderWidth: 1,
    borderColor: '#C48B47',
    gap: 8,
    ...DesignTokens.shadows.md,
    zIndex: 999,
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#C48B47',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
});
