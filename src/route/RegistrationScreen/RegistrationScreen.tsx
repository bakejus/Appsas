import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, Alert, TouchableOpacity } from 'react-native';
import { supabase } from '../../services/supabase';
import styles from './styles';

const RegisterScreen = ({ navigation }: any) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

    useEffect(() => {
        const debugSupabase = async () => {
            console.log("Testing Supabase connection...");

            // ✅ Step 1: Fetch all usernames from USER table
            const { data: users, error: usersError } = await supabase
                .from('USER')
                .select('username'); // Assuming 'username' is the primary key in USER

            if (usersError) {
                console.error("Error fetching users:", usersError);
                return;
            }

            if (!users || users.length === 0) {
                console.warn("No users found in the USER table.");
                return;
            }

            console.log("Fetched Users:", users);

            // ✅ Step 2: Fetch activities for each user dynamically
            for (const user of users) {
                console.log(`🔎 Fetching activities for user: ${user.username}`);

                const { data: activities, error: activitiesError } = await supabase
                    .from('ACTIVITY')
                    .select('*')
                    .eq('userId', user.username); // Assuming ACTIVITY.userId stores USER.username

                if (activitiesError) {
                    console.error(`Error fetching activities for user "${user.username}":`, activitiesError);
                } else if (!activities || activities.length === 0) {
                    console.warn(`No activities found for user "${user.username}".`);
                } else {
                    console.log(`Activities for user "${user.username}":`, activities);
                }
            }
        };

        debugSupabase();
    }, []);

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
            console.log("Checking if username or email already exists...");

            // Paziurim ar egzistuoja toks username ar email
            const { data: existingUser, error: checkUserError } = await supabase
                .from('USER')
                .select('username, email')
                .or(`username.eq.${username},email.eq.${email}`) // Check if username OR email exists
                .single(); // Fetch only one matching record

            if (checkUserError && checkUserError.code !== 'PGRST116') { // Ignore "no match found" error
                console.error("Error checking username/email existence:", checkUserError);
                Alert.alert('Error', 'Could not check username/email availability.');
                setLoading(false);
                return;
            }

            if (existingUser) {
                if (existingUser.username === username) {
                    console.warn("Username already taken:", username);
                    Alert.alert('Error', 'Username is already taken. Please choose another.');
                } else if (existingUser.email === email) {
                    console.warn("Email already registered:", email);
                    Alert.alert('Error', 'An account with this email already exists.');
                }
                setLoading(false);
                return;
            }

            console.log("Username and email are available. Proceeding with registration...");

            // Sukuriam nauja vartotoja
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) {
                console.error("Registration failed:", error);
                Alert.alert('Registration failed', error.message);
                setLoading(false);
                return;
            }

            console.log("User signed up successfully:", data);

            // Idedam vartotoja i USER lentele
            console.log("Inserting user into database: ", { username, email });

            const { error: dbError } = await supabase.from('USER').insert([
                { username: username, email: email },
            ]);

            if (dbError) {
                console.error("Database insertion failed:", dbError);
                Alert.alert('Database Error', dbError.message);
                setLoading(false);
                return;
            }

            console.log("User successfully added to USER table.");

            Alert.alert('Success', 'Account created. Please check your email for confirmation.');
            navigation.replace('Login');

        } catch (error) {
            console.error("Unexpected error during registration:", error);
            Alert.alert('Error', 'An unexpected error occurred.');
        }

        setLoading(false);
    };

  return (
    <View style={styles.registrationContainer}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor={styles.placeholder.color}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        autoCorrect={false}
        textContentType="oneTimeCode"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={styles.placeholder.color}
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
        placeholderTextColor={styles.placeholder.color}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        textContentType="oneTimeCode"
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor={styles.placeholder.color}
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        textContentType="oneTimeCode"
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleRegister}
        disabled={loading}
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
