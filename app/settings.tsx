import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Appbar, List, Switch, useTheme } from 'react-native-paper';

import { useAppTheme } from '../context/ThemeContext';

export default function SettingsScreen() {
  const theme = useTheme();
  const router = useRouter();
  
  const { isDarkTheme, toggleTheme } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header style={{ backgroundColor: theme.colors.background, elevation: 0 }}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Налаштування" />
      </Appbar.Header>

      <List.Section>
        <List.Item
          title="Темна тема"
          description="Увімкнути темний режим інтерфейсу"
          left={(props) => <List.Icon {...props} icon="theme-light-dark" color={theme.colors.primary} />}
          right={() => <Switch value={isDarkTheme} onValueChange={toggleTheme} />}
        />
      </List.Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});