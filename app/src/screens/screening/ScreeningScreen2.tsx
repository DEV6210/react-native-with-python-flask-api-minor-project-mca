import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Alert, Animated, Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { API_URL, IMAGE_URL } from '@env';
import { useDispatch, useSelector } from 'react-redux';
import Modal from "react-native-modal";
import { updateUserType } from '../../store/reducers/userReducer';
import { Button } from 'react-native-paper';

const ScreeningScreen2 = ({ navigation }) => {

    const [imageErrorStates, setImageErrorStates] = useState({});

    // This function updates the state to mark an image as errored
    const handleImageError = (id) => {
        setImageErrorStates((prev) => ({ ...prev, [id]: true }));
    };

    const userdata = useSelector((state) => state.user)
    const token = userdata.token

    const [searchText, setSearchText] = useState('');
    const [setselectCompany, setSetselectCompany] = useState(null)
    const [isModalVisible, setModalVisible] = useState(false);

    const handleSearch = () => {
        console.log('Searching for:', searchText);
    };
    const handleSearchClear = () => {
        console.log('Clear Search Value');
        setSearchText('');
        setSetselectCompany(null)
    };

    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current.focus()
    }, [])

    const [isloading, setIsloading] = useState(true)
    const [companies, setCompanies] = useState([])

    const getData = async () => {
        try {
            await axios.get(`${API_URL}/api/users/getCompanies?searchTerm=${searchText}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                }
            })
                .then(response => {
                    setIsloading(false)
                    setCompanies(response.data.companies)
                }).catch(error => {
                    setIsloading(false)
                    console.log(error?.response?.data?.msg || error?.message)

                })
        } catch (error) {
            console.log('APi Call eror', error)
        }
    }

    let timeoutId = null;

    useEffect(() => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
            getData();
        }, 300); // Adjust debounce delay as needed

        // Cleanup timeout on component unmount
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [searchText])

    const dispatch = useDispatch()
    const [isloading2, setIsloading2] = useState(false)

    const handleSubmit = async () => {
        setIsloading2(true)
        const formData = new FormData();
        formData.append('companyId', setselectCompany._id);
        formData.append('companyName', setselectCompany.name);
        formData.append('city', setselectCompany.city);
        formData.append('address', setselectCompany.address);
        formData.append('image', setselectCompany.image);
        formData.append('type', 'recruiter');
        formData.append('isAdded', true);

        try {
            await axios.post(`${API_URL}/api/users/update-type`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": token
                }
            }).then(response => {
                dispatch(updateUserType({
                    type: 'recruiter',
                    companyDetails: {
                        name: setselectCompany.name,
                        image: setselectCompany.image,
                        city: setselectCompany.city,
                        address: setselectCompany.address
                    }
                }));
            }).catch(error => {
                // console.log(error?.response?.data?.msg || error)
                Alert.alert('Error', error?.response?.data?.msg || error);
            })
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', 'There was an error submitting the form.');
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>

            <Modal
                isVisible={isModalVisible}
                animationIn='zoomIn'
                animationOut='fadeOut'
            >
                <View style={{ backgroundColor: '#fff', minHeight: 220, borderRadius: 10 }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginHorizontal: 20,
                            marginTop: 20,
                        }}
                    >
                        <Text style={{ fontWeight: 'bold', fontSize: 18 }} >
                            {/* {fcm_msg?.title} */}
                        </Text>
                        <TouchableOpacity onPress={() => { setModalVisible(false) }} >
                            <Icon name="close" size={25} style={{ marginTop: -2 }} />
                        </TouchableOpacity>
                    </View>

                    <View
                        style={{
                            marginHorizontal: 20,
                        }}
                    >
                        <Image
                            source={require('../../../assets/images/company.png')}
                            style={{ height: 30, width: 30 }}
                            onError={(error) => setError(true)}
                        />
                        <Text style={{ fontWeight: 'bold', fontSize: 18, marginTop: 10 }}>
                            {setselectCompany?.name}
                        </Text>
                        <Text>{setselectCompany?.city}</Text>
                    </View>


                    <Button
                        loading={isloading2}
                        style={{
                            position: 'absolute',
                            right: 5,
                            height: 40,
                            bottom: 15,
                            backgroundColor: '#00c9ff', borderRadius: 5, marginHorizontal: 10
                        }}
                        mode='contained'
                        onPress={() => { handleSubmit() }}
                    >
                        Save and Finished
                    </Button>
                </View>
            </Modal>

            <View style={styles.nav}>
                <TouchableOpacity style={styles.backArrow} onPress={() => { navigation.goBack() }}>
                    <Icon name="arrow-back" size={30} color={'#888'} />
                </TouchableOpacity>
                <View style={styles.searchContainer}>
                    <TextInput
                        ref={inputRef}
                        style={styles.input}
                        placeholder="Select Company Name"
                        value={searchText}
                        onChangeText={text => {
                            setSearchText(text);
                        }}
                        onSubmitEditing={handleSearch}
                    />
                    {!searchText ?
                        <TouchableOpacity onPress={handleSearch}>
                            <Icon name="search" size={24} color="#888" style={styles.searchIcon} />
                        </TouchableOpacity>
                        :
                        isloading ?
                            <ActivityIndicator />
                            :
                            <TouchableOpacity onPress={handleSearchClear}>
                                <Icon name="close" size={24} color="#888" style={styles.searchIcon} />
                            </TouchableOpacity>
                    }
                </View>
            </View>

            {

                isloading ?
                    <View style={{ marginTop: 10 }}>
                        <ActivityIndicator size={30} color={'#00c9ff'} />
                    </View>
                    :
                    companies && companies.length > 0 ?
                        <Animated.FlatList
                            data={companies}
                            keyExtractor={(item, index) => item._id + index.toString()}
                            renderItem={({ item }) => {
                                const imageError = imageErrorStates[item._id];
                                return (
                                    <TouchableOpacity onPress={() => { setSetselectCompany(item); setModalVisible(true) }}
                                        style={{
                                            flexDirection: 'row',
                                            gap: 10,
                                            paddingHorizontal: 8,
                                            paddingVertical: 5,
                                            borderBottomWidth: 1,
                                            borderColor: '#ddd'

                                        }}
                                    >
                                        <Image
                                            source={
                                                imageError ?
                                                    require('../../../assets/images/company.png') :
                                                    {
                                                        uri: `${IMAGE_URL}/uploads/companies/${item?.image}`
                                                    }
                                            }
                                            style={{ height: imageError ? 35 : 50, width: imageError ? 35 : 50 }}
                                            onError={() => { handleImageError(item._id) }}
                                        />

                                        <View>
                                            <Text style={{ fontWeight: 'bold', color: '#888' }} >{item?.name}</Text>
                                            <Text style={{ fontWeight: '400', color: '#888', maxWidth: '98%' }} >{item?.address}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )
                            }}
                        />
                        :
                        <TouchableOpacity onPress={() => {
                            navigation.navigate("AddCompanyScreen")
                        }}
                            style={{
                                flexDirection: 'row',
                                gap: 10,
                                paddingVertical: 5,
                                borderBottomWidth: 1,
                                borderColor: '#ddd',
                                height: 60,
                                alignItems: 'center',
                                paddingRight: 15,
                                paddingLeft: 8
                            }}
                        >
                            <Image
                                source={{ uri: 'https://cdn-icons-png.flaticon.com/128/7187/7187957.png' }}
                                style={{ height: 40, width: 40 }}
                            />

                            <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between' }} >
                                <View>
                                    <Text style={{ fontWeight: 'bold', color: '#888' }} >Company Not Found</Text>
                                    <Text style={{ fontWeight: 'bold', color: '#00C9FF' }} >Add Now</Text>
                                </View>

                                <View>
                                    {/* <Icon name="arrow-forward" size={30} color={'#888'} /> */}
                                </View>
                            </View>
                        </TouchableOpacity>
            }
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    nav: {
        height: 50,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: 'center',
        flexDirection: "row",
        elevation: 2
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff', // Background color with opacity
        borderRadius: 5,
        paddingHorizontal: 10,
        backfaceVisibility: "visible",
        borderWidth: 0.5, // Border width
        borderColor: '#ddd',
        marginRight: 10,
        marginLeft: 5,
        height: 40,
        flex: 1
    },

    input: {
        flex: 1,
        paddingVertical: 4,
    },
    searchIcon: {
        marginLeft: 5,
    },
    backArrow: {
        marginLeft: 0
    },
})

export default ScreeningScreen2