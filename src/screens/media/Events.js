//import liraries
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

// create a component
const Events = ({navigation}) => {
  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  );
  const secondaryThemeColor = useSelector(
    (state) => state.apptheme.secondaryThemeColor
  );

  const { t } = useTranslation();

  const [getMediafunc, {
    data: getMediaData,
    error: getMediaError,
    isError: mediaIsError,
    isLoading: mediaIsLoading
}] = useGetAllMediaMutation()

useEffect(()=>{
    fetchMediaData()
},[])
useEffect(() => {
    if (getMediaData) {
        console.log("getMediaData", getMediaData);
    }
    else {
        console.log("getMediaError", getMediaError)
    }

}, [getMediaData, getMediaError])

const fetchMediaData = async () => {
    const credentials = await Keychain.getGenericPassword();
    let obj = {
        token: credentials.username,
        isAll: true,
        type:'Event'
    }
    getMediafunc(obj)
}

  const EventComp = (props) => {
    const image = props.data.images[0]
    const desc = props.data.description
    const title = props.data.title
    const width = Dimensions.get('window').width

    console.log("event comp ", props.data, image)
    return (
      <View
        style={{
          height: 220,
          width: width-24,
          alignItems: "center",
          justifyContent: "center",
          borderRadius:26,
          margin:20,
          borderWidth:0.8,
          borderColor:'#DDDDDD'

        }}
      >
        <Image
          style={{ height: 150, width: 220, resizeMode: 'stretch' }}
          source={{uri:image}}
        ></Image>

        <View style={{height:2,width:'100%',backgroundColor:'white'}}></View>
        <View style={{alignItems:'center', justifyContent:'flex-start',height:'30%',width:'100%',backgroundColor:ternaryThemeColor,flexDirection:'row',borderBottomRightRadius:25,borderBottomLeftRadius:25}}>
        <PoppinsTextLeftMedium style={{ color: 'white', fontWeight: '600',width:'60%',marginLeft:20 }} content={`${title}`}></PoppinsTextLeftMedium>
        {/* <TouchableOpacity style={{alignItems:'center', justifyContent:'center', height:24,width:100,borderRadius:20, backgroundColor:'white'}}>
        <PoppinsTextLeftMedium style={{ color: 'black', fontWeight: '600' }} content={"View Details"}></PoppinsTextLeftMedium>
        </TouchableOpacity> */}
        
        </View>
        <View style={{alignItems:'center', justifyContent:'center',position:'absolute',top:0,left:18 ,backgroundColor:'white',height:30,width:100,borderBottomLeftRadius:30,borderBottomRightRadius:30 }}>
        <PoppinsTextLeftMedium style={{ color: 'black', fontWeight: '600',width:'60%',fontSize:9 }} content={`${desc}`}></PoppinsTextLeftMedium>
        </View>
      </View>
    );
  };

  return (
    <View>
      <View
        style={{
          height: 70,
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
          content={t("Events")}
        ></PoppinsTextMedium>
      </View>

      {getMediaData && <FlatList
              initialNumToRender={20}
              contentContainerStyle={{alignItems:"center",justifyContent:"center"}}
              style={{width:'100%',}}
                data={getMediaData?.body}
                renderItem={({ item, index }) => (
                 <EventComp data = {item}></EventComp>
                )}
                keyExtractor={(item,index) => index}
              />}
      
    </View>
  );
};

const styles = StyleSheet.create({});

export default Events;
