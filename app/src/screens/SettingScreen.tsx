import React from 'react'
import { Image, Pressable, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Text } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux';
import { resetUser } from '../store/reducers/userReducer';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Color } from '../..//GlobalStyles';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { IMAGE_URL } from '@env'
import { onShare } from '../utils/onShare';
import JobIcons from '../../assets/svg/JobIcons';
import ResumeComponent from '../components/ResumeComponent';
import PostIcon from '../../assets/svg/PostIcon';

const SettingScreen = () => {

    const navigation = useNavigation();

    const user = useSelector((state) => state.user.data);
    const dispatch = useDispatch();

    const logout = async () => {
        await GoogleSignin.signOut();
        dispatch(resetUser());
        navigation.navigate('LoginScreen')
    }

    return (
        <SafeAreaView style={styles.container} >
            <TouchableOpacity
                onPress={() => { navigation.goBack() }}
            >
                <Icon
                    name='close' color={'#888'} size={25}
                    style={{
                        position: 'absolute',
                        right: 15,
                        marginTop: 10
                    }}
                />
            </TouchableOpacity>

            <View style={styles.userContainer}>
                <View style={{ borderWidth: 0.5, height: 55, width: 55, justifyContent: 'center', alignItems: 'center', borderRadius: 99 }} >
                    {
                        user?.image ?
                            <Image source={{ uri: `${IMAGE_URL}/uploads/users/${user?.image}` }}
                                style={styles.profileImage}
                            />
                            :
                            <Image source={require('../../assets/images/default-profile1.png')}
                                style={[styles.profileImage, { padding: 5 }]}
                            />
                    }
                </View>

                <View style={{ flexDirection: "row", alignItems: "center" }} >
                    <Text style={styles.userName}>
                        {user?.fullName}
                    </Text>
                </View>
                <View>
                    <Text>{user?.email}</Text>
                </View>
            </View>


            <View style={styles.borderLine}></View>

            <View style={styles.optionContainer}>
                <TouchableOpacity style={styles.options} onPress={() => { navigation.navigate('ProfileScreen'); navigation.dispatch(DrawerActions.closeDrawer()) }} >
                    <Icon name="person" size={25} color="#888" />
                    <Text style={styles.optionText}>Update Profile</Text>
                </TouchableOpacity>
                {
                    user.type === 'recruiter' || user.type === 'superAdmin' ?
                        <>
                            <TouchableOpacity style={styles.options} onPress={() => { navigation.navigate('CreateJobScreen'); navigation.dispatch(DrawerActions.closeDrawer()) }} >
                                <JobIcons height={25} width={25} color="#888" />
                                <Text style={styles.optionText}>Job Post</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.options} onPress={() => { navigation.navigate('MyJobPostScreen'); navigation.dispatch(DrawerActions.closeDrawer()) }} >
                                <PostIcon height={25} width={25} color="#888" />
                                <Text style={styles.optionText}>My Posts</Text>
                            </TouchableOpacity>

                        </>
                        :
                        <TouchableOpacity style={styles.options} onPress={() => { navigation.navigate('MyapplicationScreen'); navigation.dispatch(DrawerActions.closeDrawer()) }} >
                            <JobIcons height={25} width={25} color="#888" />
                            <Text style={styles.optionText}>My Applications</Text>
                        </TouchableOpacity>
                }
            </View>

            {
                user.type === 'recruiter' ?
                    <>
                        <View style={{
                            marginLeft: 18,
                            position: 'absolute',
                            bottom: 20,
                            left: 0,
                        }}>
                            <TouchableOpacity style={styles.options} onPress={() => { logout() }} >
                                <Icon name="logout" size={25} color="#888" />
                                <Text style={{
                                    fontWeight: '600',
                                    textAlign: 'left',
                                    fontSize: 15,
                                    marginLeft: 8,
                                    position: "absolute",
                                    left: 25,
                                    top: 2

                                }}>Logout</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                    :
                    <>
                        <View>
                            <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#888', marginLeft: 15, marginBottom: 10 }} >Resume</Text>
                            <ResumeComponent />
                        </View>
                        <View style={{
                            marginTop: 20,
                            marginLeft: 20
                        }}>
                            <TouchableOpacity style={styles.options} onPress={() => { logout() }} >
                                <Icon name="logout" size={25} color="#888" />
                                <Text style={{
                                    fontWeight: '600',
                                    textAlign: 'left',
                                    fontSize: 15,
                                    marginLeft: 8,
                                    position: "absolute",
                                    left: 25,
                                    top: 2

                                }}>Logout</Text>
                            </TouchableOpacity>
                        </View>
                    </>
            }




            {/* <View style={{ flex: 1, marginLeft: -16, alignItems: 'center' }} >
                <Image source={require("../../assets/images/ref55.png")} style={{ width: '100%', resizeMode: 'center' }} />
                <Text style={{
                    marginHorizontal: 50,
                    fontWeight: 'bold', 
                    color: '#797981'
                }}>
                    Refer and Earn 50 Coins
                </Text>
                {
                    user?.mobile ?
                        <Text style={{ marginVertical: 10, backgroundColor: '#888', paddingHorizontal: 20, paddingVertical: 5, fontWeight: 'bold', color: '#F5F7F8' }} >
                            {user.mobile}
                        </Text>
                        :
                        <TouchableOpacity style={{ marginVertical: 8 }} onPress={() => { navigation.navigate("LinkMobileNumberScreen") }} >
                            <Text style={{ color: 'blue', fontWeight: 'bold' }} >Generate Refer code</Text>
                        </TouchableOpacity>
                }

            </View> */}

            {/* <TouchableOpacity onPress={() => { onShare() }} style={styles.share}>
                <View style={styles.shareButton}>
                    <Icon name="share" size={20} color={"#29B2FE"} />
                </View>
                <Text style={styles.shareText}>Share invite link</Text>
            </TouchableOpacity>

            <Pressable style={styles.logout} onPress={logout}>
                <Icon name="logout" size={20} color="#fff" />
                <Text style={styles.logoutText}>Logout</Text>
            </Pressable> */}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    profileImage: {
        height: 54,
        width: 54,
        borderRadius: 99,
    },
    userName: {
        fontWeight: '700',
        textAlign: 'left',
        fontSize: 15,
        marginTop: 8,
    },
    userContainer: {
        marginLeft: 15,
        marginTop: 15

    },
    borderLine: {
        borderBottomWidth: 1,
        marginTop: 30,
        borderColor: '#ccc'
    },
    optionContainer: {
        marginTop: 20,
        marginLeft: 15
    },
    options: {
        flexDirection: "row",
        marginBottom: 15,
    },
    optionIcon: {
        height: 24,
        width: 24
    },
    optionText: {
        fontWeight: '600',
        textAlign: 'left',
        fontSize: 15,
        marginLeft: 8,
        position: "absolute",
        left: 25,
        top: 3
    },
    logout: {
        backgroundColor: "#29B2FE",
        flexDirection: "row",
        paddingLeft: 15,
        height: 58,
        alignItems: "center",
        position: "absolute",
        bottom: 0,
        width: "100%"
    },
    logoutText: {
        color: "white",
        fontWeight: '600',
        textAlign: 'left',
        fontSize: 15,
        marginLeft: 8,
    },
    share: {
        flexDirection: "row",
        alignItems: "center",
        bottom: 80,
        marginHorizontal: 15,
        position: "absolute",
    },
    shareButton: {
        height: 40,
        width: 40,
        backgroundColor: "#E5F1FB",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 99
    },
    shareText: {
        fontWeight: '700',
        textAlign: 'left',
        fontSize: 15,
        marginTop: 2,
        marginLeft: 8,
        color: "#29B2FE"

    }
})

export default SettingScreen