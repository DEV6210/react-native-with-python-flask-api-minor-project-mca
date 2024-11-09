import React, { useState } from 'react';
import { SafeAreaView, View, ScrollView, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import BottomTab from '../components/BottomTab';

const PostScreen = () => {
    const [sortOrder, setSortOrder] = useState('asc'); // State for sorting order
    const [posts, setPosts] = useState([]); // State for user posts
    const [postText, setPostText] = useState(''); // State for the current post text

    // Sort posts based on the sort order
    const sortedPosts = [...posts].sort((a, b) => {
        return sortOrder === 'asc' ? a.localeCompare(b) : b.localeCompare(a);
    });

    const handlePostSubmit = () => {
        if (postText.trim()) {
            setPosts([...posts, postText]);
            setPostText(''); // Clear the input after submission
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.sortContainer}>
                <Text style={styles.sortText}>Sort by:</Text>
                <TouchableOpacity 
                    style={styles.sortButton} 
                    onPress={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                    <Text style={styles.sortButtonText}>{sortOrder === 'asc' ? 'Descending' : 'Ascending'}</Text>
                </TouchableOpacity>
            </View>

            <TextInput
                style={styles.input}
                placeholder="What's on your mind?"
                value={postText}
                onChangeText={setPostText}
            />
            <TouchableOpacity style={styles.submitButton} onPress={handlePostSubmit}>
                <Text style={styles.submitButtonText}>Post</Text>
            </TouchableOpacity>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {sortedPosts.map((post, index) => (
                    <View key={index} style={styles.postCard}>
                        <Text style={styles.postText}>{post}</Text>
                    </View>
                ))}
            </ScrollView>

            <View style={styles.bottomTab}>
                <BottomTab focused={"postScreen"} />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    sortContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#f8f8f8',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    sortText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    sortButton: {
        backgroundColor: '#007BFF',
        borderRadius: 5,
        padding: 8,
    },
    sortButtonText: {
        color: '#fff',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        margin: 16,
    },
    submitButton: {
        backgroundColor: '#007BFF',
        borderRadius: 5,
        padding: 10,
        marginHorizontal: 16,
        marginBottom: 16,
    },
    submitButtonText: {
        color: '#fff',
        textAlign: 'center',
    },
    scrollContainer: {
        paddingHorizontal: 16,
        paddingBottom: 80, // To ensure bottom tab is not overlapped
    },
    postCard: {
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
        marginBottom: 16,
        padding: 16,
    },
    postText: {
        fontSize: 16,
    },
    bottomTab: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
});

export default PostScreen;
