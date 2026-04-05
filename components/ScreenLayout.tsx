import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../constants/colors";

type ScreenLayoutProps = {
  title: string;
  children: ReactNode;
};

export default function ScreenLayout({ title, children }: ScreenLayoutProps) {
  return (
    <LinearGradient
      colors={[COLORS.gradientStart, COLORS.gradientEnd]}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>{title}</Text>
      </View>

      {/* Main content */}
      <View style={styles.content}>
        {children}
      </View>

    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40, // Account for status bar
  },
  headerText: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.whiteText,
    textShadowColor: COLORS.blackShadow,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 24,
  },
});

