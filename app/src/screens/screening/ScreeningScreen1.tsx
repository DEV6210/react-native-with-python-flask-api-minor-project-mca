import React, { useState } from 'react'
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, TextInput, Alert } from 'react-native'
import { ButtonStyle, Color } from '../../../GlobalStyles'
import { Button } from 'react-native-paper';
import { API_URL } from '@env'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserType } from '../../store/reducers/userReducer';

const ScreeningScreen1 = ({ navigation }) => {
    const [selectedOption, setSelectedOption] = useState(null)
    const [showContinue, setShowContinue] = useState(false)
    const [isloading, setIsloading] = useState(false)

    const userdata = useSelector((state) => state.user)
    const token = userdata.token

    const dispatch = useDispatch()

    const handleSelectOption = (option) => {
        setSelectedOption(option)
        setShowContinue(false)

        if (option === 'Find the Work') {
            setShowContinue(true)
        } else if (option === 'Hire') {
            setShowContinue(true)
        }
    }

    const handleSubmit = async () => {
        try {
            if (selectedOption === 'Find the Work') {
                setIsloading(true)
                await axios.patch(`${API_URL}/api/users/update-jobseeker-type`, { type: 'jobseeker' }, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": token
                    }
                })
                    .then(response => {
                        setIsloading(false)
                        dispatch(updateUserType({ type: 'jobseeker', companyDetails: {} }))
                    }).catch(error => {
                        setIsloading(false)
                        Alert.alert('Error', error?.response?.data?.msg || error);
                        // console.log(error?.response?.data?.msg || error?.message,)

                    })
            } else if (selectedOption === 'Hire') {
                navigation.navigate('ScreeningScreen2')
            }
        } catch (error) {
            console.log('APi Call eror', error)
        }
    }

    return (
        <SafeAreaView style={styles.container}>

            <Text style={styles.titleText}>Are you here to?</Text>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, selectedOption === 'Find the Work' && styles.selectedButton]}
                    onPress={() => handleSelectOption('Find the Work')}
                >
                    <Text style={styles.btnText1}>Find the Work</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, selectedOption === 'Hire' && styles.selectedButton]}
                    onPress={() => handleSelectOption('Hire')}
                >
                    <Text style={styles.btnText2}>Hire</Text>
                </TouchableOpacity>
            </View>


            {showContinue && (
                <Button
                    style={{
                        backgroundColor: '#1E201E',
                        borderRadius: ButtonStyle.borderRadius,
                        height: ButtonStyle.height,
                        justifyContent: 'center',
                        marginTop: 10,
                        marginBottom: 15,
                        position: 'absolute',
                        bottom: 10,
                        width: '100%',
                        alignSelf: 'center'
                    }}
                    loading={isloading}
                    onPress={() => { handleSubmit() }}
                    mode='contained' >
                    {selectedOption === 'Hire' ? 'Continue' : 'Save and Finished'}
                </Button>
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        justifyContent: 'center',

    },
    titleText: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#1E201E',
        marginBottom: 50,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        borderWidth: 0.5,
        width: "46%",
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#ddd',
    },
    selectedButton: {
        backgroundColor: '#ddd',
    },
    btnText1: {
        fontWeight: 'bold',
        color: '#00C9FF',
    },
    btnText2: {
        fontWeight: 'bold',
        color: Color.mainColor,
    },
    input: {
        marginTop: 20,
        height: 50,
        borderColor: '#ddd',
        borderWidth: 0.5,
        paddingHorizontal: 10,
    },
})

export default ScreeningScreen1
