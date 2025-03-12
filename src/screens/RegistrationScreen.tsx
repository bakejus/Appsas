import React, { useState } from 'react';
import { View, TextInput, Text, Alert, TouchableOpacity } from 'react-native';
import { supabase } from '../services/supabase'; // Import Supabase service
import styles from '../styles/styles'; // Import styles

const RegisterScreen = ({ navigation }: any) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!username || !email || !password) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match.');
            return;
        }

        setLoading(true);

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) {
                Alert.alert('Registration failed', error.message);
            } else {
                const userId = data.user?.id;

                if (userId) {
                    const { error: dbError } = await supabase.from('USER').insert([
                        { id: userId, username: username, email: email },
                    ]);

                    if (dbError) {
                        Alert.alert('Database Error', dbError.message);
                    } else {
                        Alert.alert('Success', 'Account created. Please check your email for confirmation.');
                        navigation.replace('Login');
                    }
                }
            }
        } catch (error) {
            console.error('Error signing up:', error);
        }

        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign Up</Text>
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="oneTimeCode"
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="oneTimeCode"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                textContentType="oneTimeCode"
            />
            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                textContentType="oneTimeCode"
            />
            <TouchableOpacity
                style={styles.button}
                onPress={handleRegister}
                disabled={loading} // Disable button when loading
            >
                <Text style={styles.buttonText}>
                    {loading ? 'Registering...' : 'Sign Up'}
                </Text>
            </TouchableOpacity>

            <View style={styles.signupContainer}>
                <Text style={styles.signupText}>Already have an account? </Text>
                <Text style={styles.signupLink} onPress={() => navigation.replace('Login')}>
                    Log in
                </Text>
            </View>
        </View>
    );
};

export default RegisterScreen;
