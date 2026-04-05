import { useCallback } from "react";
import { Alert, Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import ScreenLayout from "../../components/ScreenLayout";
import { COLORS } from "../../constants/colors";

export default function Settings() {
  const openSetting = useCallback((name: string) => {
    Alert.alert(`Opened ${name}`);
  }, []);

  const progress1 = useSharedValue(0);
  const animatedStyle1 = useAnimatedStyle(() => ({
    opacity: progress1.value,
  }));

  const progress2 = useSharedValue(0);
  const animatedStyle2 = useAnimatedStyle(() => ({
    opacity: progress2.value,
  }));

  const progress3 = useSharedValue(0);
  const animatedStyle3 = useAnimatedStyle(() => ({
    opacity: progress3.value,
  }));

  const progress4 = useSharedValue(0);
  const animatedStyle4 = useAnimatedStyle(() => ({
    opacity: progress4.value,
  }));

  const progress5 = useSharedValue(0);
  const animatedStyle5 = useAnimatedStyle(() => ({
    opacity: progress5.value,
  }));

  const progress6 = useSharedValue(0);
  const animatedStyle6 = useAnimatedStyle(() => ({
    opacity: progress6.value,
  }));

  return (
    <ScreenLayout title="SETTINGS">
      <View style={styles.fullWidthContainer}>
        {/* PROFILE SETTINGS */}
        <View style={styles.optionContainer}>
          <Pressable
            style={[styles.optionBox, styles.firstOption]}
            onLongPress={() => {
              progress1.value = withTiming(
                1,
                { duration: 2000 },
                (finished) => {
                  if (finished) runOnJS(openSetting)("PROFILE SETTINGS");
                },
              );
            }}
            onPressOut={() => {
              if (progress1.value < 1) progress1.value = withTiming(0);
            }}
          >
            <Text style={styles.optionText}>PROFILE SETTINGS</Text>
          </Pressable>
          <View
            style={[
              StyleSheet.absoluteFillObject,
              styles.overlay,
              animatedStyle1,
            ]}
          />
        </View>
        {/* PRIVACY SETTINGS */}
        <View style={styles.optionContainer}>
          <Pressable
            style={styles.optionBox}
            onLongPress={() => {
              progress2.value = withTiming(
                1,
                { duration: 2000 },
                (finished) => {
                  if (finished) runOnJS(openSetting)("PRIVACY SETTINGS");
                },
              );
            }}
            onPressOut={() => {
              if (progress2.value < 1) progress2.value = withTiming(0);
            }}
          >
            <Text style={styles.optionText}>PRIVACY SETTINGS</Text>
          </Pressable>
          <View
            style={[
              StyleSheet.absoluteFillObject,
              styles.overlay,
              animatedStyle2,
            ]}
          />
        </View>
        {/* FAQ */}
        <View style={styles.optionContainer}>
          <Pressable
            style={styles.optionBox}
            onLongPress={() => {
              progress3.value = withTiming(
                1,
                { duration: 2000 },
                (finished) => {
                  if (finished) runOnJS(openSetting)("FAQ");
                },
              );
            }}
            onPressOut={() => {
              if (progress3.value < 1) progress3.value = withTiming(0);
            }}
          >
            <Text style={styles.optionText}>FAQ</Text>
          </Pressable>
          <View
            style={[
              StyleSheet.absoluteFillObject,
              styles.overlay,
              animatedStyle3,
            ]}
          />
        </View>
        {/* USAGE TIPS */}
        <View style={styles.optionContainer}>
          <Pressable
            style={styles.optionBox}
            onLongPress={() => {
              progress4.value = withTiming(
                1,
                { duration: 2000 },
                (finished) => {
                  if (finished) runOnJS(openSetting)("USAGE TIPS");
                },
              );
            }}
            onPressOut={() => {
              if (progress4.value < 1) progress4.value = withTiming(0);
            }}
          >
            <Text style={styles.optionText}>USAGE TIPS</Text>
          </Pressable>
          <View
            style={[
              StyleSheet.absoluteFillObject,
              styles.overlay,
              animatedStyle4,
            ]}
          />
        </View>
        {/* GITHUB */}
        <View style={styles.optionContainer}>
          <Pressable
            style={styles.optionBox}
            onLongPress={() => {
              progress5.value = withTiming(
                1,
                { duration: 2000 },
                (finished) => {
                  if (finished) runOnJS(openSetting)("GITHUB");
                },
              );
            }}
            onPressOut={() => {
              if (progress5.value < 1) progress5.value = withTiming(0);
            }}
          >
            <Text style={styles.optionText}>GITHUB</Text>
          </Pressable>
          <View
            style={[
              StyleSheet.absoluteFillObject,
              styles.overlay,
              animatedStyle5,
            ]}
          />
        </View>
        {/* SHARE THE APP */}
        <View style={styles.optionContainer}>
          <Pressable
            style={styles.optionBox}
            onLongPress={() => {
              progress6.value = withTiming(
                1,
                { duration: 2000 },
                (finished) => {
                  if (finished) runOnJS(openSetting)("SHARE THE APP");
                },
              );
            }}
            onPressOut={() => {
              if (progress6.value < 1) progress6.value = withTiming(0);
            }}
          >
            <Text style={styles.optionText}>SHARE THE APP</Text>
          </Pressable>
          <View
            style={[
              StyleSheet.absoluteFillObject,
              styles.overlay,
              animatedStyle6,
            ]}
          />
        </View>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  fullWidthContainer: {
    width: Dimensions.get("window").width,
    marginHorizontal: -20,
  },
  optionContainer: {
    position: "relative",
  },
  optionBox: {
    width: "100%",
    height: 120,
    borderBottomWidth: 3,
    borderColor: COLORS.blackBorder,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  optionText: {
    fontSize: 38,
    fontWeight: "bold",
    color: COLORS.blackBorder,
    textAlign: "center",
  },
  firstOption: {
    borderTopWidth: 3,
  },
  overlay: {
    backgroundColor: "white",
  },
});
