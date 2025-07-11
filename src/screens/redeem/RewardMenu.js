//import liraries
import React, { useEffect,useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import TopHeader from '../../components/topBar/TopHeader';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import SocialBottomBar from '../../components/socialBar/SocialBottomBar';
import { useGetUserStatusApiMutation } from '../../apiServices/userStatus/getUserStatus';
import * as Keychain from "react-native-keychain";
import { useSelector } from 'react-redux';

// create a component
const RewardMenu = ({navigation}) => {
    const [enableRedemption, setEnableRedemption] = useState(false)
    const userData = useSelector(state => state.appusersdata.userData)

    const [getUserStatusFunc,{
        data:getUserStatusData,
        error:getUserStatusError,
        isError:getUserStatusIsError,
        isLoading:getUserStatusIsLoading
      }] = useGetUserStatusApiMutation()

    useEffect(()=>{
        const getStatus=async()=>{
          const credentials = await Keychain.getGenericPassword();
          if (credentials) {
            console.log(
              'Credentials successfully loaded for user ' + credentials.username
            );
            const token = credentials.username
            const params = {
              token:token
            }
            getUserStatusFunc(params)
        
          }
        }
        getStatus()
        
      },[userData])

    useEffect(() => {
        if (getUserStatusData) {
          console.log("getUserStatusData", getUserStatusData);
          if(getUserStatusData?.body.status == "Approved")
          {
            setEnableRedemption(true)
          }
        } else if (getUserStatusError) {
          console.log("getUserStatusError", getUserStatusError);
        }
      }, [getUserStatusData, getUserStatusError]);
    return (
        <View style={styles.container}>
            <TopHeader title={"Redeem"}></TopHeader>
            <Image style={{marginTop:40, width:200,height:100 ,resizeMode:'contain',}} source={require("../../../assets/images/gift1.png")}></Image>
            <PoppinsTextMedium style={{width:300, marginTop:25, fontSize:18, color:'black', }} content={"Unlock the magic of your points and redeem them for exciting rewards!"}></PoppinsTextMedium>

            <View style={{alignItems:'center',marginTop:30,width:'100%'}}>
                <TouchableOpacity disabled={!enableRedemption} style={{alignItems:'center',width:'100%'}} onPress={()=>{navigation.navigate('RedeemGifts',{schemeType : "yearly"})}}> 
                <Image style={{height:150, width:'100%',resizeMode:'stretch'}} source={require("../../../assets/images/redeemBox.png")}></Image>
                </TouchableOpacity>
                <TouchableOpacity disabled={!enableRedemption} style={{alignItems:'center',width:'100%',bottom:10}} onPress={()=>{navigation.navigate('RedeemCashback')}}> 
                <Image style={{height:110, width:'90%',resizeMode:'stretch'}} source={require("../../../assets/images/cashbackBox.png")}></Image>

                </TouchableOpacity>
             
            </View>
            {
                !enableRedemption && getUserStatusData?.body.status && 
            <PoppinsTextMedium style={{width:300, marginTop:10, fontSize:18, color:'#ad0638', }} content={`You cannot redeem as your current approval status is :  ${getUserStatusData?.body.status}`}></PoppinsTextMedium>

            }
            {
                getUserStatusError && 
                <PoppinsTextMedium style={{width:300, marginTop:10, fontSize:18, color:'#ad0638', }} content={`Unable to fetch your approval status`}></PoppinsTextMedium>
            }
            <SocialBottomBar/>
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'white',
        alignItems:'center',
        height:'100%'
    },
});

//make this component available to the app
export default RewardMenu;
