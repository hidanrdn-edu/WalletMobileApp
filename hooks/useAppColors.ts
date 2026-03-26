import { useTheme } from 'react-native-paper';

export function useAppColors() {
  const theme = useTheme();
  const isDark = theme.dark;

  return {
    cardBackground: isDark ? theme.colors.elevation.level2 : theme.colors.surface,
    
    income: {
      background: isDark ? '#1b5e20' : '#E8F5E9',
      iconBg: isDark ? '#2e7d32' : '#C8E6C9',
      icon: isDark ? '#ffffff' : '#4CAF50',
      text: isDark ? '#a5d6a7' : '#4CAF50',
    },

    expense: {
      background: isDark ? '#b71c1c' : '#FFEBEE',
      iconBg: isDark ? '#c62828' : '#FFCDD2',
      icon: isDark ? '#ffffff' : '#F44336',
      text: isDark ? '#ef9a9a' : '#F44336',
    },

    chart: [
      '#FF6384', 
      '#36A2EB', 
      '#FFCE56', 
      '#4BC0C0', 
      '#9966FF', 
    ]
  };
}