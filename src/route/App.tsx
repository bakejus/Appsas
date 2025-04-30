import React, {useEffect, useState} from 'react';
import { View, ActivityIndicator} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './LoginScreen/LoginScreen';
import HomeScreen from './HomeScreen/HomeScreen';
import ProfileScreen from './ProfileScreen/ProfileScreen';
import Settings from './ProfileScreen/SettingsScreen';
import Friends from './ProfileScreen/FriendsScreen';
import RegistrationScreen from './RegistrationScreen/RegistrationScreen';
import LeaderBoardScreen from './LeaderBoardScreen/LeaderBoardScreen';
import SplashScreen from 'react-native-splash-screen';
import ActivityScreen from './ActivityScreen/ActivityScreen';
import ViewActivities from './ActivityScreen/ViewActivities';
import styles from '../styles/styles';

const Stack = createStackNavigator();

const App = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            SplashScreen.hide();
            setIsLoading(false);
        }, 1500);
    }, []);

    if (isLoading) {
        return (
            <View style={styles.splashContainer}>
                <ActivityIndicator size="large" color="#feb83d" />
            </View>
        );
    }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }} />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }} />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ headerShown: false }} />
        <Stack.Screen
          name="Registration"
          component={RegistrationScreen}
          options={{ headerShown: false }} />
          <Stack.Screen
              name="LeaderBoard"
              component={LeaderBoardScreen}
              options={{ headerShown: false }} />
          <Stack.Screen
            name="Activity"
            component={ActivityScreen}
            options={{ headerShown: false }} />
        <Stack.Screen
            name="ViewActivities"
            component={ViewActivities}
            options={{ headerShown: false }} />
        <Stack.Screen
            name="Settings"
            component={Settings}
            options={{ headerShown: false }} />
        <Stack.Screen
            name="Friends"
            component={Friends}
            options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
