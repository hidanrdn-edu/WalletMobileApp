import { useTheme } from 'react-native-paper';

import { appPalette } from '@/constants/theme';

export function useAppColors() {
  const theme = useTheme();
  const isDark = theme.dark;
  const palette = isDark ? appPalette.dark : appPalette.light;

  return {
    authGradient: palette.authGradient,
    authCard: palette.authCard,
    authHeroCard: palette.authHeroCard,
    successButton: palette.successButton,
    cardBackground: isDark ? theme.colors.elevation.level2 : theme.colors.surface,
    
    income: {
      background: isDark ? '#1a581e' : '#d4f5d7',
      iconBg: isDark ? '#2e7d32' : '#93ca93',
      icon: isDark ? '#ffffff' : '#4CAF50',
      text: isDark ? '#a5d6a7' : '#4CAF50',
    },

    expense: {
      background: isDark ? '#b71c1c' : '#ffdbe0',
      iconBg: isDark ? '#c62828' : '#FFCDD2',
      icon: isDark ? '#ffffff' : '#F44336',
      text: isDark ? '#ef9a9a' : '#F44336',
    },

    chart: [
      '#ff7da2',
      '#6bc4ff',
      '#ffd166',
      '#2dd4bf',
      '#b197fc',
    ]
  };
}