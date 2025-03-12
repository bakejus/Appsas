import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { supabase } from '../../services/supabase';
import styles from './styles';

const ProfileScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState<string | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [steps, setSteps] = useState<number | null>(null);
  const [calories, setCalories] = useState<number | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
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

      setEmail(user.email || null);
      setUserId(user.id);

      const { data: activityData, error: activityError } = await supabase
        .from('ACTIVITY')
        .select();
        // .select('distance, step_count, calories_burned')
        // .eq('userId', user.id);

      console.log('Activity Data:', activityData); //testinu

      if (activityError) {
        console.log('Error fetching activity data from ACTIVITY table:', activityError);
      } else if (activityData) {
        // setDistance(activityData.distance);
        // setSteps(activityData.step_count);
        // setCalories(activityData.calories_burned);
      }

      setLoading(false);
    };

    fetchUserData();
  }, [userId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0077b6" />;
  }

  return (
    <View style={styles.profileContainer}>
      <Text style={styles.title}>My Profile</Text>
      <Text style={styles.infoText}>Email: {email}</Text>

      <Text style={styles.infoText}>Total Distance: {distance} km</Text>
      <Text style={styles.infoText}>Total Steps: {steps}</Text>
      <Text style={styles.infoText}>Calories Burned: {calories}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.buttonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;
