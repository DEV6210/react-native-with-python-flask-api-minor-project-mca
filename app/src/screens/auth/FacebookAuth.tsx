import React from 'react'
import { Image, TouchableOpacity } from 'react-native'

const FacebookAuth = () => {
    return (
        <TouchableOpacity>
            <Image
                source={require('../../../assets/images/facebook-icon.png')}
                style={{ height: 35, width: 35 }}
            />
        </TouchableOpacity>
    )
}

export default FacebookAuth
