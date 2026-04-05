import { Ionicons } from "@expo/vector-icons";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import ScreenLayout from "../components/ScreenLayout";
import { COLORS } from "../constants/colors";

export default function SignUp() {
  return (
    <ScreenLayout title="Sign Up">
      <View style={styles.content}>
        {/* Checkmark Logo */}
        <View style={styles.logoContainer}>
          <Ionicons name="checkmark-circle" size={80} color={COLORS.success} />
        </View>

        {/* Email Input */}
        <TextInput
          style={styles.input}
          placeholder="EMAIL"
          placeholderTextColor={COLORS.secondary}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Password Input */}
        <TextInput
          style={styles.input}
          placeholder="PASSWORD"
          placeholderTextColor={COLORS.secondary}
          secureTextEntry={true}
          autoCapitalize="none"
        />

        {/* Confirm Button */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: "center",
    width: "100%",
  },
  logoContainer: {
    marginBottom: 40,
    alignItems: "center",
  },
  input: {
    width: "80%",
    height: 50,
    borderWidth: 2,
    borderColor: COLORS.lightBorder,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginVertical: 10,
    fontSize: 16,
    backgroundColor: COLORS.cardBackground,
    color: COLORS.darkText,
  },
  button: {
    backgroundColor: COLORS.buttonPrimary,
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 30,
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
