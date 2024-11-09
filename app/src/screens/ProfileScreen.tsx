import React, { useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Platform, TextInput, Text, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { PermissionsAndroid } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import axios from 'axios';
import { API_URL, IMAGE_URL } from '@env'
import { useDispatch, useSelector } from 'react-redux';
import { LinearProgress } from '@rneui/themed';
import { updateUser, updateUserImage } from '../store/reducers/userReducer';
import { Color } from '../../GlobalStyles';
import { Button, Snackbar } from 'react-native-paper';

const ProfileScreen = ({ navigation }) => {

    const dispatch = useDispatch()
    const data = useSelector((state) => state.user)
    const token = data.token
    const user = data.data

    const [isloading1, setIsloading1] = useState(false)

    const requestStoragePermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                {
                    title: 'Storage Permission',
                    message: 'App needs access to your storage to pick an image.',
                    buttonPositive: 'OK',
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                openImagePicker();
            } else {
                console.log('Storage permission denied');
            }
        } catch (err) {
            console.warn(err);
        }
    };

    const handleOpenImagePicker = async () => {
        if (Platform.OS === 'android') {
            await requestStoragePermission();
        } else {
            openImagePicker();
        }
    };

    // image picker
    const openImagePicker = () => {
        ImagePicker.openPicker({
            width: 512,
            height: 512,
            cropping: true
        }).then(async image => {
            try {
                setIsloading1(true)
                // Determine the file extension based on the MIME type
                const fileExtension = image.mime.split('/')[1];

                const formData = new FormData();
                formData.append('image', {
                    uri: image.path,
                    type: image.mime,
                    name: `image_${Date.now()}.${fileExtension}`, // Use the appropriate file extension
                });

                await axios.post(`${API_URL}/api/users/update-profile-image`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "Authorization": token
                    }
                }).then(response => {
                    setIsloading1(false)
                    dispatch(updateUserImage({ image: response?.data?.image }))
                }).catch(error => {
                    setIsloading1(false)
                    console.log('backend error', error)
                })
            } catch (error) {
                console.log('api call error', error)
            }
        }).catch(error => {
            console.log(error.message)
        });
    };


    const [fullName, setFullName] = useState(user?.fullName);

    const [isloading, setIsloading] = useState(false)
    const [visible, setVisible] = useState(false);
    const onToggleSnackBar = () => setVisible(!visible);
    const onDismissSnackBar = () => setVisible(false);
    const [snackbarObject, setsnackbarObject] = useState({
        message: '',
        status: ''
    })

    const handleUpdate = async () => {

        if (!fullName.trim()) {
            onToggleSnackBar()
            setsnackbarObject({
                ...snackbarObject,
                message: 'Full Name is required',
                status: 'warning'
            })
        } else {
            setIsloading(true)
            await axios.post(`${API_URL}/api/users/update-profile`, {
                fullName: fullName
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                }
            })
                .then(response => {
                    setIsloading(false)

                    onToggleSnackBar()
                    setsnackbarObject({
                        ...snackbarObject,
                        message: response.data.msg,
                        status: 'success'
                    })
                    dispatch(updateUser(
                        {
                            fullName: fullName,
                            firstName: response.data.name.firstName,
                            middleName: response.data.name.middleName,
                            lastName: response.data.name.lastName,
                        }
                    ))

                }).catch(error => {
                    setIsloading(false)
                    onToggleSnackBar()
                    setsnackbarObject({
                        ...snackbarObject,
                        message: error?.response?.data?.msg || error?.message,
                        status: 'error'
                    })
                });
        }
    };

    return (
        <>
            <View style={styles.container}>
                <TouchableOpacity style={styles.imageContainer} onPress={handleOpenImagePicker} >
                    <View
                        style={{
                            elevation: 3,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.3,
                            shadowRadius: 2,
                        }}
                    >
                        {
                            user?.image ?
                                <Image source={{ uri: `${IMAGE_URL}/uploads/users/${user?.image}` }}
                                    style={{
                                        height: 100,
                                        width: 100,
                                        borderRadius: 99
                                    }}
                                />
                                :
                                <Image source={require('../../assets/images/default-profile1.png')}
                                    style={{
                                        height: 100,
                                        width: 100,
                                        borderRadius: 99
                                    }}
                                />
                        }

                    </View>
                    <View style={styles.cameraIcon} >
                        <Icon name='camera-reverse-outline' color={"#fff"} size={14} />
                    </View>
                </TouchableOpacity>
                {
                    isloading1 ?
                        <LinearProgress
                            variant="indeterminate"
                            color='green'
                            style={{ marginBottom: 15 }}
                        />
                        :
                        ''
                }
                <View style={styles.form} >
                    <View style={styles.inputContainer}>
                        <Icon name="person" size={20} color="gray" style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Full Name"
                            placeholderTextColor="gray"
                            value={fullName}
                            onChangeText={setFullName}
                        />
                    </View>
                    <View style={[styles.inputContainer, { backgroundColor: '#ddd' }]}>
                        <Icon name="mail" size={20} color="gray" style={styles.icon} />
                        <TextInput
                            editable={false}
                            style={styles.input}
                            placeholder="Email"
                            placeholderTextColor="#888"
                            value={user?.email}
                        />
                    </View>
                    <View style={[styles.inputContainer, { backgroundColor: '#ddd' }]}>
                        <Icon name="call" size={20} color="gray" style={styles.icon} />
                        <TextInput
                            editable={false}
                            style={styles.input}
                            placeholder="Mobile No"
                            placeholderTextColor="#888"
                            keyboardType="phone-pad"
                            value={user?.mobile}
                            maxLength={10}

                        />
                    </View>

                    <Button
                        style={{
                            backgroundColor: Color.mainColor,
                            borderRadius: 5,
                            justifyContent: 'center',
                            height: 44,
                            marginTop: 10,
                            marginBottom: 15
                        }}
                        loading={isloading}
                        mode="contained" onPress={handleUpdate}>
                        Update Profile
                    </Button>
                </View>
            </View >

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
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        alignItems: 'center',
        padding: 20,
        flex: 1,
        shadowOpacity: 0.5,
        shadowRadius: 2,
        paddingHorizontal: 10,
        paddingTop: 30,
        paddingBottom: 12,
        borderRadius: 10,
    },
    imageContainer: {
        position: 'relative',
        marginBottom: 20,
        elevation: 1,
        shadowColor: '#000',
        borderRadius: 99,
        padding: 0.2
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    cameraIcon: {
        position: 'absolute',
        right: 8,
        bottom: 5,
        backgroundColor: '#272829',
        borderRadius: 12,
        padding: 5,
    },
    form: {
        elevation: 5,
        margin: 10

    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 0.5,
        paddingHorizontal: 10,
        borderColor: '#888',
        marginBottom: 20,
        borderRadius: 5,
        height: 44,
        width: '100%',
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        color: '#000',
    },

});

export default ProfileScreen;
