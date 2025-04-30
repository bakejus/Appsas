import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '../../services/supabase';
import styles from './styles';

const SettingsScreen = ({ navigation }: any) => {
  const [username, setUsername] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [steps, setSteps] = useState('');
  const [email, setEmail] = useState<string | null>(null);


  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setEmail(user.email);

      const { data, error } = await supabase
        .from('USER')
        .select('username, name, weight, height, daily_steps')
        .eq('email', user.email)
        .single();

      if (error || !data) {
        console.log('Error fetching user:', error);
        return;
      }

      setUsername(data.username);
      setName(data.name || '');
      setWeight(data.weight?.toString() || '');
      setHeight(data.height?.toString() || '');
      setSteps(data.daily_steps?.toString() || '');
    };

    fetchUserData();
  }, []);

  const validateAndSave = async () => {
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    const stepsNum = parseFloat(steps);


    if (!name.trim()) {
      Alert.alert('Validation Error', 'Name cannot be empty.');
      return;
    }
    if (isNaN(heightNum) || heightNum < 50 || heightNum > 300) {
      Alert.alert('Validation Error', 'Height must be between 50 and 300 cm.');
      return;
    }
    if (isNaN(weightNum) || weightNum < 30 || weightNum > 600) {
      Alert.alert('Validation Error', 'Weight must be between 30 and 600 kg.');
      return;
    }
    if (isNaN(stepsNum) || stepsNum < 0) {
      Alert.alert('Validation Error', 'Daily step goal should be more than 10000.');
      return;
    }

    if (!username) return;

    const { error } = await supabase
      .from('USER')
      .update({ name: name.trim(), height: heightNum, weight: weightNum, daily_steps: steps })
      .eq('email', email);


    if (error) {
      console.error('Update error:', error);
      Alert.alert('Error', 'Failed to update settings.');
    } else {
      Alert.alert('Success', 'Settings updated successfully.');
    }
  };

  return (
    <View style={styles.profileContainer}>
      <Text style={styles.title}>Edit Profile</Text>

      <Text style={styles.settingLabel}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.settingLabel}>Weight (kg)</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 75"
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
      />

      <Text style={styles.settingLabel}>Height (cm)</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 180"
        keyboardType="numeric"
        value={height}
        onChangeText={setHeight}
      />
      <Text style={styles.settingLabel}>Daily step goal</Text>
      <TextInput
          style={styles.input}
          placeholder="e.g. 10000"
          keyboardType="numeric"
          value={steps}
          onChangeText={setSteps}
      />

      <TouchableOpacity style={styles.button} onPress={validateAndSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: '#ccc' }]} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SettingsScreen;
