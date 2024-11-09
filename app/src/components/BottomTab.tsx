import React, { useCallback, useRef, useState } from 'react'
import { Dimensions, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'; // Assuming you're using React Navigation for navigation
import { useSelector } from 'react-redux';
import Modal from "react-native-modal";
import { Color } from '../../GlobalStyles';
import ProjectsIcons from '../../assets/svg/ProjectsIcons';
import JobIcons from '../../assets/svg/JobIcons';
import MenuIcon from '../../assets/svg/MenuIcon';
import SearchIcon from '../../assets/svg/SearchIcon';
import EventIcon from '../../assets/svg/EventIcon';
import FeedIcon from '../../assets/svg/FeedIcon';
const deviceWidth = Dimensions.get("window").width;
// const deviceHeight =
//     Platform.OS === "ios"
//         ? Dimensions.get("window").height
//         : require("react-native-extra-dimensions-android").get(
//             "REAL_WINDOW_HEIGHT"
//         );


const BottomTab = ({ focused }) => {
    const navigation = useNavigation();
    const user = useSelector((state) => state.user.data);

    // -------- Create Post Modal --------
    // if login as a doctor >>> Post Section
    const [isModalVisible, setModalVisible] = useState(false);

    const showBottomSheet = useCallback(() => {
        setModalVisible(!isModalVisible);
    });

    // -------- End Create Post Modal -------- 

    // -------- Create Post Screen Modal --------
    // if login as a doctor >>> Post Section
    const [isModalVisible2, setModalVisible2] = useState(false);



    const hideModal2 = () => {
        setModalVisible2(false);
    };
    // -------- End Create Post Modal -------- 


    return (
        <View style={styles.container}>

            {/* -------- Publish Post Modal -------- */}
            <Modal
                isVisible={isModalVisible2}
                onSwipeComplete={hideModal2}
                onBackdropPress={hideModal2}
                style={{
                    margin: 0,
                }}
                // animationIn=''
                // animationOut='slideOutRight'
                swipeDirection="down"

            >
                <View style={{
                    bottom: 0,
                    width: deviceWidth,
                    flex: 1
                }}>

                </View>
            </Modal>


            {/* -------- Create Post Modal -------- */}

            {/* -------- End Create Post Modal -------- */}

            {/* tab-1 */}
            <TouchableOpacity
                style={[styles.tabButton, focused === "home" ? styles.buttonTopLine : styles.buttonTopWhiteLine]}
                onPress={() => { navigation.navigate("HomeScreen") }}
            >
                <JobIcons height={25} width={25} color="#fff" />

                <Text style={styles.tabText}>Jobs</Text>
            </TouchableOpacity>

            {/* tab-2 */}
            {/* <TouchableOpacity
                style={[styles.tabButton, focused === "projects" ? styles.buttonTopLine : styles.buttonTopWhiteLine]}
                onPress={() => { navigation.navigate("ProjectsScreen") }}
            >
                <ProjectsIcons height={25} width={25} color="red" />
                <Text style={styles.tabText}>Projects</Text>
            </TouchableOpacity> */}

            {/* tab-3 */}
            <TouchableOpacity
                onPress={() => navigation.navigate("SearchScreen")}
                style={[styles.tabButton, focused === "projects" ? styles.buttonTopLine : styles.buttonTopWhiteLine]}
            >
                <SearchIcon height={25} width={25} color="red" />
                <Text style={styles.tabText}>Search</Text>
            </TouchableOpacity>

            {/* tab-4 */}
            <TouchableOpacity
                onPress={() => navigation.navigate("FeedScreen")}
                style={[styles.tabButton, focused === "feed" ? styles.buttonTopLine : styles.buttonTopWhiteLine]}
            >
                <FeedIcon height={25} width={25} color="red" />
                <Text style={styles.tabText}>Feeds</Text>
            </TouchableOpacity>

            {/* tab-5 */}
            <TouchableOpacity
                style={[styles.tabButton, focused === "more" ? styles.buttonTopLine : styles.buttonTopWhiteLine]}
                onPress={() => navigation.navigate("SettingScreen")}
            >
                <MenuIcon height={25} width={25} />
                <Text style={styles.tabText}>More</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        width: "100%",
        height: 50,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        paddingHorizontal: 5,
        bottom: 0
    },
    tabButton: {
        alignItems: "center",
        // backgroundColor:"red",
        flex: 1,
        height: 50,
        justifyContent: "center"
    },
    buttonTopLine: {
        borderTopWidth: 2,
        borderColor: "#00c9ff",
    },
    buttonTopWhiteLine: {
        borderTopWidth: 2,
        borderColor: "#fff"
    },
    icon: {
        width: 24, height: 24, top: 2, resizeMode: "contain"
    },
    tabText: {
        fontSize: 12,
        marginTop: 2,
        color: "#888"
    },

    // create a post section 
    createapostSection: {
        marginHorizontal: 20,
        marginVertical: 20,
        flexDirection: "column",
        gap: 16,
    },
    button: {
        height: 36,
        flexDirection: "row",
        alignItems: "center",
        gap: 5
    },
    postImageIcon: {
        height: 19, width: 19
    },
    buttonText: {
        color: Color.gray950,
        fontSize: 16,
        fontWeight: "500"
    },

});
export default BottomTab