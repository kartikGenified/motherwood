//import liraries
import React, { Component, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import TopHeader from "../../components/topBar/TopHeader";
import RewardBox from "../../components/molecules/RewardBox";
import PoppinsTextLeftMedium from "../../components/electrons/customFonts/PoppinsTextLeftMedium";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import { useGetNameMutation } from "../../apiServices/login/GetNameByMobile";
import { useNavigation } from "@react-navigation/native";
import { getUserDetails, useGetUserDetailsMutation } from "../../apiServices/pointsTransfer/getUserDetails";
import * as Keychain from "react-native-keychain";


// for userSearch
const PointsTransfer = () => {
  const navigation = useNavigation();
  const [mobile, setMobile] = useState();
const [token, setToken] = useState()
  const [
    getNameFunc,
    {
      data: getNameData,
      error: getNameError,
      isLoading: getLoading,
      isError: getIsError,
    },
  ] = useGetUserDetailsMutation();

  useEffect(() => {
    if (getNameData) {
      console.log("getUSerDetails", getNameData);
    } else {
      console.log("getNameError", getNameError);
    }
  }, [getNameData,getNameError]);

  useEffect(() => {
    const getToken = async () => {
      const credentials = await Keychain.getGenericPassword();
      const token = credentials.username;
      setToken(token)
    };

    getToken();
  }, []);

  useEffect(() => {
    console.log("mobileData", mobile)
    if (mobile && mobile.length == 10) {

     const requestData = {
        mobile: mobile,
        orderIntent: "sell",
      };

      getNameFunc({token, requestData});
    }
  }, [mobile]);

  return (
    <View style={styles.container}>
      <TopHeader title={"Point Transfer"} />
      <RewardBox />

      {/* Red Strip */}
      <View
        style={{
          backgroundColor: "#B6202D",
          width: "95%",
          height: 60,
          alignSelf: "center",
          marginHorizontal: 20,
          flexDirection: "row",
          borderRadius: 10,
          marginTop: 15,
          justifyContent: "space-between",
        }}
      >
        <View
          style={{ flexDirection: "row", alignItems: "center", marginLeft: 20 }}
        >
          <Text style={{ color: "white", fontSize: 20 }}>
            Transferable Points
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginRight: 20,
          }}
        >
          <Image
            style={{ height: 20, width: 20, marginHorizontal: 5 }}
            source={require("../../../assets/images/coin.png")}
          />
          <Text style={{ color: "white", fontSize: 22 }}>{"900"}</Text>
        </View>
      </View>

      {/* Mobile Input  */}
      <View style={{ height: 120, marginTop: 30 }}>
        <PoppinsTextLeftMedium
          style={{
            marginLeft: 22,
            marginTop: 10,
            fontSize: 17,
            color: "black",
          }}
          content={"Enter Mobile No (to transfer points)"}
        ></PoppinsTextLeftMedium>
        <TextInput
          onChangeText={setMobile}
          placeholder="99999999999"
          maxLength={10}
          style={{
            height: 70,
            borderWidth: 1,
            borderColor: "#EBEBEB",
            marginTop: 20,
            marginHorizontal: 20,
            borderRadius: 10,
            fontSize: 20,
            paddingLeft: 20,
          }}
        ></TextInput>
        <Image
          style={{
            height: 35,
            width: 35,
            resizeMode: "contain",
            position: "absolute",
            right: 30,
            top: 70,
          }}
          source={require("../../../assets/images/mobile_icon.png")}
        />
      </View>

      {/* Detail Box */}
      {
        getNameData?.body &&
        <View
        style={{
          marginHorizontal: 20,
          backgroundColor: "#F4F4F4",
          borderWidth: 1,
          borderColor: "#B6202D",
          marginTop: 20,
          padding: 15,
          borderRadius: 10,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <PoppinsTextLeftMedium
            style={{ color: "black", fontSize: 23 }}
            content={"Name :"}
          ></PoppinsTextLeftMedium>
          <PoppinsTextLeftMedium
            style={{ color: "black", fontSize: 23 }}
            content={getNameData?.body?.name}
          ></PoppinsTextLeftMedium>
        </View>
        <View style={{ flexDirection: "row" }}>
          <PoppinsTextLeftMedium
            style={{ color: "black", fontSize: 23 }}
            content={"ID :"}
          ></PoppinsTextLeftMedium>
          <PoppinsTextLeftMedium
            style={{ color: "black", fontSize: 23 }}
            content={getNameData?.body?.user_id}

          ></PoppinsTextLeftMedium>
        </View>

        <View style={{ flexDirection: "row" }}>
          <PoppinsTextLeftMedium
            style={{ color: "black", fontSize: 23 }}
            content={"Type :"}
          ></PoppinsTextLeftMedium>
          <PoppinsTextLeftMedium
            style={{ color: "black", fontSize: 23 }}
            content={getNameData?.body?.user_type}
          ></PoppinsTextLeftMedium>
        </View>

        <View style={{ flexDirection: "row" }}>
          <PoppinsTextLeftMedium
            style={{ color: "black", fontSize: 23 }}
            content={"State :"}
          ></PoppinsTextLeftMedium>
          <PoppinsTextLeftMedium
            style={{ color: "black", fontSize: 23 }}
            content={getNameData?.body?.state}
          ></PoppinsTextLeftMedium>
        </View>

        <View style={{ flexDirection: "row" }}>
          <PoppinsTextLeftMedium
            style={{ color: "black", fontSize: 23 }}
            content={"City :"}
          ></PoppinsTextLeftMedium>
          <PoppinsTextLeftMedium
            style={{ color: "black", fontSize: 23 }}
            content={getNameData?.body?.city}
          ></PoppinsTextLeftMedium>
        </View>
      </View>
      }

      {
        (! getNameData?.body) &&
        <View style={{alignItems:'center', justifyContent:'center', height:300}}>
          <PoppinsTextMedium style={{color:'black', fontSize:20}} content={getNameError?.data?.message}></PoppinsTextMedium>
          </View>
      }


      {/* Button */}
      {
        getNameData?.body &&
        <TouchableOpacity
        onPress={()=>{
          navigation.navigate("PointsTransferNext", {userDetails: getNameData?.body})
        }}
        style={{
          backgroundColor: "black",
          marginHorizontal: 20,
          height: 65,
          marginTop: 30,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 10,
        }}
      >
        <PoppinsTextLeftMedium
          style={{ color: "white", fontSize: 23, fontWeight: "bold" }}
          content="NEXT"
        ></PoppinsTextLeftMedium>
      </TouchableOpacity>
      }

    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});

//make this component available to the app
export default PointsTransfer;
