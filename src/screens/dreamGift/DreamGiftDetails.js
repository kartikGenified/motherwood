//import liraries
import { useNavigation } from "@react-navigation/native";
import React, { Component, useEffect, useState } from "react";
import { View, Text, StyleSheet, ImageBackground, Image, TouchableOpacity,ScrollView } from "react-native";
import { useSelector } from "react-redux";
import  ConfettiCannon from "react-native-confetti-cannon"
import { useAddDreamGiftMutation } from "../../apiServices/dreamGift/DreamGiftApi";
import { t } from "i18next";



// create a component
const DreamGiftDetails = (params) => {
  const [isTertiary, setIsTertiary] = useState()

  const[image,setImage] = useState(params.route.params.gift.gift.images[0])

  console.log("DreamGiftDetails: params",JSON.stringify(params.route.params.gift))

const navigation = useNavigation()
  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  );
  const userData = useSelector(state => state.appusersdata.userData)

  useEffect(()=>{
    if(userData.user_type.toLowerCase() == "contractor" ||
    userData.user_type.toLowerCase() == "carpenter" ||
    userData.user_type.toLowerCase() == "oem" ||
    userData.user_type.toLowerCase() == "directoem")
    {
      setIsTertiary(true)
    }
    else{
      setIsTertiary(false)
    }
    
  },[userData])

  const target = params.route.params.gift.target
  const current = params.route.params.gift.current
  let collect = Number(target)-Number(current)
  collect = collect > 0 ? collect : 0
  const giftItem = params.route.params.item;

  console.log("My gift Item", giftItem)




  const DottedBorder = () => {
    return (
      <View
        style={{
          borderWidth: 1,
          backgroundColor: "white",
          width: "80%",
          marginTop: 30,
          borderStyle: "dotted",
        }}
      >
        <View
          style={{
            marginTop: 10,
            height: 30,
            justifyContent: "space-between",
            marginHorizontal: 20,
            flexDirection: "row",
            marginBottom: 10,
          }}
        >
          <Text
            style={{
              textAlignVertical: "center",
              color: "black",
              fontWeight: "600",
            }}
          >
            You Currently Have
          </Text>

          <View
            style={{
              flexDirection: "row",
              backgroundColor: "#D5B60B",
              padding: 5,
              borderRadius: 20,
              paddingHorizontal: 10,
            }}
          >
            <Image
              style={{
                height: 20,
                width: 20,
                resizeMode: "contain",
                marginRight: 5,
              }}
              source={require("../../../assets/images/normalCoin.png")}
            ></Image>
            <Text style={{ color: "white" }}>{current}</Text>
          </View>
        </View>
        <View
          style={{
            borderWidth: 0.8,
            width: "90%",
            alignSelf: "center",
            borderColor: "#DDDDDD",
          }}
        ></View>

        <View
          style={{
            marginTop: 10,
            height: 30,
            justifyContent: "space-between",
            marginHorizontal: 20,
            flexDirection: "row",
            marginBottom: 10,
          }}
        >
          <Text
            style={{
              textAlignVertical: "center",
              color: "black",
              fontWeight: "600",
            }}
          >
            Your Dream Gift is just
          </Text>

          <View
            style={{
              flexDirection: "row",
              backgroundColor: "#D5B60B",
              padding: 5,
              borderRadius: 20,
              paddingHorizontal: 10,
            }}
          >
            <Image
              style={{
                height: 20,
                width: 20,
                resizeMode: "contain",
                marginRight: 5,
              }}
              source={require("../../../assets/images/normalCoin.png")}
            ></Image>
            <Text style={{ color: "white" }}>{target}</Text>
          </View>
        </View>
        <View
          style={{
            borderWidth: 0.8,
            width: "90%",
            alignSelf: "center",
            borderColor: "#DDDDDD",
          }}
        ></View>
        <View
          style={{
            height: 50,
            justifyContent: "center",
            marginLeft: 10,
            flexDirection: "row",
            flexWrap:'wrap',
            marginTop:10,
            marginBottom:10
          }}
        >
          <Text style={{ textAlignVertical: "center", color: "black",marginRight:10,fontWeight:'600', fontSize:16 }}>
            Collect
          </Text>
          <View
            style={{
              height: 30,
              alignItems: "center",
              backgroundColor: ternaryThemeColor,
              flexDirection: "row",
              paddingHorizontal: 10,
              borderRadius: 20,
            }}
          >
            <Image
              style={{
                height: 20,
                width: 20,
                resizeMode: "contain",
                marginRight: 5,
              }}
              source={require("../../../assets/images/normalCoin.png")}
            ></Image>
            <Text style={{ color: "white" }}>{collect}</Text>
            
          </View>
          <Text style={{ textAlignVertical: "center", color: "black",marginLeft:5,fontSize:16, fontWeight:'600' }}>in total and</Text>
          <Text style={{ textAlignVertical: "center", color: "black",marginLeft:5,fontSize:16, fontWeight:'600' }}>
            and make this gift Yours!
          </Text>
          
        </View>
      </View>
    );
  };
  return (
    <ImageBackground
      style={{flex:1}}
      resizeMode='cover'
      source={isTertiary ? require('../../../assets/images/transparentBackgroundBlue.png') : require('../../../assets/images/transparentBackgroundred.png')}
    >
      <ScrollView contentContainerStyle={{ alignItems: "center",marginTop:30 }}>
        <Image
          style={{
            marginLeft: 10,
            height: 100,
            width: "80%",
            resizeMode: "contain",
          }}
          source={require("../../../assets/images/congratulation.png")}
        ></Image>
        <Text style={{ color: "white", fontSize: 27, fontWeight: "500" }}>
          Your Dream Gift
        </Text>
        <Image
          style={{
            // marginLeft: 10,
            height: 40,
            marginTop: 15,
            width: 30,
            resizeMode: "contain",
          }}
          source={require("../../../assets/images/downArrow.png")}
        ></Image>
        <Text
          style={{
            color: "white",
            fontSize: 29,
            width:'60%',
            fontWeight: "bold",
            marginTop: 15,
            textAlign:'center',
            letterSpacing: 1.2,
          }}
        >
          {giftItem?.name}
        </Text>
        {image&& (
          <Image
            style={{
              // marginLeft: 10,
              height: 270,
              marginTop: 60,
              width: "80%",
              borderRadius:20,
              resizeMode: "contain",
            }}
          source={{uri:image}}
          ></Image>
        )}

        <DottedBorder></DottedBorder>
        <TouchableOpacity onPress={()=>{
            navigation.navigate("Dashboard")
        }} style={{alignItems:'center', justifyContent:'center',marginTop:40,marginBottom:100,backgroundColor:'#F0692B', width:150, height:60, borderRadius:5}}>
            <Text style={{color:'white', fontSize:15}}>OK</Text>
      </TouchableOpacity>

  
      </ScrollView>

      <ConfettiCannon
          fallSpeed={3500}
          explosionSpeed={100}
          autoStart={true}
          count={150}
          origin={{ x: -10, y: 0 }}
        />
     
    </ImageBackground>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

//make this component available to the app
export default DreamGiftDetails;
