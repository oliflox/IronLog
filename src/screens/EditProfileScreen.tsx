import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import { useProfile } from "../hooks/useProfile";
import { profileStyles } from "../styles/profile";

// Mensurations prédéfinies
const PREDEFINED_MEASUREMENTS = [
  { label: 'Bras', unit: 'cm' },
  { label: 'Poitrine', unit: 'cm' },
  { label: 'Taille', unit: 'cm' },
  { label: 'Hanche', unit: 'cm' },
  { label: 'Cuisse', unit: 'cm' },
  { label: 'Mollet', unit: 'cm' },
  { label: 'Poids', unit: 'kg' },
  { label: 'Hauteur', unit: 'cm' },
];

const EditProfileScreen = () => {
  const {
    profile,
    loading,
    updateProfile,
    addMeasurement,
    updateMeasurement,
    deleteMeasurement,
  } = useProfile();
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [saving, setSaving] = useState(false);

  // États pour toutes les mensurations (nouvelles et existantes)
  const [measurementValues, setMeasurementValues] = useState<{[key: string]: string}>({});

  // Initialiser les valeurs quand le profil est chargé
  React.useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName || "");
      setLastName(profile.lastName || "");
      
      // Initialiser les mensurations
      const initialValues: {[key: string]: string} = {};
      PREDEFINED_MEASUREMENTS.forEach(m => {
        const existing = profile.measurements?.find(existing => existing.label === m.label);
        initialValues[m.label] = existing ? existing.value.toString() : '';
      });
      setMeasurementValues(initialValues);
    }
  }, [profile]);

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert("Erreur", "Le nom et le prénom sont obligatoires");
      return;
    }

    setSaving(true);
    try {
      // Sauvegarder les informations de base
      await updateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });

      // Sauvegarder toutes les mensurations
      for (const measurement of PREDEFINED_MEASUREMENTS) {
        const value = measurementValues[measurement.label];
        if (value && value.trim()) {
          const numValue = parseFloat(value);
          if (!isNaN(numValue) && numValue > 0) {
            const existing = profile?.measurements?.find(m => m.label === measurement.label);
            if (existing) {
              // Mettre à jour si la valeur a changé
              if (existing.value !== numValue) {
                await updateMeasurement(existing.id, numValue);
              }
            } else {
              // Ajouter nouvelle mensuration
              await addMeasurement(measurement.label, numValue, measurement.unit);
            }
          }
        } else {
          // Supprimer si la valeur est vide et qu'elle existait
          const existing = profile?.measurements?.find(m => m.label === measurement.label);
          if (existing) {
            await deleteMeasurement(existing.id);
          }
        }
      }

      Alert.alert("Succès", "Profil et mensurations mis à jour avec succès");
      router.back();
    } catch (error) {
      Alert.alert("Erreur", "Impossible de mettre à jour le profil");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[profileStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 16 }}>Chargement...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={profileStyles.container}>
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 24 }}>
          Éditer le profil
        </Text>

        {/* Informations de base */}
        <View style={{ marginBottom: 32 }}>
          <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 16 }}>
            Informations personnelles
          </Text>
          
          <View style={{ marginBottom: 16 }}>
            <Text style={{ marginBottom: 8, fontWeight: "500" }}>Prénom</Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#ddd",
                borderRadius: 8,
                padding: 12,
                fontSize: 16,
              }}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Votre prénom"
            />
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={{ marginBottom: 8, fontWeight: "500" }}>Nom</Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#ddd",
                borderRadius: 8,
                padding: 12,
                fontSize: 16,
              }}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Votre nom"
            />
          </View>
        </View>

        {/* Mensurations en grille */}
        <View style={{ marginBottom: 32 }}>
          <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 16 }}>
            Mensurations
          </Text>
          
          <View style={{ 
            flexDirection: 'row', 
            flexWrap: 'wrap', 
            justifyContent: 'space-between',
            gap: 12
          }}>
            {PREDEFINED_MEASUREMENTS.map((measurement) => {
              const value = measurementValues[measurement.label] || '';
              
              return (
                <View
                  key={measurement.label}
                  style={{
                    width: '48%',
                    backgroundColor: '#f8f9fa',
                    borderRadius: 12,
                    padding: 16,
                    borderWidth: 1,
                    borderColor: '#ddd',
                    minHeight: 100,
                  }}
                >
                  <Text style={{ 
                    fontWeight: "600", 
                    fontSize: 16, 
                    marginBottom: 8,
                    color: '#333'
                  }}>
                    {measurement.label}
                  </Text>
                  
                  <View style={{ 
                    flexDirection: 'row', 
                    alignItems: 'center',
                    marginBottom: 8
                  }}>
                    <TextInput
                      style={{
                        flex: 1,
                        borderWidth: 1,
                        borderColor: '#ddd',
                        borderRadius: 8,
                        padding: 8,
                        fontSize: 16,
                        backgroundColor: 'white',
                        textAlign: 'center',
                      }}
                      value={value}
                      onChangeText={(text) => setMeasurementValues(prev => ({ 
                        ...prev, 
                        [measurement.label]: text 
                      }))}
                      placeholder="0"
                      keyboardType="numeric"
                    />
                    <Text style={{ 
                      marginLeft: 8, 
                      fontWeight: "500",
                      color: '#666'
                    }}>
                      {measurement.unit}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Boutons d'action */}
        <View style={{ flexDirection: "row", gap: 12 }}>
          <Pressable
            onPress={() => router.back()}
            style={{
              flex: 1,
              backgroundColor: "#6c757d",
              padding: 16,
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontWeight: "600" }}>Annuler</Text>
          </Pressable>

          <Pressable
            onPress={handleSave}
            disabled={saving}
            style={{
              flex: 1,
              backgroundColor: "#28a745",
              padding: 16,
              borderRadius: 8,
              alignItems: "center",
              opacity: saving ? 0.6 : 1,
            }}
          >
            {saving ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={{ color: "white", fontWeight: "600" }}>Enregistrer</Text>
            )}
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

export default EditProfileScreen; 