import React, { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet } from 'react-native';
import { Appbar, Icon, Menu, Text, useTheme } from 'react-native-paper';

import { useAuth } from '@/providers/AuthProvider';
import { convertUserCurrency } from '@/services/currency';
import { CurrencyCode, getUserCurrency, SUPPORTED_CURRENCIES } from '@/types/currency';

type AppHeaderProps = {
  onOpenMenu: () => void;
  onCurrencyChanged?: () => Promise<void> | void;
};

export default function AppHeader({ onOpenMenu, onCurrencyChanged }: AppHeaderProps) {
  const theme = useTheme();
  const { currentUser, refreshCurrentUser } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);
  const [isChangingCurrency, setIsChangingCurrency] = useState(false);

  const selectedCurrency = useMemo(
    () => getUserCurrency(currentUser?.currency),
    [currentUser?.currency],
  );

  const handleChangeCurrency = async (currency: CurrencyCode) => {
    setMenuVisible(false);

    if (!currentUser || isChangingCurrency || currency === selectedCurrency) {
      return;
    }

    setIsChangingCurrency(true);

    try {
      await convertUserCurrency(currentUser.id, currency);
      await refreshCurrentUser();
      await onCurrencyChanged?.();
    } catch (error) {
      console.error('Currency conversion failed:', error);
      Alert.alert(
        'Помилка зміни валюти',
        error instanceof Error ? error.message : 'Не вдалося змінити валюту.',
      );
    } finally {
      setIsChangingCurrency(false);
    }
  };

  return (
    <Appbar.Header style={{ backgroundColor: theme.colors.background, elevation: 0 }}>
      <Appbar.Action icon="menu" onPress={onOpenMenu} />
      <Appbar.Content title="Гаманець" />

      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={(
          <Pressable
            onPress={() => setMenuVisible(true)}
            disabled={isChangingCurrency || !currentUser}
            style={[
              styles.currencyTrigger,
              {
                borderColor: theme.colors.outlineVariant,
                backgroundColor: theme.colors.surface,
              },
            ]}
          >
            <Text style={{ color: theme.colors.onSurface, fontWeight: '700' }}>{selectedCurrency}</Text>
            <Icon
              icon={menuVisible ? 'chevron-up' : 'chevron-down'}
              size={16}
              color={theme.colors.onSurfaceVariant}
            />
          </Pressable>
        )}
      >
        {SUPPORTED_CURRENCIES.map((currency) => (
          <Menu.Item
            key={currency}
            onPress={() => {
              void handleChangeCurrency(currency);
            }}
            title={currency}
            leadingIcon={currency === selectedCurrency ? 'check' : undefined}
          />
        ))}
      </Menu>
    </Appbar.Header>
  );
}

const styles = StyleSheet.create({
  currencyTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 999,
    paddingLeft: 10,
    paddingRight: 8,
    marginRight: 8,
    gap: 4,
    height: 34,
  },
});
