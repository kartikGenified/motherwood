//import liraries
import React, { Component, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import TopHeader from "../../components/topBar/TopHeader";
import RewardBox from "../../components/molecules/RewardBox";
import PoppinsTextLeftMedium from "../../components/electrons/customFonts/PoppinsTextLeftMedium";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import { useGetNameMutation } from "../../apiServices/login/GetNameByMobile";
import { useNavigation } from "@react-navigation/native";
import {
  getUserDetails,
  useGetUserDetailsMutation,
} from "../../apiServices/pointsTransfer/getUserDetails";
import * as Keychain from "react-native-keychain";
import { useFetchUserPointsMutation } from "../../apiServices/workflow/rewards/GetPointsApi";
import { useSelector } from "react-redux";
import SocialBottomBar from "../../components/socialBar/SocialBottomBar";
import { useTranslation } from "react-i18next";

// for userSearch
const PointsTransfer = () => {
  const navigation = useNavigation();
  const [mobile, setMobile] = useState();
  const id = useSelector((state) => state.appusersdata.id);
  const [token, setToken] = useState();
  const { t } = useTranslation();
  const [
    getNameFunc,
    {
      data: getNameData,
      error: getNameError,
      isLoading: getLoading,
      isError: getIsError,
    },
  ] = useGetUserDetailsMutation();

  const [
    userPointFunc,
    {
      data: userPointData,
      error: userPointError,
      isLoading: userPointIsLoading,
      isError: userPointIsError,
    },
  ] = useFetchUserPointsMutation();

  useEffect(() => {
    const getToken = async () => {
      const credentials = await Keychain.getGenericPassword();
      const token = credentials.username;
      setToken(token);

      const params = {
        userId: id,
        token: token,
      };
      console.log("jdkd", params);
      userPointFunc(params);
    };

    getToken();
  }, []);

  useEffect(() => {
    if (getNameData) {
      console.log("getUSerDetails", getNameData);
    } else {
      console.log("getNameError", getNameError);
    }
  }, [getNameData, getNameError]);

  useEffect(() => {
    if (userPointData) {
      console.log("userPointData", userPointData);
    } else if (userPointError) {
      console.log("userPointError", userPointError);
    }
  }, [userPointData, userPointError]);

  useEffect(() => {
    console.log("mobileData", mobile);
    if (mobile && mobile.length == 10) {
      const requestData = {
        mobile: mobile,
        orderIntent: "sell",
      };

      getNameFunc({ token, requestData });
    }
  }, [mobile]);

  return (
    <>
    <ScrollView style={styles.container}>
      <TopHeader title={t("Points transfer")} />
      <RewardBox />

      {/* Red Strip */}
      {/* <View
        style={{
          backgroundColor: "#B6202D",
          width: "95%",
          height: 60,
          alignSelf: "center",
          marginHorizontal: 20,
          flexDirection: "row",
          borderRadius: 10,
          marginTop: 10,
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
          <Text style={{ color: "white", fontSize: 22 }}>
            {(userPointData?.body?.transfer_points)}
          </Text>
        </View>
      </View> */}

      {/* Mobile Input  */}
      <View style={{ height: 120, marginTop: 10 }}>
        <PoppinsTextLeftMedium
          style={{
            marginLeft: 22,
            marginTop: 10,
            fontSize: 17,
            color: "black",
          }}
          content={t("Enter Mobile No (to transfer points)")}
        ></PoppinsTextLeftMedium>
        <TextInput
          onChangeText={setMobile}
          placeholder="9999999999"
          placeholderTextColor={"#808080"}
          maxLength={10}
          style={{
            height: 70,
            borderWidth: 1,
            borderColor: "#EBEBEB",
            marginTop: 20,
            marginHorizontal: 20,
            borderRadius: 10,
            fontSize: 20,
            color:'black',
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
      {getNameData?.body && (
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
              content={t("Name :")}
            ></PoppinsTextLeftMedium>
            <PoppinsTextLeftMedium
              style={{ color: "black", fontSize: 23 }}
              content={getNameData?.body?.name}
            ></PoppinsTextLeftMedium>
          </View>
          <View style={{ flexDirection: "row" }}>
            <PoppinsTextLeftMedium
              style={{ color: "black", fontSize: 23 }}
              content={t("ID :")}
            ></PoppinsTextLeftMedium>
            <PoppinsTextLeftMedium
              style={{ color: "black", fontSize: 23 }}
              content={getNameData?.body?.user_id}
            ></PoppinsTextLeftMedium>
          </View>

          <View style={{ flexDirection: "row" }}>
            <PoppinsTextLeftMedium
              style={{ color: "black", fontSize: 23 }}
              content={t("Type :")}
            ></PoppinsTextLeftMedium>
            <PoppinsTextLeftMedium
              style={{ color: "black", fontSize: 23 }}
              content={getNameData?.body?.user_type}
            ></PoppinsTextLeftMedium>
          </View>

          <View style={{ flexDirection: "row" }}>
            <PoppinsTextLeftMedium
              style={{ color: "black", fontSize: 23 }}
              content={t("State :")}
            ></PoppinsTextLeftMedium>
            <PoppinsTextLeftMedium
              style={{ color: "black", fontSize: 23 }}
              content={getNameData?.body?.state}
            ></PoppinsTextLeftMedium>
          </View>

          <View style={{ flexDirection: "row" }}>
            <PoppinsTextLeftMedium
              style={{ color: "black", fontSize: 23 }}
              content={t("City :")}
            ></PoppinsTextLeftMedium>
            <PoppinsTextLeftMedium
              style={{ color: "black", fontSize: 23 }}
              content={getNameData?.body?.city}
            ></PoppinsTextLeftMedium>
          </View>
        </View>
      )}

      {!getNameData?.body && (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            height: 300,
          }}
        >
          <PoppinsTextMedium
            style={{ color: "black", fontSize: 20 }}
            content={getNameError?.data?.message}
          ></PoppinsTextMedium>
        </View>
      )}

      {/* Button */}
      {getNameData?.body && (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("PointsTransferNext", {
              userDetails: getNameData?.body,
            });
          }}
          style={{
            backgroundColor: "black",
            marginHorizontal: 20,
            height: 65,
            marginTop: 30,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 10,
            marginBottom:10
          }}
        >
          <PoppinsTextLeftMedium
            style={{ color: "white", fontSize: 23, fontWeight: "bold" }}
            content={t("Next")}
          ></PoppinsTextLeftMedium>
        </TouchableOpacity>
      )}
    </ScrollView>
    <SocialBottomBar showRelative={true}></SocialBottomBar>
    </>
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
