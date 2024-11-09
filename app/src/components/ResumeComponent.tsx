import React, { useState } from 'react'
import { Alert, Image, Keyboard, KeyboardAvoidingView, Linking, Platform, SafeAreaView, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import DocumentPicker from 'react-native-document-picker';
import { Color } from '../../GlobalStyles';
import { LinearProgress } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { API_URL } from '@env'
import { updateResume } from '../store/reducers/userReducer';
import Modal from "react-native-modal";


const ApplyJobsFormScreen = ({ navigation }) => {

    const data = useSelector((state) => state.user);
    const token = data.token
    const user = data.data
    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(false)
    const [documentFile, setdocumentFile] = useState()

    // Function to pick a single document
    const pickDocument = async () => {
        try {
            const res = await DocumentPicker.pickSingle({
                type: [DocumentPicker.types.pdf],
            });

            if (res.size <= 1 * 1024 * 1024) { // 1 MB in bytes
                setdocumentFile(res);

                try {
                    setIsLoading(true)
                    const formData = new FormData();
                    formData.append('file', {
                        uri: res.uri,
                        type: res.type,
                        name: res.name,
                    });

                    await axios.patch(`${API_URL}/api/users/update-resume`, formData, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                            "Authorization": token
                        }
                    }).then(response => {
                        setIsLoading(false)
                        dispatch(
                            updateResume(
                                {
                                    resume: response.data.fileName
                                }
                            )
                        )
                        clearFile()
                    }).catch(error => {
                        setIsLoading(false)
                        clearFile()
                        // console.log(error?.response?.data?.msg || error?.message)
                        Alert.alert('Error', error?.response?.data?.msg || error?.message);
                    })
                } catch (error) {
                    setIsLoading(false)
                    clearFile()
                    console.log('Error:', error);
                    Alert.alert('Error', 'There was an error submitting the form.');
                }
            } else {
                Alert.alert('File Size Error', 'The selected file exceeds the 1 MB size limit.');
            }
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the document picker
                console.log('User cancelled.');
            } else {
                // Handle other errors
                console.error('Error:', err);
            }
        }
    };
    const bytesToSize = (bytes) => {
        if (bytes < 1024) {
            return bytes + ' bytes';
        } else if (bytes < 1024 * 1024) {
            return (bytes / 1024).toFixed(2) + ' kb'; // Convert to KB
        } else {
            return (bytes / (1024 * 1024)).toFixed(2) + ' mb'; // Convert to MB
        }
    };

    // clear file
    const clearFile = () => {
        setdocumentFile()
    }
    const [isModalVisible, setModalVisible] = useState(false);

    const deleteResume = async () => {
        await axios.patch(`${API_URL}/api/users/delete-resume`, { oldFile: user.resume }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        }).then(response => {
            setModalVisible(false)
            dispatch(
                updateResume(
                    {
                        resume: null
                    }
                )
            )
        }).catch(error => {
            ToastAndroid.showWithGravityAndOffset(
                error?.response?.data?.msg || error?.message,
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50,
            );
        })
    }

    const viewResume = () => {
        if (user?.resume) {
            const resumeUrl = `${API_URL}/uploads/resumes/${user.resume}`;
            Linking.openURL(resumeUrl).catch(err => console.error('Error opening the URL:', err));
        }
    };

    return (
        <View style={{ marginHorizontal: 15 }}>
            {
                user?.resume ?
                    <View style={styles.selectedDiv}>
                        <View style={styles.selectedsubdiv} >
                            <Image
                                source={require("../../assets/images/pdf-icon.png")}
                                style={{ height: 30, width: 25 }} />
                            <TouchableOpacity onPress={() => { viewResume() }} style={{ marginTop: -3 }}>
                                <Text>{user?.resume}</Text>
                                <Text style={{ color: 'blue' }}>
                                    View Resume
                                </Text>
                            </TouchableOpacity>
                            <Icon onPress={() => { setModalVisible(true) }} name="trash-outline" size={20} style={styles.closeIcon} />
                        </View>

                        <View style={{ flexDirection: 'row', gap: 5 }} >
                            <Icon name="eye-outline" size={18} color={'gray'} />
                            <Text style={{ color: 'gray',marginTop:-1 }}>Recruiters Can View Your Resume</Text>
                        </View>
                    </View>
                    :
                    documentFile ?
                        ""
                        :
                        <TouchableOpacity style={styles.filePicker} onPress={() => { pickDocument() }}>
                            <Icon name="document-attach-outline" size={30} />
                            <Text style={{ fontWeight: "500", marginTop: 10 }}>
                                Drag & Drop or
                                <Text > Choose </Text>
                                file to Upload
                            </Text>
                            <Text >Select pdf or word 1 MB size limit</Text>
                        </TouchableOpacity>
            }

            {
                documentFile ?
                    <View style={styles.selectedDiv}>
                        <View style={styles.selectedsubdiv} >
                            <Image
                                source={
                                    documentFile?.type === "application/pdf" ?
                                        require("../../assets/images/pdf-icon.png")
                                        :
                                        documentFile?.type === "image/jpeg" ?
                                            require("../../assets/images/jpg-icon.png")
                                            :
                                            require("../../assets/images/word-icon.png")
                                }
                                style={{ height: 30, width: 25 }} />
                            <View style={{ marginTop: -3 }}>
                                <Text>{documentFile?.name}</Text>
                                <Text>{bytesToSize(documentFile?.size)}</Text>
                            </View>
                            <Icon onPress={clearFile} name="trash-outline" size={20} style={styles.closeIcon} />
                        </View>
                        {
                            isLoading ?
                                <LinearProgress color="primary" />
                                :
                                ''
                        }
                    </View>
                    :
                    ""
            }




            <Modal
                isVisible={isModalVisible}
                animationIn='zoomIn'
                animationOut='fadeOut'
            >
                <View style={{ backgroundColor: '#fff', minHeight: 180, borderRadius: 10 }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginHorizontal: 20,
                            marginTop: 20,
                            marginBottom: 10
                        }}
                    >
                        <Text style={{ fontWeight: 'bold', fontSize: 18 }} >Delete Resume</Text>
                        <TouchableOpacity onPress={() => { setModalVisible(false) }} >
                            <Icon name="close" size={25} style={{ marginTop: -2 }} />
                        </TouchableOpacity>
                    </View>

                    <View
                        style={{
                            marginHorizontal: 20,
                        }}
                    >
                        <Text>
                            Are You sure to delete?
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => { deleteResume() }}
                        style={{
                            position: 'absolute',
                            right: 20,
                            bottom: 15,
                            backgroundColor: '#DC2626',
                            paddingVertical: 6,
                            paddingHorizontal: 15
                        }}
                    >
                        <Text
                            style={{
                                color: "#FCFCFC",
                                fontWeight: 'bold'
                            }}
                        >
                            Yes
                        </Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View >
    )
}

const styles = StyleSheet.create({
    // filePicker
    filePicker: {
        borderWidth: 1,
        borderStyle: "dashed",
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        height: 120
    },
    // divider
    dividerSection: {
        marginTop: 10,
        marginBottom: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: Color.gray200, // You can change the color here
        marginHorizontal: 10, // Adjust the margin as needed
    },
    //selectedDiv
    selectedDiv: {
        backgroundColor: Color.blue100,
        marginTop: 0,
        paddingVertical: 10,
        paddingHorizontal: 5,
        gap: 10,
        borderRadius: 8
    },
    selectedsubdiv: {
        flexDirection: "row",
        gap: 10
    },
    closeIcon: {
        position: "absolute",
        right: 0,
        marginTop: -3
    }
});
export default ApplyJobsFormScreen