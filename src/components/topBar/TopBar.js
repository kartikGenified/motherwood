//import liraries
import React, { Component } from "react";
import { Image } from "react-native";
import { TouchableOpacity } from "react-native";
import { View, Text, StyleSheet } from "react-native";
import PoppinsText from "../electrons/customFonts/PoppinsText";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import PoppinsTextLeftMedium from "../electrons/customFonts/PoppinsTextLeftMedium";

// create a component
const TopBar = (params) => {
  const navigationParams = params.route?.params?.navigationParams;
  const navigateTo = params.navigateTo
  const { t } = useTranslation();
  const navigation = useNavigation();
  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  );
  console.log("NavigateTo", navigateTo)
  return (
    <View
      style={{
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: ternaryThemeColor,
      }}
    >
      <View
        style={{
          height: 120,
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: ternaryThemeColor,
          flexDirection: "row",
        }}
      >
        <TouchableOpacity
          style={{
            height: 50,
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            left: 30,
            top: 38,
          }}
          onPress={() => {
            navigateTo ? navigation.navigate(navigateTo) : navigation.goBack();
          }}
        >
          <Image
            style={{ height: 30, width: 30, resizeMode: "contain" }}
            source={require("../../../assets/images/backIcon.png")}
          ></Image>
        </TouchableOpacity>

        {params?.icon && (
          <Image
            style={{
              height: 250,
              width: 250,
              resizeMode: "contain",
              position: "absolute",
            }}
            source={require("../../../assets/images/Logo.png")}
          ></Image>
        )}
        <View style={{ position: "absolute", left: 80,width:270 }}>
          <PoppinsTextLeftMedium
            style={{ color: "#FFFFFF", fontSize: 28, ...params?.fontStyle} }
            content={`${params?.title}`}
          ></PoppinsTextLeftMedium>
        </View>
      </View>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

//make this component available to the app
export default TopBar;
