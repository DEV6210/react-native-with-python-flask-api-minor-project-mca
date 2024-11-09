import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ButtonStyle, Color, InputStyle } from '../../../GlobalStyles';
import { Button, Snackbar } from 'react-native-paper';
import axios from 'axios';
import { API_URL } from '@env'

const SetNewPasswordScreen = ({ navigation, route }) => {

  const email = route.params.email

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);


  const [isloading, setIsloading] = useState(false)
  const [visible, setVisible] = useState(false);
  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);
  const [snackbarObject, setsnackbarObject] = useState({
    message: '',
    status: ''
  })

  const handleSubmit = async () => {
    if (!newPassword) {
      onToggleSnackBar()
      setsnackbarObject({
        ...snackbarObject,
        message: 'Enter New Password',
        status: 'warning'
      })
    } else if (!confirmPassword) {
      onToggleSnackBar()
      setsnackbarObject({
        ...snackbarObject,
        message: 'Enter Confirm Password',
        status: 'warning'
      })
    } else if (newPassword !== confirmPassword) {
      onToggleSnackBar()
      setsnackbarObject({
        ...snackbarObject,
        message: 'Confirmation password does not match',
        status: 'error'
      })
    } else {
      setIsloading(true)

      await axios.post(`${API_URL}/api/users/reset-password`, { email: email, newPassword: newPassword }, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": ""
        }
      })
        .then(response => {
          setIsloading(false)
          onToggleSnackBar()
          setsnackbarObject({
            ...snackbarObject,
            message: response?.data?.msg,
            status: 'success'
          })
          setTimeout(() => {
            navigation.navigate('LoginScreen')
          }, 1000);
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
          <View style={styles.inner}>
            <View style={styles.container}>
              {/* <Text style={styles.header}>Set New Password</Text> */}
              <View style={styles.inputContainer}>
                <Icon name="lock" size={20} color="#888" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="New Password"
                  placeholderTextColor="#888"
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
              </View>
              <View style={styles.inputContainer}>
                <Icon name="lock" size={20} color="#888" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  placeholderTextColor="#888"
                  secureTextEntry={!confirmPasswordVisible}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
                  <Icon name={confirmPasswordVisible ? "visibility" : "visibility-off"} size={20} color="#888" />
                </TouchableOpacity>
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
                mode="contained" onPress={handleSubmit}>
                Submit
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
    ...InputStyle,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderColor: Color.mainColor,
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
  submitButton: {
    backgroundColor: Color.mainColor,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    height: 44,
    marginTop: 10,
  },
  submitButtonText: {
    color: Color.textColor,
  },
});

export default SetNewPasswordScreen;
