import { Stack } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { EditModeProvider } from "../contexts/EditModeContext";
import { initDatabase } from "../storage/database";

export default function RootLayout() {
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await initDatabase();
        console.log('Base de données initialisée avec succès');
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de la base de données:', error);
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
