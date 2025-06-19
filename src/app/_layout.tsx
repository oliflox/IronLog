import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { EditModeProvider } from "../contexts/EditModeContext";

export default function RootLayout() {
  return (
    <EditModeProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="index" />
        </Stack>
      </GestureHandlerRootView>
    </EditModeProvider>
  );
}
