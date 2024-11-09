import axios from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Animated, RefreshControl, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { API_URL } from '@env';
import { useSelector } from 'react-redux';
import { Color } from '../../GlobalStyles';
import JobPosing from '../components/posts/JobPosing';

const SearchScreen = ({ navigation }) => {

    const [searchText, setSearchText] = useState('');
    const userdata = useSelector((state) => state.user)
    const token = userdata.token
    const [isLoading, setIsLoading] = useState(true)

    const [jobs, setJobs] = useState([])

    const getJobsData = async () => {
        try {
            await axios.get(`${API_URL}/api/users/search-jobs?searchTerm=${searchText}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            }).then(response => {
                setIsLoading(false)
                setJobs(response.data.jobs)

            }).catch(error => {
                setIsLoading(false)
                console.log('Backend Response getJobsData', error?.response?.data?.msg || error?.message)
            })
        } catch (error) {
            setIsLoading(false)
            console.log('APi Call Error', error)
        }
    }

    useEffect(() => {
        // getJobsData()
    }, []);


    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getJobsData()
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);


    const handleSearch = () => {
        // console.log('Searching for:', searchText);
    };
    const handleSearchClear = () => {
        console.log('Clear Search Value');
        setSearchText('');
    };

    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current.focus()
    }, [])

    let timeoutId = null;

    useEffect(() => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
            getJobsData()
        }, 600); // Adjust debounce delay as needed

        // Cleanup timeout on component unmount
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [searchText])

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <View style={styles.nav}>
                <TouchableOpacity style={styles.backArrow} onPress={() => { navigation.goBack() }}>
                    <Icon name="arrow-back" size={30} color={'#888'} />
                </TouchableOpacity>
                <View style={styles.searchContainer}>
                    <TextInput
                        ref={inputRef}
                        style={styles.input}
                        placeholder="Search Jobs"
                        value={searchText}
                        onChangeText={text => {
                            setSearchText(text);
                        }}
                        onSubmitEditing={handleSearch}
                    />
                    {!searchText ?
                        <TouchableOpacity onPress={handleSearch}>
                            <Icon name="search" size={24} color="#888" style={styles.searchIcon} />
                        </TouchableOpacity>
                        :
                        isLoading ?
                            <ActivityIndicator />
                            :
                            <TouchableOpacity onPress={handleSearchClear}>
                                <Icon name="close" size={24} color="#888" style={styles.searchIcon} />
                            </TouchableOpacity>
                    }
                </View>
            </View>

            {

                isLoading ?
                    <View style={{ marginTop: 10 }}>
                        <ActivityIndicator size={30} color={'#00c9ff'} />
                    </View>
                    :
                    jobs && jobs.length > 0 ?
                        <Animated.FlatList
                            data={jobs}
                            keyExtractor={(item, index) => item._id + index.toString()}
                            renderItem={({ item }) => <JobPosing item={item} />}
                            scrollEventThrottle={1}

                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={onRefresh}
                                    tintColor="#000" // Customize refresh control color
                                />
                            }

                            // onEndReached={loadMorePosts}
                            onEndReachedThreshold={0.1}

                        // ListFooterComponent={ // Component to render at the bottom (for loading indicator)
                        //     <View style={styles.loadingContainer}>
                        //         {isLoadingMore && <ActivityIndicator size="large" color="#000" />}
                        //     </View>
                        // }
                        />
                        :
                        <View style={{ flex: 1, justifyContent: "center", alignItems: 'center' }}>
                            <Text style={{ fontSize: 16, color: "#333" }}>Oops, no jobs available</Text>
                        </View>

            }
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    nav: {
        height: 50,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: 'center',
        flexDirection: "row",
        elevation: 2
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff', // Background color with opacity
        borderRadius: 5,
        paddingHorizontal: 10,
        backfaceVisibility: "visible",
        borderWidth: 0.5, // Border width
        borderColor: '#ddd',
        marginRight: 10,
        marginLeft: 5,
        height: 40,
        flex: 1
    },

    input: {
        flex: 1,
        paddingVertical: 4,
    },
    searchIcon: {
        marginLeft: 5,
    },
    backArrow: {
        marginLeft: 0
    },
})

export default SearchScreen