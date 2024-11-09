import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, SafeAreaView, ActivityIndicator, ScrollView, Pressable, Alert, TouchableOpacity, Linking } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import { API_URL } from '@env';
import { useSelector } from 'react-redux';
import { Snackbar } from 'react-native-paper';

const FinalJobPostScreen = ({ route, navigation }) => {

    const [jobdata, setJobdata] = useState({})

    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        getJobsData();
    }, [route?.params?.jobdata?._id])

    const getJobsData = async () => {
        try {
            await axios.get(`${API_URL}/api/users/get-single-jobs?id=${route?.params?.jobdata?._id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            }).then(response => {
                setIsLoading(false)
                // console.log(response.data)
                setJobdata(response.data.jobs)

            }).catch(error => {
                setIsLoading(false)
                console.log('Backend Response getJobsData', error?.response?.data?.msg || error?.message)
            })
        } catch (error) {
            setIsLoading(false)
            console.log('APi Call Error', error)
        }
    }

    const data = useSelector((state) => state.user)
    const user = data.data
    const token = data.token
    const userId = user._id;
    const applicants = jobdata?.applicants || [];

    // Check if userId is in the applicants array
    const hasApplied = applicants.some(applicant => applicant.userId === userId);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [visible, setVisible] = useState(false);
    const onToggleSnackBar = () => setVisible(!visible);
    const onDismissSnackBar = () => setVisible(false);
    const [snackbarObject, setsnackbarObject] = useState({
        message: '',
        status: ''
    })



    const postJob = async () => {
        setLoading(true);
        setError(null);

        try {
            await axios.post(`${API_URL}/api/users/apply-job`, {
                jid: route?.params?.jobdata?._id
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                }
            }).then(response => {
                setLoading(false)
                onToggleSnackBar()
                setsnackbarObject({
                    ...snackbarObject,
                    message: 'Successfully Post',
                    status: 'success'
                })
                setTimeout(() => {
                    navigation.navigate('HomeScreen');
                }, 1000);
            }).catch(error => {
                setLoading(false)
                // console.log(error?.response?.data?.msg || error.message)
                // Alert.alert('Error', error?.response?.data?.msg || error);
                setError(error?.response?.data?.msg || error.message);
            })
        } catch (err) {
            setLoading(false)
            setError(err.message);
        }
    };

    return (
        <SafeAreaView style={styles.container}>

            <View style={{
                backgroundColor: "#fff",
                height: 50,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 5,
                elevation: 2,
            }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                    {/* <Pressable onPress={() => { navigation.goBack() }} >
                        <Icon name="chevron-back-outline" size={24} />
                    </Pressable> */}
                    <TouchableOpacity onPress={() => { navigation.goBack() }}>
                        <Icon name="arrow-back" size={25} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 18, fontWeight: '600' }}>Job Description</Text>
                </View>
            </View>

            {
                isLoading ?
                    <View style={{ marginTop: 10 }} >
                        <ActivityIndicator size={25} color={'#00C9FF'} />
                    </View>
                    :

                    <ScrollView contentContainerStyle={styles.scrollViewContent}>
                        <View style={styles.detailContainer}>
                            <Text style={styles.label}>Job Title:</Text>
                            <Text style={styles.text}>{jobdata?.title}</Text>
                        </View>

                        <View style={{ marginHorizontal: 16 }}>
                            <Text style={[styles.text, { fontWeight: 'bold' }]}>Job Type: {jobdata?.jobType}</Text>
                            <Text style={[styles.text, { fontWeight: 'bold' }]}>Experience: {jobdata?.yearOfExperience}</Text>
                            <Text style={[styles.text, { fontWeight: 'bold' }]}>Packege: {
                                jobdata?.packageType === 'Not Mention' ?
                                    'Not Mention' :
                                    jobdata?.packageType === 'per_year' ?
                                        `${jobdata?.salaryRange}/Year` : `${jobdata?.salaryRange}/Month`

                            }</Text>
                        </View>

                        <View style={styles.detailContainer}>
                            <Text style={styles.label}>Job Description:</Text>
                            {
                                jobdata?.applyLink ?
                                    <TouchableOpacity onPress={() => Linking.openURL(jobdata?.applyLink ? jobdata?.applyLink : 'https://Pseudorandom Number Generators.in')}>
                                        <Text style={{ color: 'blue' }} >{jobdata?.applyLink}</Text>
                                    </TouchableOpacity>
                                    :
                                    <Text style={styles.text}>{jobdata?.description}</Text>
                            }
                        </View>
                        {jobdata?.screeningQuestions && jobdata?.screeningQuestions.length > 0 ? (
                            <View style={styles.detailContainer}>
                                <Text style={styles.label}>Screening Questions:</Text>
                                {
                                    jobdata?.screeningQuestions.map((question, index) => (
                                        <Text key={index} style={styles.text}>
                                            {index + 1}. {question}
                                        </Text>
                                    ))
                                }
                            </View>
                        ) :
                            ''
                        }
                        <View style={styles.detailContainer}>
                            <Text style={{
                                fontSize: 16,
                                fontWeight: '600',
                                color: '#333333',
                            }}>Recruiter Details:</Text>
                            <Text>
                                - {jobdata?.postedBy === 'superAdmin' ? '' : jobdata?.postedBy}
                            </Text>
                            <Text style={styles.text}>{jobdata?.companyDetails?.name}</Text>
                            <Text style={styles.text}>{jobdata?.companyDetails?.address}</Text>
                        </View>
                        {error && <Text style={styles.error}>{error}</Text>}
                        {loading ? (
                            <ActivityIndicator size="large" color="#007BFF" style={styles.loader} />
                        ) : (
                            hasApplied ?
                                <View style={{ marginBottom: 20, marginHorizontal: 10 }} >
                                    <Text style={{
                                        fontSize: 16,
                                        color: 'gray', // Red color for emphasis
                                        textAlign: 'center',
                                    }}>You have already applied for this position.</Text>
                                </View>
                                :
                                <View style={{ marginBottom: 20, marginHorizontal: 10 }} >
                                    {
                                        jobdata?.applyLink ?
                                            <TouchableOpacity
                                                onPress={() => { Linking.openURL(jobdata?.applyLink ? jobdata?.applyLink : 'https://Pseudorandom Number Generators.in'); postJob() }}
                                                style={{
                                                    backgroundColor: '#007BFF',
                                                    height: 40,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    flexDirection: 'row',
                                                    gap: 5
                                                }} >
                                                <Text style={{ color: '#fff', fontSize: 16 }} >Apply Now</Text>
                                                <Icon name='open-outline' size={20} color={'#fff'} />
                                            </TouchableOpacity>
                                            :
                                            jobdata?.screeningQuestions && jobdata?.screeningQuestions.length > 0 ?
                                                <TouchableOpacity onPress={() => {
                                                    navigation.navigate("JobScreeningQuesionScreen",
                                                        { screeningQuestions: jobdata?.screeningQuestions, jid: route?.params?.jobdata?._id })
                                                }} style={{ backgroundColor: '#007BFF', height: 40, justifyContent: 'center', alignItems: 'center' }} >
                                                    <Text style={{ color: '#fff', fontSize: 16 }} >Continue to Apply</Text>
                                                </TouchableOpacity>
                                                :
                                                <TouchableOpacity onPress={postJob} style={{ backgroundColor: '#007BFF', height: 40, justifyContent: 'center', alignItems: 'center' }} >
                                                    <Text style={{ color: '#fff', fontSize: 16 }} >Apply Now</Text>
                                                </TouchableOpacity>
                                    }
                                </View>
                        )}
                    </ScrollView>
            }



            <Snackbar
                visible={visible}
                onDismiss={onDismissSnackBar}
                duration={2000} // Snackbar will auto-dismiss after 2 seconds
                style={{
                    backgroundColor:
                        snackbarObject.status === 'error' ? '#E23E32' :
                            snackbarObject.status === 'warning' ? '#ECB90D' :
                                snackbarObject.status === 'success' ? '#03B30A' :
                                    snackbarObject.status === 'info' ? '#723230' : '#111010'
                }}
            >
                {snackbarObject.message}
            </Snackbar>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    scrollViewContent: {
        flexGrow: 1,
    },
    detailContainer: {
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        // elevation: 3,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 8,
    },
    text: {
        fontSize: 14,
        color: '#666666',
    },
    error: {
        color: 'red',
        marginTop: 16,
        fontSize: 14,
        marginLeft: 10,
        marginBottom: 5
    },
    loader: {
        marginVertical: 20,
    },
});

export default FinalJobPostScreen;
