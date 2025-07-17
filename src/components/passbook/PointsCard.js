//import liraries
import React, { Component, useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ImageBackground } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import PoppinsTextLeftMedium from "../electrons/customFonts/PoppinsTextLeftMedium";
import PoppinsTextMedium from "../electrons/customFonts/PoppinsTextMedium";
import { useFetchUserPointsMutation } from "../../apiServices/workflow/rewards/GetPointsApi";
import * as Keychain from 'react-native-keychain';
import { useSelector } from "react-redux";
import capitalizeFirstChar from "../../utils/capitalizeFirstChar";


const PointsCard = (props) => {
const [isTertiary, setIsTertiary] = useState()
  const [userPointFunc, {
    data: userPointData,
    error: userPointError,
    isLoading: userPointIsLoading,
    isError: userPointIsError
}] = useFetchUserPointsMutation();

const ternaryThemeColor = useSelector(
  (state) => state.apptheme.ternaryThemeColor
)
const id = useSelector(state => state.appusersdata.id);
const userData = useSelector((state) => state.appusersdata.userData);
const membership = props?.memberShip?.toLowerCase()

console.log("dashjgdhjgasjjcbjkasbcv gcahgvs",userData,membership)

useEffect(() => {
  if( (userData?.user_type)?.toLowerCase() == 'carpenter' ||  (userData?.user_type)?.toLowerCase() == 'contractor' ||  (userData?.user_type)?.toLowerCase() == 'oem' ||  (userData?.user_type)?.toLowerCase() == 'directoem')
 {
  setIsTertiary(true)
 }
 else{
  setIsTertiary(false)
 }
  fetchPoints()
}, []);

useEffect(() => {
  if (userPointData) {
      console.log("userPointData", userPointData)
  }
  else if (userPointError) {
      console.log("userPointError", userPointError)
  }
}, [userPointData, userPointError])

const fetchPoints = async () => {
  const credentials = await Keychain.getGenericPassword();
  const token = credentials.username;
  const params = {
      userId: id,
      token: token
  }
  userPointFunc(params)
}



console.log("cpasdjashjbchasbjhbas",capitalizeFirstChar(membership))
  const IconBox = ({ image, title, points }) => {
    console.log("pointsIconBox",points)
    let width;
    if(userData?.user_type?.toLowerCase() != "carpenter" &&
    userData?.user_type?.toLowerCase() != "contractor" &&
    userData?.user_type?.toLowerCase() != "oem" &&
    userData?.user_type?.toLowerCase() != "directoem")
    {
      width = '25%'
    }
    else{
      width = '33%'
    }
    return (
      <View
        style={{
          alignItems: "center",
          marginTop:20,
          height:110, 
          width:width,
          borderRightWidth:0.4,
          borderRightColor:membership == 'silver' ? "#C0C0C0" : membership == 'gold' ? 'gold' : membership == 'platinum' ? '#a0a09e' : ternaryThemeColor,
          padding:4
        }}
      >
        <Image
          style={{ height: 38, width:38, resizeMode: "contain" }}
          source={image}
        ></Image>
        <View style={{ alignItems: "center" }}>
          <PoppinsTextLeftMedium
            style={{
              color: "white",
              textAlign: "center",
              marginTop: 5,
              fontSize: 16,
              fontWeight:'700'
            }}
            content={points ? points : 0}
          ></PoppinsTextLeftMedium>
          <PoppinsTextMedium
            style={{ color: "white", textAlign: "center", fontSize: 12, fontWeight:'700' }}
            content={title}
          ></PoppinsTextMedium>
        </View>
      </View>
    );
  };



  return (
    <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={membership == null ? isTertiary ? ["#315855","#315855","#1B7C76","#00A79D"] : ["#B1202C", "#573B3D"] : membership == "silver" ? ['#909090','#B9B9B9'] : membership == 'gold' ? ['#C79935','#A37B24']: membership == "platinum" ? ['#DDDDDD','#B9B9B9'] :[]}  style={styles.container}>
      <View
        style={{
          height: "48%",
          justifyContent: "space-between",
          flexDirection: "row",
          borderBottomWidth: 0.5,
          borderBottomColor: membership == 'silver' ? "#C0C0C0" : membership == 'gold' ? 'gold' : membership == 'platinum' ? '#a0a09e' :  ternaryThemeColor,
          alignItems:'flex-start'
        }}
      >
        <View style={{ flexDirection: "row",alignItems:'center', justifyContent:'center',marginTop:30 }}>
          <View
            style={{
              height: 50,
              width: 50,
              borderRadius: 25,
              backgroundColor: "white",
              borderRadius: 25,
              marginHorizontal: 10,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              style={{ height: 30, width: 30, }}
              source={require("../../../assets/images/userGrey.png")}
            ></Image>
          </View>
          <View style={{ justifyContent: "center" }}>
            <PoppinsTextLeftMedium
              style={{ color: "white", fontSize: 18, fontWeight: "800",width:160 }}
              content={userData?.name}
            ></PoppinsTextLeftMedium>
            <PoppinsTextLeftMedium
              style={{ color: "white", fontSize: 16, fontWeight: "600" }}
              content={userData.user_type + '_' + userData?.id}
            ></PoppinsTextLeftMedium>
           
          </View>
        </View>

        <View>
          <Image
            style={{ height: 50, width: 100, marginTop: 10, marginRight: 10,resizeMode:'contain',top:18 }}
            source={require("../../../assets/images/motherwood_white_logo.png")}
          ></Image>
          <TouchableOpacity
            onPress={()=>{
              props.setModalVisible(true)
            }}
            style={{ flexDirection: "row", marginTop: 20,top:30, right:30 }}
          >
            <Image
              style={{ height: 16, width: 16, marginRight: 5, marginTop: 3 }}
              source={require("../../../assets/images/info_white.png")}
            ></Image>
            {membership ? <PoppinsTextMedium
            style={{ color: "white",fontSize:14 }}
            content={`${capitalizeFirstChar(membership)} Member`}
          ></PoppinsTextMedium>
          :
          <PoppinsTextMedium
            style={{ color: "white",fontSize:16 }}
            content={"Earn Badges"}
          ></PoppinsTextMedium>
          }
          </TouchableOpacity>
        </View>
      </View>
      <View style={{width:'100%',flexDirection:'row'}}>
      {userData?.user_type?.toLowerCase() != "carpenter" &&
              userData?.user_type?.toLowerCase() != "contractor" &&
              userData?.user_type?.toLowerCase() != "oem" &&
              userData?.user_type?.toLowerCase() != "directoem" ?
          <IconBox
            image={require("../../../assets/images/hand_coin_white.png")}
            points={userPointData?.body?.point_earned}
            title={"Recieved Points"}
          ></IconBox>
          :
          <IconBox
          image={require("../../../assets/images/hand_coin_white.png")}
          points={userPointData?.body?.point_earned}
          title={"Earned Points"}
        ></IconBox>
}
          {userData?.user_type?.toLowerCase() != "carpenter" &&
              userData?.user_type?.toLowerCase() != "contractor" &&
              userData?.user_type?.toLowerCase() != "oem" &&
              userData?.user_type?.toLowerCase() != "directoem" &&
              <IconBox
            image={require("../../../assets/images/loop_star.png")}
            points={userPointData?.body?.point_earned - userPointData?.body?.point_balance - userPointData?.body?.point_redeemed - userPointData?.body?.point_reserved- userPointData?.body?.transfer_points}
            title={"Transferred Points"}
          ></IconBox>}
          <IconBox
            image={require("../../../assets/images/white_coin.png")}
            points={userPointData?.body?.point_balance}
            title={"Wallet Points"}
          ></IconBox>
          <IconBox
            image={require("../../../assets/images/white_gift.png")}
            points={userPointData?.body?.point_redeemed}
            title={"Redeemed Points"}
          ></IconBox>
      </View>
    </LinearGradient>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {

    width: "97%",
    height: 280,
    alignSelf: "center",
    borderRadius: 14,

  },
});

//make this component available to the app
export default PointsCard;
