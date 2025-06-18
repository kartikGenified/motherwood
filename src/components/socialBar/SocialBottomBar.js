//import liraries
import { Link } from "@react-navigation/native";
import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Linking, KeyboardAvoidingView } from "react-native";
import { useSelector } from "react-redux";

// create a component
const SocialBottomBar = ({ showRelative ,backgroundColor}) => {
      const socials = useSelector(
          state => state.apptheme.socials,
      );
  
      const website = useSelector(
          state => state.apptheme.website,
      );

        const supportMail = useSelector(
          (state) => state.apptheme.customerSupportMail
        );

        const supportMobile = useSelector(
          (state) => state.apptheme.customerSupportMobile
        );

      console.log("socials", socials, website)
  return (
    <KeyboardAvoidingView style={{width: "100%",position: showRelative == true ? "relative" : "absolute",bottom: 0,}}>
    <View
      style={{
        
        width: "100%",
        
        height: 50,
        borderTopColor: "#B6202D",
        borderTopWidth: 1,
        backgroundColor:backgroundColor ? backgroundColor : "",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        marginTop: 10,
      }}
    >
      <TouchableOpacity
        onPress={() => {Linking.openURL(socials.facebook)}}
        style={{ flexDirection: "row", marginLeft: 10, marginTop: 5 }}
      >
        <Image
          style={{
            height: 17,
            width: 17,
            resizeMode: "contain",
          }}
          source={require("../../../assets/images/facebook.png")}
        ></Image>

        <View
          style={{
            borderRightWidth: 1,
            borderRightColor: "#B9B9B9",
            marginLeft: 10,
            height: 20,
          }}
        ></View>
      </TouchableOpacity>

      <TouchableOpacity
      onPress={()=>{
        Linking.openURL(socials.instagram)
      }}
        style={{ flexDirection: "row", marginLeft: 10, marginTop: 5 }}
      >
        <Image
          style={{
            height: 17,
            width: 17,
            resizeMode: "contain",
          }}
          source={require("../../../assets/images/instagram.png")}
        ></Image>

        <View
          style={{
            borderRightWidth: 1,
            borderRightColor: "#B9B9B9",
            marginLeft: 10,
            height: 20,
          }}
        ></View>
      </TouchableOpacity>
      <TouchableOpacity
      onPress={()=>{
        Linking.openURL(socials.youtube)
      }}
        style={{ flexDirection: "row", marginLeft: 10, marginTop: 5 }}
      >
        <Image
          style={{
            height: 17,
            width: 17,
            resizeMode: "contain",
          }}
          source={require("../../../assets/images/youtube.png")}
        ></Image>

        <View
          style={{
            borderRightWidth: 1,
            borderRightColor: "#B9B9B9",
            marginLeft: 10,
            height: 20,
          }}
        ></View>
      </TouchableOpacity>
      <TouchableOpacity
      onPress={()=>{
        socials?.linkedin
      }}
        style={{ flexDirection: "row", marginLeft: 10, marginTop: 5 }}
      >
        <Image
          style={{
            height: 17,
            width: 17,
            resizeMode: "contain",
          }}
          source={require("../../../assets/images/linkedin.png")}
        ></Image>

        <View
          style={{
            borderRightWidth: 1,
            borderRightColor: "#B9B9B9",
            marginLeft: 10,
            height: 20,
          }}
        ></View>
      </TouchableOpacity>
      <TouchableOpacity
      onPress={()=>{ Linking.openURL(`tel:${supportMobile}`)}}
        style={{ flexDirection: "row", marginLeft: 10, marginTop: 5 }}
      >
        <Image
          style={{
            height: 17,
            width: 17,
            resizeMode: "contain",
          }}
          source={require("../../../assets/images/phone.png")}
        ></Image>

        <View
          style={{
            borderRightWidth: 1,
            borderRightColor: "#B9B9B9",
            marginLeft: 10,
            height: 20,
          }}
        ></View>
      </TouchableOpacity>
      <TouchableOpacity
      onPress={()=>{
        Linking.openURL(`mailto:${supportMail}`)
      }}
        style={{ flexDirection: "row", marginLeft: 10, marginTop: 5 }}
      >
        <Image
          style={{
            height: 17,
            width: 17,
            resizeMode: "cover",
          }}
          source={require("../../../assets/images/help.png")}
        ></Image>

        <View
          style={{
            borderRightWidth: 1,
            borderRightColor: "#B9B9B9",
            marginLeft: 10,
            height: 20,
          }}
        ></View>
      </TouchableOpacity>
    </View>
    </KeyboardAvoidingView>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2c3e50",
  },
});

//make this component available to the app
export default SocialBottomBar;
