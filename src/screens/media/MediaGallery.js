//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import TopHeader from '../../components/topBar/TopHeader';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

// create a component
const MediaGallery = () => {
    const navigation = useNavigation()
    const galleryArr = [
        {
        title:"Video Gallery",
        image: require("../../../assets/images/video_gallery.png"),
        navigateTo:"VideoGallery"
    },

    {
        title:"Photo Gallery",
        image: require("../../../assets/images/photo_gallery.png"),
        navigateTo:"ImageGallery"
    },
    {
        title:"E-Catalue",
        image: require("../../../assets/images/eCatalogue.png"),
        navigateTo:"ProductCatalogue"
    },
    {
        title:"What's New",
        image: require("../../../assets/images/whatsNew.png"),
        navigateTo:"WhatsNew"
    },
    

]

    const ternaryThemeColor = useSelector(
        (state) => state.apptheme.ternaryThemeColor
      );

    return (
        <View style={styles.container}>
        <TopHeader title={"Media Gallery"}></TopHeader>
        
        <FlatList
        data={galleryArr}
        key={(item)=>{item.title}}
        numColumns={2}
        renderItem={({item})=>{
            return(
                <TouchableOpacity onPress={()=>{
                    navigation.navigate(item.navigateTo)
                }} style={{ borderWidth:1, borderRadius:10,height:160, width:160,borderColor:ternaryThemeColor,alignItems:'center',justifyContent:'center',marginHorizontal:20, marginVertical:20}}>
                <Image style={{width:80,resizeMode:'contain', marginBottom:30}} source={item.image}></Image>
                <View style={{backgroundColor:ternaryThemeColor,position:'absolute',bottom:0,width:'100%',height:40,alignItems:'center', justifyContent:'center',borderBottomRightRadius:10, borderBottomLeftRadius:10}}>
                <PoppinsTextMedium style={{color:'white',fontSize:18}} content={item.title}></PoppinsTextMedium>

                </View>
                </TouchableOpacity>
            )
        }}/>

        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems:'center',
    },
});

//make this component available to the app
export default MediaGallery;
