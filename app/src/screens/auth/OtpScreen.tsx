import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, Dimensions, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';
import { ButtonStyle, Color } from '../../../GlobalStyles';
import { Button, Snackbar } from "react-native-paper";

const CELL_COUNT = 4;

const OtpScreen = ({ navigation, route }) => {

    const otp = route.params.otp
    const msg = route.params.msg
    const email = route.params.email

    const [value, setValue] = React.useState('');
    const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });

    const [isloading, setIsloading] = useState(false)
    const [visible, setVisible] = useState(false);
    const onToggleSnackBar = () => setVisible(!visible);
    const onDismissSnackBar = () => setVisible(false);
    const [snackbarObject, setsnackbarObject] = useState({
        message: '',
        status: ''
    })

    const handleSubmit = async () => {
        if (!value) {
            onToggleSnackBar()
            setsnackbarObject({
                ...snackbarObject,
                message: 'Enter Correct OTP',
                status: 'warning'
            })
        } else {
            setIsloading(true)
            if (parseInt(value) === parseInt(otp)) {
                setIsloading(false)
                navigation.navigate('SetNewPasswordScreen', { email: email })
            } else {
                onToggleSnackBar()
                setsnackbarObject({
                    ...snackbarObject,
                    message: 'Invalid OTP',
                    status: 'error'
                })
                setIsloading(false)
            }
        }
    }

    useEffect(() => {
        onToggleSnackBar()
        setsnackbarObject({
            ...snackbarObject,
            message: msg,
            status: 'success'
        })
    }, [msg])

    useEffect(() => {
        if (parseInt(value) === parseInt(otp)) {
            setIsloading(false)
            navigation.navigate('SetNewPasswordScreen', { email: email })
        }
    }, [value])

    return (
        <>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.inner}>
                        {/* <Text style={styles.header}>Enter OTP</Text> */}
                        <View style={styles.codeContainer}>
                            <CodeField
                                ref={ref}
                                {...props}
                                value={value}
                                onChangeText={setValue}
                                cellCount={CELL_COUNT}
                                rootStyle={styles.codeFieldRoot}
                                keyboardType="number-pad"
                                textContentType="oneTimeCode"
                                renderCell={({ index, symbol, isFocused }) => (
                                    <Text
                                        key={index}
                                        style={[styles.cell, isFocused && styles.focusCell]}
                                        onLayout={getCellOnLayoutHandler(index)}
                                    >
                                        {symbol || (isFocused ? <Cursor /> : null)}
                                    </Text>
                                )}
                            />
                        </View>
                        <Button
                            style={{
                                backgroundColor: ButtonStyle.backgroundColor,
                                borderRadius: ButtonStyle.borderRadius,
                                height: ButtonStyle.height,
                                justifyContent: 'center',
                                marginTop: 10,
                                marginBottom: 15
                            }}
                            loading={isloading}
                            mode="contained" onPress={handleSubmit}>
                            Verify
                        </Button>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView >
            <Snackbar
                visible={visible}
                onDismiss={onDismissSnackBar}
                duration={2000} // Snackbar will auto-dismiss after 2 seconds
                style={{
                    backgroundColor:
                        snackbarObject.status === 'error' ? '#E23E32' :
                            snackbarObject.status === 'warning' ? '#ECB90D' :
                                snackbarObject.status === 'success' ? '#03B30A' :
                                    snackbarObject.status === 'info' ? '#723230' : '#111010'
                }}
            >
                {snackbarObject.message}
            </Snackbar>
        </>
    );
};

const { height } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff', // Replace with your desired background color
    },
    inner: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    backIcon: {
        width: 30,
        height: 30,
        marginRight: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        // marginBottom: 30,
    },
    codeContainer: {
        alignItems: 'center',
    },
    codeFieldRoot: {
        marginTop: 20,
    },
    cell: {
        width: 70,
        height: 48,
        lineHeight: 45,
        fontSize: 24,
        borderWidth: 1.5,
        borderColor: Color.mainColor,
        textAlign: 'center',
        margin: 5,
        backgroundColor: "white",
        borderRadius: 5,
    },
    focusCell: {
        borderColor: 'red',
    },
    sendOtpButton: {
        backgroundColor: Color.mainColor,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        height: 44,
        marginTop: 22,
    },
    sendOtpButtonText: {
        color: Color.textColor,
    },
});

export default OtpScreen;
