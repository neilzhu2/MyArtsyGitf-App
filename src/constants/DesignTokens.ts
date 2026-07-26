/**
 * MyArtsyGift Design Token System
 * 
 * Museum & Gallery Aesthetic:
 * - Clean, calm off-white canvas (#FAF8F5 / #FFFBF7)
 * - Gallery obsidian black typography (#141414 / #1C1A18)
 * - Muted warm bronze & gold accents (#C48B47 / #D49B57)
 * - Soft terracotta & sage secondary highlights
 * - High legibility, generous whitespace, elevation shadows
 */

export const DesignTokens = {
  colors: {
    // Gallery Canvas & Backgrounds
    canvas: '#FAF8F5',
    paper: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    cardBorder: '#EFECE6',

    // Primary Accents (Warm Gallery Bronze & Terracotta)
    primary: {
      main: '#141414',
      light: '#2C2B2A',
      contrast: '#FFFFFF',
    },
    accent: {
      bronze: '#C48B47',
      bronzeLight: '#F7EFE6',
      terracotta: '#C86D51',
      sage: '#6B8A7A',
      sand: '#EBE5D8',
    },

    // Text & Content Hierarchy
    text: {
      primary: '#141414',
      secondary: '#66615B',
      muted: '#9E988F',
      disabled: '#C4BFB7',
      inverse: '#FFFFFF',
      bronze: '#B07535',
    },

    // Status Colors
    status: {
      success: '#4E8765',
      warning: '#D97724',
      error: '#C53B3B',
      info: '#3B75C5',
    },

    // Dark Mode Palette
    dark: {
      canvas: '#121212',
      paper: '#1E1E1E',
      cardBorder: '#2E2E2E',
      textPrimary: '#F5F5F0',
      textSecondary: '#A5A29B',
      textMuted: '#73706A',
    }
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },

  radius: {
    xs: 4,
    sm: 8,
    md: 14,
    lg: 20,
    xl: 28,
    round: 9999,
  },

  shadows: {
    none: {
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    sm: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 6,
      elevation: 2,
    },
    md: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.07,
      shadowRadius: 12,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.1,
      shadowRadius: 20,
      elevation: 8,
    },
  },

  typography: {
    display: {
      fontSize: 32,
      lineHeight: 40,
      fontWeight: '700' as const,
      letterSpacing: -0.8,
    },
    h1: {
      fontSize: 26,
      lineHeight: 34,
      fontWeight: '700' as const,
      letterSpacing: -0.5,
    },
    h2: {
      fontSize: 21,
      lineHeight: 28,
      fontWeight: '600' as const,
      letterSpacing: -0.3,
    },
    h3: {
      fontSize: 18,
      lineHeight: 24,
      fontWeight: '600' as const,
      letterSpacing: -0.2,
    },
    bodyLarge: {
      fontSize: 17,
      lineHeight: 25,
      fontWeight: '400' as const,
    },
    body: {
      fontSize: 15,
      lineHeight: 22,
      fontWeight: '400' as const,
    },
    bodySmall: {
      fontSize: 13,
      lineHeight: 18,
      fontWeight: '400' as const,
    },
    caption: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '500' as const,
      letterSpacing: 0.2,
    },
    button: {
      fontSize: 16,
      lineHeight: 22,
      fontWeight: '600' as const,
      letterSpacing: 0.2,
    },
  },
} as const;
