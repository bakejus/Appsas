import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../services/supabase';
import styles from './styles';

const HomeScreen = ({ navigation }: any) => {
  const stepsCount = 1253;
  const flightsClimbed = 5;
  const caloriesBurned = 450;

  const handleLogout = async () => {
      try {
          await supabase.auth.signOut();
          await AsyncStorage.removeItem('rememberUser');
          await AsyncStorage.removeItem('userSession');

          navigation.replace('Login');
      } catch (error) {
            console.log('Error logging out:', error);
      }
  };

  return (
    <View style={styles.homeContainer}>
      <Text style={styles.title}>Home</Text>
      <View style={styles.statsContainer}>
        <Text style={styles.statText}>Steps Count: {stepsCount}</Text>
        <Text style={styles.statText}>Flights Climbed: {flightsClimbed}</Text>
        <Text style={styles.statText}>Calories Burned: {caloriesBurned} kcal</Text>
      </View>

      {/* Button Container */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogout}
        >
          <Text style={styles.buttonText}>Log Out</Text>
        </TouchableOpacity>

          <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('LeaderBoard')}
          >
              <Text style={styles.buttonText}>Leaderboards</Text>
          </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={styles.buttonText}>Profile</Text>
        </TouchableOpacity>


      </View>
    </View>
  );
};

export default HomeScreen;
