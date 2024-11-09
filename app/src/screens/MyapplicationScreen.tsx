import React, { useCallback, useEffect, useRef, useState } from 'react'
import TopHeader from '../components/TopHeader'
import { Animated, RefreshControl, SafeAreaView, TouchableOpacity, View } from 'react-native'
import { StyleSheet } from 'nativewind';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
// const RedeemReferralBonus = lazy(() => import("../components/RedeemReferralBonus"))
import { API_URL } from '@env'
import { Surface } from 'react-native-paper';
import BottomTab from '../components/BottomTab';
import JobPosing from '../components/posts/JobPosing';
import { Text } from 'react-native';
import Skeleton from '../components/Skeleton';
import { Color } from '../../GlobalStyles';

const noOfSkeleton = [1, 2, 3]

const MyapplicationScreen = ({ navigation }) => {

    const userdata = useSelector((state) => state.user)
    const token = userdata.token
    const user = userdata.data

    const [isLoading, setIsLoading] = useState(true)

    const [jobs, setJobs] = useState([])

    const getJobsData = async () => {
        try {
            await axios.get(`${API_URL}/api/users/get-my-applications`, {
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
        getJobsData()
    }, []);


    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getJobsData()
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: '#fff' }}
        >
            {
                isLoading ?
                    <Animated.FlatList
                        data={noOfSkeleton}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={() => <Skeleton />}
                        scrollEventThrottle={1}
                    />
                    :
                    jobs && jobs.length > 0 ?
                        <Animated.FlatList
                            data={jobs}
                            keyExtractor={(item, index) => item._id + index.toString()}
                            renderItem={({ item }) => <JobPosing item={item} screen={'MyApplications'} resume={user?.resume || null} />}
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
                            <Text style={{ alignSelf: 'center', fontSize: 16 }} > Opp's no jobs available</Text>
                            <TouchableOpacity
                                onPress={() => { setIsLoading(true); getJobsData(); }}
                                style={{ alignSelf: 'center', marginVertical: 10 }}>
                                <Text style={{ fontSize: 16, color: Color.mainColor }} >Refresh</Text>
                            </TouchableOpacity>
                        </View>
            }

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({

})
export default MyapplicationScreen

