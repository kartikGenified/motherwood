import React,{useEffect, useId} from 'react';
import {View, StyleSheet,TouchableOpacity,Image} from 'react-native';
import PoppinsText from '../../components/electrons/customFonts/PoppinsText';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import { useSelector } from 'react-redux';
import ButtonNavigate from '../../components/atoms/buttons/ButtonNavigate';
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next';
import TopHeader from '@/components/topBar/TopHeader';

const CashbackDetails = ({navigation,route}) => {
    
    const ternaryThemeColor = useSelector(
        state => state.apptheme.ternaryThemeColor,
      )
        ? useSelector(state => state.apptheme.ternaryThemeColor)
        : 'grey';
    
    const { t } = useTranslation();
    
    const data = route.params.data
    const date = dayjs(data.updated_at).format("DD MMM YYYY")
    const amount =data.cash;
    const beneName = data?.bene_details?.name
    const beneUpi = data?.bene_details?.vpa
    const beneMobile = data?.bene_details?.phone
    const utr = data?.utr

    console.log("Transaction data is :",data)
    return (
        <View style={{alignItems:"center",justifyContent:"flex-start",height:'100%'}}>
            <TopHeader title={t("Cashback Details")} />
            
            <View style={{alignItems:"center",justifyContent:"center",marginTop:40}}>
                <Image style={{height:80,width:80,resizeMode:"contain"}} source={require('../../../assets/images/greenRupee.png')}></Image>
                <PoppinsTextMedium style={{marginTop:20,fontSize:20,color:'black',width:220}} content={data?.approval_status == 1 ? t("Cashback Received") : data?.approval_status == 2 ? t("Cashback Rejected") :  t("Cashback Pending")}></PoppinsTextMedium>
            </View>

            <View style={{padding:10,borderWidth:1,borderStyle:"dashed",backgroundColor:data.approval_status == "1" ? "green" : data.approval_status==2 ? "red" : ternaryThemeColor,alignItems:"center",justifyContent:"center",borderRadius:4,opacity:0.7,marginTop:30,width:140}}>
            <PoppinsTextMedium style={{color:'black',fontSize:34,fontWeight:'700'}} content={`₹ ${amount}`}></PoppinsTextMedium>
             </View>
             <View style={{alignItems:"center",justifyContent:"center",marginTop:20}}>
                <PoppinsTextMedium style={{color:'black',fontSize:18,fontWeight:'700'}} content={data.approval_status==="1"? t("Credited Date"):data.approval_status==2 ? t("Declined Date") : t("Pending From")}></PoppinsTextMedium>
                <PoppinsTextMedium style={{color:'black',fontSize:18,fontWeight:'500'}} content={date}></PoppinsTextMedium>

             </View>
             <View style={{alignItems:"center",justifyContent:"center",marginTop:20}}>
                <PoppinsTextMedium style={{color:'black',fontSize:18,fontWeight:'700'}} content={t("Beneficiary Name")}></PoppinsTextMedium>
                <PoppinsTextMedium style={{color:'black',fontSize:18,fontWeight:'500'}} content={beneName}></PoppinsTextMedium>

             </View>
             <View style={{alignItems:"center",justifyContent:"center",marginTop:20}}>
                <PoppinsTextMedium style={{color:'black',fontSize:18,fontWeight:'700'}} content={t("Beneficiary UPI")}></PoppinsTextMedium>
                <PoppinsTextMedium style={{color:'black',fontSize:18,fontWeight:'500'}} content={beneUpi}></PoppinsTextMedium>

             </View>
             <View style={{alignItems:"center",justifyContent:"center",marginTop:20}}>
                <PoppinsTextMedium style={{color:'black',fontSize:18,fontWeight:'700'}} content={t("Beneficiary Mobile")}></PoppinsTextMedium>
                <PoppinsTextMedium style={{color:'black',fontSize:18,fontWeight:'500'}} content={beneMobile}></PoppinsTextMedium>

             </View>
             {data?.utr!=(null || undefined) && <View style={{alignItems:"center",justifyContent:"center",marginTop:20}}>
                <PoppinsTextMedium style={{color:'black',fontSize:18,fontWeight:'700'}} content={t("Transaction ID")}></PoppinsTextMedium>
                <PoppinsTextMedium style={{color:'black',fontSize:18,fontWeight:'500'}} content={utr}></PoppinsTextMedium>

             </View>}
             {/* <View style={{alignItems:"center",justifyContent:"center",marginTop:20,position:"absolute",bottom:10,borderTopWidth:1,borderColor:'#DDDDDD',width:'90%',paddingTop:10}}>
                <PoppinsTextMedium style={{color:"black",fontSize:18,fontWeight:"700"}} content="Issue With This ?"></PoppinsTextMedium>
                <ButtonNavigate navigateTo = "SupportQueries" style={{color:"white"}}  content ="Click Here To Report" backgroundColor="#D10000"></ButtonNavigate>
            
            </View> */}
        </View>
    );
}

const styles = StyleSheet.create({})

export default CashbackDetails;
