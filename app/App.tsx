/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import messaging from '@react-native-firebase/messaging';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; // Import createBottomTabNavigator
import { useSelector } from 'react-redux';
import DeviceInfo from 'react-native-device-info';
import NetInfo from '@react-native-community/netinfo';
import { createDrawerNavigator } from '@react-navigation/drawer';
import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import SplashScreen from './src/screens/SplashSCreen';
import SignupScreen from './src/screens/auth/SignupScreen';
import ForgotPasswordScreen from './src/screens/auth/ForgotPasswordScreen';
import OtpScreen from './src/screens/auth/OtpScreen';
import SetNewPasswordScreen from './src/screens/auth/SetNewPasswordScreen';
import HomeScreen from './src/screens/HomeScreen';
import DrawerContent from './src/components/DrawerContent';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import LinkMobileNumberScreen from './src/screens/auth/LinkMobileNumberScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ManageSettingScreen from './src/screens/ManageSettingScreen';
import Sound from 'react-native-sound';
import { Text, TouchableOpacity, StatusBar, View } from "react-native";
import Modal from "react-native-modal";
import Icon from 'react-native-vector-icons/Ionicons';
import { Color } from './GlobalStyles';
import ProjectsScreen from './src/screens/ProjectsScreen';
import MessagingScreen from './src/screens/messaging/MessagingScreen';
import ChatScreen from './src/screens/messaging/ChatScreen';
import NotificationScreen from './src/screens/NotificationScreen';
import SettingScreen from './src/screens/SettingScreen';
import ScreeningScreen1 from './src/screens/screening/ScreeningScreen1';
import ScreeningScreen2 from './src/screens/screening/ScreeningScreen2';
import AddCompanyScreen from './src/screens/screening/AddCompanyScreen';
import CreateJobScreen from './src/screens/jobs/CreateJobScreen ';
import CreateJobScreeningQuestionScreen from './src/screens/jobs/CreateJobScreeningQuestionScreen';
import FinalJobPostScreen from './src/screens/jobs/FinalJobPostScreen';
import JobdetailsScreen from './src/screens/applyjobs/JobdetailsScreen';
import JobScreeningQuesionScreen from './src/screens/applyjobs/JobScreeningQuesionScreen';
import MyapplicationScreen from './src/screens/MyapplicationScreen';
import SearchScreen from './src/screens/SearchScreen';
import MyJobPostScreen from './src/screens/jobs/MyJobPostScreen';
import ViewApplicationsScreen from './src/screens/jobs/ViewApplicationsScreen';
import RecruiterJobdetailsScreen from './src/screens/applyjobs/RecruiterJobdetailsScreen';
import PushNotification from 'react-native-push-notification';
import { checkForUpdate } from './checkForUpdate';
import EventScreen from './src/screens/EventScreen';
import FeedScreen from './src/screens/FeedScreen';

PushNotification.createChannel(
  {
    channelId: "messaging_01", // Unique ID for your channel
    channelName: "Messaging", // Name for your channel
    channelDescription: "A channel for notifications", // Optional description
    importance: 4, // Importance level for notifications (1-5)
    vibrate: true, // Enable vibration for this channel
  },
  (created) => console.log(`createChannel returned '${created}'`) // Log whether the channel was created
);

// Create Channel 02
PushNotification.createChannel(
  {
    channelId: "jobs_02", // Unique ID for your second channel
    channelName: "Jobs", // Name for your second channel
    channelDescription: "A channel for jobs notifications", // Optional description
    importance: 5, // Importance level for notifications (1-5) - This is the highest priority
    vibrate: true, // Enable vibration for this channel
  },
  (created) => console.log(`Channel 02 created: ${created}`) // Log whether the channel was created
);
function App(): React.JSX.Element {

  const [isModalVisible, setModalVisible] = useState(false);
  const [fcm_msg, setFcm_msg] = useState({
    title: '',
    body: ''
  })

  // --------------- Firebase Cloud Messaging ---------------
  const getToken = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('FCM Authorization status:', authStatus);
      // const token = await messaging().getToken();
      // console.log('Devic  e Token: ', token);
    }
  }
  // --------------------------------------------------------  
  const [hideSplash, setHideSplash] = useState(true)

  const notificationSound = new Sound('mixkit_notification_tone.wav', Sound.MAIN_BUNDLE);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '471454924889-foncg4o606ssl883j89fcs4n53pb7h0u.apps.googleusercontent.com', // Replace with your android client ID
      offlineAccess: true,
    });

    setTimeout(() => {
      setHideSplash(false);
    }, 2000);

    // get fcm device token
    getToken();
    checkForUpdate();

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
      if (remoteMessage?.data?.type === 'message') {
        PushNotification.localNotification({
          channelId: "messaging_01", // Use the channel ID you created
          title: 'Messaging',
          message: 'You have a new message',
          // bigPictureUrl: 'https://img.freepik.com/free-vector/special-offer-creative-sale-banner-design_1017-16284.jpg?1',  // URL of the image to display
          largeIcon: "ic_launcher",
          smallIcon: "ic_notification",
          bigLargeIcon: "ic_launcher", // Optional: Large icon in expanded notification
          priority: "high", // High priority to show the notification prominently
          importance: "high", // Ensure it's important enough (Android 8.0+)
          autoCancel: true, // Auto dismiss on click
          visibility: 'public', // Show full notification on lock screen
          style: 'bigPicture', // Forces notification to use BigPicture style
          // subText: 'You have new updates', // Additional smaller text shown below the message
          largeIconUrl: 'https://cdn-icons-png.flaticon.com/128/3845/3845696.png', // Optional large icon URL
          ongoing: false, // Ensure the user can dismiss the notification
        });
      } else if (remoteMessage?.data?.type === 'jobs') {
        PushNotification.localNotification({
          channelId: "messaging_01", // Use the channel ID you created
          title: 'Jobs',
          message: remoteMessage?.notification?.body,
          // bigPictureUrl: 'https://img.freepik.com/free-vector/special-offer-creative-sale-banner-design_1017-16284.jpg?1',  // URL of the image to display
          largeIcon: "ic_launcher",
          smallIcon: "ic_notification",
          bigLargeIcon: "ic_launcher", // Optional: Large icon in expanded notification
          priority: "high", // High priority to show the notification prominently
          importance: "high", // Ensure it's important enough (Android 8.0+)
          autoCancel: true, // Auto dismiss on click
          visibility: 'public', // Show full notification on lock screen
          style: 'bigPicture', // Forces notification to use BigPicture style
          subText: 'New jobs posted', // Additional smaller text shown below the message
          largeIconUrl: 'https://cdn-icons-png.flaticon.com/128/8062/8062190.png', // Optional large icon URL
          ongoing: false, // Ensure the user can dismiss the notification
        });
      } else {
        notificationSound.play()
        setModalVisible(true)
        setFcm_msg({
          ...fcm_msg,
          title: remoteMessage?.notification?.title,
          body: remoteMessage?.notification?.body
        })
      }
    });
    return unsubscribe;
  }, []);

  const data = useSelector((state) => state.user)
  const user = data?.data
  const token = data.token
  const isLoggedIn = token !== null && token !== undefined && token !== '';
  // console.log(isLoggedIn);

  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();
  const Drawer = createDrawerNavigator();

  const options = { headerShown: false };


  if (isLoggedIn) {
    StatusBar.setBackgroundColor("#fff");
    StatusBar.setBarStyle("dark-content");

  } else {
    StatusBar.setBackgroundColor(Color.mainColor);
    StatusBar.setBarStyle("light-content");
  }

  const HomeScreenTab = () => {
    return (
      <Drawer.Navigator
        initialRouteName='HomeScreen'
        screenOptions={{
          drawerPosition: 'left',
          drawerStyle: {
            backgroundColor: '#fff',
          },
        }}
        drawerContent={props => <DrawerContent {...props} />}

      >
        <Drawer.Screen name='HomeScreen' component={HomeScreen} options={options} />
        <Drawer.Screen name='FeedScreen' component={FeedScreen} options={options} />
        <Drawer.Screen name='ProjectsScreen' component={ProjectsScreen} options={options} />

      </Drawer.Navigator>
    )
  }

  return (
    <>
      <NavigationContainer>
        {
          hideSplash ?
            <Stack.Navigator>
              <Stack.Screen name='SplashScreen' component={SplashScreen} options={options} />
            </Stack.Navigator>
            :
            !isLoggedIn ?
              <Stack.Navigator>
                <Stack.Screen name='WelcomeScreen' component={WelcomeScreen} options={options} />
                <Stack.Screen name='LoginScreen' component={LoginScreen} options={options} />
                <Stack.Screen name='SignupScreen' component={SignupScreen} options={options} />
                <Stack.Screen name='ForgotPasswordScreen' component={ForgotPasswordScreen} options={{ headerTitle: 'Forgot Password' }} />
                <Stack.Screen name='OtpScreen' component={OtpScreen} options={{ headerTitle: 'Enter OTP' }} />
                <Stack.Screen name='SetNewPasswordScreen' component={SetNewPasswordScreen} options={{ headerTitle: 'Set New Password' }} />

              </Stack.Navigator>
              :
              !user.type ?
                <Stack.Navigator>
                  <Stack.Screen name='ScreeningScreen1' component={ScreeningScreen1} options={options} />
                  <Stack.Screen name='ScreeningScreen2' component={ScreeningScreen2} options={options} />
                  <Stack.Screen name='AddCompanyScreen' component={AddCompanyScreen} options={options} />

                </Stack.Navigator>
                :
                !user.mobile ?
                  <Stack.Navigator>
                    <Stack.Screen name='LinkMobileNumberScreen' component={LinkMobileNumberScreen} options={{ headerTitle: 'Add Mobile Number' }} />
                  </Stack.Navigator>
                  :
                  <Stack.Navigator>
                    <Stack.Screen name='LoginSuccess' component={HomeScreenTab} options={options} />

                    <Stack.Screen name='ProfileScreen' component={ProfileScreen} options={{ headerTitle: 'Update Profile' }} />
                    <Stack.Screen name='ManageSettingScreen' component={ManageSettingScreen} options={{ headerTitle: '' }} />

                    <Stack.Screen name='SettingScreen' component={SettingScreen} options={options} />
                    <Stack.Screen name='NotificationScreen' component={NotificationScreen} options={options} />

                    <Stack.Screen name='CreateJobScreen' component={CreateJobScreen} options={options} />
                    <Stack.Screen name='CreateJobScreeningQuestionScreen' component={CreateJobScreeningQuestionScreen} options={options} />
                    <Stack.Screen name='FinalJobPostScreen' component={FinalJobPostScreen} options={options} />

                    <Stack.Screen name='MyJobPostScreen' component={MyJobPostScreen} options={{ headerTitle: "My Posts" }} />
                    <Stack.Screen name='ViewApplicationsScreen' component={ViewApplicationsScreen} options={{ headerTitle: "Applicants" }} />


                    <Stack.Screen name='JobdetailsScreen' component={JobdetailsScreen} options={options} />
                    <Stack.Screen name='JobScreeningQuesionScreen' component={JobScreeningQuesionScreen} options={options} />
                    <Stack.Screen name='MyapplicationScreen' component={MyapplicationScreen} options={{ headerTitle: "My Applications" }} />
                    <Stack.Screen name='RecruiterJobdetailsScreen' component={RecruiterJobdetailsScreen} options={options} />

                    <Stack.Screen name='SearchScreen' component={SearchScreen} options={options} />

                    <Stack.Screen name='MessagingScreen' component={MessagingScreen} options={options} />
                    <Stack.Screen name='ChatScreen' component={ChatScreen} options={options} />

                  </Stack.Navigator>
        }
      </NavigationContainer>

      {/* Notification Msg  */}
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
            <Text style={{ fontWeight: 'bold', fontSize: 18 }} >{fcm_msg?.title}</Text>
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
              {fcm_msg?.body}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => { setModalVisible(false) }}
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
              Ok
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
}

export default App;