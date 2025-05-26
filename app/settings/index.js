import { Text, SafeAreaView, TouchableOpacity, View, Alert } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { COLORS, SHADOWS, SIZES } from "../../constants";
import { useTheme } from "../../context/ThemeProvider";
import ScreenHeaderBtn from "../../components/ScreenHeaderBtn";
import { userStorage } from "../../utils/storage";

const SettingsMenu = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          onPress: async () => {
            await userStorage.clearUserDetails();
            router.replace("/login");
          }
        }
      ]
    );
  };

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
            marginBottom: SIZES.medium,
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

        <TouchableOpacity
          style={{
            padding: SIZES.medium,
            backgroundColor: "#FE7654",
            borderRadius: SIZES.small,
            ...SHADOWS.medium,
          }}
          onPress={handleLogout}
        >
          <Text
            style={{
              color: COLORS.lightWhite,
              fontSize: SIZES.medium,
              fontFamily: "DMBold",
              textAlign: "center",
            }}
          >
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SettingsMenu; 