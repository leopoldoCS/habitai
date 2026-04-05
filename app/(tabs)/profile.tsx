import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import ScreenLayout from "../../components/ScreenLayout";
import { COLORS } from "../../constants/colors";

export default function Profile() {
  return (
    <ScreenLayout title="PROFILE">
      {/* Top Profile Section */}
      <View style={styles.topSection}>
        {/* Avatar */}
        <View style={styles.avatar}>
          <Ionicons name="person-outline" size={80} color="black" />
        </View>

        {/* User Info */}
        <View style={styles.info}>
          <Text style={styles.name}>Mark Smith</Text>
          <Text style={styles.stat}>Rank: Getter Doner</Text>
          <Text style={styles.stat}>Daily Average: 80%</Text>
          <Text style={styles.stat}>Weekly Average: 70%</Text>
          <Text style={styles.stat}>Monthly Average: 80%</Text>
        </View>
      </View>

      {/* Biography Section */}
      <Text style={styles.sectionTitle}>BIOGRAPHY</Text>
      <View style={styles.bioBox}>
        <Text style={styles.bioText}>
          This is where the user biography will go. It can describe goals,
          habits, mindset, or anything motivational.
        </Text>
      </View>

      {/* Progress Map Section */}
      <Text style={styles.sectionTitle}>PROGRESS MAP</Text>
      <View style={styles.progressBox}>
        <Text style={{ fontWeight: "bold" }}>(Heatmap coming soon)</Text>
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

  topSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  avatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 4,
    borderColor: COLORS.blackBorder,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },

  info: {
    flex: 1,
  },

  name: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    color: COLORS.whiteText,
  },

  stat: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 4,
    color: COLORS.whiteText,
  },

  sectionTitle: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 15,
  },

  bioBox: {
    width: "90%",
    height: 200,
    borderWidth: 3,
    borderColor: COLORS.blackBorder,
    padding: 15,
    marginBottom: 25,
    backgroundColor: "#ffffff",
    borderRadius: 10,
  },

  bioText: {
    fontSize: 16,
    color: COLORS.darkText,
  },

  progressBox: {
    width: "90%",
    height: 200,
    backgroundColor: "#ffffff",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.lightBorder,
    marginBottom: 20,
  },
});
