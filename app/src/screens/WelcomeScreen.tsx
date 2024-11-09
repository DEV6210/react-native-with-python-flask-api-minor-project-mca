import { ButtonStyle, Color } from '../../GlobalStyles';
import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { AppContent } from '../../GlobalContent';
const WelcomeScreen = ({ navigation }) => {
    return (
        <View style={styles.container} >
            <View>

            </View>
            <Image style={styles.image} source={require('../../assets/images/welcome.png')} />

            <View style={{ width: '90%' }} >
                <Text style={{ fontSize: 28, fontWeight: '700' ,color:'#fff'}} >
                    Welcome to
                </Text>
                <Text style={{ fontSize: 38, fontWeight: '700',color:'#fff' }} >
                    <Text style={{color:'#00c9ff'}}>Work</Text> Blend
                </Text>
                <Text style={{color:'#fff'}} >Job Portal and Freelancer Onboarding Platform </Text>
            </View>



            <TouchableOpacity style={{
                backgroundColor: "#fff",
                width: '90%',
                borderRadius: 100,
                marginTop: 50,
                position: 'absolute',
                bottom: 30,
                justifyContent: 'center',
                alignItems: 'center',
                height: 44,
            }}
                onPress={() => { navigation.navigate('LoginScreen') }}
            >
                <Text style={{ color: ButtonStyle.textColor,fontWeight:'500' }} >Get Start</Text>
            </TouchableOpacity>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: Color.mainColor,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: 300,
        height: 300,
    },
})

export default WelcomeScreen


// Play Games and Win Rewards, Complete Surveys and Get Paid, Invite Friends and Earn More