import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ScrollView, Dimensions, Linking, Text } from 'react-native';
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
import SocialBottomBar from '../../components/socialBar/SocialBottomBar';

const VideoGallery = ({ navigation }) => {
  const [videoData, setVideoData] = useState([])
  const ternaryThemeColor = useSelector(
    state => state.apptheme.ternaryThemeColor,
  )
    ? useSelector(state => state.apptheme.ternaryThemeColor)
    : 'grey';
  const {t} = useTranslation()
  const height = Dimensions.get('window').height

  const gifUri = Image.resolveAssetSource(require('../../../assets/assets/gif/loader.gif')).uri;


  const [appVideoFunc, {
    data: appVideoData,
    error: appVideoError,
    isLoading: appVideoIsLoading,
    isError: appVideoIsError
  }] = useGetAppVideoMutation()

  useEffect(() => {
    const getToken = async () => {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        console.log(
          'Credentials successfully loaded for user ' + credentials.username
        );
        const token = credentials.username
        let parmas = {
          token: token,
        }
        appVideoFunc(parmas)
      }
    }
    getToken()


  }, [])

  useEffect(() => {
    if (appVideoData) {
      console.log("appVideoData", appVideoData)
      setVideoData(appVideoData.body)
    }
    else if (appVideoError) {
      console.log("appVideoError", appVideoError)
    }
  }, [appVideoData, appVideoError])



  

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
        backgroundColor: "white",
        height: '100%',
      }}>
      <TopHeader title={"Corporate Film"}></TopHeader>
      <ScrollView contentContainerStyle={{}} style={{ width: '100%',minHeight:'80%'}}>
        <View
          style={{
            // borderTopRightRadius: 30,
            // borderTopLeftRadius: 30,
            backgroundColor: 'white',
            // minHeight: 650,
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
      <View style={{height:'10%',width:'100%'}}>
        <SocialBottomBar></SocialBottomBar>
      </View>
    </View>

  );
}


export default VideoGallery;