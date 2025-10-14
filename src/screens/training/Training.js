import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ScrollView, Dimensions, Linking, Text, LogBox } from 'react-native';
import { useSelector } from 'react-redux';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import { useGetAppVideoMutation } from '../../apiServices/video/VideoApi';
import * as Keychain from 'react-native-keychain';
import Logo from 'react-native-vector-icons/AntDesign'
import moment from 'moment';
import FastImage from 'react-native-fast-image';
import DataNotFound from '../data not found/DataNotFound';
import { useTranslation } from 'react-i18next';
import PoppinsTextLeftMedium from '../../components/electrons/customFonts/PoppinsTextLeftMedium';
import TopHeader from '../../components/topBar/TopHeader';
import { useGetAllMediaMutation } from '../../apiServices/mediaApi/GetMediaApi';

const Training = ({ navigation }) => {
  const [videoData, setVideoData] = useState([])
  const ternaryThemeColor = useSelector(
    state => state.apptheme.ternaryThemeColor,
  )
    ? useSelector(state => state.apptheme.ternaryThemeColor)
    : 'grey';
  const {t} = useTranslation()
  const height = Dimensions.get('window').height

  const gifUri = Image.resolveAssetSource(require('../../../assets/assets/gif/loader.gif')).uri;


  const [getCategoryMediafunc, {
    data: getCatMediaData,
    error: getCatMediaError,
    isError: catMediaIsError,
    isLoading: catMediaIsLoading
}] = useGetAllMediaMutation()


  

  useEffect(() => {
    fetchCategoryMedia("training video");
}, [])

  const fetchCategoryMedia = async (item) => {
    const credentials = await Keychain.getGenericPassword();
    let obj = {
        token: credentials.username,
        isAll: false,
        type: item
    }
    // getMediafunc(obj)
    getCategoryMediafunc(obj)
}

  useEffect(() => {
    if (getCatMediaData) {
        console.log("getCatMediaData", getCatMediaData);
        alert(getCatMediaData)
        if(getCatMediaData.success && getCatMediaData.body.length!==0)
        {
            setVideoData(getCatMediaData.body)
        }
        else{
            setVideoData([])
        }
       

    }
    else if(getCatMediaError) {
        console.log("getCatMediaError", getCatMediaError)
    }

}, [getCatMediaData, getCatMediaError])


  

  const VideoComp = (props) => {
    const video = props.video
    const title = props.title
    const type = props.type
    const date = props.date

    const extractVideoId = (url) => {
      const match = url.match(
        /(?:youtu\.be\/|youtube\.com\/(?:.*v=|embed\/|v\/))([^?&]+)/ 
      );
      return match ? match[1] : null;
    };
  
    const videoId = extractVideoId(video);
    const thumbnailUrl = videoId 
      ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` 
      : require("../../../assets/images/youtube.png"); // Fallback image

      
    return (
      <TouchableOpacity onPress={() => { Linking.openURL(video) }} style={{ height: 400, width: '90%', borderRadius: 10, backgroundColor: 'white',  marginTop:20}}>
        <View style={{ width: '100%', backgroundColor: "white", alignItems: "center", justifyContent: 'center', height: '50%' }}>

        <Image style={{position:'absolute', height:80,width:80,zIndex:1}} source={require('../../../assets/images/playButton.png')}></Image>

        <Image style={{ height: "100%", width: "100%", borderTopLeftRadius: 10, borderTopRightRadius: 10 }} 
          source={{ uri: thumbnailUrl }} />

        </View>

        <View style={{ backgroundColor: 'white', width: '100%', justifyContent: "center",padding:4, flexWrap:'wrap', borderBottomLeftRadius:10,borderBottomRightRadius:10,shadowColor:'black', shadowOffset:{height:100,width:100},elevation:5 }}>
          <View style={{ marginBottom:10,width:'100%',alignItems:'center', }}>
          <PoppinsTextMedium style={{ color: 'black', fontSize: 24, marginLeft: 8, marginTop:5,width:250 }} content={`${title}`}></PoppinsTextMedium>

          </View>
        </View>

      </TouchableOpacity>
    )
  }

  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        backgroundColor: ternaryThemeColor,
        height: '100%',
      }}>
      <TopHeader title={"Corporate Film"}></TopHeader>
      <ScrollView contentContainerStyle={{height:'100%'}} style={{ width: '100%', height: '100%' }}>


        <View
          style={{
            // borderTopRightRadius: 30,
            // borderTopLeftRadius: 30,
            backgroundColor: 'white',
            // minHeight: 650,
            flex:1,
            flexDirection: "row",
            flexWrap: 'wrap',
            justifyContent:'center'

          }}>

          {/* {appVideoIsLoading ?
            <FastImage
              style={{ width: 100, height: 100, alignSelf: 'center', marginTop: '50%' }}
              source={{
                uri: gifUri, // Update the path to your GIF
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.contain}
            /> :
            appVideoData?.body?.length===0 && <DataNotFound></DataNotFound>
          } */}

          {
            videoData != undefined && videoData.length > 0 && videoData.map((item, index) => {
              return (

                  <VideoComp key={item.id} title={item.title} type={item.type} video={item.link} date={item.updated_at}></VideoComp> 
                  

                
              )
            })
             
            
          }




        </View>
      </ScrollView>
    </View>

  );
}


export default Training;