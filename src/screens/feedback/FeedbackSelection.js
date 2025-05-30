import React, { Component, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useSelector } from "react-redux";
import FeedbackTextArea from "../../components/modals/feedback/FeedbackTextArea";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import ButtonWithPlane from "../../components/atoms/buttons/ButtonWithPlane";
import StarRating from "react-native-star-rating";
import FeedbackModal from "../../components/modals/feedback/FeedbackModal";
import { useAddFeedbackMutation } from "../../apiServices/feedbackApi/FeedbackApi";
import * as Keychain from "react-native-keychain";
import ErrorModal from "../../components/modals/ErrorModal";
import { useTranslation } from "react-i18next";
import FastImage from "react-native-fast-image";
import { clientOfficialName } from "../../utils/HandleClientSetup";
import SocialBottomBar from "../../components/socialBar/SocialBottomBar";
import TopHeader from "../../components/topBar/TopHeader";

const FeedbackSelection = ({navigation}) => {

    const Selector=(props)=>{
        const image = props.image
        const title = props.title
        const navigate = props.navigate
        console.log("sleector" ,navigate)
        return(
            <TouchableOpacity onPress={()=>{
                navigation.navigate(navigate)
            }} style={{height:180,width:'80%', alignItems:'center',justifyContent:'center',borderWidth:2,borderColor:'#B6202D',borderRadius:20,margin:20}}>
                <Image style={{height:90,width:90,resizeMode:'contain'}} source={image}></Image>
                <PoppinsTextMedium style={{color:'#525252',fontSize:16,marginTop:20}} content={title}></PoppinsTextMedium>
            </TouchableOpacity>
        )
    }

    return (
        <View>
            <TopHeader title={"Feedback/Ratings"}></TopHeader>
            <View style={{alignItems:'center', justifyContent:'center',marginTop:40}}>
            <Selector image={require('../../../assets/images/feedbackApp.png')} navigate="Feedback" title="Feedback For App"/>
            <Selector image={require('../../../assets/images/feedbackProducts.png')} navigate="FeedbackProducts" title="Feedback For Product"/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({})

export default FeedbackSelection;
