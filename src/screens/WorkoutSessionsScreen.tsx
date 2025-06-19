import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import GenericFlatList from "../components/GenericFlatList";
import GlobalAddButton from "../components/GlobalAddButton";
import { useEditMode } from "../contexts/EditModeContext";
import { useSessionManager } from "../hooks/useSessionManager";
import { RootStackParamList } from "../navigation/AppNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "WorkoutSessions">;

const WorkoutSessionsScreen = ({ route, navigation }: Props) => {
  const { programId } = route.params;
  const { sessions, isLoading, error, loadSessions, deleteSession, reorderSessions } = useSessionManager(programId);
  const { editMode } = useEditMode();
  
  const handleItemPress = (item: any) => {
    navigation.navigate("WorkoutExercises", { sessionId: item.id });
  };

  const handleDeleteSession = async (sessionId: string) => {
    await deleteSession(sessionId);
  };

  const handleReorderSessions = async (reorderedItems: any[]) => {
    await reorderSessions(reorderedItems);
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "red" }}>{error}</Text>
      </View>
    );
  }

  return (
    <>
      <GenericFlatList
        data={sessions}
        onItemPress={handleItemPress}
        title="Sessions"
        onDeleteItem={handleDeleteSession}
        onReorderItems={handleReorderSessions}
        editMode={editMode}
      />
      <GlobalAddButton 
        onRefresh={loadSessions}
        sessionWorkoutId={programId}
      />
    </>
  );
};

export default WorkoutSessionsScreen;
