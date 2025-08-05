import React, { Component, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Touchable,
  Dimensions,
} from "react-native";
import { useGetAllMediaMutation } from "../../apiServices/mediaApi/GetMediaApi";
import * as Keychain from "react-native-keychain";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import { useSelector } from "react-redux";
import PoppinsTextLeftMedium from "../../components/electrons/customFonts/PoppinsTextLeftMedium";
import FastImage from "react-native-fast-image";
import DataNotFound from "../data not found/DataNotFound";
import { useTranslation } from "react-i18next";
import SocialBottomBar from "../../components/socialBar/SocialBottomBar";
import { useGetUserBirthdayApiMutation } from "../../apiServices/birthday/birthdayApi";
import dayjs from "dayjs";

const BirthdayScreen = ({navigation}) => {
  const [selected, setSelected] = useState("today");
  const [data, setData] = useState();
  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  );
  const secondaryThemeColor = useSelector(
    (state) => state.apptheme.secondaryThemeColor
  );
  const { t } = useTranslation();

  const [
    getBirthdayFunc,
    {
      data: getBirthdayData,
      error: getBirthdayError,
      isLoading: getBirthdayIsLoading,
      isError: getBirthdayIsError,
    },
  ] = useGetUserBirthdayApiMutation();

  useEffect(() => {
    const getToken = async () => {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        console.log(
          "Credentials successfully loaded for user " + credentials.username
        );
        const token = credentials.username;
        const currentDate = new Date();
        const formatedDate = dayjs(currentDate).format("YYYY-MM-DD");
        const params = {
          data: {date:formatedDate},
          token: token,
        };
        getBirthdayFunc(params);
      }
    };
    getToken();
  }, []);

  const getBirthdayDataFromApi = async (date) => {
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      console.log(
        "Credentials successfully loaded for user " + credentials.username
      );
      const token = credentials.username;
      const currentDate = new Date();
      const params = {
        data: {date:date},
        token: token,
      };
      getBirthdayFunc(params);
    }
  };
  

  useEffect(() => {
    if (getBirthdayData) {
      console.log("getBirthdayData", JSON.stringify(getBirthdayData));
      setData(getBirthdayData?.body?.users)
    } else if (getBirthdayError) {
      console.log("getBirthdayError", getBirthdayError);
    }
  }, [getBirthdayData, getBirthdayError]);

  function getFormattedDate(relativeDay) {
    const today = dayjs();
  
    switch (relativeDay.toLowerCase()) {
      case 'yesterday':
        return today.subtract(1, 'day').format('YYYY-MM-DD');
      case 'today':
        return today.format('YYYY-MM-DD');
      case 'tomorrow':
        return today.add(1, 'day').format('YYYY-MM-DD');
      default:
        throw new Error('Invalid input. Expected "yesterday", "today", or "tomorrow".');
    }
  }
  const handleDatafetch=(date)=>{
    console.log("date selected in the birthday page", date)
    getBirthdayDataFromApi(date)
  }

  const BirthdayComp = (props) => {
    const name = props.data.name;
    const email = props.data.email;
    const mobile = props.data.mobile
    const userType = props.data.user_type
    const status = props.data.extra_status.approved

    console.log("birthday comp ", props.data);
    return (
      <View
        style={{
          height: 150,
          alignItems: "center",
          justifyContent: "flex-start",
          borderRadius: 26,
          borderWidth: 0.8,
          borderColor: "#DDDDDD",
          width: Dimensions.get("window").width - 40,
          marginBottom: 10,
          marginTop: 10,
          backgroundColor:'white'
        }}
      >

        
        <View
          style={{
            alignItems: "center",
            justifyContent: "flex-start",
            height: "30%",
            width: "100%",
            backgroundColor: ternaryThemeColor,
            flexDirection: "row",
           
          }}
        >
          <PoppinsTextLeftMedium
            style={{
              color: "white",
              fontWeight: "600",
              width: "60%",
              marginLeft: 20,
            }}
            content={`Name - ${name}`}
          ></PoppinsTextLeftMedium>
          {/* <TouchableOpacity style={{alignItems:'center', justifyContent:'center', height:24,width:100,borderRadius:20, backgroundColor:'white'}}>
            <PoppinsTextLeftMedium style={{ color: 'black', fontWeight: '600' }} content={"View Details"}></PoppinsTextLeftMedium>
            </TouchableOpacity> */}
        </View>
        <View
          style={{
            alignItems: "flex-start",
            justifyContent: "center",
            backgroundColor: "white",
            width: '88%',
            
          }}
        >
          <PoppinsTextLeftMedium
            style={{ color: "black", fontWeight: "700", fontSize: 14,marginTop:10 }}
            content={`Email - ${email}`}
          ></PoppinsTextLeftMedium>
          <PoppinsTextLeftMedium
            style={{ color: "black", fontWeight: "700", fontSize: 14,marginTop:4 }}
            content={`Mobile - ${mobile}`}
          ></PoppinsTextLeftMedium>
          <PoppinsTextLeftMedium
            style={{ color: "black", fontWeight: "700", fontSize: 14,marginTop:4 }}
            content={`User Type - ${userType}`}
          ></PoppinsTextLeftMedium>
           <PoppinsTextLeftMedium
            style={{ color: "black", fontWeight: "700", fontSize: 14,marginTop:4 }}
            content={`User Approval Status - ${status ? "Approved" : "Pending/Rejected"}`}
          ></PoppinsTextLeftMedium>
        </View>
        
      </View>
    );
  };
  return (
    <View style={{ width: "100%", height: "100%" }}>
      <View
        style={{
          height: "10%",
          width: "100%",
          backgroundColor: secondaryThemeColor,
          alignItems: "flex-start",
          justifyContent: "center",
          flexDirection: "row",
          // marginTop: 10,
        }}
      >
        <TouchableOpacity
          style={{
            height: 20,
            width: 20,
            position: "absolute",
            left: 20,
            marginTop: 20,
          }}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Image
            style={{ height: 20, width: 20, resizeMode: "contain" }}
            source={require("../../../assets/images/blackBack.png")}
          ></Image>
        </TouchableOpacity>

        <PoppinsTextMedium
          style={{
            fontSize: 20,
            color: "black",
            marginTop: 15,
            position: "absolute",
            left: 60,
          }}
          content={t("Birthday Status")}
        ></PoppinsTextMedium>
      </View>
      <View
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          height: "10%",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            setSelected("yesterday");
            handleDatafetch(getFormattedDate("yesterday"))
          }}
          style={{
            width: "32%",
            alignItems: "center",
            justifyContent: "center",
            height: 40,
            borderBottomWidth: selected == "yesterday" ? 2 : 0,
            borderColor: selected == "yesterday" ? ternaryThemeColor : "",
          }}
        >
          <PoppinsTextLeftMedium
            content="Yesterday"
            style={{ color: "black", fontSize: 16, fontWeight: "600" }}
          ></PoppinsTextLeftMedium>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setSelected("today");
            handleDatafetch(getFormattedDate("today"))

          }}
          style={{
            width: "32%",
            alignItems: "center",
            justifyContent: "center",
            height: 40,
            borderBottomWidth: selected == "today" ? 2 : 0,
            borderColor: selected == "today" ? ternaryThemeColor : "",
          }}
        >
          <PoppinsTextLeftMedium
            content="Today"
            style={{ color: "black", fontSize: 16, fontWeight: "600" }}
          ></PoppinsTextLeftMedium>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setSelected("tomorrow");
            handleDatafetch(getFormattedDate("tomorrow"))
            
          }}
          style={{
            width: "32%",
            alignItems: "center",
            justifyContent: "center",
            height: 40,
            borderBottomWidth: selected == "tomorrow" ? 2 : 0,
            borderColor: selected == "tomorrow" ? ternaryThemeColor : "",
          }}
        >
          <PoppinsTextLeftMedium
            content="Tomorrow"
            style={{ color: "black", fontSize: 16, fontWeight: "600" }}
          ></PoppinsTextLeftMedium>
        </TouchableOpacity>
        
      </View>

      <View style={{ width: "100%", marginTop: 0 }}>
        {data && (
          <FlatList
            initialNumToRender={20}
            contentContainerStyle={{
              alignItems: "center",
              justifyContent: "center",
            }}
            style={{ width: "100%", height: "70%" }}
            data={data}
            renderItem={({ item, index }) => (
              <BirthdayComp data={item}></BirthdayComp>
            )}
            keyExtractor={(item, index) => index}
          />
        )}
      </View>
      {data && <SocialBottomBar showRelative={true}></SocialBottomBar>}
    </View>
  );
};

const styles = StyleSheet.create({});

export default BirthdayScreen;
