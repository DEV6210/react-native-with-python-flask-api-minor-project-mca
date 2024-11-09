import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, SafeAreaView, ActivityIndicator, ScrollView, Pressable, Alert } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import { API_URL } from '@env';
import { useSelector } from 'react-redux';
import { Snackbar } from 'react-native-paper';

const FinalJobPostScreen = ({ route, navigation }) => {

    const { jobTitle, jobDescription, screeningQuestions } = route.params.data;

    const udata = useSelector((state) => state.user)
    const user = udata.data
    const token = udata.token

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
            await axios.post(`${API_URL}/api/users/post-job`, {
                jobTitle,
                jobDescription,
                screeningQuestions
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
                // console.log(error?.response?.data?.msg || error)
                // Alert.alert('Error', error?.response?.data?.msg || error);
                setError(error?.response?.data?.msg || error);
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
                    <Pressable onPress={() => { navigation.goBack() }} >
                        <Icon name="chevron-back-outline" size={24} />
                    </Pressable>
                    <Text style={{ fontSize: 18, fontWeight: "500" }}>Preview</Text>
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
                <View style={styles.detailContainer}>
                    <Text style={styles.label}>Screening Questions:</Text>
                    {screeningQuestions && screeningQuestions.length > 0 ? (
                        screeningQuestions.map((question, index) => (
                            <Text key={index} style={styles.text}>
                                {index + 1}. {question}
                            </Text>
                        ))
                    ) : (
                        <Text style={styles.text}>No screening questions provided.</Text>
                    )}
                </View>
                <View style={styles.detailContainer}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: '600',
                        color: '#333333',
                    }}>Recruiter Details:</Text>
                    <Text>
                        - {user?.fullName}
                    </Text>
                    <Text style={styles.text}>{user?.companyDetails?.name}</Text>
                    <Text style={styles.text}>{user?.companyDetails?.address}</Text>
                </View>
                {loading ? (
                    <ActivityIndicator size="large" color="#007BFF" style={styles.loader} />
                ) : (
                    <View style={{ marginBottom: 20, marginHorizontal: 10 }} >
                        <Button title="Post Job" onPress={postJob} color="#007BFF" />
                    </View>
                )}
                {error && <Text style={styles.error}>{error}</Text>}
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
    },
    loader: {
        marginVertical: 20
    },
});

export default FinalJobPostScreen;
