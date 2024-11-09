
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
import { useDispatch, useSelector } from 'react-redux';
import { setUserDetails, updateUserDetails } from '../../store/reducers/userReducer';

const LinkMobileNumberScreen = ({ navigation }) => {

  const dispatch = useDispatch()
  const token = useSelector(state => state.user.token)

  const [isloading, setIsloading] = useState(false)
  const [visible, setVisible] = useState(false);
  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);
  const [snackbarObject, setsnackbarObject] = useState({
    message: '',
    status: ''
  })

  const [mobile, setMobile] = useState('');

  const handleSubmit = async () => {
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobile) {
      onToggleSnackBar()
      setsnackbarObject({
        ...snackbarObject,
        message: 'Enter Correct Mobile Number',
        status: 'warning'
      })
    } else if (!mobileRegex.test(mobile)) {
      onToggleSnackBar()
      setsnackbarObject({
        ...snackbarObject,
        message: 'Mobile number must be 10 digits',
        status: 'error'
      })
    } else {
      setIsloading(true)
      await axios.post(`${API_URL}/api/users/link-mobile-number`, {
        mobile: mobile
      }, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        }
      })
        .then(response => {

          const user = response.data.user;

          dispatch(updateUserDetails({
            user: user
          }))
          setIsloading(false)
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
                <Icon name="link" size={20} color="#888" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter Mobile Number"
                  placeholderTextColor="#888"
                  value={mobile}
                  keyboardType='numeric'
                  maxLength={10}
                  onChangeText={setMobile}
                />
              </View>
              <Button
                style={{
                  borderRadius: ButtonStyle.borderRadius,
                  height: ButtonStyle.height,

                  backgroundColor: Color.mainColor,
                  justifyContent: 'center',
                  marginTop: 10,
                  marginBottom: 15
                }}
                loading={isloading}
                mode="contained" onPress={() => { handleSubmit() }}>
                Save
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

export default LinkMobileNumberScreen;
