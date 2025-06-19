import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { Pressable } from "react-native";
import { useEditMode } from "../contexts/EditModeContext";
import CalendarScreen from "../screens/CalendarScreen";
import ProfileScreen from "../screens/ProfileScreen";
import TimerScreen from "../screens/TimerScreen";
import WorkoutExercises from "../screens/WorkoutExercises";
import WorkoutLogScreen from "../screens/WorkoutLogScreen";
import WorkoutScreen from "../screens/WorkoutScreen";
import WorkoutSessionsScreen from "../screens/WorkoutSessionsScreen";
import { navigationOptions, navigationStyles } from "../styles/navigation";
import { theme } from "../styles/theme";

export type RootStackParamList = {
  Workout: { refresh?: boolean};
  WorkoutSessions: { programId: string };
  WorkoutExercises: { sessionId: string };
  WorkoutLog: {
    exercise: {
      id: string;
      name: string;
      imageUrl: string;
      history: {
        date: string;
        sets: {
          id: string;
          repetitions: number;
          weight: number;
        }[];
      }[];
    };
  };
};

type RootTabParamList = {
  Workout: undefined;
  Timer: undefined;
  Add: undefined;
  Calendar: undefined;
  Profil: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

const EmptyScreen = () => null;

const WorkoutStack = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { editMode, toggleEditMode } = useEditMode();

  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        ...navigationOptions,
        headerLeft: () => (
          <Pressable onPress={() => navigation.goBack()}>
            <Ionicons style={navigationStyles.backButton} name="chevron-back" />
          </Pressable>
        ),
        headerRight: () => (
          <Pressable onPress={toggleEditMode} style={{ paddingRight: 15 }}>
            <Ionicons
              name={editMode ? "close" : "create-outline"}
              size={24}
              color={theme.colors.primary}
            />
          </Pressable>
        ),
      })}
    >
      <Stack.Screen
        name="Workout"
        component={WorkoutScreen}
        options={{
          headerShown: true,
          headerTitle: "Workout",
        }}
      />
      <Stack.Screen
        name="WorkoutSessions"
        component={WorkoutSessionsScreen}
        options={{
          headerShown: true,
          headerTitle: "Sessions",
        }}
      />
      <Stack.Screen
        name="WorkoutExercises"
        component={WorkoutExercises}
        options={{
          headerShown: true,
          headerTitle: "Exercices",
        }}
      />
      <Stack.Screen
        name="WorkoutLog"
        component={WorkoutLogScreen}
        options={{
          headerShown: true,
          headerTitle: "Historique",
        }}
      />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        ...navigationOptions,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case "Workout":
              iconName = focused ? "barbell" : "barbell-outline";
              break;
            case "Timer":
              iconName = focused ? "timer" : "timer-outline";
              break;
            case "Calendar":
              iconName = focused ? "calendar" : "calendar-outline";
              break;
            case "Profil":
              iconName = focused ? "person" : "person-outline";
              break;
            default:
              iconName = "help-circle";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.mainBg,
      })}
    >
      <Tab.Screen
        name="Workout"
        component={WorkoutStack}
        options={{
          headerShown: false,
          headerTitle: "Workout",
        }}
      />
      <Tab.Screen
        name="Timer"
        component={TimerScreen}
        options={{
          headerShown: true,
          headerTitle: "Timer",
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          headerShown: true,
          headerTitle: "Calendar",
        }}
      />
      <Tab.Screen
        name="Profil"
        component={ProfileScreen}
        options={{
          headerShown: true,
          headerTitle: "Profil",
        }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;
