import React, { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Easing, Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { Avatar, Drawer, Text, useTheme } from "react-native-paper";
import type { User } from "@/db/schema";
import { useRouter } from 'expo-router';

const { width } = Dimensions.get("window");

interface SideMenuProps {
  user: User;
  visible: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export default function SideMenu({ visible, onClose, onLogout, user }: SideMenuProps) {
  const theme = useTheme();

  const router = useRouter();

  const slideAnim = useRef(new Animated.Value(-width)).current;
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      setModalVisible(true);
      slideAnim.setValue(-width);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }).start();
      return;
    }

    Animated.timing(slideAnim, {
      toValue: -width,
      duration: 450,
      useNativeDriver: true,
      easing: Easing.in(Easing.cubic),
    }).start(() => setModalVisible(false));
  }, [slideAnim, visible]);

  const handleLogoutPress = () => {
    onClose();
    onLogout();
  };

  return (
    <Modal visible={modalVisible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

        <Animated.View
          style={[
            styles.drawerContainer,
            { backgroundColor: theme.colors.surface, transform: [{ translateX: slideAnim }] },
          ]}
        >
          <View style={[styles.userInfo, { backgroundColor: "#16a34a" }]}>
            <Avatar.Icon size={56} icon="account" style={{ backgroundColor: theme.colors.primary }} />
            <View style={styles.userDetails}>
              <Text variant="titleMedium" style={styles.userName}>
                {user.name}
              </Text>
              <Text variant="bodyMedium" style={{ color: "#ddddddff" }}>
                {user.email}
              </Text>
            </View>
          </View>

          <Drawer.Section style={styles.menuSection}>
            <Drawer.Item icon="view-dashboard" label="Головна" active onPress={onClose} />
            <Drawer.Item icon="wallet" label="Рахунки" onPress={onClose} />
            <Drawer.Item icon="format-list-bulleted" label="Транзакції" onPress={onClose} />
            <Drawer.Item icon="chart-pie" label="Статистика" onPress={onClose} />
          </Drawer.Section>

          <Drawer.Section title="Налаштування" showDivider={false}>
            <Drawer.Item icon="cog" label="Налаштування" onPress={() => {onClose(); router.push('/settings' as any ); }} />
            <Drawer.Item icon="logout" label="Вийти" onPress={handleLogoutPress} />
          </Drawer.Section>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: "row",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  drawerContainer: {
    width: "75%",
    height: "100%",
    elevation: 16,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  userInfo: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ffffffff",
  },
  userDetails: {
    marginTop: 12,
  },
  userName: {
    fontWeight: "bold",
  },
  menuSection: {
    paddingTop: 10,
  },
});
