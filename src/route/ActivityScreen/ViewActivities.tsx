import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList, Modal, TextInput  } from 'react-native';
import { supabase } from '../../services/supabase';
import styles from './styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import NavBar from '../NavBar'
import AsyncStorage from '@react-native-async-storage/async-storage';

const ViewActivities = ({ navigation }: any) => {
  const [duration, setDuration] = useState<number | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [steps, setSteps] = useState<number | null>(null);
  const [calories, setCalories] = useState<number | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]);
  //posting states
  const [isPosting, setIsPosting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState(null);
  const [postTitle, setPostTitle] = useState('Activity Share');
  const [postDescription, setPostDescription] = useState('Check out my activity!');


  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.log('Error fetching authenticated user:', userError);
        setLoading(false);
        return;
      }

      // Fetch username
      const { data: userData, error: userDataError } = await supabase
        .from('USER')
        .select('username')
        .eq('email', user.email)
        .single();

      if (userDataError || !userData) {
        console.log('Error fetching user data:', userDataError);
        setLoading(false);
        return;
      }

      setUsername(userData.username);
      setLoading(false);
    };

    fetchUserData();
  }, []);

  // ✅ Fetch activities only AFTER username is set
  useEffect(() => {
    if (username) {
      fetchActivities();
    }
  }, [username]);  // Runs again when `username` is updated


  const fetchActivities = async (userId) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('ACTIVITY')
      .select('*')
      .eq('userId', username)  // Use userId instead of username
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching activities:', error);
    } else {
      setActivities(data);
    }
    setLoading(false);
  };

  const handlePostPress = (activityId) => {
    setSelectedActivityId(activityId);
    setPostTitle('Activity Share');
    setPostDescription('Check out my activity!');
    setModalVisible(true);
};

const uploadPost = async () => {
    if (!username || isPosting || !selectedActivityId) return;
    
    setIsPosting(true);
    try {
        const { data: post, error: postError } = await supabase
            .from('POST')
            .insert([{
                user: username,
                title: postTitle,
                description: postDescription,
                visibility: 3,
                activity: selectedActivityId,
                created_at: new Date().toISOString()
            }])
            .select()
            .single();

        if (postError) {
            console.error('Error creating post:', postError);
            alert('Failed to create post');
            return;
        }

        alert('Activity posted successfully!');
        setModalVisible(false);

    } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong');
    } finally {
        setIsPosting(false);
    }
};
  return (
    <View style={styles.profileContainer}>
      <FlatList
        data={activities}
        style={styles.scroller}
        keyExtractor={(item) => item.id.toString()} // Ensure 'id' is unique
        renderItem={({ item }) => (
          <View style={styles.activityItem}>
            <Text style={styles.activityText}>
              📅 {new Date(item.date).toLocaleDateString()} - ⏱ {item.duration} sec
            </Text>
            <Text style={styles.activityText}>
              🚶‍♂️ {item.step_count} steps | 🏃 {item.distance.toFixed(2)} km | 🔥 {item.calories_burned.toFixed(2)} kcal
            </Text>
            <TouchableOpacity 
                style={[styles.postButton]}
                onPress={() => handlePostPress(item.id)}
            >
                <Icon
                    name="share"
                    size={20}
                    style={{color: 'white'}}
                />
                <Text style={styles.postButtonText}>Post</Text>
            </TouchableOpacity>
          </View>
        )}
        ListHeaderComponent={
          <>
            <Text style={styles.title}>My Activities</Text>
            <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Activity')}>
              <Text style={styles.buttonText}>Start recording!</Text>
            </TouchableOpacity>
            </View>
              <Text style={styles.title}>Past Activities</Text>
              {loading && <Text>Loading...</Text>}
              {activities.length === 0 && !loading && <Text>No past activities found.</Text>}
          </>
        }
        contentContainerStyle={{ paddingBottom: 100 }} // Avoids cutting off last item
      />
      <NavBar navigation={navigation} />
      <Modal
    animationType="slide"
    transparent={true}
    visible={modalVisible}
    onRequestClose={() => setModalVisible(false)}
>
    <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Post</Text>
            
            <TextInput
                style={styles.input}
                value={postTitle}
                onChangeText={setPostTitle}
                placeholder="Enter post title"
                placeholderTextColor="#666"
            />
            
            <TextInput
                style={[styles.input, styles.textArea]}
                value={postDescription}
                onChangeText={setPostDescription}
                placeholder="Enter post description"
                placeholderTextColor="#666"
                multiline
                numberOfLines={4}
            />

            <View style={styles.modalButtons}>
                <TouchableOpacity 
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setModalVisible(false)}
                >
                    <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={[styles.modalButton, styles.postButton]}
                    onPress={uploadPost}
                    disabled={isPosting}
                >
                    <Text style={styles.buttonText}>
                        {isPosting ? 'Posting...' : 'Post'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    </View>
</Modal>
    </View>


  );
};

export default ViewActivities;
