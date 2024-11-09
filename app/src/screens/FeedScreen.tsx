import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, StyleSheet, Image, Text, TouchableOpacity, Linking, ScrollView, RefreshControl } from 'react-native';
import BottomTab from '../components/BottomTab';
import TopHeader from '../components/TopHeader';
import { RewardedAd, RewardedAdEventType, TestIds } from 'react-native-google-mobile-ads';
import FeedIcon from '../../assets/svg/FeedIcon';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { API_URL, IMAGE_URL } from '@env'
import BannerAds_0 from '../components/googleAds/BannerAds_0';

const adUnitId = __DEV__ ? TestIds.REWARDED : 'ca-app-pub-5888001794214419/8459742899';

const rewarded = RewardedAd.createForAdRequest(adUnitId, {
    keywords: ['fashion', 'clothing'],
});

const FeedScreen = () => {
    const userdata = useSelector((state) => state.user)
    const token = userdata.token

    const [loaded, setLoaded] = useState(false);
    const [refreshing, setRefreshing] = useState(false); // State for refreshing
    const [feedsData, setFeedsData] = useState([])

    const fetchData = async () => {
        try {
            await axios.get(`${API_URL}/api/users/get-feeds-data`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            }).then(response => {
                setFeedsData(response.data.data)
            }).catch(error => {
                console.log('Backend Response getJobsData', error?.response?.data?.msg || error?.message)
            })
        } catch (error) {
            console.log('APi Call Error', error)
        }
    }


    useEffect(() => {
        fetchData()
        const unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
            setLoaded(true);
        });
        const unsubscribeEarned = rewarded.addAdEventListener(
            RewardedAdEventType.EARNED_REWARD,
            async reward => {
                // console.log('User earned reward of ', reward);
            },
        );

        // Start loading the rewarded ad straight away
        rewarded.load();

        // Unsubscribe from events on unmount
        return () => {
            unsubscribeLoaded();
            unsubscribeEarned();
        };
    }, []);

    // No advert ready to show yet
    if (!loaded) {
        return (
            <View style={{
                flex: 1,
                backgroundColor: '#fff',
                justifyContent: 'center',
                alignItems: 'center'
            }} >
                <FeedIcon height={40} width={40} color="red" />
                <Text style={{
                    marginTop: 10,
                    color: '#797981',
                    fontWeight: 'bold',
                    fontSize: 16,
                }}>Loading ..</Text>
            </View>
        )
    }
    if (loaded) {
        rewarded.show()
    }

    const onRefresh = async () => {
        setRefreshing(true)
        setTimeout(() => {
            setRefreshing(false)
            // fetchData()
        }, 999);
    }
    // Function to truncate long links
    const truncateLink = (link, maxLength = 40) => {
        return link.length > maxLength ? `${link.substring(0, maxLength)}...` : link;
    };

    return (
        <SafeAreaView style={styles.container}>
            <TopHeader />
            <ScrollView
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                {
                    feedsData && feedsData?.length > 0 ?
                        feedsData.map((e, i) => {
                            return (
                                <View key={i} style={styles.cardContainer}>
                                    <Image source={{ uri: `${IMAGE_URL}/uploads/feeds/${e?.image}` }} style={styles.postImage} />
                                    <View style={styles.cardContent}>
                                        <Text style={styles.description}>{e?.title}</Text>
                                        <View style={{ height: 10, width: 10, borderWidth: 1, borderColor: '#888', backgroundColor: '#ddd', borderRadius: 99 }} />
                                        <View style={{ height: 20, width: 0, borderWidth: 0.30, backgroundColor: '#ddd', marginLeft: 4.5 }} />


                                        <View style={{ position: 'absolute', bottom: 5, width: '95%', marginLeft: 25 }} >
                                            <Text >{e?.comment} </Text>
                                            <TouchableOpacity onPress={() => { Linking.openURL(e?.link) }} >
                                                <Text style={{ color: 'blue' }} >
                                                    {truncateLink(e?.link)}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            )
                        })
                        :
                        <View style={{
                            flex: 1,
                            backgroundColor: '#fff',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }} >
                            <FeedIcon height={40} width={40} color="red" />
                            <Text style={{
                                marginTop: 10,
                                color: '#797981',
                                fontWeight: 'bold',
                                fontSize: 16,
                            }}>No Data AVailable</Text>
                        </View>
                }
            </ScrollView>

            <View style={styles.bottomTab}>
                <BannerAds_0 />
                <BottomTab focused={"feed"} />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    feed: {
        paddingBottom: 100, // To prevent content from hiding behind the BottomTab
    },
    postContainer: {
        marginBottom: 20,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    postImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    postDescription: {
        padding: 10,
        fontSize: 16,
        color: '#333',
    },
    bottomTab: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },


    cardContainer: {
        margin: 10,
        borderRadius: 8,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    postImage: {
        width: '100%',
        height: 200,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        resizeMode: 'cover',
    },
    cardContent: {
        padding: 10,
    },
    description: {
        fontSize: 16,
        color: '#333',
        marginBottom: 10,
    },
    linksContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    link: {
        marginRight: 10,
        marginBottom: 5,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        backgroundColor: '#f0f0f0',
    },
    linkText: {
        color: '#007BFF',
    },
});

export default FeedScreen;
