import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, Text, View } from 'react-native';
import { RewardedAd, RewardedAdEventType, TestIds } from 'react-native-google-mobile-ads';
import { useNavigation } from '@react-navigation/native';

const adUnitId = __DEV__ ? TestIds.REWARDED : 'ca-app-pub-5888001794214419/8459742899';

const rewarded = RewardedAd.createForAdRequest(adUnitId, {
    keywords: ['fashion', 'clothing'],
});

const RewardedAds_0 = () => {
    const navigation = useNavigation();

    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
            setLoaded(true);
        });
        const unsubscribeEarned = rewarded.addAdEventListener(
            RewardedAdEventType.EARNED_REWARD,
            reward => {
                // console.log('User earned reward of ', reward);
                navigation.goBack();
            },
        );

        // Start loading the rewarded ad straight away
        rewarded.load();

        // Unsubscribe from events on unmount
        return () => {
            unsubscribeLoaded();
            unsubscribeEarned();
        };
    }, []);

    // No advert ready to show yet
    if (!loaded) {
        return (
            <View style={{
                flex: 1,
                backgroundColor: '#fff',
                justifyContent: 'center',
                alignItems: 'center'
            }} >
                <ActivityIndicator color={'#797981'} />
                <Text style={{ color: '#797981', fontWeight: 'bold' }}>Loading Ads..</Text>
            </View>
        )
    }
    if (loaded) {
        rewarded.show()
    }
    return (
        <Button
            title="Show Rewarded Ad"
            onPress={() => {
                rewarded.show();
            }}
        />
    )
}

export default RewardedAds_0