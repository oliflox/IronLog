import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import GenericFlatList from "../components/GenericFlatList";
import GlobalAddButton from "../components/GlobalAddButton";
import { useSessions } from "../hooks/useSessions";
import { RootStackParamList } from "../navigation/AppNavigator";
import { Session, sessionRepository } from "../storage/sessionRepository";

type Props = NativeStackScreenProps<RootStackParamList, "WorkoutSessions">;

const WorkoutSessionsScreen = ({ route, navigation }: Props) => {
  const { programId } = route.params;
  const { sessions, isLoading, error, refreshSessions } =
    useSessions(programId);

  const handleItemPress = (item: any) => {
    navigation.navigate("WorkoutExercises", { sessionId: item.id });
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      await sessionRepository.deleteSession(sessionId);
      await refreshSessions();
    } catch (err) {
      console.error("Erreur lors de la suppression de la session:", err);
    }
  };

  const handleReorderSessions = async (reorderedItems: any[]) => {
    try {
      const reorderedSessions = reorderedItems.map((item, index) => ({
        ...item,
        order: index,
      })) as Session[];

      await sessionRepository.reorderSessions(reorderedSessions);
      await refreshSessions();
    } catch (err) {
      console.error("Erreur lors de la réorganisation des sessions:", err);
    }
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
      />
      <GlobalAddButton 
        onRefresh={refreshSessions}
        sessionWorkoutId={programId}
      />
    </>
  );
};

export default WorkoutSessionsScreen;
