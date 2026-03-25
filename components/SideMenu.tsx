import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Avatar, Drawer, Text, useTheme } from 'react-native-paper';
const { width } = Dimensions.get('window');

interface SideMenuProps {
  visible: boolean;
  onClose: () => void;
}

export default function SideMenu({ visible, onClose }: SideMenuProps) {
  const theme = useTheme();
  const router = useRouter();
  const slideAnim = useRef(new Animated.Value(-width)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -width,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.overlay}>
        
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        
        <Animated.View 
          style={[
            styles.drawerContainer, 
            { backgroundColor: theme.colors.surface, transform: [{ translateX: slideAnim }] }
          ]}>
          <View style={[styles.userInfo, { backgroundColor: theme.colors.primaryContainer }]}>
            <Avatar.Icon size={56} icon="account" style={{ backgroundColor: theme.colors.primary }} />
            <View style={styles.userDetails}>
              <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>Mamont Mamontovich</Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>mamont67@gmail.com</Text>
            </View>
          </View>

          <Drawer.Section style={styles.menuSection}>
            <Drawer.Item icon="view-dashboard" label="Головна" active={true} onPress={onClose} />
            <Drawer.Item icon="wallet" label="Рахунки" onPress={onClose} />
            <Drawer.Item icon="format-list-bulleted" label="Транзакції" onPress={onClose} />
            <Drawer.Item icon="chart-pie" label="Статистика" onPress={onClose} />
          </Drawer.Section>

          <Drawer.Section title="Налаштування" showDivider={false}>
            <Drawer.Item icon="cog" label="Налаштування" onPress={() => {onClose(); router.push('/settings' as any ); }} />
            <Drawer.Item icon="logout" label="Вийти" onPress={onClose} />
          </Drawer.Section>
          
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  drawerContainer: {
    width: '75%', 
    height: '100%',
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  userInfo: {
    paddingTop: 50, 
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  userDetails: {
    marginTop: 12,
  },
  menuSection: {
    paddingTop: 10,
  },
});