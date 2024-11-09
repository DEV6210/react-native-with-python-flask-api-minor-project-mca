import React from 'react'
import { SafeAreaView, View, TouchableOpacity, Image, StyleSheet, Text } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import MenuIcon from '../../assets/svg/MenuIcon'
import { useSelector } from 'react-redux'
import { Color } from '../../GlobalStyles'
import NotificationIcon from '../../assets/svg/NotificationIcon'
import ChatIcon from '../../assets/svg/ChatIcon'

const TopHeader = () => {
    const navigation = useNavigation();
    const user = useSelector((state) => state.user.data);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }} >
                    <Text style={{ fontSize: 18, fontWeight: '700', color: Color.mainColor }} >
                        <Text style={{ color: '#00c9ff' }}>Work</Text>Blend
                    </Text>
                </View>

                <View style={styles.rightIcons}>

                    <TouchableOpacity
                        onPress={() => { navigation.navigate("MessagingScreen") }}
                    >
                        {/* <View style={{
                            position: 'absolute',
                            zIndex: 999,
                            right: 0,
                            backgroundColor: 'red',
                            borderRadius: 99,
                            marginTop: -5,
                            marginRight: 3.5,
                            height: 5,
                            width: 5,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }} /> */}
                        <ChatIcon height={28} width={28} />
                    </TouchableOpacity>



                    {/* <TouchableOpacity onPress={() => navigation.openDrawer()} >
                        <MenuIcon height={25} width={25} />
                    </TouchableOpacity> */}
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        height: 50,
        elevation: 1,
        width: "100%"
    },
    rightIcons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    userImage: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginLeft: 15,
    },
})

export default TopHeader
