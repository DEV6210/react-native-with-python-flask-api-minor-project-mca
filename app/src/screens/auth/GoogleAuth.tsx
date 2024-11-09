import React from 'react'
import { Image, Text, ToastAndroid, TouchableOpacity } from 'react-native'
import {
    GoogleSignin,
    statusCodes,
} from '@react-native-google-signin/google-signin';
import messaging from '@react-native-firebase/messaging';
import axios from 'axios';
import { API_URL } from '@env'
import { setUserDetails } from '../../store/reducers/userReducer';
import { useDispatch } from 'react-redux';
import { Color } from '../../../GlobalStyles';
// import { useNavigation } from '@react-navigation/native';

const GoogleAuth = () => {

    // const navigation = useNavigation()
    const dispatch = useDispatch()

    const handleSubmit = async () => {
        await GoogleSignin.signIn().then(async response => {
            const { user } = response
            const deviceToken = await messaging().getToken();
            await axios.post(`${API_URL}/api/users/google-auth`, {
                email: user.email, fullName: user.name, deviceToken: deviceToken
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": ""
                }
            })
                .then(response => {
                    let token = response.data.token;
                    let user = response.data.user;

                    dispatch(setUserDetails({
                        token: token,
                        user: user
                    }));

                }).catch(error => {
                    ToastAndroid.show(error?.response?.data?.msg || error?.message, ToastAndroid.SHORT);
                })

        }).catch(error => {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // console.log('Error Code Cancelled:', error);
                ToastAndroid.show(`Cancelled.`, ToastAndroid.SHORT);
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // console.log('Error Code In Progress:', error);
                ToastAndroid.show(`Progress.`, ToastAndroid.SHORT);
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // console.log('Error Code Play Services Not Available:', error);
                ToastAndroid.show(`Services Not Available.`, ToastAndroid.SHORT);
            } else {
                // console.log('Something Went Wrong', error);
                ToastAndroid.show(`Something Went Wrong, Check Netork Connection.`, ToastAndroid.SHORT);
            }
        })


    }


    return (
        <TouchableOpacity
            style={{
                backgroundColor: '#fff',
                height: 44,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: "row",
                gap: 10,
                borderRadius: 99,
                paddingHorizontal: 25,
                borderWidth: 0.8,
                borderColor: '#eee'
            }}

            onPress={() => { handleSubmit() }}  >
            <Image
                source={require('../../../assets/images/google-icon.png')}
                style={{ height: 20, width: 20 }}
            />
            <Text style={{ fontWeight: 'bold', color: '#3C3D37' }} >Continue With Google</Text>
        </TouchableOpacity>
    )
}

export default GoogleAuth
