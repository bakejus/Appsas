import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/styles';
import { Pedometer } from 'expo-sensors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const NavBar = ({ navigation }) => {

    return (
        <View style={styles.navBar}>
            <TouchableOpacity style={styles.navBarButton} onPress={() => navigation.navigate('Home')}>
                <Icon name="home" size={20} style={styles.icon} />
                <Text style={styles.navBarButtonText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navBarButton} onPress={() => navigation.navigate('LeaderBoard')}>
                <Icon name="account-multiple" size={20} style={styles.icon} />
                <Text style={styles.navBarButtonText}>Leaderboard</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navBarButton} onPress={() => navigation.navigate('Profile')}>
                <Icon name="account" size={20} style={styles.icon} />
                <Text style={styles.navBarButtonText}>Account</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navBarButton} onPress={() => navigation.navigate('Activity')}>
                <Icon name="arm-flex" size={20} style={styles.icon} />
                <Text style={styles.navBarButtonText}>Record</Text>
            </TouchableOpacity>
        </View>
    );
};

export default NavBar;
