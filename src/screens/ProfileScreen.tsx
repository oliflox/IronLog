import React from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { profileMock } from "../mock/profile";
import { profileStyles } from "../styles/profile";

const ProfileScreen = () => {
  return (
    <ScrollView
      style={profileStyles.container}
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      {/* Bloc Profil */}
      <View style={profileStyles.profileBlock}>
        <Image source={profileMock.avatar} style={profileStyles.avatar} />
        <Text style={profileStyles.name}>{profileMock.name}</Text>
        <Text style={profileStyles.lastWorkout}>
          Dernier entraînement : {profileMock.lastWorkout}
        </Text>
        <Pressable style={profileStyles.editButton}>
          <Text style={profileStyles.editButtonText}>Edit Profile</Text>
        </Pressable>
      </View>

      {/* Bloc Mensurations */}
      <View style={profileStyles.measurementsBlock}>
        <Text style={profileStyles.measurementsTitle}>Mensurations</Text>
        <View style={profileStyles.measurementsRow}>
          {profileMock.measurements.map((item) => (
            <View key={item.label} style={profileStyles.measurementItem}>
              <Text style={profileStyles.measurementLabel}>{item.label}</Text>
              <Text style={profileStyles.measurementValue}>
                {item.value} {item.unit}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Résumé Hebdo */}
      <View style={profileStyles.weeklyBlock}>
        <Text style={profileStyles.weeklyTitle}>Résumé hebdo</Text>
        <View style={profileStyles.weeklyStatsRow}>
          <View style={profileStyles.weeklyStat}>
            <Text style={profileStyles.statValue}>
              {profileMock.weekly.reps}{" "}
              <Text style={profileStyles.statLabel}>Reps</Text>
            </Text>
          </View>
          <View style={profileStyles.weeklyStat}>
            <Text style={profileStyles.statValue}>
              {profileMock.weekly.weight}{" "}
              <Text style={profileStyles.statLabel}>kg</Text>
            </Text>
          </View>
          <View style={profileStyles.weeklyStat}>
            <Text style={profileStyles.statValue}>
              {profileMock.weekly.workouts}{" "}
              <Text style={profileStyles.statLabel}>Séances</Text>
            </Text>
          </View>
        </View>
      </View>

      {/* Stats Exos */}
      <View style={profileStyles.statsBlock}>
        <Text style={profileStyles.statsTitle}>Records principaux</Text>
        {profileMock.topExercises.map((ex) => (
          <View key={ex.name} style={profileStyles.recordRow}>
            <Text style={profileStyles.recordLabel}>{ex.name}</Text>
            <Text style={profileStyles.recordValue}>{ex.record}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
