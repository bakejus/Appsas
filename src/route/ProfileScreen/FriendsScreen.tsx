import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { supabase } from '../../services/supabase';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './styles';

const FriendsScreen = ({ route, navigation }: any) => {
  const { username } = route.params;
  const [friends, setFriends] = useState<any[]>([]);
  const [friendRequests, setFriendRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    setLoading(true);
    console.log(`Fetching friends for user: ${username}`);

    // Step 1: Fetch accepted friendships where this user is user1
    const { data: sent, error: sentError } = await supabase
      .from('FRIEND')
      .select('*')
      .eq('status', 'accepted')
      .eq('user1', username);

    console.log('Sent friends (user1):', sent);
    if (sentError) console.error('Error fetching sent friendships:', sentError);

    // Step 2: Fetch accepted friendships where this user is user2
    const { data: received, error: recvError } = await supabase
      .from('FRIEND')
      .select('*')
      .eq('status', 'accepted')
      .eq('user2', username);

    console.log('Received friends (user2):', received);
    if (recvError) console.error('Error fetching received friendships:', recvError);

    const allFriends = [...(sent || []), ...(received || [])];
    console.log('Combined friend rows:', allFriends);

    // Step 3: Extract friend usernames
    const friendUsernames = allFriends.map(f =>
      f.user1 === username ? f.user2 : f.user1
    );
    console.log('Resolved friend usernames:', friendUsernames);

    if (friendUsernames.length === 0) {
      console.log('No friends found.');
      setFriends([]);
      setLoading(false);
      return;
    }

    // Step 4: Fetch user info for friend usernames
    const { data: users, error: userError } = await supabase
      .from('USER')
      .select('username, name, picture_url')
      .in('username', friendUsernames);

    console.log('Fetched user profiles:', users);
    if (userError) console.error('Error fetching friend user data:', userError);


    // Step 5: Fetch friend requests
    const { data: requests, error: reqError } = await supabase
      .from('FRIEND')
      .select('*')
      .eq('status', 'pending')
      .eq('user2', username)
    console.log('Friend requests:', requests);
    if (reqError) console.error('Error fetching friend requests:', reqError);
    const requestUsernames = requests?.map(f =>
      f.user1 === username ? f.user2 : f.user1
    );

    const { data: userRequest, error: userRequestError } = await supabase
              .from('USER')
              .select('username, name, picture_url')
              .in('username', requestUsernames);

            console.log('Fetched user profiles:', userRequest);
            if (userError) console.error('Error fetching friend user data:', userRequestError);

    setFriendRequests(userRequest || []);

    setFriends(users || []);
    setLoading(false);
  };
  const acceptRequest = async (requesterUsername: string) => {
    const { error } = await supabase
      .from('FRIEND')
      .update({ status: 'accepted' })
      .eq('user1', requesterUsername)
      .eq('user2', username);

    if (error) {
      console.error('Error accepting friend request:', error);
      return;
    }

    fetchFriends(); // Refresh list
  };

  const declineRequest = async (requesterUsername: string) => {
    const { error } = await supabase
      .from('FRIEND')
      .delete()
      .eq('user1', requesterUsername)
      .eq('user2', username);

    if (error) {
      console.error('Error declining friend request:', error);
      return;
    }

    fetchFriends(); // Refresh list
  };

  const renderFriend = ({ item }: any) => (
    <TouchableOpacity
      style={styles.friendCard}
      onPress={() => navigation.navigate('Profile', { username: item.username })}
    >
      <Image
        source={{ uri: item.picture_url || 'https://fastly.picsum.photos/id/295/100/100.jpg?hmac=94ML4pZHH5noxaWO7PZQRVND7lKEGB7yzirdjMxqEvI' }}
        style={styles.friendAvatar}
      />
      <Text style={styles.friendName}>{item.name || item.username}</Text>
    </TouchableOpacity>
  );
  const renderFriendRequest = ({ item }: any) => (
      <TouchableOpacity
        style={styles.friendCard}
        onPress={() => navigation.navigate('Profile', { username: item.username })}
      >
        <Image
          source={{ uri: item.picture_url || 'https://fastly.picsum.photos/id/295/100/100.jpg?hmac=94ML4pZHH5noxaWO7PZQRVND7lKEGB7yzirdjMxqEvI' }}
          style={styles.friendAvatar}
        />
        <Text style={styles.friendName}>{item.name || item.username}</Text>
        <TouchableOpacity onPress={() => acceptRequest(item.username)}>
          <Icon name="check" size={24} color="#4CAF50" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => declineRequest(item.username)}>
          <Icon name="close" size={24} color="#FF0000" />
        </TouchableOpacity>
      </TouchableOpacity>

    );

  if (loading) {
    return (
      <View style={styles.profileContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.profileContainer}>
      <Text style={styles.title}>Friend Requests</Text>
            {friendRequests.length === 0 ? (
              <Text style={{ textAlign: 'center' }}>No friends requests.</Text>
            ) : (
              <FlatList
                data={friendRequests}
                renderItem={renderFriendRequest}
                keyExtractor={(item) => item.username}
                style={{paddingHorizontal: 20, marginBottom: -300, padding: 0}}
              />
            )}
      <Text style={styles.title}>Friends</Text>
      {friends.length === 0 ? (
        <Text style={{ textAlign: 'center' }}>No accepted friends yet.</Text>
      ) : (
        <FlatList
          data={friends}
          renderItem={renderFriend}
          keyExtractor={(item) => item.username}
          style={{paddingHorizontal: 20,}}
        />
      )}
    </View>
  );
};

export default FriendsScreen;
