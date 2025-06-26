import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { Text, View } from "react-native";
import EditSessionPopup from "../components/EditSessionPopup";
import GenericFlatList from "../components/GenericFlatList";
import GlobalAddButton from "../components/GlobalAddButton";
import { useEditMode } from "../contexts/EditModeContext";
import { useSessionManager } from "../hooks/useSessionManager";
import { RootStackParamList } from "../navigation/AppNavigator";
import { Session } from "../storage/sessionRepository";

type Props = NativeStackScreenProps<RootStackParamList, "WorkoutSessions">;

const WorkoutSessionsScreen = ({ route, navigation }: Props) => {
  const { programId } = route.params;
  const { sessions, error, loadSessions, deleteSession, reorderSessions, updateSession } = useSessionManager(programId);
  const { editMode } = useEditMode();
  const [editPopupVisible, setEditPopupVisible] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  
  const handleItemPress = (item: any) => {
    navigation.navigate("WorkoutExercises", { sessionId: item.id });
  };

  const handleDeleteSession = async (sessionId: string) => {
    await deleteSession(sessionId);
  };

  const handleReorderSessions = async (reorderedItems: any[]) => {
    await reorderSessions(reorderedItems);
  };

  const handleUpdateSession = (session: any) => {
    setSelectedSession(session);
    setEditPopupVisible(true);
  };

  const handleCloseEditPopup = () => {
    setEditPopupVisible(false);
    setSelectedSession(null);
  };

  const handleSaveSession = (updatedSession: Session) => {
    updateSession(updatedSession);
  };

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
        onUpdateItem={handleUpdateSession}
      />
      <GlobalAddButton 
        actionType="session"
        onRefresh={loadSessions}
        sessionWorkoutId={programId}
      />
      <EditSessionPopup
        visible={editPopupVisible}
        session={selectedSession}
        onClose={handleCloseEditPopup}
        onSave={handleSaveSession}
      />
    </>
  );
};

export default WorkoutSessionsScreen;
