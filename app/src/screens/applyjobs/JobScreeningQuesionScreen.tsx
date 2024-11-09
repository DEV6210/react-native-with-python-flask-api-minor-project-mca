import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert, Pressable, SafeAreaView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Snackbar } from 'react-native-paper';
import axios from 'axios';
import { API_URL } from '@env';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

const JobScreeningQuesionScreen = ({ navigation }) => {
    const route = useRoute();
    const { screeningQuestions, jid } = route.params || {}; // Destructure the `screeningQuestions` and `jid` from params

    // State to store answers and errors
    const [answers, setAnswers] = useState(
        screeningQuestions.reduce((acc, _, index) => ({ ...acc, [index]: '' }), {})
    );
    const [errors, setErrors] = useState(
        screeningQuestions.reduce((acc, _, index) => ({ ...acc, [index]: '' }), {})
    );

    const token = useSelector((state) => state.user.token);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [visible, setVisible] = useState(false);
    const onToggleSnackBar = () => setVisible(!visible);
    const onDismissSnackBar = () => setVisible(false);
    const [snackbarObject, setsnackbarObject] = useState({
        message: '',
        status: ''
    });

    // Handle input change
    const handleInputChange = (index, text) => {
        setAnswers({ ...answers, [index]: text });
        // Clear the error for the specific question when the user starts typing
        if (errors[index]) {
            setErrors({ ...errors, [index]: '' });
        }
    };

    // Handle form submission
    const handleSubmit = async () => {
        let hasErrors = false;
        const newErrors = {};

        // Check if all fields are filled
        Object.keys(answers).forEach((key) => {
            if (answers[key].trim() === '') {
                newErrors[key] = 'This field is required.';
                hasErrors = true;
            }
        });

        if (hasErrors) {
            setErrors(newErrors);
            return;
        }

        // Prepare data to send
        const answersArray = screeningQuestions.map((question, index) => ({
            question,
            answer: answers[index]
        }));

        try {
            setLoading(true);
            await axios.post(`${API_URL}/api/users/apply-job`, {
                jid,
                answers: answersArray
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                }
            }).then(response => {
                setLoading(false);
                onToggleSnackBar();
                setsnackbarObject({
                    ...snackbarObject,
                    message: 'Application submitted successfully.',
                    status: 'success'
                });
                setTimeout(() => {
                    navigation.navigate('HomeScreen'); // Uncomment if navigation is needed
                }, 1000);
            }).catch(error => {
                setLoading(false);
                // console.log(error?.response?.data?.msg || error.message);
                setError(error?.response?.data?.msg || error.message);
            });
        } catch (err) {
            setLoading(false);
            setError(err.message);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }} >
            <View style={{
                backgroundColor: "#fff",
                height: 50,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 5,
                elevation: 2,
                borderBottomWidth: 0.5,
                borderColor: '#888'
            }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                    <TouchableOpacity onPress={() => { navigation.goBack() }}>
                        <Icon name="arrow-back" size={30} color={'#888'} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 18, fontWeight: "500" }}>Screening Questions</Text>
                </View>
            </View>

            <View style={styles.container}>
                <ScrollView style={styles.scrollView}>
                    {screeningQuestions && screeningQuestions.length > 0 ? (
                        screeningQuestions.map((question, index) => (
                            <View key={index} style={styles.questionContainer}>
                                <Text style={styles.questionText}>{index + 1}. {question}</Text>
                                <TextInput
                                    style={[styles.input, errors[index] && styles.inputError]}
                                    value={answers[index]}
                                    onChangeText={(text) => handleInputChange(index, text)}
                                    placeholder="Enter your answer"
                                />
                                {errors[index] ? <Text style={styles.errorText}>{errors[index]}</Text> : null}
                            </View>
                        ))
                    ) : (
                        <Text style={styles.noQuestions}>No screening questions available.</Text>
                    )}
                </ScrollView>
                {error && <Text style={styles.error}>{error}</Text>}
                <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
                    <Text style={styles.submitButtonText}>Apply Now</Text>
                </TouchableOpacity>

            </View>
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
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    scrollView: {
        flex: 1,
    },
    questionContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        marginBottom: 10,
    },
    questionText: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
    },
    inputError: {
        borderColor: '#FF0000', // Red color for error indication
    },
    errorText: {
        fontSize: 14,
        color: '#FF0000',
        marginTop: 5,
    },
    noQuestions: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
    },
    error: {
        fontSize: 16,
        color: '#FF0000',
    },
    submitButton: {
        backgroundColor: '#007BFF',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default JobScreeningQuesionScreen;
