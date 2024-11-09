import React, { useEffect, useState } from 'react';
import { StyleSheet, TextInput, View, SafeAreaView, TouchableOpacity, Image, Text, Button, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { Animated } from 'react-native';
import axios from 'axios';
import { API_URL, IMAGE_URL } from '@env';
import { useSelector } from 'react-redux';

const MessagingScreen = () => {
    const token = useSelector((state) => state.user.token);
    const navigation = useNavigation();
    const [searchText, setSearchText] = useState('');
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    const [isLoading, setIsLoading] = useState(true)

    const handleSearch = () => {
        console.log('Searching for:', searchText);
    };

    const handleSearchClear = () => {
        console.log('Clear Search Value');
        setSearchText('');
    };

    const getUsers = async () => {
        try {

            const response = await axios.get(`${API_URL}/api/users/get-users`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            });
            if (response.status === 200) {
                setData(response.data.user);
                setIsLoading(false)
            } else {
                setIsLoading(false)
            }
        } catch (error) {
            console.log('Backend Response getUsersData', error?.response?.data?.msg || error?.message);
        }
    };

    useEffect(() => {
        getUsers();
    }, []);

    useEffect(() => {
        if (searchText.trim() === '') {
            setFilteredData(data);
        } else {
            const filtered = data.filter(user =>
                user.fullName.toLowerCase().includes(searchText.toLowerCase())
            );
            setFilteredData(filtered);
        }
    }, [searchText, data]);

    const RenderItem = ({ data }) => {
        return (
            <TouchableOpacity style={styles.card} onPress={() => {
                navigation.navigate("ChatScreen", { data: data });
            }}>
                <View style={styles.cardLeftContent}>
                    {data.isOnline && (
                        <View style={styles.online} />
                    )}
                    <View style={{ borderWidth: 0.5, borderRadius: 99, padding: 2, borderColor: '#ccc' }}>
                        {
                            data?.image ?
                                <Image source={{ uri: `${IMAGE_URL}/uploads/users/${data?.image}` }}
                                    style={{
                                        height: 45,
                                        width: 45,
                                        borderRadius: 99
                                    }} />
                                :
                                <Image source={require('../../../assets/images/default-profile1.png')}
                                    style={{
                                        height: 45,
                                        width: 45,
                                        borderRadius: 99
                                    }}
                                />
                        }
                    </View>
                </View>

                <View style={styles.cardMiddleContent}>
                    <View style={styles.nameSection}>
                        <Text style={styles.name}>{data?.fullName}</Text>
                    </View>
                    <Text style={styles.lastMessage}>{data?.lastMessage}</Text>
                </View>

                <View style={styles.cardRightContent}>
                    {
                        !data?.isRead && (
                            <Text style={styles.msgBudge}>{data?.total}</Text>
                        )
                    }
                    <Text style={styles.timestamp}>{data?.createdAt}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.nav}>
                <TouchableOpacity style={styles.backArrow} onPress={() => { navigation.goBack() }}>
                    <Icon name="arrow-back" size={30} color={'#888'} />
                </TouchableOpacity>
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Search here..."
                        value={searchText}
                        onChangeText={(text) => setSearchText(text)}
                        onSubmitEditing={handleSearch}
                    />
                    {!searchText ? (
                        <TouchableOpacity onPress={handleSearch}>
                            <Icon name="search-outline" size={24} color="#fff" style={styles.searchIcon} />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={handleSearchClear}>
                            <Icon name="close" size={24} color="#fff" style={styles.searchIcon} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {
                isLoading ?
                    <View style={{ marginTop: 10 }}>
                        <ActivityIndicator size={30} color={'#00c9ff'} />
                    </View>
                    :
                    filteredData && filteredData.length > 0 ?
                        <Animated.FlatList
                            data={filteredData}
                            keyExtractor={(item) => item._id.toString()}
                            renderItem={({ item }) => (
                                <RenderItem data={item} />
                            )}
                        />
                        :
                        <Text style={{ margin: 10 }} >No Message Available</Text>
            }


        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    nav: {
        height: 50,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        elevation: 2,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 5,
        paddingHorizontal: 10,
        borderWidth: 1,
        marginRight: 15,
        marginLeft: 5,
        borderColor: '#ccc',
        height: 40,
        flex: 1,
    },
    input: {
        flex: 1,
        paddingVertical: 4,
        color: '#555',
    },
    searchIcon: {
        marginLeft: 5,
        color: '#555',
    },
    backArrow: {
        marginLeft: 0,
    },
    card: {
        flexDirection: "row",
        backgroundColor: "#fff",
        marginVertical: 1,
        paddingVertical: 10,
        paddingHorizontal: 10,
        justifyContent: "center",
        alignItems: "center"
    },
    cardLeftContent: {
        width: "20%",
        alignItems: "center",
    },
    online: {
        height: 10,
        width: 10,
        backgroundColor: "#52b06f",
        borderRadius: 99,
        position: "absolute",
        zIndex: 999,
        right: 8,
        bottom: 8
    },
    cardMiddleContent: {
        width: "62%"
    },
    cardRightContent: {
        width: "18%",
        alignItems: "stretch",
        paddingVertical: 2,
        height: "auto"
    },
    nameSection: {
        flexDirection: "row"
    },
    name: {
        fontWeight: "bold"
    },
    bio: {
        fontSize: 13
    },
    lastMessage: {
        color: "gray",
        fontSize: 12
    },
    msgBudge: {
        height: 20,
        width: 20,
        textAlign: "center",
        lineHeight: 19,
        borderRadius: 999,
        alignSelf: "center",
        color: "#fff",
        fontSize: 12,
        backgroundColor: '',
        marginBottom: 1
    },
    timestamp: {
        color: "gray",
    }
});

export default MessagingScreen;
