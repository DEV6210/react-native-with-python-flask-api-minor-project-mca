import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Modal, Button, Linking, ActivityIndicator } from 'react-native';
import { IMAGE_URL } from '@env';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { API_URL } from '@env'

const ViewApplicationsScreen = ({ navigation, route }) => {
    const [error, setError] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const [status, setStatus] = useState('');

    const token = useSelector((state) => state.user.token);

    const { applicants, title, company } = route.params;

    const userIds = applicants.map((e) => e.userId);

    const [isLoading, setIsLoading] = useState(true);
    const [applicantdata, setApplicantdata] = useState([]);

    const getUsersData = async () => {
        try {
            await axios.post(`${API_URL}/api/users/get-applicants`, { userIds: userIds }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            }).then(response => {
                setIsLoading(false);
                setApplicantdata(response.data.data);
            }).catch(error => {
                setIsLoading(false);
                console.log('Backend Response getJobsData', error?.response?.data?.msg || error?.message);
            });
        } catch (error) {
            setIsLoading(false);
            console.log('APi Call Error', error);
        }
    }

    useEffect(() => {
        getUsersData();
    }, []);

    const handleStatusChange = (applicant) => {
        setSelectedApplicant(applicant);
        setModalVisible(true);
    };

    const handleStatusUpdate = async () => {
        try {
            await axios.patch(`${API_URL}/api/users/application-status`, {
                userId: selectedApplicant._id,
                deviceToken: selectedApplicant.deviceToken,
                status: status,
                title: title,
                company: company
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            }).then(response => {
                // Update the applicant data in the state
                const updatedApplicantData = applicantdata.map((applicant) => {
                    if (applicant._id === selectedApplicant._id) {
                        return { ...applicant, status: status };
                    }
                    return applicant;
                });

                // Update the state to reflect the changes
                setApplicantdata(updatedApplicantData);

                // Hide the modal and reset selected status
                setModalVisible(false);
                setStatus('');
            }).catch(error => {
                console.log('Backend Response getUsersData', error?.response?.data?.msg || error?.message);
            });
        } catch (error) {
            console.log('APi Call Error', error);
        }
    };


    const viewResume = (resume) => {
        const resumeUrl = `${API_URL}/uploads/resumes/${resume}`;
        Linking.openURL(resumeUrl).catch(err => console.error('Error opening the URL:', err));
    };

    return (
        isLoading ?
            <ActivityIndicator size={30} style={{ marginTop: 20 }} color={'#00c9ff'} />
            :
            <ScrollView style={styles.container}>
                {applicantdata?.map((applicant, index) => (
                    <View key={index} style={styles.applicantCard}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image
                                source={
                                    !applicant?.image ?
                                        require('../../../assets/images/default-profile1.png')
                                        :
                                        {
                                            uri: `${IMAGE_URL}/uploads/users/${applicant?.image}`
                                        }
                                }
                                onError={() => setError(true)}
                                style={styles.userImage}
                            />
                            <View style={styles.detailsContainer}>
                                <Text style={styles.name}>{applicant?.fullName || 'Name not available'}</Text>
                                <Text style={styles.info}>Phone: {applicant?.mobile || 'Phone number not available'}</Text>
                                <Text style={styles.info}>Email: {applicant?.email || 'Email not available'}</Text>
                                <Text style={styles.info}>Status: {applicants[index]?.status || 'Not set yet'}</Text>
                                {
                                    applicant?.status ?
                                        <Text style={[styles.info, { color: 'green' }]}>Last Updated Status: {applicant?.status}</Text>
                                        : ''
                                }
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', marginTop: 10, gap: 5 }}>
                            {
                                !applicant?.resume ?
                                    ''
                                    :
                                    <TouchableOpacity
                                        onPress={() => {
                                            viewResume(applicant?.resume);
                                        }}
                                        style={styles.viewResumeButton}>
                                        <Text style={styles.viewResumeText}>View Resume</Text>
                                    </TouchableOpacity>
                            }




                            {
                                applicant.type === 'recruiter' ?
                                    <Text>You</Text>
                                    :
                                    <>
                                        <TouchableOpacity
                                            onPress={() => handleStatusChange(applicant)}
                                            style={styles.changeStatusButton}>
                                            <Text style={styles.changeStatusText}>Change Status</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => navigation.navigate("ChatScreen", { data: applicant })}
                                            style={styles.sendButton}>
                                            <Text style={styles.changeStatusText}> Message</Text>
                                        </TouchableOpacity>
                                    </>
                            }
                        </View>
                    </View>
                ))
                }

                {/* Modal for status change */}
                <Modal
                    transparent={true}
                    visible={modalVisible}
                    animationType="slide"
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Change Status</Text>
                            <Picker
                                selectedValue={status}
                                onValueChange={(itemValue) => setStatus(itemValue)}
                                style={styles.picker}
                            >
                                <Picker.Item label="Select Option" value="" />
                                <Picker.Item label="Shortlisted" value="Shortlisted" />
                                <Picker.Item label="Not Shortlisted" value="Not Shortlisted" />
                                <Picker.Item label="Interview Scheduled" value="Interview Scheduled" />
                                <Picker.Item label="Hired" value="Hired" />
                            </Picker>
                            <View style={{ marginBottom: 10 }}>
                                <Button title="Update Status" onPress={handleStatusUpdate} />
                            </View>
                            <Button title="Cancel" onPress={() => { setModalVisible(false); setStatus(applicants?.status || '') }} color="red" />
                        </View>
                    </View>
                </Modal>
            </ScrollView >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10
    },
    applicantCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#e0e0e0'
    },
    userImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15
    },
    detailsContainer: {
        flex: 1
    },
    name: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333'
    },
    info: {
        fontSize: 14,
        color: '#777',
        marginTop: 5
    },
    viewResumeButton: {
        backgroundColor: '#007BFF',
        borderRadius: 5,
        paddingVertical: 5,
        paddingHorizontal: 10
    },
    viewResumeText: {
        color: '#fff',
        fontWeight: '500'
    },
    changeStatusButton: {
        backgroundColor: '#FFC107',
        borderRadius: 5,
        paddingVertical: 5,
        paddingHorizontal: 10
    },
    sendButton: {
        backgroundColor: 'green',
        borderRadius: 5,
        paddingVertical: 5,
        paddingHorizontal: 10
    },
    changeStatusText: {
        color: '#fff',
        fontWeight: '500'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        width: '80%'
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10
    },
    picker: {
        height: 50,
        width: '100%',
        marginBottom: 10
    }
});

export default ViewApplicationsScreen;
