import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ButtonStyle, Color, InputStyle } from '../../../GlobalStyles';
import axios from 'axios';
import { API_URL } from '@env'
import { Button, Snackbar } from 'react-native-paper';

const ForgotPasswordScreen = ({ navigation }) => {

  const [isloading, setIsloading] = useState(false)
  const [visible, setVisible] = useState(false);
  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);
  const [snackbarObject, setsnackbarObject] = useState({
    message: '',
    status: ''
  })

  const [email, setEmail] = useState('');

  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);



  const handleSubmit = async () => {
    if (!email) {
      onToggleSnackBar()
      setsnackbarObject({
        ...snackbarObject,
        message: 'Enter Correct Email Id',
        status: 'warning'
      })
    } else {
      setIsloading(true)
      await axios.post(`${API_URL}/api/users/send-forgot-password-email`, {
        email: email
      }, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": ""
        }
      })
      .then(response => {
          console.log(response?.data)
          setTimer(60);
          setIsloading(false)
          // onToggleSnackBar()
          // setsnackbarObject({
          //   ...snackbarObject,
          //   message: response?.data?.msg,
          //   status: 'success'
          // })
          navigation.navigate('OtpScreen', { otp: response?.data?.otp, email: response?.data?.email, msg: response?.data?.msg })
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
  }

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <View style={styles.container}>
              {/* <Text style={styles.header}>Forgot Password?</Text> */}
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
              <Button
                style={{
                  backgroundColor: ButtonStyle.backgroundColor,
                  borderRadius: ButtonStyle.borderRadius,
                  height: ButtonStyle.height,
                  justifyContent: 'center',
                  marginTop: 10,
                  marginBottom: 15
                }}
                loading={isloading}
                mode="contained" onPress={() => { timer === 0 ? handleSubmit() : '' }}>
                {timer > 0 ? `Resend after ${timer}s` : 'Send OTP'}
              </Button>
            </View>
          </View>
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
    backgroundColor: '#fff',
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
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    ...InputStyle,
    marginBottom: 20,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 5,
    color: '#000',
  },
  sendOtpButton: {
    backgroundColor: Color.mainColor,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    height: 44,
    marginTop: 10,
  },
  sendOtpButtonText: {
    color: Color.textColor,
  },
});

export default ForgotPasswordScreen;
