import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import { supabase } from '../services/supabase'; // Import Supabase service
import styles from '../styles/styles'; // Import the styles

const LoginScreen = ({ navigation }: any) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);

    try {
      // Using Supabase to log in
      const { data, error } = await supabase.auth.signInWithPassword({
        email: username, // Supabase uses email for username
        password: password,
      });

      if (error) {
        Alert.alert('Invalid credentials');
      } else {
        console.log('Login successful', data);
        navigation.replace('Home'); // Navigate to Home on success
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }

    setLoading(false);
  };

  const handleResetPassword = async () => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(username);
      if (error) {
        Alert.alert('Error', error.message || 'Something went wrong');
      } else {
        Alert.alert('Password reset', 'Check your email for reset instructions.');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username (Email)"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title={loading ? 'Logging in...' : 'Login'} onPress={handleLogin} disabled={loading} />
      <Button title="Forgot Password?" onPress={handleResetPassword} />
    </View>
  );
};

export default LoginScreen;
