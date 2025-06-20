import { Stack } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { EditModeProvider } from "../contexts/EditModeContext";
import { initDatabase } from "../storage/database";
import { timerRepository } from "../storage/timerRepository";

export default function RootLayout() {
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await initDatabase();
        await timerRepository.initializeDefaultTimers();
        console.log('Base de données et timers initialisés avec succès');
      } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
      }
    };

    initializeApp();
  }, []);

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
