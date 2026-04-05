import { StyleSheet, Text, View } from "react-native";
import ScreenLayout from "../../components/ScreenLayout";
import { COLORS } from "../../constants/colors";

export default function Calendar() {
  return (
    <ScreenLayout title="CALENDAR">
      

        {/* Calendar Box */}
        <View style={styles.card}>
          <Text style={styles.title}>Calendar</Text>
        </View>

        {/* Progress Box */}
        <View style={styles.card}>
          <Text style={styles.title}>Progress</Text>
        </View>

    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    padding: 20,
    backgroundColor: COLORS.pinkBack,
  },
  card: {
    width: "100%",
    height: 250,
    backgroundColor: "#ffffff",
    borderRadius: 25,
    marginBottom: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
});