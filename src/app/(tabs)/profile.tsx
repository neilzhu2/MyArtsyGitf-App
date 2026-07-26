import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Header } from '../../components/common/Header';
import { DesignTokens } from '../../constants/DesignTokens';
import { useUserStore } from '../../stores/useUserStore';
import { setAppLanguage } from '../../i18n';

export default function ProfileScreen() {
  const { t, i18n } = useTranslation();
  const insets = useSafeAreaInsets();
  const profile = useUserStore(state => state.profile);
  const toggleUserMode = useUserStore(state => state.toggleUserMode);

  const currentLang = i18n.language.startsWith('zh') ? 'zh' : 'en';

  const handleLanguageChange = (lang: 'en' | 'zh') => {
    setAppLanguage(lang);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header title={t('profile.headerTitle')} />
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}
        showsVerticalScrollIndicator={false}
      >

        {/* Profile Card Header */}
        <View style={styles.profileHeaderCard}>
          <Image source={{ uri: profile.avatarUrl }} style={styles.avatar} />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.email}>
              {profile.isVisitor ? t('profile.visitorMode') : profile.email}
            </Text>
            <View style={[styles.badge, profile.isVisitor ? styles.visitorBadge : styles.memberBadge]}>
              <Text style={styles.badgeText}>
                {profile.isVisitor ? t('profile.visitorBadge') : t('profile.memberBadge')}
              </Text>
            </View>
          </View>
        </View>

        {/* Language Selection Card */}
        <View style={styles.langCard}>
          <View style={styles.langHeader}>
            <Ionicons name="language-outline" size={20} color="#141414" />
            <Text style={styles.langTitle}>{t('profile.appLanguage')}</Text>
          </View>
          <View style={styles.langBtnRow}>
            <TouchableOpacity 
              style={[styles.langChoiceBtn, currentLang === 'en' && styles.activeLangChoiceBtn]}
              onPress={() => handleLanguageChange('en')}
            >
              <Text style={[styles.langChoiceText, currentLang === 'en' && styles.activeLangChoiceText]}>
                {t('common.english')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.langChoiceBtn, currentLang === 'zh' && styles.activeLangChoiceBtn]}
              onPress={() => handleLanguageChange('zh')}
            >
              <Text style={[styles.langChoiceText, currentLang === 'zh' && styles.activeLangChoiceText]}>
                {t('common.chinese')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Visitor vs Account Mode Toggle Switch */}
        <View style={styles.toggleCard}>
          <View style={styles.toggleTextContainer}>
            <Text style={styles.toggleTitle}>{t('profile.demoSwitchTitle')}</Text>
            <Text style={styles.toggleDesc}>
              {profile.isVisitor 
                ? t('profile.demoSwitchVisitorDesc')
                : t('profile.demoSwitchMemberDesc')
              }
            </Text>
          </View>
          <Switch 
            value={!profile.isVisitor}
            onValueChange={toggleUserMode}
            trackColor={{ false: '#767577', true: '#C48B47' }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* Account Options Group */}
        <View style={styles.menuGroup}>
          <Text style={styles.menuGroupTitle}>{t('profile.accountPreferences')}</Text>
          
          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <Ionicons name="location-outline" size={20} color="#141414" />
            <Text style={styles.menuItemText}>{t('profile.shippingAddresses')}</Text>
            <Ionicons name="chevron-forward" size={18} color="#9E988F" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <Ionicons name="notifications-outline" size={20} color="#141414" />
            <Text style={styles.menuItemText}>{t('profile.notifications')}</Text>
            <Ionicons name="chevron-forward" size={18} color="#9E988F" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <Ionicons name="color-palette-outline" size={20} color="#141414" />
            <Text style={styles.menuItemText}>{t('profile.artPreferences')}</Text>
            <Ionicons name="chevron-forward" size={18} color="#9E988F" />
          </TouchableOpacity>
        </View>

        {/* Support & Legal */}
        <View style={styles.menuGroup}>
          <Text style={styles.menuGroupTitle}>{t('profile.aboutSupport')}</Text>
          
          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <Ionicons name="people-outline" size={20} color="#141414" />
            <Text style={styles.menuItemText}>{t('profile.aboutArtists')}</Text>
            <Ionicons name="chevron-forward" size={18} color="#9E988F" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <Ionicons name="help-circle-outline" size={20} color="#141414" />
            <Text style={styles.menuItemText}>{t('profile.helpFaq')}</Text>
            <Ionicons name="chevron-forward" size={18} color="#9E988F" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <Ionicons name="shield-checkmark-outline" size={20} color="#141414" />
            <Text style={styles.menuItemText}>{t('profile.privacy')}</Text>
            <Ionicons name="chevron-forward" size={18} color="#9E988F" />
          </TouchableOpacity>
        </View>

        <View style={styles.versionFooter}>
          <Text style={styles.versionText}>MyArtsyGift v1.0.0 (Expo Go Prototype)</Text>
          <Text style={styles.copyText}>© 2026 MyArtsyGift AI. All rights reserved.</Text>
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
  profileHeaderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DesignTokens.colors.paper,
    marginHorizontal: DesignTokens.spacing.lg,
    marginTop: DesignTokens.spacing.md,
    padding: DesignTokens.spacing.lg,
    borderRadius: DesignTokens.radius.lg,
    borderWidth: 1,
    borderColor: DesignTokens.colors.cardBorder,
    gap: 16,
    ...DesignTokens.shadows.sm,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileInfo: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: DesignTokens.colors.text.primary,
  },
  email: {
    fontSize: 12,
    color: DesignTokens.colors.text.secondary,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  visitorBadge: {
    backgroundColor: '#EBE5D8',
  },
  memberBadge: {
    backgroundColor: '#C48B47',
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#141414',
  },
  langCard: {
    backgroundColor: DesignTokens.colors.paper,
    marginHorizontal: DesignTokens.spacing.lg,
    marginTop: DesignTokens.spacing.md,
    padding: DesignTokens.spacing.md,
    borderRadius: DesignTokens.radius.md,
    borderWidth: 1,
    borderColor: DesignTokens.colors.cardBorder,
    gap: 10,
  },
  langHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  langTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#141414',
  },
  langBtnRow: {
    flexDirection: 'row',
    gap: 8,
  },
  langChoiceBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: DesignTokens.radius.sm,
    backgroundColor: DesignTokens.colors.canvas,
    borderWidth: 1,
    borderColor: DesignTokens.colors.cardBorder,
    alignItems: 'center',
  },
  activeLangChoiceBtn: {
    backgroundColor: '#141414',
    borderColor: '#141414',
  },
  langChoiceText: {
    fontSize: 12,
    fontWeight: '600',
    color: DesignTokens.colors.text.secondary,
  },
  activeLangChoiceText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  toggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F7EFE6',
    marginHorizontal: DesignTokens.spacing.lg,
    marginTop: DesignTokens.spacing.md,
    padding: DesignTokens.spacing.md,
    borderRadius: DesignTokens.radius.md,
    borderWidth: 1,
    borderColor: '#C48B47',
    gap: 12,
  },
  toggleTextContainer: {
    flex: 1,
    gap: 2,
  },
  toggleTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#141414',
  },
  toggleDesc: {
    fontSize: 11,
    color: '#66615B',
  },
  menuGroup: {
    marginTop: DesignTokens.spacing.lg,
    paddingHorizontal: DesignTokens.spacing.lg,
  },
  menuGroupTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: DesignTokens.colors.text.muted,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DesignTokens.colors.paper,
    padding: DesignTokens.spacing.md,
    borderRadius: DesignTokens.radius.md,
    borderWidth: 1,
    borderColor: DesignTokens.colors.cardBorder,
    marginBottom: 8,
    gap: 12,
  },
  menuItemText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: DesignTokens.colors.text.primary,
  },
  versionFooter: {
    alignItems: 'center',
    paddingVertical: 30,
    gap: 4,
  },
  versionText: {
    fontSize: 12,
    fontWeight: '600',
    color: DesignTokens.colors.text.muted,
  },
  copyText: {
    fontSize: 10,
    color: DesignTokens.colors.text.disabled,
  },
});
