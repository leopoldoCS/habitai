import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ScreenLayout from "../../components/ScreenLayout";
import { COLORS } from "../../constants/colors";

export default function Homepage() {
  return (
    <ScreenLayout title="HABITAI">
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Welcome to HabitAI!</Text>
        <Text style={styles.subtitle}>
          Track your habits and build better routines with AI assistance.
        </Text>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="flame" size={24} color={COLORS.success} />
            <Text style={styles.statNumber}>7</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons
              name="checkmark-circle"
              size={24}
              color={COLORS.primary}
            />
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Habits Today</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Add New Habit</Text>
        </TouchableOpacity>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: "center",
    paddingVertical: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.whiteText,
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.whiteText,
    textAlign: "center",
    marginBottom: 30,
    opacity: 0.9,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 40,
  },
  statCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    shadowColor: COLORS.blackShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 120,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.darkText,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.secondary,
    marginTop: 4,
  },
  button: {
    backgroundColor: COLORS.buttonPrimary,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    shadowColor: COLORS.blackShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: COLORS.whiteText,
    fontSize: 18,
    fontWeight: "bold",
  },
});
