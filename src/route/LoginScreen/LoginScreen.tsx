import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, Alert, ImageBackground, TouchableOpacity } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../services/supabase';
import styles from './styles';

const LoginScreen = ({ navigation }: any) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [rememberUser, setRememberUser] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const rememberMe = await AsyncStorage.getItem('rememberUser');
        const storedSession = await AsyncStorage.getItem('session');

        if (storedSession) {
          try {
            const parsedSession = JSON.parse(storedSession);
            const { data, error } = await supabase.auth.setSession(parsedSession);
            if (error) console.log('Error restoring session:', error);
          } catch (parseError) {
            console.error('Error parsing session data:', parseError);
          }
        }
        if (rememberMe === 'true' && storedSession) {
          const parsedSession = JSON.parse(storedSession);

          const { data, error } = await supabase.auth.setSession(parsedSession);

          if (error) {
            console.log('Error restoring session:', error);
          } else if (data.session) {
            console.log('User session restored:', data.session.user);
            navigation.replace('Home');
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
      }
    };

    checkSession();
  }, [navigation]);

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

        if (rememberUser) {
          await AsyncStorage.setItem('rememberUser', 'true');
          await AsyncStorage.setItem('session', JSON.stringify(authData.session));
        }
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
    <View style={{width:"100%", height:"100%"}}>
    <ImageBackground resizeMode="cover"
                     source={require('../../assets/3835.jpg')}
                     style={styles.background}
                              >
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
      <View style={styles.rememberUserContainer}>

          <CheckBox
              value={rememberUser}
              onValueChange={setRememberUser}
              style={styles.checkbox}
              onCheckColor="#feb83d"  // Checkmark color (iOS)
              onTintColor="#feb83d"   // Checkbox background when checked (iOS)
              tintColor="#888888"
          />
          <Text style={styles.rememberUserText}>Remember me</Text>
      </View>
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
    </ImageBackground>
    </View>
  );
};

export default LoginScreen;
