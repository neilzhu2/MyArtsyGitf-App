import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { DesignTokens } from '../../constants/DesignTokens';
import '../../i18n';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const bottomPadding = Math.max(insets.bottom, 6);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#141414',
        tabBarInactiveTintColor: '#9E988F',
        tabBarStyle: {
          backgroundColor: '#FAF8F5',
          borderTopColor: '#EFECE6',
          borderTopWidth: 1,
          height: 56 + bottomPadding,
          paddingBottom: bottomPadding,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="gallery"
        options={{
          title: t('tabs.gallery'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "images" : "images-outline"} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="gifts"
        options={{
          title: t('tabs.gifts'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "gift" : "gift-outline"} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: t('tabs.create'),
          tabBarIcon: ({ focused }) => (
            <View style={styles.createButtonContainer}>
              <View style={styles.createButtonInner}>
                <Ionicons name="add" size={26} color="#FFFFFF" />
              </View>
            </View>
          ),
          tabBarLabel: () => (
            <Text style={[styles.createLabel, { color: '#C48B47' }]}>
              {t('tabs.create')}
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="studio"
        options={{
          title: t('tabs.studio'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "sparkles" : "sparkles-outline"} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabs.profile'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "person" : "person-outline"} size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  createButtonContainer: {
    top: -10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButtonInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#141414',
    borderWidth: 2,
    borderColor: '#C48B47',
    justifyContent: 'center',
    alignItems: 'center',
    ...DesignTokens.shadows.md,
  },
  createLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
});
