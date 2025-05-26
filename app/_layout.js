import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { ActivityIndicator, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeProvider } from "../context/ThemeProvider";

export const unstable_settings = {
  initialRouteName: "login",
};

const Layout = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [fontsLoaded] = useFonts({
    DMBold: require("../assets/fonts/DMSans-Bold.ttf"),
    DMMedium: require("../assets/fonts/DMSans-Medium.ttf"),
    DMRegular: require("../assets/fonts/DMSans-Regular.ttf"),
  });

  const checkLoginState = async () => {
    try {
      console.log("Checking login state...");
      const user = await AsyncStorage.getItem("userDetails");
      console.log("User details from storage:", user);
      setIsLoggedIn(!!user);
    } catch (error) {
      console.error("Error checking login state:", error);
      setIsLoggedIn(false);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // Check login state on mount
    checkLoginState();
  }, []);

  if (isLoading || !fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  console.log("Current login state:", isLoggedIn);

  return (
    <ThemeProvider>
      <Stack
        initialRouteName={isLoggedIn ? "home" : "login"}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="home" />
        <Stack.Screen name="settings" />
      </Stack>
    </ThemeProvider>
  );
};

export default Layout; 