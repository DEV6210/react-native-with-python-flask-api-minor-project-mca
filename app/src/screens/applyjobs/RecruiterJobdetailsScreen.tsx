
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, SafeAreaView, ActivityIndicator, ScrollView, Pressable, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import { API_URL } from '@env';
import { useSelector } from 'react-redux';
import { Snackbar } from 'react-native-paper';

const RecruiterJobdetailsScreen = ({ route, navigation }) => {

    const jobTitle = route?.params?.jobdata?.title
    const jobDescription = route?.params?.jobdata?.description
    const screeningQuestions = route?.params?.jobdata?.screeningQuestions

    const data = useSelector((state) => state.user)
    const user = data.data
    const token = data.token
    const userId = user._id;
    const applicants = route?.params?.jobdata?.applicants || [];

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



    const deleteJob = async () => {
        setLoading(true);
        setError(null);
        Alert.alert(
            "Confirm Action",
            "Are you sure you want to proceed?",
            [
                {
                    text: "No",
                    onPress: () => setLoading(false),
                    style: "cancel"
                },
                {
                    text: "Yes",
                    onPress: async () => {
                        try {

                            await axios.post(`${API_URL}/api/users/delete-job`, {
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
                                    message: 'Successfully Delete',
                                    status: 'success'
                                })
                                setTimeout(() => {
                                    navigation.navigate('SettingScreen');
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
                    },
                }
            ]
        );
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
                    <Pressable onPress={() => { navigation.goBack() }} >
                        <Icon name="chevron-back-outline" size={24} />
                    </Pressable>
                    <Text style={{ fontSize: 18, fontWeight: "500" }}>Job Description</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.detailContainer}>
                    <Text style={styles.label}>Job Title:</Text>
                    <Text style={styles.text}>{jobTitle}</Text>
                </View>
                <View style={styles.detailContainer}>
                    <Text style={styles.label}>Job Description:</Text>
                    <Text style={styles.text}>{jobDescription}</Text>
                </View>
                {screeningQuestions && screeningQuestions.length > 0 ? (
                    <View style={styles.detailContainer}>
                        <Text style={styles.label}>Screening Questions:</Text>
                        {
                            screeningQuestions.map((question, index) => (
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
                        - {route?.params?.jobdata?.postedBy}
                    </Text>
                    <Text style={styles.text}>{route?.params?.jobdata?.companyDetails?.name}</Text>
                    <Text style={styles.text}>{route?.params?.jobdata?.companyDetails?.address}</Text>
                </View>
                {error && <Text style={styles.error}>{error}</Text>}
                {loading ? (
                    <ActivityIndicator size="large" color="#007BFF" style={styles.loader} />
                ) : (
                    <View style={{ marginBottom: 20, marginHorizontal: 10 }} >
                        <TouchableOpacity onPress={deleteJob} style={{ backgroundColor: '#d73d32', height: 40, justifyContent: 'center', alignItems: 'center' }} >
                            <Text style={{ color: '#fff', fontSize: 16 }} >Delete this Job</Text>
                        </TouchableOpacity>
                    </View>

                )}
            </ScrollView>

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
        </SafeAreaView >
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

export default RecruiterJobdetailsScreen;
