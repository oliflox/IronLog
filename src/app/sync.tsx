// import { Stack } from 'expo-router';
// import React, { useEffect, useState } from 'react';
// import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
// import { syncApi, Workout } from '../../app-example/api';

// export default function SyncScreen() {
//   const [data, setData] = useState<Workout[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [refreshing, setRefreshing] = useState(false);

//   const loadData = async () => {
//     try {
//       setError(null);
//       const workouts = await syncApi.getWorkouts();
//       setData(workouts);
//     } catch (err) {
//       setError('Erreur lors du chargement des données');
//       console.error(err);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     loadData();
//   }, []);

//   const onRefresh = () => {
//     setRefreshing(true);
//     loadData();
//   };

//   return (
//     <>
//       <Stack.Screen
//         options={{
//           title: 'Synchronisation',
//           headerShown: true,
//         }}
//       />
//       <ScrollView
//         style={styles.container}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//       >
//         {loading ? (
//           <View style={styles.centerContainer}>
//             <ActivityIndicator size="large" color="#007AFF" />
//           </View>
//         ) : error ? (
//           <View style={styles.centerContainer}>
//             <Text style={styles.errorText}>{error}</Text>
//           </View>
//         ) : data.length === 0 ? (
//           <View style={styles.centerContainer}>
//             <Text style={styles.errorText}>Aucune donnée disponible</Text>
//           </View>
//         ) : (
//           <View style={styles.dataContainer}>
//             {data.map((workout) => (
//               <View key={workout.id} style={styles.itemContainer}>
//                 <Text style={styles.itemTitle}>{workout.name}</Text>
//               </View>
//             ))}
//           </View>
//         )}
//       </ScrollView>
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   centerContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   dataContainer: {
//     padding: 16,
//   },
//   itemContainer: {
//     backgroundColor: '#f5f5f5',
//     padding: 16,
//     borderRadius: 8,
//     marginBottom: 12,
//   },
//   itemTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 8,
//   },
//   errorText: {
//     color: 'red',
//     fontSize: 16,
//     textAlign: 'center',
//   },
// }); 