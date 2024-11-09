import React, { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ScrollView, TouchableWithoutFeedback } from 'react-native';
import { Button } from 'react-native-paper';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import { ButtonStyle, Color } from '../../../GlobalStyles';
import { useDispatch, useSelector } from 'react-redux';
import { API_URL } from '@env'
import { updateUserType } from '../../store/reducers/userReducer';

const ApplyJobsFormScreen = ({ navigation }) => {
    const userdata = useSelector((state) => state.user)
    const token = userdata.token

    const dispatch = useDispatch()

    const [companyName, setCompanyName] = useState('');
    const [city, setCity] = useState('');
    const [address, setAddress] = useState('');
    const [documentFile, setDocumentFile] = useState(null);
    const [loading, setLoading] = useState(false);

    // Function to pick an image
    const pickImage = () => {
        launchImageLibrary({
            mediaType: 'photo',
            quality: 1,
        }, response => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorCode) {
                console.log('ImagePicker Error: ', response.errorMessage);
            } else {
                setDocumentFile(response.assets[0]);
            }
        });
    };

    // Clear selected image
    const clearImage = () => {
        setDocumentFile(null);
    };

    // Validate form fields
    const validateForm = () => {
        if (!companyName.trim()) {
            Alert.alert('Validation Error', 'Company Name is required.');
            return false;
        }
        if (!city.trim()) {
            Alert.alert('Validation Error', 'City is required.');
            return false;
        }
        if (!address.trim()) {
            Alert.alert('Validation Error', 'Address is required.');
            return false;
        }
        if (!documentFile) {
            Alert.alert('Validation Error', 'Company Logo is required.');
            return false;
        }
        return true;
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);

        const formData = new FormData();
        formData.append('companyName', companyName.trim());
        formData.append('city', city.trim());
        formData.append('address', address.trim());
        formData.append('type', 'recruiter');
        formData.append('isAdded', false);

        if (documentFile) {
            formData.append('image', {
                uri: documentFile.uri,
                type: documentFile.type,
                name: documentFile.fileName,
            });
        }

        try {
            await axios.post(`${API_URL}/api/users/update-type`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": token
                }
            }).then(response => {
                setLoading(false)
                dispatch(updateUserType({
                    type: 'recruiter',
                    companyDetails: {
                        name: companyName,
                        image: response.data.image,
                        city: city,
                        address: address
                    }
                }))
                // Reset form fields
                setCompanyName('');
                setCity('');
                setAddress('');
                setDocumentFile(null);

            }).catch(error => {
                setLoading(false)
                // console.log(error?.response?.data?.msg || error)
                Alert.alert('Error', error?.response?.data?.msg || error);
            })
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', 'There was an error submitting the form.');
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <View style={{ paddingHorizontal: 8, paddingVertical: 10 }}>
                <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => { navigation.goBack() }}>
                    <Icon name="arrow-back" size={30} color={'#888'} />
                </TouchableOpacity>
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
                            <Text style={styles.headerTitles2}>Fill the Details</Text>

                            <TextInput
                                placeholder="Company Name"
                                style={styles.textInput}
                                value={companyName}
                                onChangeText={setCompanyName}
                            />
                            <TextInput
                                placeholder="City"
                                style={styles.textInput}
                                value={city}
                                onChangeText={setCity}
                            />

                            <TextInput
                                placeholder="Address"
                                style={styles.textArea}
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                                value={address}
                                onChangeText={setAddress}
                            />

                            <Text style={styles.headerTitles2}>Company Logo</Text>


                            {documentFile ?
                                <View>

                                    <View style={styles.selectedSubDiv}>
                                        <Icon onPress={clearImage} name="close-sharp" size={30} style={styles.closeIcon} />
                                    </View>

                                    <View style={styles.selectedDiv}>

                                        <Image
                                            source={{ uri: documentFile.uri }}
                                            style={styles.image}
                                        />

                                    </View>
                                </View>

                                :
                                <TouchableOpacity style={styles.filePicker} onPress={pickImage}>
                                    <Icon name="document-attach-outline" size={30} />
                                    <Text style={{ fontWeight: "500", marginTop: 10 }}>
                                        Drag & Drop or
                                        <Text> Choose </Text>
                                        file to Upload
                                    </Text>
                                    <Text style={{ marginTop: 2 }}>Select image</Text>
                                </TouchableOpacity>
                            }

                            <Button
                                style={{
                                    backgroundColor: Color.mainColor,
                                    borderRadius: ButtonStyle.borderRadius,
                                    height: ButtonStyle.height,
                                    justifyContent: 'center',
                                    marginTop: 50,
                                    marginBottom: 15,
                                }}
                                loading={loading}
                                mode="contained"
                                onPress={handleSubmit}
                            >
                                Save and Finished
                            </Button>
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        // flex: 1
    },
    inner: {
        flex: 1,
        marginHorizontal: 15,
    },
    headerTitles2: {
        marginTop: 10,
        marginBottom: 15,
        fontSize: 18,
        color: "#0D111C",
        fontWeight: "bold"
    },
    textInput: {
        height: 40,
        borderRadius: 3,
        borderWidth: 1,
        marginVertical: 10,
        paddingHorizontal: 12
    },
    textArea: {
        height: 100,
        borderRadius: 3,
        borderWidth: 1,
        marginVertical: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        textAlignVertical: "top",
    },
    filePicker: {
        borderWidth: 1,
        borderStyle: "dashed",
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        height: 120
    },
    selectedDiv: {
        marginTop: 15,
        padding: 20,
        gap: 10,
        borderRadius: 8,
        alignItems: 'center'
    },
    selectedSubDiv: {
        flexDirection: "row",
        gap: 10,
        alignItems: 'center'
    },
    closeIcon: {
        position: "absolute",
        right: 0,
        marginTop: -3
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginBottom: 10
    }
});

export default ApplyJobsFormScreen;
