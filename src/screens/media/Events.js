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
import SocialBottomBar from "../../components/socialBar/SocialBottomBar";
import EventModal from "./EventModal";

// create a component
const Events = ({navigation}) => {
  const [selected, setSelected] = useState("current")
  const [data, setData] = useState()
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState()
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
    const now = new Date().getTime();
    console.log("getMediaData", getMediaData);

    const filteredData = getMediaData?.body.filter((item) => {
      const startDate = item.start_date ? new Date(item.start_date).getTime() : null;
      const endDate = item.end_date ? new Date(item.end_date).getTime() : null;

      if (selected === "current") {
        // Only show if both dates exist and now is between them
        return startDate !== null && endDate !== null && startDate <= now 
      } else {
        // Show if start_date is in future OR both dates are null/undefined
        return (startDate !== null && startDate > now) ||
               (startDate === null && endDate === null);
      }
    });

    // Optional: sort by start_date (nulls go last)
    const sortedData = filteredData.sort((a, b) => {
      const aTime = a.start_date ? new Date(a.start_date).getTime() : Infinity;
      const bTime = b.start_date ? new Date(b.start_date).getTime() : Infinity;
      return aTime - bTime;
    });

    setData(sortedData);
  } else {
    console.log("getMediaError", getMediaError);
  }
}, [getMediaData, getMediaError, selected]);


console.log("selected events selected", data, selected)

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

    return (
      <TouchableOpacity
        onPress={()=>{
          setSelectedEvent(props.data)
          setModalVisible(true)
        }}
        style={{
          height: 160,
          alignItems: "center",
          justifyContent: "center",
          borderRadius:26,
          borderWidth:0.8,
          borderColor:'#DDDDDD',
          width:Dimensions.get('window').width-40,
          marginBottom:10,
          marginTop:10
        }}
      >
        <View style={{borderTopLeftRadius:26,borderTopRightRadius:26, height: '69%', width: '100%'}}>
        <Image
          style={{height:'100%', width:'100%', resizeMode: 'stretch' }}
          source={{uri:image}}
        ></Image>
        </View>
        

        <View style={{height:2,width:'100%',backgroundColor:'white'}}></View>
        <View style={{alignItems:'center', justifyContent:'flex-start',height:'30%',width:'100%',backgroundColor:ternaryThemeColor,flexDirection:'row',borderBottomRightRadius:25,borderBottomLeftRadius:25}}>
        <PoppinsTextLeftMedium style={{ color: 'white', fontWeight: '600',width:'60%',marginLeft:20 }} content={`${title}`}></PoppinsTextLeftMedium>
        {/* <TouchableOpacity style={{alignItems:'center', justifyContent:'center', height:24,width:100,borderRadius:20, backgroundColor:'white'}}>
        <PoppinsTextLeftMedium style={{ color: 'black', fontWeight: '600' }} content={"View Details"}></PoppinsTextLeftMedium>
        </TouchableOpacity> */}
        
        </View>
        <View style={{alignItems:'center', justifyContent:'center',backgroundColor:'white',height:30,width:90,borderBottomLeftRadius:30,borderBottomRightRadius:30,position:'absolute', top:0, left:18 }}>
        <PoppinsTextLeftMedium style={{ color: 'black', fontWeight: '700',fontSize:9 }} content={`${desc}`}></PoppinsTextLeftMedium>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{width:'100%',height:'100%'}}>
      <View
        style={{
          height: '10%',
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
      <View style={{width:'100%',alignItems:'center', justifyContent:'center',flexDirection:"row",height:'10%'}}>
          <TouchableOpacity onPress={()=>{
            setSelected("current")
          }} style={{width:'49%',alignItems:'center', justifyContent:'center',height:40,borderBottomWidth:selected == "current" ? 2 : 0, borderColor:selected == "current" ? ternaryThemeColor : ""}}>
            <PoppinsTextLeftMedium content={t("Events")} style={{color:"black",fontSize:16, fontWeight:'600'}}></PoppinsTextLeftMedium>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{
            setSelected("upcoming")
          }} style={{width:'49%',alignItems:'center', justifyContent:'center',height:40,borderBottomWidth:selected == "upcoming" ? 2 : 0, borderColor:selected == "upcoming" ? ternaryThemeColor : ""}}>
            <PoppinsTextLeftMedium content={t("Upcoming Events")} style={{color:"black",fontSize:16, fontWeight:'600'}}></PoppinsTextLeftMedium>
          </TouchableOpacity>
      </View>

        <View style={{width:'100%',marginTop:0}}>
      {data && <FlatList
              initialNumToRender={20}
              contentContainerStyle={{alignItems:'center', justifyContent:'center'}}
              style={{width:'100%',height:'70%'}}
                data={data}
                renderItem={({ item, index }) => (
                 <EventComp data = {item}></EventComp>
                )}
                keyExtractor={(item,index) => index}
              />}
      </View>
      {data && <SocialBottomBar showRelative={true}></SocialBottomBar>}
      <EventModal modalVisible={modalVisible} setModalVisible={setModalVisible} selectedEvent={selectedEvent} />
    </View>
  );
};

const styles = StyleSheet.create({});

export default Events;
