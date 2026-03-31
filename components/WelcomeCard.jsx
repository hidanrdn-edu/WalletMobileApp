import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "react-native-paper";

import { useAppColors } from "@/hooks/useAppColors";

export default function WelcomeCard(){
    const theme = useTheme();
    const appColors = useAppColors();

    return(
        <View style={[styles.heroCard, { backgroundColor: appColors.authHeroCard }]}>
              <Text style={[styles.eyebrow, { color: theme.colors.secondary }]}>Moneyfy</Text>
              <Text style={[styles.title, { color: theme.colors.onPrimaryContainer }]}>Sign up or log in to enter your wallet app.</Text>
              <Text style={[styles.subtitle, { color: theme.colors.onPrimaryContainer + "cc" }]}>
                Take control of your money. Track, spend, and save smarter with MONEYFY!
              </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    heroCard: {
    borderRadius: 28,
    padding: 24,
    },
    eyebrow: {
        fontSize: 12,
        fontWeight: "700",
        letterSpacing: 1.5,
        textTransform: "uppercase",
    },
    title: {
        marginTop: 12,
        fontSize: 30,
        lineHeight: 36,
        fontWeight: "800",
    },
    subtitle: {
        marginTop: 12,
        fontSize: 15,
        lineHeight: 22,
    },
})
