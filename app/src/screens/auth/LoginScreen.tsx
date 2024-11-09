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
import axios from 'axios';
import messaging from '@react-native-firebase/messaging';
import { setUserDetails } from '../../store/reducers/userReducer';
import { useDispatch } from 'react-redux';
import { API_URL } from '@env'
import GoogleAuth from './GoogleAuth';
import FacebookAuth from './FacebookAuth';

const LoginScreen = ({ navigation }) => {

  const dispatch = useDispatch()

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const [isloading, setIsloading] = useState(false)
  const [visible, setVisible] = useState(false);
  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);
  const [snackbarObject, setsnackbarObject] = useState({
    message: '',
    status: ''
  })

  const handleSubmit = async () => {
    if (!email) {
      onToggleSnackBar()
      setsnackbarObject({
        ...snackbarObject,
        message: 'Enter Correct Email Id',
        status: 'warning'
      })
    } else if (!password) {
      onToggleSnackBar()
      setsnackbarObject({
        ...snackbarObject,
        message: 'Enter Password',
        status: 'warning'
      })
    } else {
      try {
        setIsloading(true)
        const deviceToken = await messaging().getToken();
        await axios.post(`${API_URL}/api/users/login`, {
          email: email, password: password, deviceToken: deviceToken
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
      } catch (error) {
        console.log('Login Error: ', error)
      }
    }
  }

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView >
            <View style={styles.inner}>
              <View style={styles.container}>
                <View style={{ alignItems: 'center', marginBottom: 0, marginTop: -5 }} >
                  <Image
                    source={require('../../../assets/images/logo.png')}
                    style={{
                       height: 200,
                        width: 200 
                      }}
                  />
                </View>


                <View style={styles.inputContainer}>
                  <Icon name="email" size={22} color="#888" style={styles.icon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#888"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Icon name="lock" size={22} color="#888" style={styles.icon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#888"
                    secureTextEntry={!isPasswordVisible}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                    <Icon name={isPasswordVisible ? "visibility-off" : "visibility"} size={22} color="#888" />
                  </TouchableOpacity>
                </View>


                <Button
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: ButtonStyle.borderRadius,
                    height: ButtonStyle.height,
                    justifyContent: 'center',
                    marginTop: 10,
                    marginBottom: 15
                  }}
                  loading={isloading}
                  mode="contained-tonal" onPress={handleSubmit}>
                  Login
                </Button>


                <TouchableOpacity
                  onPress={() => { navigation.navigate('ForgotPasswordScreen') }}
                >
                  <Text style={styles.forgotPassword}>FORGOT PASSWORD?</Text>
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
                <TouchableOpacity
                  onPress={() => { navigation.navigate('SignupScreen') }}
                >
                  <Text style={styles.register}>New to Pseudorandom Number Generators? Register Now</Text>
                </TouchableOpacity>
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
    backgroundColor: Color.mainColor
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
    marginBottom: 20,
    backgroundColor:'#fff'
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
    // marginTop:5
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
    justifyContent: "space-evenly"
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    justifyContent: 'center',
    marginBottom: 10,
  },
  socialIcon: {
    marginRight: 10,
  },
  googleButton: {

  },
  facebookButton: {

  },
  socialButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  register: {
    color: '#3b5998',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default LoginScreen;
