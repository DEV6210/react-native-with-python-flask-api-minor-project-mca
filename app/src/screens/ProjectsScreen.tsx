import React, { useCallback, useEffect, useRef, useState } from 'react'
import TopHeader from '../components/TopHeader'
import { Animated, RefreshControl, SafeAreaView, TouchableOpacity, View } from 'react-native'
import { StyleSheet } from 'nativewind';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
// const RedeemReferralBonus = lazy(() => import("../components/RedeemReferralBonus"))
import { API_URL } from '@env'
import { updateUserDetails } from '../store/reducers/userReducer';
import { Surface } from 'react-native-paper';
import BottomTab from '../components/BottomTab';
import JobPosing from '../components/posts/JobPosing';
import { Text } from 'react-native';
import Skeleton from '../components/Skeleton';
import { Color } from '../../GlobalStyles';

const noOfSkeleton = [1, 2, 3]
const CONTAINER_HEIGHT = 50;


const ProjectsScreen = ({ navigation }) => {

    const userdata = useSelector((state) => state.user)
    const token = userdata.token

    const dispatch = useDispatch()

    const getUsersData = async () => {
        try {
            await axios.get(`${API_URL}/api/users/get-users-data`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            }).then(response => {
                // console.log(response.data.user)
                dispatch(updateUserDetails({
                    user: response.data.user
                }))

            }).catch(error => {
                console.log('Backend Response getUsersData', error?.response?.data?.msg || error?.message)
            })
        } catch (error) {
            console.log('APi Call Error', error)
        }
    }
    useEffect(() => {
        getUsersData()
    }, [])


    // scroll hide logic impliment here
    const scrollY = useRef(new Animated.Value(0)).current;
    const offsetAnim = useRef(new Animated.Value(0)).current;
    const clampedScroll = Animated.diffClamp(
        Animated.add(
            scrollY.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
                extrapolateLeft: 'clamp',
            }),
            offsetAnim,
        ),
        0,
        CONTAINER_HEIGHT
    )
    var _clampedScrollValue = 0;
    var _offsetValue = 0;
    var _scrollValue = 0;
    useEffect(() => {
        scrollY.addListener(({ value }) => {
            const diff = value - _scrollValue;
            _scrollValue = value;
            _clampedScrollValue = Math.min(
                Math.max(_clampedScrollValue + diff, 0),
                CONTAINER_HEIGHT,
            )
        });
        offsetAnim.addListener(({ value }) => {
            _offsetValue = value;
        })
    }, []);

    var scrollEndTimer = null;
    const onMomentumScrollBegin = () => {
        clearTimeout(scrollEndTimer)
    }
    const onMomentumScrollEnd = () => {
        const toValue = _scrollValue > CONTAINER_HEIGHT &&
            _clampedScrollValue > (CONTAINER_HEIGHT) / 2
            ? _offsetValue + CONTAINER_HEIGHT : _offsetValue - CONTAINER_HEIGHT;

        Animated.timing(offsetAnim, {
            toValue,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }
    const onScrollEndDrag = () => {
        scrollEndTimer = setTimeout(onMomentumScrollEnd, 250);
    }

    const headerTranslate = clampedScroll.interpolate({
        inputRange: [0, CONTAINER_HEIGHT],
        outputRange: [0, -CONTAINER_HEIGHT],
        extrapolate: 'clamp',
    })
    const opacity = clampedScroll.interpolate({
        inputRange: [0, CONTAINER_HEIGHT - 20, CONTAINER_HEIGHT],
        outputRange: [1, 0.05, 0],
        extrapolate: 'clamp',
    })
    const bottomTabTranslate = clampedScroll.interpolate({
        inputRange: [0, CONTAINER_HEIGHT],
        outputRange: [0, CONTAINER_HEIGHT * 2],
        extrapolate: 'clamp',
    })
    //---------------------------------
    const [postsData, setPostsData] = useState([ ])

    const [isLoading, setisLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setPostsData([]);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);


    const posts = []
    return (
        <SafeAreaView
            style={{ flex: 1 }}
        >
            {
                isLoading ?
                    <Animated.FlatList
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                            { useNativeDriver: true }
                        )}
                        data={noOfSkeleton}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={() => <Skeleton />}
                        contentContainerStyle={styles.contentContainerStyle}
                        onMomentumScrollBegin={onMomentumScrollBegin}
                        onMomentumScrollEnd={onMomentumScrollEnd}
                        onScrollEndDrag={onScrollEndDrag}
                        scrollEventThrottle={1}
                    />
                    :
                    postsData && postsData.length > 0 ?
                        <Animated.FlatList
                            onScroll={Animated.event(
                                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                                { useNativeDriver: true }
                            )}
                            data={postsData}
                            keyExtractor={(item, index) => item.title + index.toString()}
                            renderItem={({ item }) => <JobPosing data={item} />}
                            contentContainerStyle={styles.contentContainerStyle}
                            onMomentumScrollBegin={onMomentumScrollBegin}
                            onMomentumScrollEnd={onMomentumScrollEnd}
                            onScrollEndDrag={onScrollEndDrag}
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
                        <View style={{ flex: 1, justifyContent: "center" }} >
                            <Text style={{ alignSelf: 'center', fontSize: 16 }} > Opp's no projects available</Text>
                            <TouchableOpacity style={{ alignSelf: 'center', marginVertical: 10 }}>
                                <Text style={{ fontSize: 16, color: Color.mainColor }} >Refresh</Text>
                            </TouchableOpacity>
                        </View>
            }





            {/* Header Section */}
            <Animated.View style={[styles.view, { top: 0, transform: [{ translateY: headerTranslate }] }]}>
                <TopHeader />
            </Animated.View>


            {/* Footer Section */}
            <Animated.View style={[styles.view, { bottom: 0, transform: [{ translateY: bottomTabTranslate }] }]}>
                <Surface style={[styles.rowContainer, styles.bottomBar]}>
                    <BottomTab focused={"projects"} />
                </Surface>
            </Animated.View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    // --------- Header Section ---------
    view: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: CONTAINER_HEIGHT,
        backgroundColor: "#fff",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    contentContainerStyle: {
        paddingTop: CONTAINER_HEIGHT,
    },

    // --------- Footer Section ---------
    bottomBar: {
        borderTopRightRadius: 16,
        borderTopLeftRadius: 16,
    },
    rowContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },


})
export default ProjectsScreen

