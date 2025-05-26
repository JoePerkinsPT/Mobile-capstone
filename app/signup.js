import React, { useState } from "react";
import {
  View,
  SafeAreaView,
  Image,
  Alert,
  TextInput,
  Text,
  TouchableOpacity
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import { COLORS, icons, SHADOWS } from "../constants";

const SignUp = () => {
  const [userName, setUserName] = useState("");
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

    if (!userName.trim()) {
      newErrors.userName = "Username is required";
    } else if (userName.length < 3) {
      newErrors.userName = "Username must be at least 3 characters";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      // Check if user already exists
      const existingUsers = await AsyncStorage.getItem("userDetails");
      if (existingUsers) {
        const users = JSON.parse(existingUsers);
        if (users.email === email) {
          Alert.alert("Error", "An account with this email already exists");
          return;
        }
      }

      const userDetails = { userName, email, password, token: "sample-token" };
      await AsyncStorage.setItem("userDetails", JSON.stringify(userDetails));
      Alert.alert("Success", "Account created successfully!", [
        {
          text: "OK",
          onPress: () => router.push("/login")
        }
      ]);
    } catch (error) {
      console.error("Registration error:", error);
      Alert.alert("Error", "Failed to create account. Please try again.");
    }
  };

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
        <Stack.Screen
          options={{
            headerStyle: { backgroundColor: COLORS.lightWhite },
            headerShadowVisible: false,
            headerLeft: () => <></>,
            headerTitle: "",
          }}
        />
        <View style={{ padding: 20 }} testID="signupContainer">
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
            testID="imageIcon"
          >
            <Image
              source={icons.menu}
              style={{
                width: 50,
                height: 50,
              }}
            />
          </View>
          
          <View style={{ marginBottom: 10 }} testID="userName">
            <TextInput
              style={{
                borderColor: errors.userName ? "red" : "#ccc",
                borderWidth: 1,
                padding: 10,
                borderRadius: 5,
                marginBottom: 5,
              }}
              value={userName}
              onChangeText={(text) => {
                setUserName(text);
                setErrors({ ...errors, userName: null });
              }}
              placeholder="Username"
            />
            {errors.userName && (
              <Text style={{ color: "red", fontSize: 12, marginBottom: 10 }}>
                {errors.userName}
              </Text>
            )}
          </View>

          <View style={{ marginBottom: 10 }} testID="email">
            <TextInput
              style={{
                borderColor: errors.email ? "red" : "#ccc",
                borderWidth: 1,
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
          </View>

          <View style={{ marginBottom: 20 }} testID="password">
            <TextInput
              style={{
                borderColor: errors.password ? "red" : "#ccc",
                borderWidth: 1,
                padding: 10,
                borderRadius: 5,
                marginBottom: 5,
              }}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setErrors({ ...errors, password: null });
              }}
              secureTextEntry={true}
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
              marginBottom: 10,
            }}
            onPress={handleRegister}
            testID="handleRegister"
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>Sign Up</Text>
          </TouchableOpacity>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 5,
            }}
            testID="textData"
          >
            <Text style={{ marginRight: 5 }}>Already have an account?</Text>
            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text style={{ color: "blue" }}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default SignUp; 