//import liraries
import React, { Component, useEffect } from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ImageBackground } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import PoppinsTextLeftMedium from "../electrons/customFonts/PoppinsTextLeftMedium";
import PoppinsTextMedium from "../electrons/customFonts/PoppinsTextMedium";
import { useFetchUserPointsMutation } from "../../apiServices/workflow/rewards/GetPointsApi";
import * as Keychain from 'react-native-keychain';
import { useSelector } from "react-redux";


const PointsCard = (props) => {

  const [userPointFunc, {
    data: userPointData,
    error: userPointError,
    isLoading: userPointIsLoading,
    isError: userPointIsError
}] = useFetchUserPointsMutation();

const id = useSelector(state => state.appusersdata.id);
const userData = useSelector((state) => state.appusersdata.userData);
const membership = props.memberShip
useEffect(() => {
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


  const IconBox = ({ image, title, points }) => {
    console.log("pointsIconBox",points)
    return (
      <View
        style={{
          alignItems: "center",
          marginTop:20,
          height:105, 
          width:130,
          paddingRight:5, 
          borderRightWidth:0.4,
          borderRightColor:'red',
          paddingLeft:5
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
            style={{ color: "white", textAlign: "center", fontSize: 13, fontWeight:'600' }}
            content={title}
          ></PoppinsTextMedium>
        </View>
      </View>
    );
  };



  return (
    <LinearGradient colors={membership == null ? ["#B1202C", "#573B3D"] : membership == "silver" ? ['#909090','#B9B9B9'] : membership == 'gold' ? ['#C79935','#A37B24']: membership == "platinum" ? ['#DDDDDD','#B9B9B9'] :[]}  style={styles.container}>
      <View
        style={{
          height: "53%",
          justifyContent: "space-between",
          flexDirection: "row",
          borderBottomWidth: 0.5,
          borderBottomColor: "red",
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
              style={{ color: "white", fontSize: 18, fontWeight: "800" }}
              content={userData?.name}
            ></PoppinsTextLeftMedium>
           
          </View>
        </View>

        <View>
          <Image
            style={{ height: 40, width: 100, marginTop: 30, marginRight: 10,resizeMode:'contain' }}
            source={require("../../../assets/images/motherwood_white_logo.png")}
          ></Image>
          <TouchableOpacity
            onPress={()=>{
              props.setModalVisible(true)
            }}
            style={{ flexDirection: "row", marginTop: 20, marginRight: 20 }}
          >
            <Image
              style={{ height: 16, width: 16, marginRight: 5, marginTop: 3 }}
              source={require("../../../assets/images/info_white.png")}
            ></Image>
            <PoppinsTextLeftMedium
              style={{ color: "white", fontSize: 16 }}
              content={"Earn Badge"}
            ></PoppinsTextLeftMedium>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{width:'100%',}}>
        <ScrollView
          horizontal={true}
          style={{}}
          contentContainerStyle={
            {
              flexDirection:'row',
              justifyContent:'center',
              marginBottom: 10,
          }
          }

        >
          <IconBox
            image={require("../../../assets/images/hand_coin_white.png")}
            points={isNaN(Math.floor(userPointData?.body.point_earned)) ? '0' : Math.floor(userPointData?.body.point_earned)}
            title={"Recieved Points"}
          ></IconBox>
          <IconBox
            image={require("../../../assets/images/loop_star.png")}
            points={isNaN(Math.floor(userPointData?.body?.transfer_points)) ? '0' : Math.floor(userPointData?.body?.transfer_points)}
            title={"Transfered Points"}
          ></IconBox>
          <IconBox
            image={require("../../../assets/images/white_coin.png")}
            points={isNaN(Math.floor(userPointData?.body?.point_balance)) ? '0' : Math.floor(userPointData?.body?.point_balance)}
            title={"Wallet Points"}
          ></IconBox>
          <IconBox
            image={require("../../../assets/images/white_gift.png")}
            points={isNaN(Math.floor(userPointData?.body?.point_balance)) ? '0' : Math.floor(userPointData?.body?.point_balance)}
            title={"Redeemed Points"}
          ></IconBox>
        </ScrollView>
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
