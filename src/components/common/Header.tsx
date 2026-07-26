import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { DesignTokens } from '../../constants/DesignTokens';
import { useStudioStore } from '../../stores/useStudioStore';
import { useUserStore } from '../../stores/useUserStore';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title, showBack, rightAction }) => {
  const router = useRouter();
  const { t } = useTranslation();
  const cartItems = useStudioStore(state => state.cartItems);
  const profile = useUserStore(state => state.profile);
  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        {showBack ? (
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={22} color={DesignTokens.colors.text.primary} />
          </TouchableOpacity>
        ) : (
          <View style={styles.brandContainer}>
            <Text style={styles.brandTitle}>MyArtsyGift</Text>
            <View style={[styles.badge, profile.isVisitor ? styles.visitorBadge : styles.memberBadge]}>
              <Text style={styles.badgeText}>{profile.isVisitor ? t('common.visitor') : t('common.studio')}</Text>
            </View>
          </View>
        )}
      </View>

      {title && !showBack && (
        <View style={styles.centerTitleContainer}>
          <Text style={styles.centerTitle} numberOfLines={1}>{title}</Text>
        </View>
      )}

      <View style={styles.rightContainer}>
        {rightAction ? (
          rightAction
        ) : (
          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={() => router.push('/(modals)/cart')} 
            activeOpacity={0.7}
          >
            <Ionicons name="bag-handle-outline" size={22} color={DesignTokens.colors.text.primary} />
            {totalCartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{totalCartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: DesignTokens.spacing.lg,
    paddingVertical: 12,
    backgroundColor: DesignTokens.colors.canvas,
    borderBottomWidth: 1,
    borderBottomColor: DesignTokens.colors.cardBorder,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: DesignTokens.colors.text.primary,
    letterSpacing: -0.5,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  visitorBadge: {
    backgroundColor: '#EBE5D8',
  },
  memberBadge: {
    backgroundColor: '#D49B57',
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#141414',
    letterSpacing: 0.5,
  },
  centerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  centerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: DesignTokens.colors.text.primary,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: DesignTokens.colors.paper,
    borderWidth: 1,
    borderColor: DesignTokens.colors.cardBorder,
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: DesignTokens.colors.accent.bronze,
    borderRadius: 10,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
});
