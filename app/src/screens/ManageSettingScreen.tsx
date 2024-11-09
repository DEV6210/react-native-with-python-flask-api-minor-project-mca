import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, Button, StyleSheet, TouchableOpacity, Image } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import { Color } from '../../GlobalStyles';
import { IMAGE_URL } from '@env'
import { onShare } from '../utils/onShare';
import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';

const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-5888001794214419/3224481718';

const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
    keywords: ['fashion', 'clothing'],
});

const ManageSettingScreen = () => {
    const user = useSelector((state) => state.user.data);

    const referralCode = "1234567890";
    const qrValue = `https://example.com/referral?code=${referralCode}`;


    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const unsubscribe = interstitial.addAdEventListener(AdEventType.LOADED, () => {
            setLoaded(true);
        });

        // Start loading the interstitial straight away
        interstitial.load();

        // Unsubscribe from events on unmount
        return unsubscribe;
    }, []);

    // No advert ready to show yet
    // if (!loaded) {
    //     return null;
    // }
    if (loaded) {
        interstitial.show()
    }


    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.userContainer}>
                {/* <Image
                    source={{ uri: 'https://cdn-icons-png.flaticon.com/128/149/149071.png' }}
                    style={styles.profileImage}
                /> */}
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
                        <Image source={require('../../assets/images/default-profile.png')}
                            style={{
                                height: 100,
                                width: 100,
                                borderRadius: 99
                            }}
                        />
                }

                <View style={{ flexDirection: "row", alignItems: "center" }} >
                    <Text style={styles.userName}>
                        {user?.fullName}
                    </Text>
                </View>
                <View>
                    <Text>{user?.email}</Text>
                </View>
            </View>

            <View style={styles.qrCodeContainer}>
                <QRCode value={qrValue} size={200} color="black" backgroundColor="white" />
                {
                    user?.mobile ?
                        <Text style={styles.referralCodeText}>Referral Code: {" "}
                            <Text style={{
                                marginVertical: 10,
                                backgroundColor: '#888',

                                paddingVertical: 5,
                                fontWeight: 'bold',
                                color: '#F5F7F8'
                            }} >
                                {" " + user.mobile + " "}
                            </Text>
                        </Text>


                        :
                        <TouchableOpacity style={{ marginVertical: 8 }} onPress={() => { navigation.navigate("LinkMobileNumberScreen") }} >
                            <Text style={{ color: 'blue', fontWeight: 'bold' }} >Generate Refer code</Text>
                        </TouchableOpacity>
                }
            </View>

            <View>
                <TouchableOpacity onPress={() => { onShare() }}
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: Color.mainColor,
                        width: '100%',
                        height: 50,
                        borderRadius: 100
                    }}>
                    <View style={styles.shareButton}>
                        <Icon name="share" size={20} color={Color.mainColor} />
                    </View>
                    <Text style={styles.shareText}>Share invite link</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    qrCodeContainer: {
        alignItems: 'center',
        marginBottom: 32,
        marginTop: 40
    },
    referralCodeText: {
        marginTop: 16,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
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
        marginLeft: 8,
        color: '#fff'

    },
    profileImage: {
        height: 80,
        width: 80,
        borderRadius: 5
    },
    userName: {
        fontWeight: '700',
        textAlign: 'left',
        fontSize: 15,
        marginTop: 8,
    },
    userContainer: {
        marginHorizontal: 10,
        marginTop: 10

    },
    borderLine: {
        borderBottomWidth: 1,
        marginTop: 30
    },
});

export default ManageSettingScreen;
