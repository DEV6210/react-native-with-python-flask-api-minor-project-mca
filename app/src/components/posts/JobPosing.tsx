import React, { useState } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { IMAGE_URL } from '@env'
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { timeAgo } from '../../utils/TimeAgo';

const JobPosing = ({ item, screen, resume }) => {
    const navigation = useNavigation();
    const [error, setError] = useState(false)

    // Assuming you have a way to check if the resume is uploaded
    const isResumeUploaded = resume; // Change this based on your data structure

    return (
        <TouchableOpacity
            onPress={() => { navigation.navigate('JobdetailsScreen', { jobdata: item }) }}
            style={{
                // height: ,
                backgroundColor: '#fff',
                marginHorizontal: 8,
                marginVertical: 5,
                borderWidth: 1,
                borderColor: '#E5E8E7',
                borderRadius: 10,
                padding: 10,
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
                screen === 'MyApplications' ?
                    <View style={{ marginTop: 10 }}>
                        {isResumeUploaded ? (
                            <>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }} >
                                    <Icon name="eye-outline" size={18} color={'gray'} />
                                    <Text style={{ fontSize: 12 }}>
                                        Status:{" "}
                                        {
                                            item?.applicants && item?.applicants?.length > 0 ?
                                                item?.applicants[0]?.status ? item?.applicants[0]?.status : "Pending"
                                                :
                                                "Pending"}
                                    </Text>
                                </View>

                                <Text style={{ fontSize: 12, color: '#888' }}>Recruiters will see your resume from your profile</Text>
                            </>
                        ) : (
                            <Text style={{ fontSize: 12, color: '#DC3545' }}>
                                Resume not uploaded. Your application may not be shortlisted. Upload your resume on your profile now.
                            </Text>
                        )}
                    </View>
                    :
                    ''
            }
        </TouchableOpacity>
    )
}

export default JobPosing
