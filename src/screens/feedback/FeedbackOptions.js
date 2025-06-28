//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import SocialBottomBar from '../../components/socialBar/SocialBottomBar';

// create a component
const FeedbackOptions = () => {
    const {t} = useTranslation()
    const ternaryThemeColor = useSelector(
        state => state.apptheme.ternaryThemeColor,
    )
    const secondaryThemeColor = useSelector(
        state => state.apptheme.secondaryThemeColor,
    )
    const navigation =  useNavigation()
    return (
        <View style={styles.container}>
              <View
                style={{
                    height: 70,
                    backgroundColor:secondaryThemeColor,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',

                }}>
                <TouchableOpacity
                    style={{ height: 20, width: 20, position: 'absolute', left: 20, marginTop: 10 }}
                    onPress={() => {
                        navigation.goBack();
                    }}>
                    <Image
                        style={{ height: 20, width: 20, resizeMode: 'contain' }}
                        source={require('../../../assets/images/blackBack.png')}></Image>
                </TouchableOpacity>
                <PoppinsTextMedium style={{ fontSize: 20, color: 'black', marginTop: 5, position: 'absolute', left: 60, fontWeight:'bold'}} content={t("Rating/ Feedback")}></PoppinsTextMedium>
            </View>

        <View style={{marginTop:'20%',alignItems:'center'}}>
                    <TouchableOpacity onPress={()=>{
                        navigation.navigate("Feedback")
                    }} style={{width:330, height:200, borderRadius:10,borderColor:"#B6202D", borderWidth:1,alignItems:'center',justifyContent:'center'}}>
                        <Image style={{height:100,width:100, resizeMode:'contain', }} source={require("../../../assets/images/feedback_app_red.png")}></Image>
                        <PoppinsTextMedium style={{marginTop:10, fontWeight:'600', color:'black', fontSize:20}} content={"Feedback For App"}></PoppinsTextMedium>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{
                        navigation.navigate("FeedbackProducts")
                    }} style={{width:330, height:200, borderRadius:10,borderColor:"#B6202D", borderWidth:1,alignItems:'center',justifyContent:'center',marginTop:30}}>
                        <Image style={{height:100,width:100, resizeMode:'contain', }} source={require("../../../assets/images/feedback_for_product.png")}></Image>
                        <PoppinsTextMedium style={{marginTop:10, fontWeight:'600', color:'black', fontSize:20}} content={"Feedback For Product"}></PoppinsTextMedium>
                    </TouchableOpacity>
        </View>
                    <SocialBottomBar></SocialBottomBar>
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
});

//make this component available to the app
export default FeedbackOptions;
