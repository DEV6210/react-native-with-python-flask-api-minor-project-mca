import { Color } from '../../GlobalStyles';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, SafeAreaView, StatusBar, View } from 'react-native';
import { AppContent } from '../../GlobalContent';

const SplashScreen = () => {
    useEffect(() => {
        // #1e1a34
        StatusBar.setBackgroundColor(Color.mainColor);
        StatusBar.setBarStyle("light-content");
        animate();
    }, []);

    const startBlinkAnimation = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true
                }),
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 990,
                    useNativeDriver: true
                })
            ])
        ).start();
    };


    const position = useRef(new Animated.ValueXY({ x: 0, y: 500 })).current;
    const opacity = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(0.5)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current; // Initial scale is 1

    const animate = () => {
        // Animated.parallel([
        //     Animated.timing(position, {
        //         toValue: { x: 0, y: 0 },
        //         duration: 1200,
        //         easing: Easing.bounce, // Correctly using Easing here
        //         useNativeDriver: true,
        //     }),
        //     Animated.timing(scale, {
        //         toValue: 1,
        //         duration: 1000,
        //         useNativeDriver: true,
        //     }),
        // ]).start(() => {
        //     startBlinkAnimation();
        // });
        Animated.timing(scaleAnim, {
            toValue: 1.5, // Zoom in to 1.5x the original size
            duration: 1500, // Duration of the animation
            useNativeDriver: true, // Use native driver for better performance
        }).start();
    };



    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Color.mainColor }}>

            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Animated.Image
                    source={require('../../assets/images/2272580.png')}
                    style={{
                        height: 120, // Increased the size of the logo
                        width: 120,
                        resizeMode: 'contain',
                        borderRadius: 15, // Increased border radius for a softer look
                        transform: [{ scale: scaleAnim }] // Apply zoom-in animation

                    }}
                />
            </View>

            <View style={{ justifyContent: "center", alignItems: 'center', }}>
                <View
                    style={{
                        // backgroundColor: "#fff",
                        paddingVertical: 1,
                        paddingHorizontal: 5,
                        bottom: 20,
                    }}
                >
                    <Animated.Text
                        style={{
                            fontWeight: "700",
                            // fontSize: 24,
                            color: '#fcfcfd',
                            // opacity: opacity, // Apply opacity for blinking effect
                        }}
                    >
                        {/* {AppContent.appName} */}
                        Powered By Pseudorandom Number Generators
                    </Animated.Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default SplashScreen;