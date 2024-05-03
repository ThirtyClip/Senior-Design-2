import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, ScrollView } from 'react-native';
import firebase from "firebase/compat";
import { db } from './firebase';

const ForumDetailScreen = ({ route, navigation }) => {
    const { forumId, forumName } = route.params;
    const [discussion, setDiscussion] = useState(null); // State to store discussion details
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    // Function to fetch discussion details based on forumId
    const fetchDiscussionDetails = async () => {
        try {
            console.log('Fetching discussion details for forumId:', forumId); // Log the forumId
            const discussionDoc = await db.collection('discussions').doc(forumId).get();
            if (discussionDoc.exists) {
                console.log('Discussion document:', discussionDoc.data()); // Log the discussion document data
                setDiscussion({ id: discussionDoc.id, ...discussionDoc.data() });
            } else {
                console.log('Discussion not found');
            }
        } catch (error) {
            console.error('Error fetching discussion:', error);
        }
    };

    // Function to fetch comments for the forum
    const fetchComments = async () => {
        try {
            // Check if forumId is defined before fetching comments
            if (forumId) {
                const commentsRef = db.collection('comments').where('forumId', '==', forumId);
                const snapshot = await commentsRef.get();
                const commentsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setComments(commentsData);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    useEffect(() => {
        fetchDiscussionDetails(); // Fetch discussion details when component mounts
        fetchComments(); // Fetch comments when component mounts
    }, [forumId]);

    // Function to add a new comment
    const addComment = async () => {
        try {
            await db.collection('comments').add({
                forumId: forumId,
                content: newComment,
                // Add other comment details like user ID, timestamp, etc.
            });
            // Clear the input field after adding the comment
            setNewComment('');
            // Fetch comments again to update the list
            fetchComments();
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    // Function to delete the forum
    const deleteForum = async () => {
        try {
            await db.collection('discussions').doc(forumId).delete();
            navigation.goBack(); // Navigate back to the previous screen after deletion
        } catch (error) {
            console.error('Error deleting forum:', error);
            Alert.alert('Error', 'Failed to delete forum. Please try again.');
        }
    };

    // Render loading if discussion details are being fetched
    if (!discussion) {
        return <Text>Loading...</Text>;
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior="padding"
            keyboardVerticalOffset={100} // Adjust this value as needed
        >
            <ScrollView>
                <View style={styles.header}>
                    <Text style={styles.title}>{discussion.title}</Text>
                    <Text style={styles.description}>{discussion.description}</Text>
                    <Text style={styles.author}>Posted by: {discussion.author}</Text>
                    <TouchableOpacity onPress={deleteForum} style={styles.deleteButton}>
                        <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                </View>

                {/* Render comments */}
                <View style={styles.commentsContainer}>
                    {comments.map(comment => (
                        <View key={comment.id} style={styles.comment}>
                            <Text style={styles.commentAuthor}>User: {comment.userId}</Text>
                            <Text style={styles.commentContent}>{comment.content}</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* Input field to add new comment */}
            <TextInput
                placeholder="Add a comment"
                value={newComment}
                onChangeText={setNewComment}
                style={styles.input}
            />
            <TouchableOpacity onPress={addComment} style={styles.addButton}>
                <Text style={styles.addButtonText}>Add Comment</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0', // Light gray background
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    header: {
        backgroundColor: 'black',
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginBottom: 20,
        borderRadius: 10, // Rounded corners for header
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
    },
    description: {
        fontSize: 18,
        color: 'white',
        marginBottom: 10,
    },
    author: {
        fontSize: 14,
        color: '#a0a0a0', // Light gray color for author
    },
    deleteButton: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    deleteButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    commentsContainer: {
        marginBottom: 20,
        
    },
    comment: {
        marginBottom: 10,
    },
    commentAuthor: {
        fontWeight: 'bold',
        color: 'black', // Dark color for comment author
    },
    commentContent: {
        marginLeft: 10,
        color: 'black', // Dark color for comment content
    },
    input: {
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#d0d0d0', // Light gray border color
        borderRadius: 5,
        padding: 10,
        backgroundColor: 'white', // White background for input
        
    },
    addButton: {
        marginBottom: 30,
        backgroundColor: 'black',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        
    },
    addButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ForumDetailScreen;
