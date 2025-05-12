import React from "react";
import {
  View,
  StyleSheet,
  Image,
  Platform,
  TouchableOpacity,
} from "react-native";
import PoppinsTextMedium from "../electrons/customFonts/PoppinsTextMedium";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
const DashboardSupportBox = (props) => {
  const navigation = useNavigation();
  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  )
  const image = props?.image;
  const backgroundColor = props?.backgroundColor;
  const title = props.title;
  const text = props?.text;
  const borderColor = props?.borderColor;
  const fontWeight = Platform.OS === "ios" ? "400" : "800";
  const fontSize = Platform.OS === "ios" ? 10 : 12;

  // console.log("text support",text)

  const handleNavigation = () => {
    if (text === "Feedback") {
      navigation.navigate("Feedback");
    } else if (text === "Rewards") {
      navigation.navigate("RedeemRewardHistory");
    } else if (text === "Customer Support") {
      navigation.navigate("HelpAndSupport");
    }
  };

  return (
    <TouchableOpacity
      onPress={() => {
        handleNavigation();
      }}
      style={{
        height: 50,
        width: 180,
        borderTopLeftRadius:30,
        borderBottomLeftRadius:30,
        borderTopRightRadius:30,
        borderBottomRightRadius:30,
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth:1,
        flexDirection: "row",
        alignItems: "center",

      }}
    >
      <View
        style={{
          height: 50,
          width: 50,
          borderRadius: 40,
          backgroundColor: "white",
          alignItems: "center",
          borderWidth:1,
          borderColor:ternaryThemeColor,
          justifyContent: "center",

        }}
      >
        <Image
          style={{ height: 30, width: 30, resizeMode: "contain" }}
          source={image}
        ></Image>
      </View>
      <PoppinsTextMedium
        style={{ fontSize: fontSize, fontWeight: fontWeight, color:ternaryThemeColor, marginLeft:10 }}
        content={title}
      ></PoppinsTextMedium>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({});

export default DashboardSupportBox;
