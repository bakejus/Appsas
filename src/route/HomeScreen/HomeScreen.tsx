import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../services/supabase';
import styles from './styles';
import { Pedometer } from 'expo-sensors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import NavBar from '../NavBar';
import Alert, { ALERT_TYPE, Toast, AlertNotificationRoot } from 'react-native-alert-notification';
import { StepNotifications } from './StepNotifications';

const HomeScreen = ({ navigation }) => {
    const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
    const [stepsCount, setStepsCount] = useState(0);
    const [distance, setDistance] = useState(0);
    const [caloriesBurned, setCaloriesBurned] = useState(0);

    const dailyWantedSteps = 10000; // should get user number from database
    const [notified, setNotified] = useState(false);

    StepNotifications(stepsCount, dailyWantedSteps, notified, setNotified);

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
            <AlertNotificationRoot>
            <ScrollView>
                <View style={styles.topBar}>
                    <Text style={styles.appName}>StepZen</Text>
                    <TouchableOpacity style={styles.navBarButton} >
                        <Icon name="magnify" size={30} style={styles.icon} />
                        <Text style={styles.navBarButtonText}>Home</Text>
                    </TouchableOpacity>
                </View>
                <View style={{padding: 20}}>
                <Text style={styles.title}>Home</Text>
                <View style={styles.statsContainer}>
                    <Text testID="steps-count" style={styles.statText}>Steps Count: {stepsCount}</Text>
                    <Text testID="distance" style={styles.statText}>Distance: {distance.toFixed(2)} km</Text>
                    <Text testID="calories" style={styles.statText}>Calories Burned: {caloriesBurned.toFixed(2)} cal</Text>
                </View>
                <View style={styles.statsContainer}>
                        <Text style={styles.statText}>POST</Text>
                        <Text style={styles.statText}>pooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooost</Text>
                </View>
                <View style={styles.statsContainer}>
                        <Text style={styles.statText}>POST</Text>
                        <Text style={styles.statText}>pooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooost</Text>
                </View>
                <View style={styles.statsContainer}>
                        <Text style={styles.statText}>POST</Text>
                        <Text style={styles.statText}>pooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooost</Text>
                </View>
                </View>
            </ScrollView>
            </AlertNotificationRoot>
            <NavBar navigation={navigation}/>
        </View>

    );
};

export default HomeScreen;
