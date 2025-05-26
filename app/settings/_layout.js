import { Stack } from "expo-router";

export default function SettingsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="ThemeChange"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Favourites"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
} 