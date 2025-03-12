import React from 'react';
import { View, Text, Button} from 'react-native';
import styles from '../styles/styles'; // Import the styles

const HomeScreen = ({ navigation }: any) => {
  // Fake data for the home screen
  const stepsCount = 1253;  // Fake steps count
  const flightsClimbed = 5; // Fake flights climbed
  const caloriesBurned = 450; // Fake calories burned

  return (
    <View style={styles.homeContainer}>
      <Text style={styles.title}>Welcome to Home Screen!</Text>
      <View style={styles.statsContainer}>
        <Text style={styles.statText}>Steps Count: {stepsCount}</Text>
        <Text style={styles.statText}>Flights Climbed: {flightsClimbed}</Text>
        <Text style={styles.statText}>Calories Burned: {caloriesBurned} kcal</Text>
      </View>
      <Button title="Log Out" onPress={() => navigation.replace('Login')} />
    </View>
  );
};

export default HomeScreen;
