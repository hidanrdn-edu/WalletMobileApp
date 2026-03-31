import { MD3DarkTheme, MD3LightTheme, type MD3Theme } from 'react-native-paper';

export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#0f766e',
    onPrimary: '#ffffff',
    primaryContainer: '#a7f3d0',
    onPrimaryContainer: '#05241f',
    secondary: '#16a34a',
    onSecondary: '#ffffff',
    secondaryContainer: '#dcfce7',
    onSecondaryContainer: '#0f2d1c',
    tertiary: '#0ea5e9',
    background: '#f4fbf7',
    onBackground: '#15322c',
    surface: '#ffffff',
    onSurface: '#15322c',
    surfaceVariant: '#dce9e3',
    onSurfaceVariant: '#49625a',
    outline: '#7d958d',
    outlineVariant: '#c3d2cb',
    error: '#b42318',
    elevation: {
      ...MD3LightTheme.colors.elevation,
      level1: '#f2faf6',
      level2: '#eaf6f1',
      level3: '#e2f1eb',
    },
  },
};

export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#5eead4',
    onPrimary: '#003731',
    primaryContainer: '#0f3f39',
    onPrimaryContainer: '#b6f6ea',
    secondary: '#86efac',
    onSecondary: '#123621',
    secondaryContainer: '#204b31',
    onSecondaryContainer: '#c8f6d6',
    tertiary: '#67d3ff',
    background: '#0f1816',
    onBackground: '#e5f2ed',
    surface: '#172320',
    onSurface: '#e5f2ed',
    surfaceVariant: '#334540',
    onSurfaceVariant: '#b7ccc4',
    outline: '#8ca39b',
    outlineVariant: '#4f635d',
    error: '#ffb4ab',
    elevation: {
      ...MD3DarkTheme.colors.elevation,
      level1: '#1b2b27',
      level2: '#22332e',
      level3: '#29403a',
    },
  },
};

export const appPalette = {
  light: {
    authGradient: ['#16a34a', '#22c55e', '#86efac'],
    authCard: 'rgba(255, 255, 255, 0.88)',
    authHeroCard: 'rgba(16, 42, 25, 0.4)',
    successButton: '#0f766e',
  },
  dark: {
    authGradient: ['#0d1f1a', '#14332b', '#1f4c40'],
    authCard: 'rgba(20, 32, 29, 0.92)',
    authHeroCard: 'rgba(7, 18, 16, 0.92)',
    successButton: '#14b8a6',
  },
} as const;
