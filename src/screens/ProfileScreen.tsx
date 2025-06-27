import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback } from "react";
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from "react-native";
import { useProfile } from "../hooks/useProfile";
import { profileStyles } from "../styles/profile";

const ProfileScreen = () => {
  const {
    profile,
    weeklyStats,
    topExercises,
    lastWorkout,
    loading,
    error,
    refreshData
  } = useProfile();
  const router = useRouter();

  // Rafraîchir les données quand on revient sur cette page
  useFocusEffect(
    useCallback(() => {
      refreshData();
    }, [])
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long' 
    });
  };

  const getAvatarSource = () => {
    if (profile?.avatar) {
      return { uri: profile.avatar };
    }
    return require('../assets/images/icon.png');
  };

  if (loading) {
    return (
      <View style={[profileStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 16 }}>Chargement du profil...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[profileStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: 'red', marginBottom: 16 }}>Erreur: {error}</Text>
        <Pressable style={profileStyles.editButton} onPress={refreshData}>
          <Text style={profileStyles.editButtonText}>Réessayer</Text>
        </Pressable>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={[profileStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Aucun profil trouvé</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={profileStyles.container}
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      {/* Bloc Profil */}
      <View style={profileStyles.profileBlock}>
        <Image source={getAvatarSource()} style={profileStyles.avatar} />
        <Text style={profileStyles.name}>
          {profile.firstName} {profile.lastName}
        </Text>
        <Text style={profileStyles.lastWorkout}>
          Dernier entraînement : {lastWorkout ? formatDate(lastWorkout) : 'Aucun'}
        </Text>
        <Pressable 
          style={profileStyles.editButton}
          onPress={() => router.push("/edit-profile")}
        >
          <Text style={profileStyles.editButtonText}>Edit Profile</Text>
        </Pressable>
      </View>

      {/* Bloc Mensurations */}
      <View style={profileStyles.measurementsBlock}>
        <Text style={profileStyles.measurementsTitle}>Mensurations</Text>
        {profile.measurements && profile.measurements.length > 0 ? (
          <View style={profileStyles.measurementsRow}>
            {profile.measurements.map((item) => (
              <View key={item.id} style={profileStyles.measurementItem}>
                <Text style={profileStyles.measurementLabel}>{item.label}</Text>
                <Text style={profileStyles.measurementValue}>
                  {item.value} {item.unit}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={{ textAlign: 'center', color: '#666', fontStyle: 'italic', marginTop: 16 }}>
            Aucune mensuration enregistrée
          </Text>
        )}
      </View>

      {/* Résumé Hebdo */}
      <View style={profileStyles.weeklyBlock}>
        <Text style={profileStyles.weeklyTitle}>Résumé hebdo</Text>
        <View style={profileStyles.weeklyStatsRow}>
          <View style={profileStyles.weeklyStat}>
            <Text style={profileStyles.statValue}>
              {weeklyStats.reps > 0 ? weeklyStats.reps.toLocaleString() : 'N/A'}{" "}
              <Text style={profileStyles.statLabel}>Reps</Text>
            </Text>
          </View>
          <View style={profileStyles.weeklyStat}>
            <Text style={profileStyles.statValue}>
              {weeklyStats.weight > 0 ? weeklyStats.weight.toLocaleString() : 'N/A'}{" "}
              <Text style={profileStyles.statLabel}>kg</Text>
            </Text>
          </View>
          <View style={profileStyles.weeklyStat}>
            <Text style={profileStyles.statValue}>
              {weeklyStats.workouts > 0 ? weeklyStats.workouts : 'N/A'}{" "}
              <Text style={profileStyles.statLabel}>Séances</Text>
            </Text>
          </View>
        </View>
      </View>

      {/* Stats Exos */}
      <View style={profileStyles.statsBlock}>
        <Text style={profileStyles.statsTitle}>Records principaux</Text>
        {topExercises.length > 0 ? (
          topExercises.map((ex) => (
            <View key={ex.name} style={profileStyles.recordRow}>
              <Text style={profileStyles.recordLabel}>{ex.name}</Text>
              <Text style={profileStyles.recordValue}>{ex.record}</Text>
            </View>
          ))
        ) : (
          <Text style={{ textAlign: 'center', color: '#666', fontStyle: 'italic', marginTop: 16 }}>
            Aucun record enregistré
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
