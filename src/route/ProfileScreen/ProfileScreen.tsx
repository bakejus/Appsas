import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList } from 'react-native';
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
  const [activities, setActivities] = useState([]);


  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.log('Error fetching authenticated user:', userError);
        setLoading(false);
        return;
      }

      // Fetch username
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
      setLoading(false);
    };

    fetchUserData();
  }, []);

  // ✅ Fetch activities only AFTER username is set
  useEffect(() => {
    if (username) {
      fetchActivities();
    }
  }, [username]);  // Runs again when `username` is updated


  const fetchActivities = async (userId) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('ACTIVITY')
      .select('*')
      .eq('userId', username)  // Use userId instead of username
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching activities:', error);
    } else {
      setActivities(data);
    }
    setLoading(false);
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
    <View style={styles.profileContainer}>
      <FlatList
        data={activities}
        style={styles.scroller}
        keyExtractor={(item) => item.id.toString()} // Ensure 'id' is unique
        renderItem={({ item }) => (
          <View style={styles.activityItem}>
            <Text style={styles.activityText}>
              📅 {new Date(item.date).toLocaleDateString()} - ⏱ {item.duration} sec
            </Text>
            <Text style={styles.activityText}>
              🚶‍♂️ {item.step_count} steps | 🏃 {item.distance.toFixed(2)} km | 🔥 {item.calories_burned.toFixed(2)} kcal
            </Text>
          </View>
        )}
        ListHeaderComponent={
          <>
            <Text style={styles.title}>My Profile</Text>
            <Text style={styles.infoText}>Total Duration: {duration} km</Text>
            <Text style={styles.infoText}>Total Distance: {distance} km</Text>
            <Text style={styles.infoText}>Total Steps: {steps}</Text>
            <Text style={styles.infoText}>Calories Burned: {calories} kcal</Text>

            <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={handleLogout}>
              <Text style={styles.buttonText}>Log out</Text>
            </TouchableOpacity>
            </View>
            <View style={styles.container}>
              <Text style={styles.title}>Past Activities</Text>
              {loading && <Text>Loading...</Text>}
              {activities.length === 0 && !loading && <Text>No past activities found.</Text>}
            </View>
          </>
        }
        contentContainerStyle={{ paddingBottom: 100 }} // Avoids cutting off last item
      />
      <NavBar navigation={navigation} />
    </View>


  );
};

export default ProfileScreen;
