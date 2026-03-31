import { Redirect } from "expo-router";

import { MainScreen } from "@/components/MainScreen";
import { useAuth } from "@/providers/AuthProvider";
import { logout } from "@/services/auth";

export default function HomePage() {
  const { currentUser, setCurrentUser } = useAuth();

  if (!currentUser) {
    return <Redirect href="/" />;
  }

  async function handleLogout() {
    await logout();
    setCurrentUser(null);
  }

  return (
    <MainScreen
      user={currentUser}
      onLogout={() => void handleLogout()}
    />
  );
}