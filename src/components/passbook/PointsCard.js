//import liraries
import React, { Component, useEffect } from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import PoppinsTextLeftMedium from "../electrons/customFonts/PoppinsTextLeftMedium";
import PoppinsTextMedium from "../electrons/customFonts/PoppinsTextMedium";
import { useFetchUserPointsMutation } from "../../apiServices/workflow/rewards/GetPointsApi";
import * as Keychain from 'react-native-keychain';
import { useSelector } from "react-redux";


const PointsCard = () => {

  const [userPointFunc, {
    data: userPointData,
    error: userPointError,
    isLoading: userPointIsLoading,
    isError: userPointIsError
}] = useFetchUserPointsMutation();

const id = useSelector(state => state.appusersdata.id);
const userData = useSelector((state) => state.appusersdata.userData);

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
    console.log("mddkkdd",points)
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
          style={{ height: 42, width:42, resizeMode: "contain" }}
          source={image}
        ></Image>
        <View style={{ alignItems: "center" }}>
          <PoppinsTextLeftMedium
            style={{
              color: "white",
              textAlign: "center",
              marginTop: 5,
              fontSize: 16,

            }}
            content={points}
          ></PoppinsTextLeftMedium>
          <PoppinsTextMedium
            style={{ color: "white", textAlign: "center", fontSize: 15 }}
            content={title}
          ></PoppinsTextMedium>
        </View>
      </View>
    );
  };



  return (
    <LinearGradient colors={["#B1202C", "#573B3D"]} style={styles.container}>
      <View
        style={{
          height: "53%",
          justifyContent: "space-between",
          flexDirection: "row",
          borderBottomWidth: 0.5,
          borderBottomColor: "red",
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              height: 50,
              width: 50,
              borderRadius: 25,
              backgroundColor: "white",
              borderRadius: 25,
              marginHorizontal: 20,
              marginTop:30,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              style={{ height: 30, width: 30, }}
              source={require("../../../assets/images/userGrey.png")}
            ></Image>
          </View>
          <View style={{ justifyContent: "center", marginBottom: 30 }}>
            <PoppinsTextLeftMedium
              style={{ color: "white", fontSize: 20, fontWeight: "800" }}
              content={userData?.name}
            ></PoppinsTextLeftMedium>
            <PoppinsTextLeftMedium
              style={{ color: "white", fontSize: 17 }}
              content={"MMWHDKk"}
            ></PoppinsTextLeftMedium>
          </View>
        </View>

        <View>
          <Image
            style={{ height: 40, width: 100, marginTop: 30, marginRight: 20 }}
            source={require("../../../assets/images/motherwood_white_logo.png")}
          ></Image>
          <View
            style={{ flexDirection: "row", marginTop: 20, marginRight: 20 }}
          >
            <Image
              style={{ height: 20, width: 20, marginRight: 5, marginTop: 3 }}
              source={require("../../../assets/images/info_white.png")}
            ></Image>
            <PoppinsTextLeftMedium
              style={{ color: "white", fontSize: 18 }}
              content={"Earn Badge"}
            ></PoppinsTextLeftMedium>
          </View>
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
            points={Math.floor(userPointData?.body.point_earned)}
            title={"Recieved Points"}
          ></IconBox>
          <IconBox
            image={require("../../../assets/images/loop_star.png")}
            points={Math.floor(userPointData?.body?.transfer_points)}
            title={"Transfered Points"}
          ></IconBox>
          <IconBox
            image={require("../../../assets/images/white_coin.png")}
            points={Math.floor(userPointData?.body?.point_balance)}
            title={"Wallet Points"}
          ></IconBox>
          <IconBox
            image={require("../../../assets/images/white_gift.png")}
            points={Math.floor(userPointData?.body?.point_balance)}
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
    borderRadius: 10,

  },
});

//make this component available to the app
export default PointsCard;
