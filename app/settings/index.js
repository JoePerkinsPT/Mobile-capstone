import { Text, SafeAreaView, TouchableOpacity, View } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { COLORS, SHADOWS, SIZES } from "../../constants";
import { useTheme } from "../../context/ThemeProvider";
import ScreenHeaderBtn from "../../components/ScreenHeaderBtn";

const SettingsMenu = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightWhite,
      }}
    >
      <ScreenHeaderBtn />
      <View style={{ padding: SIZES.medium }}>
        <TouchableOpacity
          style={{
            padding: SIZES.medium,
            backgroundColor: isDarkMode ? COLORS.lightWhite : COLORS.darkBackground,
            borderRadius: SIZES.small,
            marginBottom: SIZES.medium,
            ...SHADOWS.medium,
          }}
          onPress={() => router.push("/settings/ThemeChange")}
        >
          <Text
            style={{
              color: isDarkMode ? COLORS.lightText : COLORS.darkText,
              fontSize: SIZES.medium,
              fontFamily: "DMBold",
            }}
          >
            Theme Settings
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            padding: SIZES.medium,
            backgroundColor: isDarkMode ? COLORS.lightWhite : COLORS.darkBackground,
            borderRadius: SIZES.small,
            marginBottom: SIZES.medium,
            ...SHADOWS.medium,
          }}
          onPress={() => router.push("/settings/Favourites")}
        >
          <Text
            style={{
              color: isDarkMode ? COLORS.lightText : COLORS.darkText,
              fontSize: SIZES.medium,
              fontFamily: "DMBold",
            }}
          >
            My Favourites
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            padding: SIZES.medium,
            backgroundColor: isDarkMode ? COLORS.lightWhite : COLORS.darkBackground,
            borderRadius: SIZES.small,
            ...SHADOWS.medium,
          }}
          onPress={() => router.push("/settings/DailyReminders")}
        >
          <Text
            style={{
              color: isDarkMode ? COLORS.lightText : COLORS.darkText,
              fontSize: SIZES.medium,
              fontFamily: "DMBold",
            }}
          >
            Daily Reminders
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SettingsMenu; 