import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import {useState} from "react"

import AppHeader from "@/components/AppHeader";
import SideMenu from "@/components/SideMenu"
import type { User } from "@/db/schema";

type MainScreenProps = {
  user: User;
  isSubmitting: boolean;
  onLogout: () => void;
};

export function MainScreen({ user, isSubmitting, onLogout }: MainScreenProps) {
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  return (
    <View style={styles.container}>
      <AppHeader onOpenMenu={openMenu}/>
      <SideMenu visible={menuVisible} onClose={closeMenu} onLogout={onLogout}></SideMenu>
      <View style={styles.content}>
        <Text style={styles.eyebrow}>Home</Text>
        <Text style={styles.greeting}>Hello, {user.name}</Text>
        <Text style={styles.subtitle}>Your Moneyfy main page is ready.</Text>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fff8",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: "#5b7a71",
  },
  greeting: {
    marginTop: 12,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "800",
    color: "#16312b",
  },
  subtitle: {
    marginTop: 10,
    fontSize: 16,
    lineHeight: 24,
    color: "#49625a",
  },
  logoutButton: {
    marginTop: 24,
    alignSelf: "flex-start",
    borderRadius: 18,
    paddingHorizontal: 22,
    paddingVertical: 14,
    backgroundColor: "#f97316",
  },
  logoutButtonText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#ffffff",
  },
  buttonDisabled: {
    opacity: 0.55,
  },
});
