import React from 'react';
import { Appbar, useTheme } from 'react-native-paper';
export default function AppHeader({ onOpenMenu }: { onOpenMenu: () => void }) {
  const theme = useTheme();

  return (
    <Appbar.Header style={{ backgroundColor: theme.colors.background, elevation: 0 }}>
      <Appbar.Action icon="menu" onPress={onOpenMenu} />
      <Appbar.Content title="Гаманець" />
      
    </Appbar.Header>
  );
}