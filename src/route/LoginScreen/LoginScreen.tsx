import React, { useState } from 'react';
import { View, TextInput, Text, Alert, TouchableOpacity } from 'react-native';
import { supabase } from '../../services/supabase';
import styles from './styles';

const LoginScreen = ({ navigation }: any) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      let emailUsername = username;

      if (!emailUsername.includes('@')) {
        const { data, error } = await supabase
          .from('USER')
          .select('email')
          .eq('username', emailUsername)
          .single();
        console.log({ data, error });
        if (error || !data) {
          setErrorMessage('Invalid credentials');
          setLoading(false);
          return;
        }
        console.log(data.email);
        emailUsername = data?.email;
      }

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: emailUsername,
        password: password,
      });

      if (authError) {
        setErrorMessage('Invalid credentials');
      } else {
        console.log('Login successful', authData);
        navigation.replace('Home');
      }
    } catch (error) {
      console.error('Error logging in:', error);
        setErrorMessage('Something went wrong');
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
    <View style={styles.loginContainer}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username (Email)"
        placeholderTextColor={styles.placeholder.color}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={styles.placeholder.color}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Logging in...' : 'Log in'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleResetPassword}>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>

      <View style={styles.loginContainer}>
        <Text style={styles.forgotPassword}>Don't have an account? </Text>
        <Text style={styles.linkText} onPress={() => navigation.replace('Registration')}>
          Sign Up
        </Text>
      </View>
    </View>
  );
};

export default LoginScreen;
