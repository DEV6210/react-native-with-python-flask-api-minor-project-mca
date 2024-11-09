import React, { useState } from 'react';
import { Keyboard, Platform, StyleSheet, Text, TouchableOpacity, View, SafeAreaView, TextInput, KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Alert, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Color } from '../../../GlobalStyles';

const CreateJobScreen = ({ navigation }) => {

    // State for the input values
    const [jobTitle, setJobTitle] = useState('');
    const [jobDescription, setJobDescription] = useState('');

    // Handle navigation to the next screen with data
    const handleNext = () => {
        if (jobTitle && jobDescription) {
            navigation.navigate('CreateJobScreeningQuestionScreen', {
                jobTitle,
                jobDescription
            });
        } else {
            // Handle the case where the input is invalid
            Alert.alert('Warning', 'Please fill in all fields.');
        }
    };



    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name="chevron-back-outline" size={24} color={Color.mainColor} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Create Job</Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 5 }}>
                    <TouchableOpacity
                        onPress={() => { handleNext() }}
                        style={styles.nextButton}
                    >
                        <Text style={styles.nextButtonText}>Next</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            Linking.openURL('https://Pseudorandom Number Generators.in/login');
                        }}
                        style={{
                            height: 36,
                            width: 85,
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: 99,
                            borderColor: "#3777B5",
                            borderWidth: 1,
                            marginRight: 5
                        }}
                    >
                        <Text style={styles.nextButtonText}>Use WEB</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView
                        keyboardShouldPersistTaps="handled"
                        contentInsetAdjustmentBehavior="automatic"
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.inner}>
                            <Text style={styles.headerTitles}>Post a Job</Text>
                            <Text style={{ color: '#888' }} >We recommend posting jobs through the web panel for a better experience. We offer recruiters a dedicated panel at no cost.</Text>

                            <TextInput
                                placeholder="Job Title"
                                placeholderTextColor={styles.placeholderStyle.color}
                                style={styles.textInput}
                                value={jobTitle}
                                onChangeText={setJobTitle}
                            />
                            <View
                                style={{
                                    borderBottomColor: '#000000',
                                }}>

                                <TextInput
                                    placeholder='Job Description'
                                    editable
                                    multiline
                                    value={jobDescription}
                                    onChangeText={setJobDescription}
                                    style={{
                                        borderWidth: 0.5,
                                        paddingBottom: 70,
                                        borderRadius: 5,
                                        borderColor: 'gray',
                                    }}
                                />
                            </View>

                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: "#fff",
        height: 50,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 5,
        elevation: 2
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "500",
        color: Color.mainColor
    },
    nextButton: {
        height: 36,
        width: 71,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 99,
        borderColor: "#3777B5",
        borderWidth: 1,
        marginRight: 5
    },
    nextButtonText: {
        color: "#3777B5",
        fontWeight: "500"
    },
    container: {
        flex: 1
    },
    inner: {
        flex: 1,
        marginHorizontal: 15,
        marginVertical: 20
    },
    headerTitles: {
        fontSize: 16,
        fontWeight: "700",
        color: 'gray'
    },
    textInput: {
        borderWidth: 0.5,
        borderColor: 'gray',
        borderRadius: 4,
        paddingHorizontal: 15,
        height: 44,
        marginVertical: 10
    },
    descriptionContainer: {
        borderBottomColor: '#000000',
    },
    descriptionInput: {
        borderWidth: 1,
        paddingBottom: 70,
        borderRadius: 4,
        paddingHorizontal: 15,
        height: 100, // Adjust height as needed
        marginVertical: 10
    },
    placeholderStyle: {
        color: "#9AA2B1"
    }
});

export default CreateJobScreen;
