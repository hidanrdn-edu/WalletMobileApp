import { BillsProvider } from "@/context/bills-context";
import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";

export default function RootLayout() {
  return (
    <PaperProvider>
      <BillsProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </BillsProvider>
    </PaperProvider>
  );
}