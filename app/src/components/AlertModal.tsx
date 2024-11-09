import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import Icon from 'react-native-vector-icons/Ionicons';

function AlertModal({ isModalVisible, setModalVisible, title, body }) {

    return (
        <Modal
            isVisible={isModalVisible}
            animationIn='zoomIn'
            animationOut='fadeOut'
        >
            <View style={{ backgroundColor: '#fff', minHeight: 180, borderRadius: 10 }}>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginHorizontal: 20,
                        marginTop: 20,
                        marginBottom: 10
                    }}
                >
                    <Text style={{ fontWeight: 'bold', fontSize: 18 }} >{title}</Text>
                    <TouchableOpacity onPress={() => { setModalVisible(false) }} >
                        <Icon name="close" size={25} style={{ marginTop: -2 }} />
                    </TouchableOpacity>
                </View>

                <View
                    style={{
                        marginHorizontal: 20,
                    }}
                >
                    <Text>
                        {body}
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={() => { setModalVisible(false) }}
                    style={{
                        position: 'absolute',
                        right: 20,
                        bottom: 15,
                        backgroundColor: '#DC2626',
                        paddingVertical: 6,
                        paddingHorizontal: 15
                    }}
                >
                    <Text
                        style={{
                            color: "#FCFCFC",
                            fontWeight: 'bold'
                        }}
                    >
                        Ok
                    </Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
}

export default AlertModal;
