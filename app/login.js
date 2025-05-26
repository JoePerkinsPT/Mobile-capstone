import React, { useState } from "react";
import { View, SafeAreaView, Image, Alert, Text, TextInput, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import { COLORS, icons, SHADOWS } from "../constants";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const detailsDatafromSignup = await AsyncStorage.getItem("userDetails");
      
      if (!detailsDatafromSignup) {
        Alert.alert(
          "Error",
          "No account found. Please sign up first.",
          [
            {
              text: "Sign Up",
              onPress: () => router.push("/signup")
            },
            {
              text: "Cancel",
              style: "cancel"
            }
          ]
        );
        return;
      }

      const parsedDetails = JSON.parse(detailsDatafromSignup);
      
      if (email === parsedDetails.email && password === parsedDetails.password) {
        // Save the logged-in user's details
        await AsyncStorage.setItem("userDetails", JSON.stringify(parsedDetails));
        router.push("/home");
      } else {
        Alert.alert(
          "Login Failed",
          "Incorrect email or password. Please try again.",
          [
            {
              text: "Forgot Password",
              onPress: () => {
                // TODO: Implement forgot password functionality
                Alert.alert("Coming Soon", "Password reset functionality will be available soon.");
              }
            },
            {
              text: "Try Again",
              style: "cancel"
            }
          ]
        );
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "An error occurred during login. Please try again.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.lightWhite },
          headerShadowVisible: false,
          headerLeft: () => <></>,
          headerTitle: "",
        }}
      />
      <View style={{ padding: 20 }}>
        <View
          style={{
            padding: 20,
            marginLeft: "auto",
            marginRight: "auto",
            backgroundColor: "#f0f0f0",
            borderRadius: 50,
            height: 90,
            ...SHADOWS.medium,
            shadowColor: COLORS.white,
          }}
        >
          <Image
            source={icons.menu}
            style={{
              width: 50,
              height: 50,
              marginBottom: 20,
            }}
          />
        </View>
        <View style={{ marginTop: 20 }}>
          <View style={{ marginBottom: 20 }}>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: errors.email ? "red" : "#ccc",
                padding: 10,
                borderRadius: 5,
                marginBottom: 5,
              }}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setErrors({ ...errors, email: null });
              }}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && (
              <Text style={{ color: "red", fontSize: 12, marginBottom: 10 }}>
                {errors.email}
              </Text>
            )}
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: errors.password ? "red" : "#ccc",
                padding: 10,
                borderRadius: 5,
                marginBottom: 5,
              }}
              value={password}
              secureTextEntry={true}
              onChangeText={(text) => {
                setPassword(text);
                setErrors({ ...errors, password: null });
              }}
              placeholder="Password"
            />
            {errors.password && (
              <Text style={{ color: "red", fontSize: 12, marginBottom: 10 }}>
                {errors.password}
              </Text>
            )}
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: COLORS.primary,
              padding: 15,
              borderRadius: 5,
              alignItems: "center",
            }}
            onPress={handleLogin}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>Login</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            margin: 10,
          }}
        >
          <Text style={{ marginRight: 5 }}>
            Don't have an account?
          </Text>
          <TouchableOpacity onPress={() => router.push("/signup")}>
            <Text style={{ color: "blue" }}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login; 