import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { supabase } from '../../services/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import NavBar from '../NavBar';

const ProfileScreen = ({ route, navigation }: any) => {
    const [viewerUsername, setViewerUsername] = useState<string | null>(null);
  const [profileUsername, setProfileUsername] = useState<string | null>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [stats, setStats] = useState({
    distance: 0,
    steps: 0,
    calories: 0
  });
    const [posts, setPosts] = useState([]);
    const [likedPosts, setLikedPosts] = useState(new Set());

  useEffect(() => {
    const init = async () => {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      const currentUsername = await getCurrentUsername(user?.email);
      const targetUsername = route.params?.username || currentUsername;

      setProfileUsername(targetUsername);
      setIsOwnProfile(targetUsername === currentUsername);

      if (targetUsername) {
        await fetchUserProfile(targetUsername);
        await fetchStats(targetUsername);
      }

      setLoading(false);
    };

    init();
  }, []);

  const getCurrentUsername = async (email: string) => {
    const { data, error } = await supabase
      .from('USER')
      .select('username')
      .eq('email', email)
      .single();
    return data?.username || null;
  };

  const fetchUserProfile = async (username: string) => {
    const { data, error } = await supabase
      .from('USER')
      .select('name, picture_url')
      .eq('username', username)
      .single();

    if (!error) setUserInfo(data);
  };

  const fetchStats = async (username: string) => {
    const { data, error } = await supabase
      .from('ACTIVITY')
      .select('distance, step_count, calories_burned')
      .eq('userId', username);

    if (error || !data) return;

    const totals = data.reduce(
      (acc, activity) => ({
        distance: acc.distance + (activity.distance || 0),
        steps: acc.steps + (activity.step_count || 0),
        calories: acc.calories + (activity.calories_burned || 0)
      }),
      { distance: 0, steps: 0, calories: 0 }
    );

    setStats(totals);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    await AsyncStorage.multiRemove(['rememberUser', 'userSession']);
    navigation.replace('Login');
  };
// Main data fetching - combined user and posts
    useEffect(() => {
      let isMounted = true;

      const fetchData = async () => {
        try {
          const { data: { user }, error: userError } = await supabase.auth.getUser();
          if (userError || !user) {
            console.log('Error fetching authenticated user:', userError);
            return;
          }

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
          setViewerUsername(userUsername);
          let publicPosts = [];
          let friendPosts = [];
          let privatePosts = [];

          if (!isOwnProfile) {
            const { data: pubData, error: publicPostsError } = await supabase
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
              .eq('user', profileUsername)
              .eq('visibility', 3);

            if (publicPostsError) {
              console.error('Error fetching public posts:', publicPostsError);
            } else {
              console.log('Public posts:', pubData);
            }


            publicPosts = pubData || [];
            const { data: friendship, error: friendError } = await supabase
              .from('FRIEND')
              .select('user1, user2')
              .or(`user1.eq.${userUsername},user2.eq.${userUsername}`)
              .eq('status', 'accepted');

            const isFriend = friendship?.some(
              (relation) =>
                (relation.user1 === userUsername && relation.user2 === profileUsername) ||
                (relation.user2 === userUsername && relation.user1 === profileUsername)
            );

            if (isFriend) {
              const { data: friendData, error: friendPostsError } = await supabase
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
                .eq('user', profileUsername)
                .eq('visibility', 2);

              if (friendPostsError) {
                console.error('Error fetching friend posts:', friendPostsError);
              } else {
                friendPosts = friendData || [];
              }
            }


          } else {
            const { data: privData, error: privatePostsError } = await supabase
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
              .eq('user', profileUsername);

            privatePosts = privData || [];
          }

          const combinedPosts = [
            ...publicPosts,
            ...friendPosts,
            ...privatePosts
          ];

          const uniquePostsMap = new Map();
          combinedPosts.forEach(post => {
            uniquePostsMap.set(post.id, post);
          });

          const uniquePosts = Array.from(uniquePostsMap.values());
          uniquePosts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

          const postIds = uniquePosts.map(post => post.id);


          if (isMounted) {
            setPosts(uniquePosts);
          }

        } catch (error) {
          console.error('Error in fetchData:', error);
        }

      // Fetch liked posts for the user
      const { data: likesData, error: likesError } = await supabase
          .from('LIKE')
          .select('post')
          .eq('user', viewerUsername);

      if (likesError) {
          console.log('Error fetching likes:', likesError);
          return;
      }

      const likedPostIds = new Set(likesData.map(like => like.post));
      setLikedPosts(likedPostIds);
      };

      fetchData();

      return () => {
        isMounted = false;
      };
    }, [profileUsername]);
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
                        ),
                        USER (
                            picture_url
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
        }, [profileUsername]);
    // Handle like/unlike toggle
            const toggleLike = async (postId) => {
                if (!viewerUsername) return; // Ensure the user is logged in

                try {
                    // Check if the post is already liked
                    if (likedPosts.has(postId)) {
                        // Unlike the post: Delete the like
                        await supabase
                            .from('LIKE')
                            .delete()
                            .eq('post', postId)
                            .eq('user', viewerUsername);

                        setLikedPosts(prev => {
                            const updated = new Set(prev);
                            updated.delete(postId); // Remove the like
                            return updated;
                        });
                    } else {
                        // Like the post: Insert a like
                        await supabase
                            .from('LIKE')
                            .insert([{ post: postId, user: viewerUsername }]);

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
  // Handle button text change
  const FriendButton = () => {
    const [buttonText, setButtonText] = useState('Add Friend');

    const changeButtonText = () => {
        if (buttonText === 'Add Friend') {
            setButtonText('Invite sent');
        } else {
            setButtonText('Add Friend');
        }
    };

    return (
        <TouchableOpacity onPress={changeButtonText}>
            <Text style={{color:'white', fontWeight: 'bold'}}>{buttonText}</Text>
        </TouchableOpacity>
    );
};
  return (
    <View style={styles.profileContainer}>
        <FlatList
            data={posts}
            style={{ width: '100%', paddingHorizontal: 20, marginBottom: 40}}
            keyExtractor={(item) => item.id.toString()}
            ListHeaderComponent={
                <>
          
          <View style={{flexDirection: 'row', margin: 'auto'}}>
            {userInfo?.picture_url && (
              <Image source={{ uri: userInfo.picture_url }} style={styles.profileImage} />
            )}
            <View>
              <Text style={styles.title}>{userInfo?.name}</Text>
              <Text style={[styles.title, {fontSize: 25, top: -5}]}>@{profileUsername}</Text>
            </View>
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Icon name="run" size={24} color="#4CAF50" />
              <Text style={styles.statLabel}>Distance</Text>
              <Text style={styles.statValue}>{stats.distance.toFixed(2)} km</Text>
            </View>
            <View style={styles.statCard}>
              <Icon name="fire" size={24} color="#F44336" />
              <Text style={styles.statLabel}>Calories</Text>
              <Text style={styles.statValue}>{stats.calories.toFixed(2)} cal</Text>
            </View>
            <View style={styles.statCard}>
              <Icon name="walk" size={24} color="#2196F3" />
              <Text style={styles.statLabel}>Steps</Text>
              <Text style={styles.statValue}>{stats.steps.toFixed(0)}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Friends', { username: profileUsername })}>
            <Text style={styles.buttonText}>View Friends</Text>
          </TouchableOpacity>

          {isOwnProfile ? (
            <>
              <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Settings')}>
                <Text style={styles.buttonText}>Settings</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, { backgroundColor: '#f44336' }]} onPress={handleLogout}>
                <Text style={styles.buttonText}>Log out</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={styles.button}>
                <FriendButton/>
              </TouchableOpacity>
          )}
            {loading && <Text style={styles.statText}>Loading posts...</Text>}
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
                            <Text style={styles.activityText}>⏱ {post.ACTIVITY?.duration || 'N/A'} mins</Text>
                            <Text style={styles.activityText}>🚶‍♂️ {post.ACTIVITY?.step_count} steps</Text>
                            <Text style={styles.activityText}>📏 {post.ACTIVITY?.distance.toFixed(2) || 'N/A'} km</Text>
                            <Text style={styles.activityText}>🔥 {post.ACTIVITY?.calories_burned} cal</Text>
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

export default ProfileScreen;