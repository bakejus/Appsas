import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../services/supabase';
import styles from './styles';
import { Pedometer } from 'expo-sensors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import NavBar from '../NavBar';
import Alert, { ALERT_TYPE, Toast, AlertNotificationRoot } from 'react-native-alert-notification';
import { StepNotifications } from './StepNotifications';

const HomeScreen = ({ navigation }) => {
    const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
    const [stepsCount, setStepsCount] = useState(0);
    const [distance, setDistance] = useState(0);
    const [caloriesBurned, setCaloriesBurned] = useState(0);
    const [username, setUsername] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [likedPosts, setLikedPosts] = useState(new Set()); // Store liked post IDs for efficient checking
    const [searchText, setSearchText] = useState('');

    const dailyWantedSteps = 10000;
    const [notified, setNotified] = useState(false);

    StepNotifications(stepsCount, dailyWantedSteps, notified, setNotified);

    

    const calculateCalories = (steps) => {
        const caloriesPerStep = 0.04;
        setCaloriesBurned(steps * caloriesPerStep);
    };

    const getStepsSinceMidnight = async () => {
        try {
            const now = new Date();
            const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            const result = await Pedometer.getStepCountAsync(startOfDay, now);
            if (result && result.steps !== undefined) {
                setStepsCount(result.steps);
                await AsyncStorage.setItem('stepsCount', result.steps.toString());
                calculateCalories(result.steps);
                setDistance(result.steps * 170 * 0.414 / 100000);
            } else {
                console.log('No step count data available');
            }
        } catch (error) {
            console.log('Error fetching step count:', error);
        }
    };

    // Main data fetching - combined user and posts
    useEffect(() => {
        let subscription;
        let isMounted = true;

        const loadSteps = async () => {
            try {
                // Retrieve stored steps
                const storedSteps = await AsyncStorage.getItem('stepsCount');
                if (storedSteps !== null && isMounted) {
                    const parsedSteps = parseInt(storedSteps, 10);
                    setStepsCount(parsedSteps);
                    calculateCalories(parsedSteps);
                    setDistance(parsedSteps * 170 * 0.414 / 100000);
                }

                // Check pedometer availability
                const isAvailable = await Pedometer.isAvailableAsync();
                if (isMounted) {
                    setIsPedometerAvailable(isAvailable ? 'Available' : 'Not available');
                }

                if (isAvailable && isMounted) {
                    try {
                        await getStepsSinceMidnight();
                    } catch (error) {
                        console.log('Error fetching step count:', error);
                    }

                    // Watch for live step updates
                    subscription = Pedometer.watchStepCount(result => {
                        if (isMounted) {
                            setStepsCount(prevSteps => {
                                const updatedSteps = prevSteps + result.steps;
                                AsyncStorage.setItem('stepsCount', updatedSteps.toString());
                                calculateCalories(updatedSteps);
                                setDistance(updatedSteps * 170 * 0.414 / 100000);
                                return updatedSteps;
                            });
                        }
                    });
                }
            } catch (error) {
                console.error('Error loading steps:', error);
            }
        };

        loadSteps();

        const fetchData = async () => {
            try {
                // Get the authenticated user
                const { data: { user }, error: userError } = await supabase.auth.getUser();

                if (userError || !user) {
                    console.log('Error fetching authenticated user:', userError);
                    return;
                }

                console.log('Auth user email:', user.email);

                // Fetch username from USER table using email
                const { data: userData, error: userDataError } = await supabase
                    .from('USER')
                    .select('username')
                    .eq('email', user.email)
                    .single();

                if (userDataError || !userData) {
                    console.log('Error fetching user data:', userDataError);
                    return;
                }

                const userUsername = userData.username;
                console.log('Found username:', userUsername);

                if (isMounted) {
                    setUsername(userUsername);

                    // Now fetch posts
                    console.log('Fetching posts for user:', userUsername);

                    // Get public posts (visibility = 3)
                    const { data: publicPosts, error: publicError } = await supabase
                        .from('POST')
                        .select(`
                               *,
                               ACTIVITY (
                                   duration,
                                   step_count,
                                   distance,
                                   calories_burned,
                                   date
                               ),
                                USER (
                                    picture_url
                                )
                           `)
                        .eq('visibility', 3);

                    console.log('Public posts:', publicPosts?.length || 0, publicError);
                    // Get own posts
                    const { data: ownPosts, error: ownPostsError } = await supabase
                        .from('POST')
                        .select(`
                               *,
                               ACTIVITY (
                                   duration,
                                   step_count,
                                   distance,
                                   calories_burned,
                                   date
                               ),
                                USER (
                                    picture_url
                                )
                           `)
                        .eq('user', userUsername);

                    console.log('Own posts:', ownPosts?.length || 0, ownPostsError);

                    // Get friends
                    const { data: friends, error: friendError } = await supabase
                        .from('FRIEND')
                        .select('user1, user2')
                        .or(`user1.eq.${userUsername},user2.eq.${userUsername}`)
                        .eq('status', 'accepted');

                    console.log('Friends query result:', friends?.length || 0, friendError);

                    // Get friend posts if there are friends
                    let friendPosts = [];
                    if (friends && friends.length > 0) {
                        const friendUsernames = friends.map(f =>
                            f.user1 === userUsername ? f.user2 : f.user1
                        );

                        console.log('Friend usernames:', friendUsernames);

                        if (friendUsernames.length > 0) {
                            const { data: friendPostsData } = await supabase
                            .from('POST')
                            .select(`
                                   *,
                                   ACTIVITY (
                                       duration,
                                       step_count,
                                       distance,
                                       calories_burned,
                                       date
                                   ),
                                    USER (
                                        picture_url
                                    )
                               `)
                                .eq('visibility', 2)
                                .in('user', friendUsernames);

                            friendPosts = friendPostsData || [];
                        }
                    }

                    // Combine and set posts
                    const combinedPosts = [
                        ...(publicPosts || []),
                        ...(ownPosts || []),
                        ...friendPosts
                    ];

                    // De-duplicate by post ID
                    const uniquePostsMap = new Map();
                    combinedPosts.forEach(post => {
                        uniquePostsMap.set(post.id, post);
                    });
                    const uniquePosts = Array.from(uniquePostsMap.values());

                    // Sort by date
                    uniquePosts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

                    console.log('Final posts count (deduped):', uniquePosts.length);
                    // Fetch likes for all post IDs
                    await fetchLikes(userUsername);

                    setPosts(uniquePosts);
                }
            } catch (error) {
                console.error('Error in fetchData:', error);
            }
        };

        fetchData();

        return () => {
            isMounted = false;
            if (subscription) {
                subscription.remove();
            }
        };
    }, []);
    const fetchLikes = async (currentUsername) => {
        if (!currentUsername) return;
        
        const { data: likesData, error: likesError } = await supabase
            .from('LIKE')
            .select('post')
            .eq('user', currentUsername);
    
        if (likesError) {
            console.log('Error fetching likes:', likesError);
            return;
        }
    
        const likedPostIds = new Set(likesData.map(like => like.post));
        setLikedPosts(likedPostIds);
    };
    const toggleLike = async (postId) => {
        if (!username) return; // Ensure the user is logged in

        try {
            // Check if the post is already liked
            if (likedPosts.has(postId)) {
                // Unlike the post: Delete the like
                await supabase
                    .from('LIKE')
                    .delete()
                    .eq('post', postId)
                    .eq('user', username);
            } else {
                await supabase
                    .from('LIKE')
                    .insert([{ post: postId, user: username }]);
            }
            // Fetch updated likes immediately after toggle
            await fetchLikes(username);
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    return (
        <View style={styles.homeContainer}>
            <AlertNotificationRoot>
            </AlertNotificationRoot>
                <FlatList
                    data={posts}
                    style={{ width: '100%', paddingHorizontal: 20, marginBottom: 40}}
                    keyExtractor={(item) => item.id.toString()}
                    ListHeaderComponent={
                        <>
                            <View style={styles.topBar}>
                                <Text style={styles.appName}>StepZen</Text>
                                <View style={styles.searchContainer}>
                                    <TextInput
                                      style={styles.searchInput}
                                      placeholder="Search..."
                                      value={searchText}
                                      onChangeText={setSearchText}
                                      onSubmitEditing={() => navigation.navigate('Profile', { username: searchText })}
                                      returnKeyType="search"
                                    />
                                    <Icon name="magnify" size={25} onPress={() => navigation.navigate('Profile', { username: searchText })} />
                                </View>
                            </View>
                            <View style={{ padding: 0 }}>
                                <Text style={styles.title}>Home</Text>
                                <View style={styles.statsContainer}>
                                    <Text testID="steps-count" style={styles.statText}>Steps Count: {stepsCount}</Text>
                                    <Text testID="distance" style={styles.statText}>Distance: {distance.toFixed(2)} km</Text>
                                    <Text testID="calories" style={styles.statText}>Calories Burned: {caloriesBurned.toFixed(2)} cal</Text>
                                    <Text testID="streak" style={styles.statText}>Streak: 0 days</Text>
                                </View>

                                {loading && <Text style={styles.statText}>Loading posts...</Text>}

                                {posts.length === 0 &&
                                    <View style={styles.statsContainer}>
                                        <Text style={styles.statText}>No posts found</Text>
                                    </View>
                                }
                            </View>
                        </>
                    }
                    renderItem={({ item: post }) => (
                        <View style={styles.postContainer}>
                            <Text style={styles.postTitle}>{post.title || 'Untitled'}</Text>
                            <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => navigation.navigate('Profile', { username: post.user })}>
                                <Image source={{ uri: post.USER?.picture_url }} style={{width: 20, height: 20, borderRadius: 50}} />
                                <Text style={styles.postUser}>@{post.user}</Text>
                                <Text style={styles.postUser}>{post.ACTIVITY?.date || 'No date'}</Text>
                            </TouchableOpacity>
                            <Text style={styles.postDescription}>{post.description || 'No description'}</Text>

                            {/* Activity Data */}
                            <View style={styles.activityContainer}>
                                <Text style={styles.activityText}>⏱ {post.ACTIVITY?.duration || '0'} mins</Text>
                                <Text style={styles.activityText}>🚶‍♂️ {post.ACTIVITY?.step_count || '0'} steps</Text>
                                <Text style={styles.activityText}>📏 {post.ACTIVITY?.distance.toFixed(2) || '0'} km</Text>
                                <Text style={styles.activityText}>🔥 {post.ACTIVITY?.calories_burned || '0'} cal</Text>
                            </View>

                            {/* Like button */}
                            <TouchableOpacity style={styles.likesRow} onPress={() => toggleLike(post.id)}>
                                <Icon
                                    name={likedPosts.has(post.id) ? 'cards-heart' : 'cards-heart-outline'}
                                    size={20}
                                    style={styles.icon}
                                />
                                <Text style={styles.likesText}>
                                    {post.likes + (likedPosts.has(post.id) ? 1 : 0)} {/* Update likes count dynamically */}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            <NavBar navigation={navigation} />
        </View>
    );
};

export default HomeScreen;