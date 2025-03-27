import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { supabase } from '../../services/supabase';
import styles from './styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import NavBar from '../NavBar'
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ navigation }: any) => {
  const [duration, setDuration] = useState<number | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [steps, setSteps] = useState<number | null>(null);
  const [calories, setCalories] = useState<number | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.log('Error fetching authenticated user:', userError);
        setLoading(false);
        return;
      }

      const { data: userData, error: userDataError } = await supabase
          .from('USER')
          .select('username')
          .eq('email', user.email)
          .single();

      if (userDataError || !userData) {
          console.log('Error fetching user data:', userDataError);
          setLoading(false);
          return;
      }

      setUsername(userData.username);

      const { data: data, error: error } = await supabase
        .from('ACTIVITY')
        .select('duration, distance, step_count, calories_burned')
        .eq('userId', userData.username);


      if (error) {
        console.log('Error fetching activity data from ACTIVITY table:', error);
      } else if (data) {
        setDuration(() => {
          let sum = 0;
          for (let i of data) {
            sum += i.duration;
          }
          return sum;
        });
        setDistance( () => {
            let sum = 0;
            for (let i of data) {
                sum += i.distance;
            }
            return sum;
        });
        setSteps( () => {
            let sum = 0;
            for (let i of data) {
                sum += i.step_count;
            }
            return sum;
        });
        setCalories( () => {
            let sum = 0;
            for (let i of data) {
                sum += i.calories_burned;
            }
            return sum;
        });
      }

      setLoading(false);
    };

    fetchUserData();
  }, []);

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
    <View style={styles.profileContainer}>
      <Text style={styles.title}>My Profile</Text>
      <Text style={styles.infoText}>Total Duration: {duration} km</Text>
      <Text style={styles.infoText}>Total Distance: {distance} km</Text>
      <Text style={styles.infoText}>Total Steps: {steps}</Text>
      <Text style={styles.infoText}>Calories Burned: {calories} kcal</Text>

            <TouchableOpacity
                style={styles.button}
                onPress={handleLogout}
            >
                <Text style={styles.buttonText}>Log out</Text>
            </TouchableOpacity>

      <NavBar navigation={navigation}/>
    </View>
  );
};

export default ProfileScreen;
