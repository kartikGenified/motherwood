import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image, ScrollView } from 'react-native';
import PoppinsTextMedium from '../electrons/customFonts/PoppinsTextMedium';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import TrackGiftProgessBar from '../organisms/TrackGiftProgessBar';
import { useGetRedeemedGiftsStatusMutation } from '../../apiServices/gifts/RedeemGifts';
import Close from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';



// create a component
const TrackDeliveryModal = ({ isVisible, onClose,status, data, trackdata }) => {
    const [delStatus, setDelStatus] = useState()
    const {t} = useTranslation()
    const ternaryThemeColor = useSelector(
        state => state.apptheme.ternaryThemeColor,
    )


    console.log("Data track", data,trackdata,status);

    
    useEffect(()=>{
        for(let i=0;i<trackdata?.body.length;i++)
        {
            console.log("sadbasvhdhgasghg",status,trackdata?.body[i])
            if(status == trackdata?.body[i])
            {
                setDelStatus(i);
            }
        }

    },[trackdata])



    return (
        <Modal
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={[styles.modalContent, { borderColor: ternaryThemeColor, borderWidth: 3 }]}>

                    <View>
                        <View style={{ flexDirection: 'row', }}>
                            <Image
                                style={{ height: 21, width: 15, resizeMode: 'contain', marginTop: 2 }}
                                source={require('../../../assets/images/loc.png')}></Image>

                            <PoppinsTextMedium style={{ fontSize: 18, fontWeight: '700', color: 'black', marginLeft: 5, }} content={t("Track Delivery Status")}></PoppinsTextMedium>
                        </View>

                        <View style={{ color: '#808080', borderColor: '#80808030', borderWidth: 0.8, marginTop: 10, }}></View>
                    </View>

                    <View style={{ alignItems: 'center', marginTop: 10, marginBottom: 10 }}>
                        <Image style={{ height: 70, width: 117, resizeMode: "contain", margin: 10, padding: 10, backgroundColor: 'white', }} source={{ uri:data?.images[0] }}></Image>
                        <PoppinsTextMedium style={{ fontSize: 16, fontWeight: '600', color: '#474747', width: '100%' }} content={data.name}></PoppinsTextMedium>
                    </View>

                    <View style={{ width: '100%', flexDirection: 'row' }}>
                        <View style={{ width: '50%', backgroundColor: '#ECECEC', height: 53, alignItems: 'center' }}>
                            <PoppinsTextMedium style={{ fontSize: 15, fontWeight: '600', marginTop: 5,color:'black' }} content={t("Brand")}></PoppinsTextMedium>
                            <PoppinsTextMedium style={{ fontSize: 15, fontWeight: '600', marginTop: 2,color:'black' }} content={data.brand}></PoppinsTextMedium>

                        </View>

                        <View style={{ width: '50%', backgroundColor: '#DDDDDD', height: 53 }}>
                            <PoppinsTextMedium style={{ fontSize: 15, fontWeight: '600', marginTop: 5 ,color:'black'}} content={t("Reference Number")}></PoppinsTextMedium>
                            <PoppinsTextMedium style={{ fontSize: 15, fontWeight: '600', marginTop: 2,color:'black' }} content={data.id}></PoppinsTextMedium>


                        </View>
                    </View>

                    <ScrollView style={{ marginTop: 20 }}>
                        {delStatus && <TrackGiftProgessBar height={500} data={trackdata?.body} status={delStatus} />}
                    </ScrollView>

                    <TouchableOpacity style={[{
                    backgroundColor: ternaryThemeColor, padding: 6, borderRadius: 5, position: 'absolute', top: -10, right: -10,
                }]} onPress={onClose} >
                    <Close name="close" size={19} color="#ffffff" />
                </TouchableOpacity>

                </View>
               
            </View>

        </Modal>
    );
};


// define your styles
const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#F5F5F5',
        width: '92%',
        height: '75%',
        borderRadius: 20,
        padding: 20,

    },

});


//make this component available to the app
export default TrackDeliveryModal;