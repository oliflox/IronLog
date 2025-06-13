import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable } from 'react-native';

import CalendarScreen from '../screens/CalendarScreen';
import ProfileScreen from '../screens/ProfileScreen';
import TimerScreen from '../screens/TimerScreen';
import WorkoutExercises from '../screens/WorkoutExercises';
import WorkoutLogScreen from '../screens/WorkoutLogScreen';
import WorkoutScreen from '../screens/WorkoutScreen';
import WorkoutSessionsScreen from '../screens/WorkoutSessionsScreen';
import { navigationOptions, navigationStyles } from '../styles/navigation';

import { theme } from '../styles/theme';

export type RootStackParamList = {
  Main: undefined;
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

const AddButton = () => (
  <Pressable
    style={navigationStyles.addButton}
    onPress={() => {
      // TODO: Implémenter l'action du bouton add
    }}
  >
    <Ionicons name="add" size={30} color="#fff" />
  </Pressable>
);

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Workout') {
            iconName = focused ? 'barbell' : 'barbell-outline';
          } else if (route.name === 'Profil') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Timer') {
            iconName = focused ? 'timer' : 'timer-outline';
          } else if (route.name === 'Calendar') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.accent,
        tabBarStyle: navigationStyles.tabBar,
        tabBarShowLabel: false,
      })}
    >
      <Tab.Screen name="Workout" component={WorkoutScreen} />
      <Tab.Screen name="Timer" component={TimerScreen} />
      <Tab.Screen
        name="Add"
        component={EmptyScreen}
        options={{
          tabBarButton: () => <AddButton />,
        }}
      />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const EmptyScreen = () => null;

const AppNavigator = () => {
  return (
    <Stack.Navigator 
      initialRouteName="Main"
      screenOptions={({ navigation }) => ({
        ...navigationOptions,
        headerLeft: () => (
          <Pressable onPress={() => navigation.goBack()}>
            <Ionicons style={navigationStyles.backButton} name="chevron-back"  />
          </Pressable>
        ),
      })}
    >
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen
        name="WorkoutSessions" 
        component={WorkoutSessionsScreen}
        options={{
          headerShown: true,
          title: '',
        }}
      />
      <Stack.Screen 
        name="WorkoutExercises" 
        component={WorkoutExercises}
        options={{
          headerShown: true,
          title: '',
        }}
      />
      <Stack.Screen 
        name="WorkoutLog" 
        component={WorkoutLogScreen}
        options={{
          headerShown: true,
          title: '',
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
