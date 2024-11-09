import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard,
    Image,
    ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ButtonStyle, Color, InputStyle } from '../../../GlobalStyles';
import { Button, Snackbar } from 'react-native-paper';
import { API_URL } from '@env'
import axios from 'axios';
import messaging from '@react-native-firebase/messaging';
import { setUserDetails } from '../../store/reducers/userReducer';
import { useDispatch } from 'react-redux';
import GoogleAuth from './GoogleAuth';
import FacebookAuth from './FacebookAuth';

const SignupScreen = ({ navigation }) => {

    const dispatch = useDispatch()

    const [fullName, setFullName] = useState('');
    const [lastName, setlastName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const [isloading, setIsloading] = useState(false)
    const [visible, setVisible] = useState(false);
    const onToggleSnackBar = () => setVisible(!visible);
    const onDismissSnackBar = () => setVisible(false);
    const [snackbarObject, setsnackbarObject] = useState({
        message: '',
        status: ''
    })

    const handleRegister = async () => {
        // Validate Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // Validate Mobile
        const mobileRegex = /^[0-9]{10}$/;

        if (!fullName.trim()) {
            onToggleSnackBar()
            setsnackbarObject({
                ...snackbarObject,
                message: 'First Name is required',
                status: 'warning'
            })
        } else if (!lastName.trim()) {
            onToggleSnackBar()
            setsnackbarObject({
                ...snackbarObject,
                message: 'Last Name is required',
                status: 'warning'
            })
        } else if (!email.trim()) {
            onToggleSnackBar()
            setsnackbarObject({
                ...snackbarObject,
                message: 'Email is required',
                status: 'warning'
            })
        } else if (!emailRegex.test(email.trim())) {
            onToggleSnackBar()
            setsnackbarObject({
                ...snackbarObject,
                message: 'Invalid email format',
                status: 'warning'
            })
        } else if (!mobile.trim()) {
            onToggleSnackBar()
            setsnackbarObject({
                ...snackbarObject,
                message: 'Mobile number is required',
                status: 'warning'
            })
        } else if (!mobileRegex.test(mobile)) {
            onToggleSnackBar()
            setsnackbarObject({
                ...snackbarObject,
                message: 'Mobile number must be 10 digits',
                status: 'warning'
            })
        } else if (!password) {
            onToggleSnackBar()
            setsnackbarObject({
                ...snackbarObject,
                message: 'Password is required',
                status: 'warning'
            })
        } else if (password !== confirmPassword) {
            onToggleSnackBar()
            setsnackbarObject({
                ...snackbarObject,
                message: 'Passwords do not match',
                status: 'warning'
            })
        } else {
            setIsloading(true)
            const deviceToken = await messaging().getToken();
            await axios.post(`${API_URL}/api/users/signup`, {
                fullName: fullName + ' ' + lastName, email: email, mobile: mobile, password: password, deviceToken: deviceToken
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": ""
                }
            })
                .then(response => {
                    setIsloading(false)
                    const token = response.data.token;
                    const user = response.data.user;
                    dispatch(setUserDetails({
                        token: token,
                        user: user
                    }))
                }).catch(error => {
                    setIsloading(false)
                    onToggleSnackBar()
                    setsnackbarObject({
                        ...snackbarObject,
                        message: error?.response?.data?.msg || error?.message,
                        status: 'error'
                    })
                })
        }

    };

    return (
        <>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView>
                        <View style={styles.inner}>
                            <View style={styles.container}>
                                <View style={{ alignItems: 'center', marginBottom: -20, marginTop: -40 }} >
                                    <Image
                                        source={require('../../../assets/images/logo.png')}
                                        style={{
                                            height: 200,
                                            width: 200
                                        }}
                                    />
                                </View>

                                <View style={{ flexDirection: 'row', gap: 10 }} >
                                    <View style={[styles.inputContainer, { width: '48.4%' }]}>
                                        {/* <Icon name="person" size={20} color="#888" style={styles.icon} /> */}
                                        <TextInput
                                            style={styles.input}
                                            placeholder="First Name"
                                            placeholderTextColor="#888"
                                            value={fullName}
                                            onChangeText={setFullName}
                                        />
                                    </View>
                                    <View style={[styles.inputContainer, { width: '48.4%' }]}>
                                        {/* <Icon name="person" size={20} color="#888" style={styles.icon} /> */}
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Last Name"
                                            placeholderTextColor="#888"
                                            value={lastName}
                                            onChangeText={setlastName}
                                        />
                                    </View>
                                </View>
                                <View style={styles.inputContainer}>
                                    <Icon name="email" size={20} color="#888" style={styles.icon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Email"
                                        placeholderTextColor="#888"
                                        value={email}
                                        onChangeText={setEmail}
                                    />
                                </View>
                                <View style={styles.inputContainer}>
                                    <Icon name="phone" size={20} color="#888" style={styles.icon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Mobile No"
                                        placeholderTextColor="#888"
                                        keyboardType="phone-pad"
                                        value={mobile}
                                        onChangeText={setMobile}
                                        returnKeyType='numeric'
                                        maxLength={10}
                                    />
                                </View>
                                <View style={styles.inputContainer}>
                                    <Icon name="lock" size={20} color="#888" style={styles.icon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Password"
                                        placeholderTextColor="#888"
                                        value={password}
                                        onChangeText={setPassword}
                                    />

                                </View>
                                <View style={styles.inputContainer}>
                                    <Icon name="lock" size={20} color="#888" style={styles.icon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Confirm Password"
                                        placeholderTextColor="#888"
                                        secureTextEntry={!isConfirmPasswordVisible}
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                    />
                                    <TouchableOpacity onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}>
                                        <Icon name={isConfirmPasswordVisible ? "visibility-off" : "visibility"} size={20} color="#888" />
                                    </TouchableOpacity>
                                </View>


                                <Button
                                    style={{
                                        backgroundColor: "#fff",
                                        borderRadius: ButtonStyle.borderRadius,
                                        height: ButtonStyle.height,
                                        justifyContent: 'center',
                                        marginTop: 10,
                                        marginBottom: 15
                                    }}
                                    loading={isloading}
                                    mode="contained-tonal" onPress={handleRegister}>
                                    Register
                                </Button>

                                <TouchableOpacity onPress={() => { navigation.navigate('LoginScreen') }}>
                                    <Text style={styles.forgotPassword}>Already have an account? Login</Text>
                                </TouchableOpacity>

                                <View style={styles.dividerContainer}>
                                    <View style={styles.divider} />
                                    <Text style={styles.orText}>OR</Text>
                                    <View style={styles.divider} />
                                </View>

                                <View style={styles.socialButtonsContainer}>
                                    <GoogleAuth />
                                    {/* <FacebookAuth /> */}
                                </View>

                            </View>
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
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
        flex: 1,
        justifyContent: 'center',
        backgroundColor: Color.mainColor,
    },
    inner: {
        padding: 24,
        flex: 1,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        ...InputStyle,
        marginBottom: 15,
        backgroundColor: '#fff'
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        paddingVertical: 5,
        color: '#000',
    },
    forgotPassword: {
        color: '#3b5998',
        textAlign: 'center',
        marginBottom: 20,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#ccc',
    },
    orText: {
        marginHorizontal: 10,
        color: '#ccc',
    },
    socialButtonsContainer: {
        marginBottom: 20,
        flexDirection: "row",
        gap: 20,
        justifyContent: "space-evenly",
    },
    socialButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 5,
        justifyContent: 'center',
        marginBottom: 10,
    },
    googleButton: {},
    facebookButton: {},
    socialButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    registerButton: {
        backgroundColor: Color.mainColor,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        height: 44,
        marginTop: 10,
        marginBottom: 15,
    },
    registerButtonText: {
        color: Color.textColor,
    },
    login: {
        color: '#3b5998',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default SignupScreen;
