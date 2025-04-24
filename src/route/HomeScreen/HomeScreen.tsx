import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
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

    const dailyWantedSteps = 10000;
    const [notified, setNotified] = useState(false);

    StepNotifications(stepsCount, dailyWantedSteps, notified, setNotified);

    // Pedometer functionality
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

        return () => {
            isMounted = false;
            if (subscription) {
                subscription.remove();
            }
        };
    }, []);

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
        let isMounted = true;

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
                            )
                        `)
                        .eq('visibility', 3); // Public posts

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
                                .select('*')
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
                    const postIds = uniquePosts.map(post => post.id);

                    const { data: likesData, error: likesError } = await supabase
                        .from('LIKE')
                        .select('post')  // Assuming each row has { post: id, user: username }
                        .in('post', postIds);

                    if (likesError) {
                        console.log('Error fetching likes:', likesError);
                    } else {
                        // Count likes per post ID
                        const likeCounts = {};
                        likesData.forEach(like => {
                            likeCounts[like.post] = (likeCounts[like.post] || 0);
                        });

                        // Attach like counts to each post
                        uniquePosts.forEach(post => {
                            post.likes = likeCounts[post.id] || 0;
                        });
                    }

                    setPosts(uniquePosts);
                }
            } catch (error) {
                console.error('Error in fetchData:', error);
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, []);
    // Fetch posts and check for likes on load
        useEffect(() => {
            const fetchPosts = async () => {
                // Fetch posts and likes data
                const { data: postsData, error: postsError } = await supabase
                    .from('POST')
                    .select(`
                        *,
                        ACTIVITY (
                            duration,
                            step_count,
                            distance,
                            calories_burned,
                            date
                        )
                    `)
                    .eq('visibility', 3); // Public posts

                if (postsError) {
                    console.log('Error fetching posts:', postsError);
                    return;
                }

                // Fetch liked posts for the user
                const { data: likesData, error: likesError } = await supabase
                    .from('LIKE')
                    .select('post')
                    .eq('user', username);

                if (likesError) {
                    console.log('Error fetching likes:', likesError);
                    return;
                }

                const likedPostIds = new Set(likesData.map(like => like.post));
                setLikedPosts(likedPostIds);

                setPosts(postsData);
            };

            fetchPosts();
        }, [username]);

        // Handle like/unlike toggle
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

                    setLikedPosts(prev => {
                        const updated = new Set(prev);
                        updated.delete(postId); // Remove the like
                        return updated;
                    });
                } else {
                    // Like the post: Insert a like
                    await supabase
                        .from('LIKE')
                        .insert([{ post: postId, user: username }]);

                    setLikedPosts(prev => {
                        const updated = new Set(prev);
                        updated.add(postId); // Add the like
                        return updated;
                    });
                }
            } catch (error) {
                console.error('Error toggling like:', error);
            }
        };

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();
            await AsyncStorage.removeItem('rememberUser');
            await AsyncStorage.removeItem('userSession');
            navigation.replace('Login');
        } catch (error) {
            console.log('Error logging out:', error);
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
                                <TouchableOpacity style={styles.navBarButton}>
                                    <Icon name="magnify" size={30}/>
                                </TouchableOpacity>
                            </View>
                            <View style={{ padding: 0 }}>
                                <Text style={styles.title}>Home</Text>
                                <View style={styles.statsContainer}>
                                    <Text testID="steps-count" style={styles.statText}>Steps Count: {stepsCount}</Text>
                                    <Text testID="distance" style={styles.statText}>Distance: {distance.toFixed(2)} km</Text>
                                    <Text testID="calories" style={styles.statText}>Calories Burned: {caloriesBurned.toFixed(2)} cal</Text>
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
                            <TouchableOpacity>
                                <Text style={styles.postUser}>@{post.user}</Text>
                            </TouchableOpacity>
                            <Text style={styles.postUser}>{post.ACTIVITY?.date || 'No date'}</Text>
                            <Text style={styles.postDescription}>{post.description || 'No description'}</Text>

                            {/* Activity Data */}
                            <View style={styles.activityContainer}>
                                <Text style={styles.activityText}>⏱ {post.ACTIVITY?.duration || 'N/A'} mins</Text>
                                <Text style={styles.activityText}>🚶‍♂️ {post.ACTIVITY?.step_count || 'N/A'} steps</Text>
                                <Text style={styles.activityText}>📏 {post.ACTIVITY?.distance.toFixed(2) || 'N/A'} km</Text>
                                <Text style={styles.activityText}>🔥 {post.ACTIVITY?.calories_burned || 'N/A'} cal</Text>
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