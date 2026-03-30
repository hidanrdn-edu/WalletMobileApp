import { StyleSheet, Text, View } from "react-native";

export default function WelcomeCard(){
    return(
        <View style={styles.heroCard}>
              <Text style={styles.eyebrow}>Moneyfy</Text>
              <Text style={styles.title}>Sign up or log in to enter your wallet app.</Text>
              <Text style={styles.subtitle}>
                Take control of your money. Track, spend, and save smarter with MONEYFY!
              </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    heroCard: {
    borderRadius: 28,
    padding: 24,
    backgroundColor: "rgba(16, 42, 36, 0.92)",
    },
    eyebrow: {
        fontSize: 12,
        fontWeight: "700",
        letterSpacing: 1.5,
        textTransform: "uppercase",
        color: "#8ff0c9",
    },
    title: {
        marginTop: 12,
        fontSize: 30,
        lineHeight: 36,
        fontWeight: "800",
        color: "#f9fffc",
    },
    subtitle: {
        marginTop: 12,
        fontSize: 15,
        lineHeight: 22,
        color: "#cfe7dd",
    },
})
