//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

// create a component
const SocialBottomBar = ({showRelative}) => {
    return (
        <View
        style={{
          position: showRelative ? "relative" : "absolute",
          width: "100%",
          bottom: 0,
          height: 50,
          borderTopColor: "#B6202D",
          borderTopWidth: 1,
          alignItems: "center",
          justifyContent:'center',
          flexDirection: "row",
          marginTop:10
        }}
      >
        <TouchableOpacity onPress={()=>{}} style={{ flexDirection: "row", marginLeft: 20,marginTop:5 }}>
          <Image
            style={{
              height: 20,
              width: 20,
              resizeMode: "cover",
            }}
            source={require("../../../assets/images/facebook.png")}
          ></Image>

          <View
            style={{ borderRightWidth: 1, borderRightColor: "#B9B9B9" ,marginLeft:10,height:20, }}
          ></View>
        </TouchableOpacity>

        <TouchableOpacity style={{ flexDirection: "row", marginLeft: 20,marginTop:5 }}>
          <Image
            style={{
              height: 20,
              width: 20,
              resizeMode: "cover",
            }}
            source={require("../../../assets/images/instagram.png")}
          ></Image>

          <View
            style={{ borderRightWidth: 1, borderRightColor: "#B9B9B9" ,marginLeft:10,height:20, }}
          ></View>
        </TouchableOpacity>
        <TouchableOpacity style={{ flexDirection: "row", marginLeft: 20,marginTop:5 }}>
          <Image
            style={{
              height: 20,
              width: 20,
              resizeMode: "cover",
            }}
            source={require("../../../assets/images/youtube.png")}
          ></Image>

          <View
            style={{ borderRightWidth: 1, borderRightColor: "#B9B9B9" ,marginLeft:10,height:20, }}
          ></View>
        </TouchableOpacity>
        <TouchableOpacity style={{ flexDirection: "row", marginLeft: 20,marginTop:5 }}>
          <Image
            style={{
              height: 20,
              width: 20,
              resizeMode: "cover",
            }}
            source={require("../../../assets/images/linkedin.png")}
          ></Image>

          <View
            style={{ borderRightWidth: 1, borderRightColor: "#B9B9B9" ,marginLeft:10,height:20, }}
          ></View>
        </TouchableOpacity>
        <TouchableOpacity style={{ flexDirection: "row", marginLeft: 20,marginTop:5 }}>
          <Image
            style={{
              height: 20,
              width: 20,
              resizeMode: "cover",
            }}
            source={require("../../../assets/images/phone.png")}
          ></Image>

          <View
            style={{ borderRightWidth: 1, borderRightColor: "#B9B9B9" ,marginLeft:10,height:20, }}
          ></View>
        </TouchableOpacity>
        <TouchableOpacity style={{ flexDirection: "row", marginLeft: 20,marginTop:5 }}>
          <Image
            style={{
              height: 20,
              width: 20,
              resizeMode: "cover",
            }}
            source={require("../../../assets/images/help.png")}
          ></Image>

          <View
            style={{ borderRightWidth: 1, borderRightColor: "#B9B9B9" ,marginLeft:10,height:20, }}
          ></View>
        </TouchableOpacity>
      </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
});

//make this component available to the app
export default SocialBottomBar;
