import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Button, Alert } from 'react-native';
import { Pedometer } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../services/supabase';
import styles from './styles';
import Activity from '../../classes/Activity';
import Person from '../../classes/Person';

const ActivityScreen = ({ navigation }) => {
  const [activity, setActivity] = useState(() => new Activity(new Person()));
  const [duration, setDuration] = useState(0);
  const [distance, setDistance] = useState(0);
  const [steps, setSteps] = useState(0); // Start with 0 steps when the activity starts
  const [calories, setCalories] = useState(0);
  const [speed, setSpeed] = useState(0);

  useEffect(() => {
    let interval;
    let stepSubscription;

    // When the activity screen is loaded, we start tracking
    const startTrackingSteps = async () => {
      try {
        // Initialize pedometer and start tracking steps
        const isAvailable = await Pedometer.isAvailableAsync();
        if (isAvailable) {
          stepSubscription = Pedometer.watchStepCount(result => {
            setSteps(prevSteps => {
              const newSteps = prevSteps + result.steps;
              activity.updateSteps(newSteps);
              AsyncStorage.setItem('stepsCount', newSteps.toString()); // Save steps to AsyncStorage
              return newSteps;
            });
          });
        }
      } catch (error) {
        console.error('Error initializing pedometer:', error);
      }
    };

    startTrackingSteps();

    // Start timer for tracking activity stats
    interval = setInterval(() => {
      activity.updateTime(1);  // Update activity duration
      activity.calculateAvgSpeed(); // Update speed
      activity.calculateDistance(); // Update distance
      activity.calculateCaloriesBurnt(); // Update calories

      setDuration(activity.timeElapsed);
      setSpeed(activity.avgSpeed);
      setDistance(activity.distance);
      setCalories(activity.caloriesBurnt);
    }, 1000);

    return () => {
      if (stepSubscription) stepSubscription.remove();
      clearInterval(interval);
    };
  }, []);

  const handleSaveActivity = () => {
    Alert.alert(
          "Confirmation",
          "Do you wish to proceed?",
          [
            { text: "Cancel", style: "cancel" },
            { text: "OK", onPress: () => saveActivityToSupabase() }
          ]
        );
  };
  const saveActivityToSupabase = async () => {
    console.log('Saving...');

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error('Error fetching authenticated user:', userError);
        return;
      }

      // ✅ Fetch the username from the USER table
      const { data: userData, error: userDataError } = await supabase
        .from('USER')
        .select('username')
        .eq('email', user.email)  // Assuming email is used to identify the user
        .single();

      if (userDataError || !userData) {
        console.error('Error fetching username:', userDataError);
        return;
      }

      // ✅ Use the fetched username for userId
      const activityData = {
        date: new Date().toISOString(),
        duration,
        step_count: steps,
        distance,
        calories_burned: calories.toFixed(0),
        userId: userData.username,  // Use the fetched username instead of user.id
      };

      const { error } = await supabase.from('ACTIVITY').insert([activityData]);

      if (error) {
        console.error('Error inserting activity:', error);
      } else {
        console.log('Activity saved successfully!');
        navigation.navigate('Home');
      }
    } catch (error) {
      console.error('Error saving activity to Supabase:', error);
    }
  };


  const formatDuration = (totalSeconds) => {
    const seconds = Math.floor(totalSeconds); // Ensure it's always an integer
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  return (
    <View style={styles.profileContainer}>
      <Text style={styles.title}>LETS' GO!</Text>

      <View style={styles.container}>
          <View style={styles.square1}>
            <Text style={styles.infoText}>DURATION</Text>
            <Text style={styles.infoText}>{formatDuration(duration)} min</Text>
          </View>
          <View style={styles.square1}>
            <Text style={styles.infoText}>DISTANCE</Text>
            <Text style={styles.infoText}>{distance.toFixed(2)} km</Text>
          </View>
      </View>
      <View style={styles.container}>
          <View style={styles.square1}>
            <Text style={styles.infoText}>AVG SPEED</Text>
            <Text style={styles.infoText}>{formatDuration(speed*60)} min/km</Text>
          </View>
          <View style={styles.square1}>
            <Text style={styles.infoText}>CALS BURNED</Text>
            <Text style={styles.infoText}>{calories.toFixed(2)} cal</Text>
          </View>
      </View>
      <View style={styles.container}>
          <View style={styles.square2}>
            <Text style={styles.infoText}>STEPS</Text>
            <Text style={styles.infoText}>{steps}</Text>
          </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSaveActivity}>
          <Text style={styles.buttonText}>Finish</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ActivityScreen;
