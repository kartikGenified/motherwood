import React,{useEffect, useId} from 'react';
import {View, StyleSheet,TouchableOpacity,Image,FlatList} from 'react-native';
import PoppinsText from '../../components/electrons/customFonts/PoppinsText';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import { useSelector } from 'react-redux';
import { useFetchGiftsRedemptionsOfUserMutation } from '../../apiServices/workflow/RedemptionApi';
import * as Keychain from 'react-native-keychain';
import { useFetchUserPointsMutation } from '../../apiServices/workflow/rewards/GetPointsApi';
import { useTranslation } from 'react-i18next';
import TopHeader from "@/components/topBar/TopHeader";

const AddBankAccountAndUpi = ({navigation}) => {
    const ternaryThemeColor = useSelector(
        state => state.apptheme.ternaryThemeColor,
      )
        ? useSelector(state => state.apptheme.ternaryThemeColor)
        : 'grey';
        
        const {t} = useTranslation()
    return (
        <View style={{alignItems:"center",justifyContent:"flex-start",width:'100%',backgroundColor:"#FFF8E7",height:'100%'}}>
            <TopHeader title={t("Add Bank & UPI")} />
            <View style={{height:'90%',width:'100%',borderTopRightRadius:40,borderTopLeftRadius:40,alignItems:"center",justifyContent:"flexx-start",backgroundColor:"white"}}>
            
            <View style={{borderBottomWidth:1,borderColor:'#DDDDDD',width: '80%',paddingBottom:10}}>
            <PoppinsTextMedium style={{color:'#292626',marginTop:10,fontWeight:'800', fontSize:18}} content={t("Select Method")}></PoppinsTextMedium>
            </View>
            <TouchableOpacity onPress={()=>{navigation.navigate('AddBankDetails')}} style={{width:'90%',alignItems:"center",justifyContent:"center",height:80,flexDirection:'row',marginTop:20,borderBottomWidth:0.4,borderColor:'#DDDDDD'}}>
            <View style={{height:60,width:60,alignItems:'center',justifyContent:'center',borderRadius:30,borderWidth:1,borderColor:'#DDDDDD'}}>
                <Image style={{height:30,width:30,resizeMode:'contain'}} source={require('../../../assets/images/bankaccount.png')}></Image>
            </View>
            <View style={{alignItems:'flex-start',justifyContent:'center',width:'70%',height:'100%',marginLeft:20}}>
                <PoppinsTextMedium style={{color:'black',fontSize:14}} content="Account Number"></PoppinsTextMedium>
                <PoppinsTextMedium style={{color:'black',fontSize:10}} content="Transfer without adding a beneficiary"></PoppinsTextMedium>

            </View>
            <View style={{alignItems:'center',justifyContent:'center'}}>
                <Image style={{height:20,width:20,resizeMode:"contain"}} source={require('../../../assets/images/next.png')}></Image>
            </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{navigation.navigate('AddUpi')}} style={{width:'90%',alignItems:"center",justifyContent:"center",height:80,flexDirection:'row',marginTop:20,borderBottomWidth:0.4,borderColor:'#DDDDDD'}}>
            <View style={{height:60,width:60,alignItems:'center',justifyContent:'center',borderRadius:30,borderWidth:1,borderColor:'#DDDDDD'}}>
                <Image style={{height:30,width:30,resizeMode:'contain'}} source={require('../../../assets/images/upi.png')}></Image>
            </View>
            <View style={{alignItems:'flex-start',justifyContent:'center',width:'70%',height:'100%',marginLeft:20}}>
                <PoppinsTextMedium style={{color:'black',fontSize:14}} content="Unified Payments Interface (UPI)"></PoppinsTextMedium>
                <PoppinsTextMedium style={{color:'black',fontSize:10}} content={t("Transfer through UPI ID")}></PoppinsTextMedium>

            </View>
            <View style={{alignItems:'center',justifyContent:'center'}}>
                <Image style={{height:20,width:20,resizeMode:"contain"}} source={require('../../../assets/images/next.png')}></Image>
            </View>
            </TouchableOpacity>
            </View>
            
        </View>
    );
}

const styles = StyleSheet.create({})

export default AddBankAccountAndUpi;
