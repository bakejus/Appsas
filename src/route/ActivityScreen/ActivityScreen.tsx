import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Pedometer } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  }, []); // Empty dependency array ensures this effect only runs once on component mount

  // ➕ Function to manually add 100 steps
  const handleAddSteps = () => {
    setSteps(prevSteps => {
      const newSteps = prevSteps + 100;
      activity.updateSteps(newSteps);
      AsyncStorage.setItem('stepsCount', newSteps.toString());
      return newSteps;
    });
  };

  return (
    <View style={styles.profileContainer}>
      <Text style={styles.title}>Let's go!</Text>
      <Text style={styles.infoText}>Duration: {duration} sec</Text>
      <Text style={styles.infoText}>Distance: {distance.toFixed(2)} km</Text>
      <Text style={styles.infoText}>Average speed: {speed.toFixed(2)} min/km</Text>
      <Text style={styles.infoText}>Steps: {steps}</Text>
      <Text style={styles.infoText}>Calories Burned: {calories.toFixed(2)} cal</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleAddSteps}>
          <Text style={styles.buttonText}>Add 100 steps</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ActivityScreen;
