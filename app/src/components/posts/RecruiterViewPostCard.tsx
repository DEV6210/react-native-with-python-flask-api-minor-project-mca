import React, { useState } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { IMAGE_URL } from '@env'
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { timeAgo } from '../../utils/TimeAgo';

const RecruiterViewPostCard = ({ item, screen, resume }) => {
    const navigation = useNavigation();
    const [error, setError] = useState(false)

    return (
        <TouchableOpacity
            onPress={() => { navigation.navigate('RecruiterJobdetailsScreen', { jobdata: item }) }}
            style={{
                // height: ,
                backgroundColor: '#fff',
                marginHorizontal: 8,
                marginVertical: 5,
                borderWidth: 1,
                borderColor: '#E5E8E7',
                borderRadius: 10,
                padding: 10
            }} >
            <Text style={{ fontWeight: '500', fontSize: 16, color: '#2D3036' }} >{item?.title}</Text>
            <View style={{
                backgroundColor: '#F7F8FA',
                padding: 10,
                marginTop: 5
            }} >
                <View style={{ flexDirection: 'row' }} >
                    {/* <Icon name='location-on' color={'#888'} style={{marginTop:3}} /> */}
                    <Text style={{ color: '#6C727F' }} >{item?.companyDetails?.address}</Text>
                </View>

                <View
                    style={{
                        flexDirection: 'row',
                        gap: 10,
                        marginTop: 10
                    }}
                >
                    <Image
                        source={
                            error ?
                                require('../../../assets/images/company.png')
                                :
                                {
                                    uri: `${IMAGE_URL}/uploads/companies/${item?.companyDetails?.image}`
                                }
                        }
                        style={{ height: 22, width: 22 }}
                        onError={(error) => setError(true)}
                    />

                    <View>
                        <Text style={{ fontWeight: '400', color: '#6C727F' }} >{item?.companyDetails?.name}</Text>
                        {/* <Text style={{ fontWeight: '400', color: '#888', maxWidth: '98%' }} >{item?.companyDetails?.address}</Text> */}
                    </View>
                </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} >
                <Text style={{ fontSize: 10, color: '#888' }} >Applicant: {item?.applicants && item?.applicants?.length > 0 ? item?.applicants?.length : 0}</Text>
                <Text style={{ fontSize: 10, color: '#888' }} >Posted: {timeAgo(item?.createdAt)}</Text>
            </View>

            {
                item?.applicants && item?.applicants?.length > 0 ?
                    <TouchableOpacity
                        onPress={() => navigation.navigate('ViewApplicationsScreen', {
                            title: item?.title,
                            applicants: item?.applicants,
                            company: item?.companyDetails?.name
                        })}
                        style={{
                            marginTop: 10,
                            padding: 10,
                            backgroundColor: '#007BFF',
                            borderRadius: 5,
                            alignItems: 'center'
                        }}>
                        <Text style={{ color: '#fff', fontWeight: '500' }}>View Applications</Text>
                    </TouchableOpacity>
                    :
                    ''
            }
        </TouchableOpacity>
    )
}

export default RecruiterViewPostCard
