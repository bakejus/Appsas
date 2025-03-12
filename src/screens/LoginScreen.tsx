import React, { useState } from 'react';
import {View, TextInput, Button, Text, Alert, TouchableOpacity} from 'react-native';
import { supabase } from '../services/supabase'; // Import Supabase service
import styles from '../styles/styles'; // Import the styles

const LoginScreen = ({ navigation }: any) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);

    try {
        let emailUsername = username;

        if(!emailUsername.includes('@')) {
            const { data, error } = await supabase
                .from('USER')
                .select('email')
                .eq('username', emailUsername)
                .single();
            console.log({data, error});
            if(error || !data) {
                Alert.alert('Invalid credentials');
                setLoading(false);
                return;
            }
            console.log(data.email);
            emailUsername = data?.email;
        }

      // Using Supabase to log in
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: emailUsername,
            password: password,
        });

      if (authError) {
        Alert.alert('Invalid credentials');
      } else {
        console.log('Login successful', authData);
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
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}  // Disable button when loading
      >
        <Text style={styles.buttonText}>
          {loading ? 'Logging in...' : 'Log in'}
        </Text>
      </TouchableOpacity>
      <Button title="Forgot Password?" onPress={handleResetPassword} />

      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don't have an account? </Text>
        <Text style={styles.signupLink} onPress={() => navigation.replace('Register')}>
          Sign Up
        </Text>
      </View>
    </View>
  );
};

export default LoginScreen;
