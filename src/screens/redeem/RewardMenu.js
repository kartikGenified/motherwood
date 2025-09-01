//import liraries
import React, { useEffect,useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import TopHeader from '../../components/topBar/TopHeader';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import SocialBottomBar from '../../components/socialBar/SocialBottomBar';
import { useGetUserStatusApiMutation } from '../../apiServices/userStatus/getUserStatus';
import * as Keychain from "react-native-keychain";
import { useSelector } from 'react-redux';
import { useGetkycStatusMutation } from '../../apiServices/kyc/KycStatusApi';
import { useCashPerPointMutation, useFetchUserPointsMutation } from '../../apiServices/workflow/rewards/GetPointsApi';
import { useIsFocused } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import ErrorModal from '../../components/modals/ErrorModal';
import MessageModal from '../../components/modals/MessageModal';

// create a component
const RewardMenu = ({navigation}) => {
    const [enableRedemption, setEnableRedemption] = useState(false)
    const [redemptionStartData, setRedemptionStartDate]  = useState()
  const [redemptionEndDate, setRedemptionEndDate] = useState()
  const [modalVisible,setModalVisible] = useState(false)
  const [showKyc, setShowKyc] = useState(true)
  const [message, setMessage] = useState();
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false)
  const [navigateTo, setNavigateTo] = useState()
  const [pointBalance, setPointBalance] = useState()
  const {t} = useTranslation();

  const [minRedemptionPoints, setMinRedemptionPoints] = useState()
    const userData = useSelector(state => state.appusersdata.userData)
    const appUserData = useSelector(state=>state.appusers.value)
    const focused = useIsFocused()

    const [getUserStatusFunc,{
        data:getUserStatusData,
        error:getUserStatusError,
        isError:getUserStatusIsError,
        isLoading:getUserStatusIsLoading
      }] = useGetUserStatusApiMutation()

      const [getKycStatusFunc, {
        data: getKycStatusData,
        error: getKycStatusError,
        isLoading: getKycStatusIsLoading,
        isError: getKycStatusIsError
      }] = useGetkycStatusMutation()
      
      const [cashPerPointFunc,{
        data:cashPerPointData,
        error:cashPerPointError,
        isLoading:cashPerPointIsLoading,
        isError:cashPerPointIsError
      }] = useCashPerPointMutation()

      const [userPointFunc, {
        data: userPointData,
        error: userPointError,
        isLoading: userPointIsLoading,
        isError: userPointIsError
      }] = useFetchUserPointsMutation()

      useEffect(() => {
        (async () => {
          const credentials = await Keychain.getGenericPassword();
          const token = credentials.username;
          const userId = userData.id
          cashPerPointFunc(token)
          getKycStatusFunc(token)
        })();
      }, [focused]);

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

      useEffect(()=>{
        if(cashPerPointData)
        {
            console.log("cashPerPointData",cashPerPointData)
            if(cashPerPointData.success)
    
            {
              const temp = cashPerPointData?.body
              setRedemptionStartDate(temp?.redeem_start_date)
              setRedemptionEndDate(temp?.redeem_end_date)
              setMinRedemptionPoints(temp?.min_point_redeem)
            }
        }
        else if(cashPerPointError){
            console.log("cashPerPointError",cashPerPointError)
            
        }
      },[cashPerPointData,cashPerPointError])

      useEffect(() => {
        if (userPointData) {
          console.log("userPointData", userPointData)
          if(userPointData.success)
          {
          setPointBalance(userPointData.body.point_balance)
    
          }
        }
        else if (userPointError) {
          console.log("userPointError", userPointError)
        }
    
      }, [userPointData, userPointError])

      useEffect(() => {
        fetchPoints()
        if(appUserData!==undefined)
        {
         const influencerRedemptionCategories =  appUserData.filter((item)=>{
            return item.name===userData.user_type
          })
          console.log("influencerRedemptionCategories",influencerRedemptionCategories)
          if(influencerRedemptionCategories.length!==0)
          {
            setRedemptionStartDate(influencerRedemptionCategories[0].redeem_start_date)
            setRedemptionEndDate(influencerRedemptionCategories[0].redeem_end_date)
          }
        }
      }, [focused])

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

      useEffect(() => {
        if (getKycStatusData) {
          console.log("getKycStatusData", getKycStatusData)
          if (getKycStatusData.success) {
            const tempStatus = Object.values(getKycStatusData.body)        
            setShowKyc(tempStatus.includes(false))
          }
        }
        else if (getKycStatusError) {
          console.log("getKycStatusError", getKycStatusError)
        }
      }, [getKycStatusData, getKycStatusError])

      
      const modalClose = () => {
        setError(false);
        setSuccess(false);
      };

      const fetchPoints = async () => {
        const credentials = await Keychain.getGenericPassword();
        const token = credentials.username;
        const params = {
          userId: id,
          token: token
        }
        userPointFunc(params)
    
      }

      const handleNavigation =(type)=>{
        if(type == "gift")
        navigation.navigate('RedeemGifts',{schemeType : "yearly"})
        else
        navigation.navigate('RedeemCashback')
      }

      const handleRedeemButtonPress = (params) => {
      
        if (Number(userPointData?.body?.point_balance) <= 0 ) {
          setError(true)
          setMessage(t("Sorry you don't have enough points."))
          setNavigateTo("RedeemedHistory")
        }
      
        else if(Number(minRedemptionPoints)>Number(pointBalance))
        {
          console.log("Minimum Point required to redeem is",minRedemptionPoints)
          setError(true)
          setMessage(`${t("Minimum Point required to redeem is")} ${minRedemptionPoints}`)
          setNavigateTo("RedeemedHistory")
  
        }
        else {
          
          if((Number(new Date(redemptionStartData).getTime()) <= Number(new Date().getTime()) ) &&  ( Number(new Date().getTime()) <= Number(new Date(redemptionEndDate).getTime())) )
          {
            
          if(!showKyc)
          {
  
            handleNavigation(params)

          }
          else{
            console.log("correct redemption date sadghasgd",new Date().getTime(),new Date(redemptionStartData).getTime(),new Date(redemptionEndDate).getTime())
  
            setError(true)
            setMessage(t("KYC not completed yet"))
          }
          }
          else{
            console.log("correct redemption date",new Date().getTime(),new Date(redemptionStartData).getTime(),new Date(redemptionEndDate).getTime(),"hello")
  
            setError(true)
          setMessage(`${t("Redemption window starts from ")} ${dayjs(redemptionStartData).format("DD-MMM-YYYY")}  ${t(" and ends on ")}  ${dayjs(redemptionEndDate).format("DD-MMM-YYYY")}`)
          // setMessage("hello")
          // setNavigateTo("RedeemedHistory")
  
          }
        }
  
      }
    return (
        <View style={styles.container}>
            <TopHeader title={"Redeem"}></TopHeader>
            <Image style={{marginTop:40, width:200,height:100 ,resizeMode:'contain',}} source={require("../../../assets/images/gift1.png")}></Image>
            <PoppinsTextMedium style={{width:300, marginTop:25, fontSize:18, color:'black', }} content={"Unlock the magic of your points and redeem them for exciting rewards!"}></PoppinsTextMedium>

            <View style={{alignItems:'center',marginTop:30,width:'100%'}}>
                <TouchableOpacity disabled={!enableRedemption} style={{alignItems:'center',width:'100%'}} onPress={()=>{handleRedeemButtonPress('gift')}}> 
                <Image style={{height:150, width:'100%',resizeMode:'stretch'}} source={require("../../../assets/images/redeemBox.png")}></Image>
                </TouchableOpacity>
                <TouchableOpacity disabled={!enableRedemption} style={{alignItems:'center',width:'100%',bottom:10}} onPress={()=>{handleRedeemButtonPress('cashback')}}> 
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
            {error && (
        <ErrorModal
          modalClose={modalClose}
          message={message}
          openModal={error}
        ></ErrorModal>
      )}
      {success && (
        <MessageModal
          modalClose={modalClose}
          title={"Thanks"}
          message={message}
          openModal={success}
          navigateTo="ListAddress"
        ></MessageModal>
      )}
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
