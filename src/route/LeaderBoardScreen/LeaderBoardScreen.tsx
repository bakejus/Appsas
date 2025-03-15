import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { supabase } from '../../services/supabase';
import styles from './styles';

const LeaderboardScreen = ({ navigation }: any) => {
    const [selectedTab, setSelectedTab] = useState('all');
    const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchLeaderboard = useCallback(async () => {
        setLoading(true);

        const now = new Date();
        let filterDate = null;

        if (selectedTab === 'month') {
            filterDate = new Date(now.getFullYear(), now.getMonth(), 1);
        } else if (selectedTab === 'week') {
            filterDate = new Date(now);
            filterDate.setDate(now.getDate() - now.getDay());
        }

        let query = supabase
            .from('ACTIVITY')
            .select('duration, distance, step_count, calories_burned, date, userId')
            .order('distance', { ascending: false });

        if (filterDate) {
            query = query.gte('date', filterDate.toISOString());
        }

        const { data: data, error: error } = await query;
        if (error) {
            console.error('Error fetching leaderboard data:', error);
            setLoading(false);
            return;
        }


        // For each record, query the USER table to get the username.
        const updatedData = await Promise.all(
            data.map(async (record) => {
                const { data: userData, error: userError } = await supabase
                    .from('USER')
                    .select('username')
                    .eq('id', record.userId)
                    .single();

                if (userError) {
                    console.error('Error fetching user data for record', record, userError);
                    return { ...record, username: 'Unknown' };
                }
                return { ...record, username: userData.username };
            })
        );

        setLeaderboardData(updatedData || []);
        setLoading(false);
    }, [selectedTab]);

    useEffect(() => {
        fetchLeaderboard();
    }, [selectedTab, fetchLeaderboard]);

    const renderItem = ({ item, index }: { item: any; index: number }) => (
        <View style={styles.leaderboardItem}>
            <Text style={styles.leaderboardRank}>{index + 1}.</Text>
            <Text style={styles.leaderboardUsername}>{item.username || 'Unknown'}</Text>
            <Text style={styles.leaderboardScore}>{item.distance}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Leaderboard</Text>
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'all' && styles.activeTab]}
                    onPress={() => setSelectedTab('all')}
                >
                    <Text style={styles.tabText}>All Time</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'month' && styles.activeTab]}
                    onPress={() => setSelectedTab('month')}
                >
                    <Text style={styles.tabText}>Month</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'week' && styles.activeTab]}
                    onPress={() => setSelectedTab('week')}
                >
                    <Text style={styles.tabText}>Week</Text>
                </TouchableOpacity>
            </View>
            {loading ? (
                <ActivityIndicator size="large" />
            ) : (
                <FlatList
                    data={leaderboardData}
                    keyExtractor={(item) => (item.id ? item.id.toString() : Math.random().toString())}
                    renderItem={renderItem}
                />
            )}

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.replace('Home')}
                >
                    <Text style={styles.buttonText}>Back to Home</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default LeaderboardScreen;
