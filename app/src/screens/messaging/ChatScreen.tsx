import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Image, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';
import Modal from 'react-native-modal';
import { IMAGE_URL, API_URL } from '@env';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';
import Sound from 'react-native-sound';
import { formatTime } from '../../utils/formatTime';
const notificationSound = new Sound('message.mp3', Sound.MAIN_BUNDLE);

// Initialize the socket connection
const socket = io(API_URL); // Replace with your server URL

const ChatScreen = ({ navigation, route }) => {
    const [isOnline, setisOnline] = useState('offline'); // Default to offline
    const { data } = route.params;
    const udata = useSelector((state) => state.user.data);
    const myId = udata._id;
    const friendId = data._id;

    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isModalVisible, setModalVisible] = useState(false);
    const [modalData, setModalData] = useState({});
    const flatListRef = useRef();

    useEffect(() => {
        // Emit an event to let the server know the user is online
        socket.emit('userOnline', myId);

        // Listen for updates on the friend's online status
        socket.on('friendOnlineStatus', (status) => {
            setisOnline(status);
        });

        // Cleanup: Emit an event when the user disconnects
        return () => {
            socket.emit('userOffline', myId);
        };
    }, []);


    useEffect(() => {
        // Join the chat room for this user
        socket.emit('joinRoom', { userId: myId });

        // Listen for incoming messages
        socket.on('receiveMessage', (message) => {
            notificationSound.play()
            setMessages(prevMessages => [...prevMessages, message]);
        });

        // Fetch previous messages from the server once when the component mounts
        fetch(`${API_URL}/messages/${myId}/${friendId}`)
            .then(response => response.json())
            .then(data => setMessages(data))
            .catch(error => console.error('Error fetching messages:', error));

        // Cleanup on component unmount
        return () => {
            socket.off('receiveMessage');
        };
    }, []); // Empty dependency array to only run once on mount

    useEffect(() => {
        flatListRef.current.scrollToEnd({ animated: true });
    }, [messages]);

    const sendMessage = () => {
        if (inputMessage.trim() !== '') {
            const message = {
                fullName: udata.fullName,
                sender: myId,
                receiver: friendId,
                text: inputMessage,
                createdAt: formatTime(new Date())
            };
            setMessages(prevMessages => [...prevMessages, message]); // Add to state before sending
            socket.emit('sendMessage', message);
            setInputMessage('');
        }
    };

    const openImagePicker = () => {
        const options = {
            mediaType: 'photo',
            quality: 1,
        };
        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                const imageMessage = {
                    fullName: udata.fullName,
                    sender: myId,
                    receiver: friendId,
                    type: 'image',
                    file: response.assets[0].uri,
                    text: 'Image uploaded!',
                    createdAt: formatTime(new Date())
                };
                setMessages(prevMessages => [...prevMessages, imageMessage]); // Add to state before sending
                socket.emit('sendMessage', imageMessage);
            }
        });
    };

    const openModal = (data) => {
        setModalData(data);
        setModalVisible(true);
    };

    const hideModal = () => {
        setModalVisible(false);
    };

    const renderMessage = ({ item }) => (
        <View style={[styles.messageContainer, item.sender === myId ? styles.userMessage : styles.friendMessage]}>
            {item.type === 'image' ? (
                <TouchableOpacity onPress={() => openModal(item)}>
                    <Image source={{ uri: item.file }} style={styles.imageMessage} />
                    <Text style={item.sender === myId ? styles.userMessageText : styles.friendMessageText}>{item.text}</Text>
                </TouchableOpacity>
            ) : (
                <Text style={item.sender === myId ? styles.userMessageText : styles.friendMessageText}>{item.text}</Text>
            )}
            <View style={item.sender === myId ? styles.userTimestamp : styles.friendTimestamp}>
                <Text style={item.sender === myId ? styles.userTimestampText : styles.friendTimestampText}>{item?.createdAt}</Text>
                {item.sender === myId ? <Icon color="#fff" name="checkmark-done" size={15} /> : null}
            </View>
        </View>
    );

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {/* Modal */}
            <Modal
                isVisible={isModalVisible}
                onSwipeComplete={hideModal}
                onBackdropPress={hideModal}
                style={styles.modal}
                animationIn="zoomIn"
                animationOut="zoomOut"
            >
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity style={styles.modalButton}>
                            <Icon name="download" size={22} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={hideModal} style={styles.modalButton}>
                            <Icon name="close" size={22} color="#fff" />
                        </TouchableOpacity>
                    </View>
                    <Image
                        source={{ uri: modalData.file }}
                        style={styles.modalImage}
                    />
                    <Text style={styles.modalText}>{modalData.text}</Text>
                    <Text style={styles.modalTimestamp}>{modalData?.createdAt}</Text>
                </View>
            </Modal>

            <View style={styles.nav}>
                {/* <TouchableOpacity style={styles.backArrow} onPress={() => navigation.goBack()}>
                    <Icon name="chevron-back-outline" size={30} color='#888' />
                </TouchableOpacity> */}
                <TouchableOpacity style={styles.backArrow} onPress={() => { navigation.goBack() }}>
                    <Icon name="arrow-back" size={30} color={'#888'} />
                </TouchableOpacity>



                <View style={styles.card}>
                    <TouchableOpacity style={styles.cardContent}>
                        <View style={styles.cardLeftContent}>

                            <View style={styles.profileImageContainer}>
                                {data?.image ? (
                                    <Image source={{ uri: `${IMAGE_URL}/uploads/users/${data?.image}` }} style={styles.profileImage} />
                                ) : (
                                    <Image source={require('../../../assets/images/default-profile1.png')} style={styles.profileImage} />
                                )}
                            </View>
                            {/* {isOnline === 'offline' ?
                                <View style={{
                                    backgroundColor: '#52b06f',
                                    zIndex: 999,
                                    height: 10,
                                    width: 10,
                                    right: 4,
                                    bottom: 8,
                                    borderRadius: 99,
                                    position: 'absolute',

                                }} />
                                :
                                <Text>offline</Text>
                            } */}
                        </View>
                        <View style={styles.cardMiddleContent}>
                            <Text style={styles.name}>{data?.fullName}</Text>
                            <Text style={styles.bio}>{data?.type}</Text>
                        </View>
                    </TouchableOpacity>
                    {/* <TouchableOpacity>
                        <Icon name="ellipsis-vertical" size={22} />
                    </TouchableOpacity> */}
                </View>
            </View>

            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item, index) => item._id ? item._id : index.toString()} // Use index as a fallback
                style={styles.messageList}
                contentContainerStyle={styles.messageListContent}
                flexGrow={1}
            />


            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Type here..."
                    style={styles.textInput}
                    value={inputMessage}
                    onChangeText={text => setInputMessage(text)}
                />
                <View style={styles.iconContainer}>
                    {/* {!inputMessage && (
                        <TouchableOpacity onPress={openImagePicker}>
                            <Icon name="attach" size={22} color="#687083" style={styles.icon} />
                        </TouchableOpacity>
                    )} */}
                    <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
                        <Icon name="send" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    // Modal styles
    modal: {
        flex: 1,
        marginHorizontal: "5%",
        marginVertical: "18%",
        borderRadius: 16,
    },
    modalContent: {
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: 16,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "flex-end",
        padding: 10,
    },
    modalButton: {
        backgroundColor: "#54B471",
        padding: 8,
        borderRadius: 5,
        marginLeft: 5,
    },
    modalImage: {
        height: "100%",
        width: "100%",
        borderRadius: 16,
    },
    modalText: {
        position: "absolute",
        bottom: 40,
        left: 15,
        color: "#fff",
        fontSize: 16,
    },
    modalTimestamp: {
        position: "absolute",
        bottom: 15,
        right: 10,
        color: "#fff",
    },

    // Navigation and chat styles
    nav: {
        height: 50,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 0.5,
        borderBottomColor: '#DFE1E5',
        paddingHorizontal: 8,
    },
    backArrow: {
        width: '10%',
    },
    card: {
        width: '90%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '90%',
    },
    profileImageContainer: {
        height: 45,
        width: 45,
        borderRadius: 50,
        backgroundColor: '#f1f1f1',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#DFE1E5',
    },
    profileImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    cardLeftContent: {
        width: '18%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardMiddleContent: {
        width: '82%',
        justifyContent: 'center',
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    bio: {
        fontSize: 14,
        color: '#687083',
    },
    messageList: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    messageListContent: {
        padding: 10,
        paddingBottom: 20,
    },
    messageContainer: {
        maxWidth: '80%',
        marginBottom: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },
    userMessage: {
        backgroundColor: '#54B471',
        alignSelf: 'flex-end',
    },
    friendMessage: {
        backgroundColor: '#DFE1E5',
        alignSelf: 'flex-start',
    },
    userMessageText: {
        color: '#fff',
    },
    friendMessageText: {
        color: '#333',
    },
    userTimestamp: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 5,
    },
    friendTimestamp: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginTop: 5,
    },
    userTimestampText: {
        color: '#fff',
        fontSize: 12,
        marginRight: 5,
    },
    friendTimestampText: {
        color: '#333',
        fontSize: 12,
        marginRight: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderTopWidth: 0.5,
        borderTopColor: '#DFE1E5',
        paddingHorizontal: 8,
        paddingVertical: 5,
    },
    textInput: {
        flex: 1,
        padding: 10,
        fontSize: 16,
        borderRadius: 20,
        backgroundColor: '#f1f1f1',
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 5,
    },
    icon: {
        marginHorizontal: 5,
    },
    sendButton: {
        backgroundColor: '#54B471',
        padding: 10,
        borderRadius: 20,
    },
});

export default ChatScreen;
