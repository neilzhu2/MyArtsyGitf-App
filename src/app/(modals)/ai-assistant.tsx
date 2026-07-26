import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  ActivityIndicator,
  Keyboard,
  Platform
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { DesignTokens } from '../../constants/DesignTokens';
import { useAiStore } from '../../stores/useAiStore';
import { VisualRecommendationCard } from '../../components/ai/VisualRecommendationCard';

export default function AIAssistantModal() {
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);

  const messages = useAiStore(state => state.messages);
  const isThinking = useAiStore(state => state.isThinking);
  const sendMessage = useAiStore(state => state.sendMessage);
  const closeAiAssistant = useAiStore(state => state.closeAiAssistant);

  const [inputText, setInputText] = useState('');
  const [keyboardPad, setKeyboardPad] = useState(0);

  const quickPrompts = [
    t('aiModal.quickPrompt1'),
    t('aiModal.quickPrompt2'),
    t('aiModal.quickPrompt3'),
    t('aiModal.quickPrompt4'),
  ];

  // 1. Listen for real keyboard frame (Memoria LEARNINGS.md Rule 1)
  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      e => setKeyboardPad(e.endCoordinates.height)
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardPad(0)
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // 2. Auto-scroll to end when messages or keyboard frame updates
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages, isThinking, keyboardPad]);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;
    sendMessage(query);
    setInputText('');
  };

  return (
    <View style={styles.outerWrapper}>
      {/* Header Bar - Fixed compact padding (No double top padding gap) */}
      <View style={styles.headerBar}>
        <View style={styles.titleContainer}>
          <View style={styles.sparkleIcon}>
            <Ionicons name="sparkles" size={16} color="#FFFFFF" />
          </View>
          <View>
            <View style={styles.titleStatusRow}>
              <Text style={styles.headerTitle}>{t('aiModal.title')}</Text>
              <View style={styles.onlineDot} />
            </View>
            <Text style={styles.headerSubtitle}>{t('aiModal.subtitle')}</Text>
          </View>
        </View>

        <TouchableOpacity onPress={() => { closeAiAssistant(); router.back(); }} style={styles.closeBtn} activeOpacity={0.7}>
          <Ionicons name="close" size={22} color="#141414" />
        </TouchableOpacity>
      </View>

      {/* Messages Scroll Area - Modal-Aware Keyboard Insets */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer} 
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        automaticallyAdjustKeyboardInsets
        keyboardShouldPersistTaps="handled"
      >
        {messages.map(msg => (
          <View 
            key={msg.id} 
            style={[styles.msgRow, msg.sender === 'user' ? styles.userRow : styles.assistantRow]}
          >
            {msg.sender === 'assistant' && (
              <View style={styles.aiAvatar}>
                <Ionicons name="sparkles" size={12} color="#FFFFFF" />
              </View>
            )}

            <View style={[styles.bubble, msg.sender === 'user' ? styles.userBubble : styles.assistantBubble]}>
              <Text style={[styles.bubbleText, msg.sender === 'user' && styles.userBubbleText]}>
                {msg.text}
              </Text>

              {/* Render Visual Recommendation Cards if provided */}
              {msg.recommendations && msg.recommendations.length > 0 && (
                <View style={styles.recommendationsList}>
                  {msg.recommendations.map(concept => (
                    <VisualRecommendationCard key={concept.id} concept={concept} />
                  ))}
                </View>
              )}
            </View>
          </View>
        ))}

        {isThinking && (
          <View style={styles.thinkingBox}>
            <ActivityIndicator size="small" color="#C48B47" />
            <Text style={styles.thinkingText}>{t('aiModal.thinking')}</Text>
          </View>
        )}
      </ScrollView>

      {/* Quick Prompt Chips (hidden when keyboard is open to save space) */}
      {keyboardPad === 0 && (
        <View style={styles.quickPromptsContainer}>
          <Text style={styles.quickPromptHeader}>{t('aiModal.demoQueries')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickPromptsScroll}>
            {quickPrompts.map((p, idx) => (
              <TouchableOpacity 
                key={idx} 
                style={styles.promptChip} 
                onPress={() => handleSend(p)}
                activeOpacity={0.8}
              >
                <Text style={styles.promptChipText}>{p}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Input Bar - Dynamically lifts above system keyboard */}
      <View style={[
        styles.inputBar, 
        { paddingBottom: keyboardPad > 0 ? keyboardPad : Math.max(insets.bottom, 12) }
      ]}>
        <TextInput 
          style={styles.input}
          placeholder={t('aiModal.placeholder')}
          placeholderTextColor="#9E988F"
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={() => handleSend()}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={() => handleSend()} activeOpacity={0.85}>
          <Ionicons name="arrow-up" size={18} color="#FFFFFF" />
        </TouchableOpacity>
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: DesignTokens.colors.cardBorder,
    backgroundColor: '#FAF8F5',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sparkleIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#C48B47',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#141414',
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4E8765',
  },
  headerSubtitle: {
    fontSize: 11,
    color: DesignTokens.colors.text.secondary,
  },
  closeBtn: {
    padding: 4,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: DesignTokens.spacing.lg,
    gap: 14,
  },
  msgRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  assistantRow: {
    justifyContent: 'flex-start',
  },
  aiAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#141414',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  bubble: {
    maxWidth: '88%',
    padding: DesignTokens.spacing.md,
    borderRadius: DesignTokens.radius.md,
  },
  assistantBubble: {
    backgroundColor: DesignTokens.colors.paper,
    borderWidth: 1,
    borderColor: DesignTokens.colors.cardBorder,
  },
  userBubble: {
    backgroundColor: '#141414',
  },
  bubbleText: {
    fontSize: 14,
    color: DesignTokens.colors.text.primary,
    lineHeight: 20,
  },
  userBubbleText: {
    color: '#FFFFFF',
  },
  recommendationsList: {
    marginTop: 8,
    gap: 8,
  },
  thinkingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 8,
    paddingHorizontal: 8,
  },
  thinkingText: {
    fontSize: 12,
    fontStyle: 'italic',
    color: DesignTokens.colors.text.secondary,
  },
  quickPromptsContainer: {
    borderTopWidth: 1,
    borderTopColor: DesignTokens.colors.cardBorder,
    paddingTop: 8,
    backgroundColor: '#FAF8F5',
  },
  quickPromptHeader: {
    fontSize: 10,
    fontWeight: '700',
    color: DesignTokens.colors.text.muted,
    paddingHorizontal: DesignTokens.spacing.lg,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  quickPromptsScroll: {
    paddingHorizontal: DesignTokens.spacing.lg,
    paddingBottom: 8,
    gap: 8,
  },
  promptChip: {
    backgroundColor: DesignTokens.colors.paper,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: DesignTokens.radius.round,
    borderWidth: 1,
    borderColor: DesignTokens.colors.cardBorder,
  },
  promptChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: DesignTokens.colors.text.primary,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: DesignTokens.spacing.lg,
    paddingTop: DesignTokens.spacing.md,
    backgroundColor: DesignTokens.colors.paper,
    borderTopWidth: 1,
    borderTopColor: DesignTokens.colors.cardBorder,
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: DesignTokens.colors.canvas,
    borderWidth: 1,
    borderColor: DesignTokens.colors.cardBorder,
    borderRadius: DesignTokens.radius.round,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: DesignTokens.colors.text.primary,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#141414',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
