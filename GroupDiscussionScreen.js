import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TextInput, Alert, TouchableOpacity, StyleSheet, KeyboardAvoidingView } from 'react-native';
import firebase from "firebase/compat";
import { db } from './firebase';

const DiscussionItem = ({ discussion, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <View style={styles.forumItem}>
      <Text style={styles.forumTitle}>{discussion.title}</Text>
      <Text style={styles.forumInfo}>Posted by {discussion.author} - {discussion.timestamp?.toDate().toLocaleString()}</Text>
      <Text style={styles.forumDescription}>{discussion.description}</Text>
    </View>
  </TouchableOpacity>
);

const GroupDiscussionScreen = ({ navigation }) => {
  const [discussions, setDiscussions] = useState([]);
  const [newDiscussionTitle, setNewDiscussionTitle] = useState('');
  const [newDiscussionDescription, setNewDiscussionDescription] = useState('');

  // Function to fetch discussions from Firestore
  const fetchDiscussions = async () => {
    try {
      const discussionsRef = firebase.firestore().collection('discussions');
      const snapshot = await discussionsRef.get();
      const discussionsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDiscussions(discussionsData);
    } catch (error) {
      console.error('Error fetching discussions:', error);
    }
  };

  useEffect(() => {
    fetchDiscussions();
  }, []);

  const handleForumPress = (forumId, forumName) => {
    // Navigate to the detailed view of the forum using navigation.navigate
    navigation.navigate('ForumDetailScreen', { forumId: forumId, forumName: forumName });
  };

  const createDiscussion = async () => {
    try {
      const discussionsRef = firebase.firestore().collection('discussions');
      await discussionsRef.add({
        title: newDiscussionTitle,
        author: 'Current User', // Replace with actual user information
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        description: newDiscussionDescription,
      });
      // Fetch discussions again to update the list
      fetchDiscussions();
      // Reset input fields
      setNewDiscussionTitle('');
      setNewDiscussionDescription('');
      // Show success message
      Alert.alert('Discussion Created', 'Your discussion has been created successfully.');
    } catch (error) {
      console.error('Error creating discussion:', error);
      Alert.alert('Error', 'Failed to create discussion. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding" keyboardVerticalOffset={100}>
      <Text style={styles.title}>Discussion Forum</Text>

      <FlatList
        data={discussions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <DiscussionItem
            discussion={item}
            onPress={() => handleForumPress(item.id, item.title)}
          />
        )}
      />

      <View style={styles.createDiscussionSection}>
        <TextInput
          placeholder="Enter discussion title"
          value={newDiscussionTitle}
          onChangeText={setNewDiscussionTitle}
          style={styles.input}
        />
        <TextInput
          placeholder="Enter discussion description"
          value={newDiscussionDescription}
          onChangeText={setNewDiscussionDescription}
          multiline
          numberOfLines={4}
          style={[styles.input, { marginBottom: 20 }]}
        />

        <TouchableOpacity style={styles.createButton} onPress={createDiscussion} disabled={!newDiscussionTitle || !newDiscussionDescription}>
          <Text style={styles.createButtonText}>Create Discussion</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 20,
    paddingTop: 20,

  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
	
  },
  forumItem: {
    marginBottom: 20,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dcdcdc',
  },
  forumTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  forumInfo: {
    fontSize: 14,
    color: 'gray',
    marginTop: 5,
  },
  forumDescription: {
    marginTop: 5,
    },
    createDiscussionSection: {
        marginTop: 20,
		paddingBottom: 30,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 10,
        padding: 10,
    },
    createButton: {
        backgroundColor: 'black',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    createButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default GroupDiscussionScreen;
