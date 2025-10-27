//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import TopHeader from '../../components/topBar/TopHeader';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

// create a component
const MediaGallery = () => {
    const { t } = useTranslation();
    const navigation = useNavigation()
    const galleryArr = [
        {
        title: t("Video Gallery"),
        image: require("../../../assets/images/video_gallery.png"),
        navigateTo:"VideoGallery"
    },

    {
        title: t("Photo Gallery"),
        image: require("../../../assets/images/photo_gallery.png"),
        navigateTo:"ImageGallery"
    },
    {
        title: t("E-Catalogues"),
        image: require("../../../assets/images/eCatalogue.png"),
        navigateTo:"ProductCatalogue"
    },
    {
        title: t("What's New"),
        image: require("../../../assets/images/whatsNew.png"),
        navigateTo:"WhatsNew"
    },
    

]

    const ternaryThemeColor = useSelector(
        (state) => state.apptheme.ternaryThemeColor
      );

    return (
        <View style={styles.container}>
        <TopHeader title={t("Media Gallery")}></TopHeader>
        
        <FlatList
        contentContainerStyle={{alignItems:'center',justifyContent:'center'}}
        style={{width:'90%'}}
        data={galleryArr}
        key={(item)=>{item.title}}
        numColumns={2}
        renderItem={({item})=>{
            return(
                <TouchableOpacity onPress={()=>{
                    navigation.navigate(item.navigateTo)
                }} style={{ borderWidth:1, borderRadius:10,height:140, width:'44%',borderColor:ternaryThemeColor,alignItems:'center',justifyContent:'center',margin:10}}>
                <View style={{height:'70%',width:'100%',alignItems:'center',justifyContent:'center'}}>
                <Image style={{width:'80%',resizeMode:'contain', height:'50%'}} source={item.image}></Image>
                </View>
                <View style={{backgroundColor:ternaryThemeColor,width:'100%',height:'30%',alignItems:'center', justifyContent:'center',borderBottomRightRadius:10, borderBottomLeftRadius:10}}>
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
