//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import TopHeader from '../../components/topBar/TopHeader';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import SocialBottomBar from '../../components/socialBar/SocialBottomBar';

// create a component
const RewardMenu = ({navigation}) => {
    return (
        <View style={styles.container}>
            <TopHeader title={"Rewards"}></TopHeader>
            <Image style={{marginTop:40, width:200,height:100 ,resizeMode:'contain',}} source={require("../../../assets/images/gift1.png")}></Image>
            <PoppinsTextMedium style={{width:300, marginTop:25, fontSize:18, color:'black', }} content={"Unlock the magic of your points and redeem them for exciting rewards!"}></PoppinsTextMedium>

            <View style={{alignItems:'center',marginTop:30,width:'100%'}}>
                <TouchableOpacity style={{alignItems:'center',width:'90%'}} onPress={()=>{navigation.navigate('RedeemGifts',{schemeType : "yearly"})}}> 
                <Image style={{height:150, width:'100%',borderRadius:20,resizeMode:'contain'}} source={require("../../../assets/images/redeemBox.png")}></Image>
                </TouchableOpacity>
                <TouchableOpacity style={{alignItems:'center',width:'90%'}} onPress={()=>{navigation.navigate('RedeemCashback')}}> 
                <Image style={{height:150, width:'100%', marginTop:20,borderRadius:20,resizeMode:'contain'}} source={require("../../../assets/images/cashbackBox.png")}></Image>

                </TouchableOpacity>
             
            </View>
            <SocialBottomBar/>
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'white',
        alignItems:'center'
    },
});

//make this component available to the app
export default RewardMenu;
