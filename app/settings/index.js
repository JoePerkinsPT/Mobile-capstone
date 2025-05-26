import { Text, SafeAreaView, TouchableOpacity, View, Alert } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { COLORS, SHADOWS, SIZES } from "../../constants";
import { useTheme } from "../../context/ThemeProvider";
import ScreenHeaderBtn from "../../components/ScreenHeaderBtn";
import { userStorage, favoritesStorage, notificationsStorage } from "../../utils/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SettingsMenu = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const handleLogout = async () => {
    console.log("Logout button pressed");
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => console.log("Logout cancelled")
        },
        {
          text: "Logout",
          onPress: async () => {
            console.log("Logout confirmed, starting logout process");
            try {
              // Clear all user-related data
              console.log("Clearing user details...");
              await userStorage.clearUserDetails();
              console.log("Clearing favorites...");
              await favoritesStorage.clearFavorites();
              console.log("Clearing notifications...");
              await notificationsStorage.clearNotifications();
              console.log("Removing userDetails from AsyncStorage...");
              await AsyncStorage.removeItem("userDetails");
              
              console.log("All data cleared, navigating to login...");
              // Navigate to login page
              router.push("/login");
            } catch (error) {
              console.error("Error during logout:", error);
              Alert.alert("Error", "Failed to logout. Please try again.");
            }
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
          onPress={() => {
            console.log("Logout button pressed - direct handler");
            handleLogout();
          }}
          activeOpacity={0.7}
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