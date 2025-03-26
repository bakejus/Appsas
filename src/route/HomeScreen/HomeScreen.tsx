import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../services/supabase';
import styles from './styles';
import { Pedometer } from 'expo-sensors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const HomeScreen = ({ navigation }) => {
    const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
    const [stepsCount, setStepsCount] = useState(0);
    const [distance, setDistance] = useState(0);
    const [caloriesBurned, setCaloriesBurned] = useState(0);

    useEffect(() => {
        let subscription;

        const loadSteps = async () => {
            try {
                // Retrieve stored steps
                const storedSteps = await AsyncStorage.getItem('stepsCount');
                if (storedSteps !== null) {
                    const parsedSteps = parseInt(storedSteps, 10);
                    setStepsCount(parsedSteps);
                    calculateCalories(parsedSteps); // ✅ Calculate calories immediately
                    setDistance(parsedSteps * 170 * 0.414 / 100000);
                }

                // Check pedometer availability
                const isAvailable = await Pedometer.isAvailableAsync();
                setIsPedometerAvailable(isAvailable ? 'Available' : 'Not available');

                if (isAvailable) {
                    await getStepsSinceMidnight();

                    // Watch for live step updates
                    subscription = Pedometer.watchStepCount(result => {
                        setStepsCount(prevSteps => {
                            const updatedSteps = prevSteps + result.steps;
                            AsyncStorage.setItem('stepsCount', updatedSteps.toString());
                            calculateCalories(updatedSteps); // ✅ Update calories live
                            setDistance(updatedSteps * 170 * 0.414 / 100000);
                            return updatedSteps;
                        });
                    });
                }
            } catch (error) {
                console.error('Error loading steps:', error);
            }
        };

        loadSteps();

        return () => {
            if (subscription) {
                subscription.remove();
            }
        };
    }, []);

    const getStepsSinceMidnight = async () => {
        try {
            const now = new Date();
            const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            const result = await Pedometer.getStepCountAsync(startOfDay, now);
            if (result && result.steps !== undefined) {
                setStepsCount(result.steps);
                await AsyncStorage.setItem('stepsCount', result.steps.toString());
                calculateCalories(result.steps); // ✅ Calculate immediately when loading data
                setDistance(result.steps * 170 * 0.414 / 100000);
            } else {
                console.log('No step count data available');
            }
        } catch (error) {
            console.log('Error fetching step count:', error);
        }
    };

    const calculateCalories = (steps) => {
        const caloriesPerStep = 0.04; // Example estimation
        setCaloriesBurned(steps * caloriesPerStep);
    };


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
                <Text style={styles.statText}>Distance: {distance.toFixed(2)} km</Text>
                <Text style={styles.statText}>Calories Burned: {caloriesBurned.toFixed(2)} cal</Text>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleLogout}>
                    <Icon name="logout" size={30} color="#000" />
                    <Text style={styles.buttonText}>Log out</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('LeaderBoard')}>
                    <Icon name="account-multiple" size={30} color="#000" />
                    <Text style={styles.buttonText}>Leaderboard</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Profile')}>
                    <Icon name="account" size={30} color="#000" />
                    <Text style={styles.buttonText}>Account</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Activity')}>
                    <Icon name="arm-flex" size={30} color="#000" />
                    <Text style={styles.buttonText}>Record</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default HomeScreen;
