import React, { useEffect, useId, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  ScrollView,
  Dimensions,
  Text,
  Linking,
} from "react-native";
import PoppinsText from "../../components/electrons/customFonts/PoppinsText";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import Icon from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import * as Keychain from "react-native-keychain";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import PoppinsTextLeftMedium from "../../components/electrons/customFonts/PoppinsTextLeftMedium";

const HelpAndSupport = ({ navigation }) => {
  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  )
  const secondaryThemeColor = useSelector(
    (state) => state.apptheme.secondaryThemeColor
  )

  const { t } = useTranslation();

  const supportMobile = useSelector(
    (state) => state.apptheme.customerSupportMobile
  );
  const supportMail = useSelector(
    (state) => state.apptheme.customerSupportMail
  );
  console.log(supportMail, supportMobile);

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "flex-start",
        width: "100%",
        backgroundColor: "white",
        height: "100%",
      }}
    >
      <View
        style={{
          alignItems: "center",
          justifyContent: "flex-start",
          flexDirection: "row",
          width: "100%",
          backgroundColor:secondaryThemeColor,
          height: 60,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Image
            style={{
              height: 24,
              width: 24,
              resizeMode: "contain",
              marginLeft: 10,
            }}
            source={require("../../../assets/images/blackBack.png")}
          ></Image>
        </TouchableOpacity>
        <PoppinsTextMedium
          content={t("Help And Support")}
          style={{
            marginLeft: 10,
            fontSize: 16,
            fontWeight: "700",
            color: "black",
          }}
        ></PoppinsTextMedium>
      </View>
      <View style={{ alignItems: "center", width: "100%",  }}>
        <PoppinsTextMedium
          content={t("Get In Touch")}
          style={{
            fontSize: 24,
            marginTop: 20,
            fontWeight: "700",
            color: "black",
          }}
        ></PoppinsTextMedium>
        <PoppinsTextMedium
          content={t(
            "Don't hesitate to contact us whether you have a suggestion for improvement, a complaint to discuss, or an issue to resolve."
          )}
          style={{
            fontSize: 17,
            marginTop: 20,
            marginHorizontal: 20,
            color: "black",
          }}
        ></PoppinsTextMedium>
      </View>
          {/* mail */}
      <View
        style={{
          width: "90%",
          height: 80,
          marginTop:50,
          borderWidth: 1,
          borderRadius: 40,
          borderColor: "#B7202C",
          justifyContent: "center",
          paddingHorizontal: 30,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Image
            style={{
              height: 30,
              width: 50,
              resizeMode: "contain",
              marginTop: 13,
            }}
            source={require("../../../assets/images/mail_red.png")}
          ></Image>
          <View>
            <PoppinsTextLeftMedium
              style={{
                fontSize: 20,
                marginLeft: 20,
                color: "#303030",
                fontWeight: "600",
              }}
              content={t("Mail Us")}
            ></PoppinsTextLeftMedium>
            <PoppinsTextLeftMedium
              style={{
                fontSize: 17,
                marginLeft: 20,
                color: "#303030",
                fontWeight: "700",
              }}
              content={supportMail ? supportMail : "customercare@motherwood.in"}
            ></PoppinsTextLeftMedium>
          </View>
        </View>
      </View>
        {/* phone */}
      <View
        style={{
          width: "90%",
          height: 80,
          marginTop:20,
          borderWidth: 1,
          borderRadius: 40,
          borderColor: "#B7202C",
          justifyContent: "center",
          paddingHorizontal: 30,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Image
            style={{
              height: 37,
              width: 50,
              resizeMode: "contain",
              marginTop: 13,
            }}
            source={require("../../../assets/images/phone_red.png")}
          ></Image>
          <View>
            <PoppinsTextLeftMedium
              style={{
                fontSize: 20,
                marginLeft: 20,
                color: "#303030",
                fontWeight: "600",
              }}
              content={t("Call Us")}
            ></PoppinsTextLeftMedium>
            <PoppinsTextLeftMedium
              style={{
                fontSize: 17,
                marginLeft: 20,
                color: "#303030",
                fontWeight: "700",
              }}
              content={supportMobile ? supportMobile : ""}
            ></PoppinsTextLeftMedium>
          </View>
        </View>
      </View>

      <View style={{height:70, backgroundColor:'#B6202D', width:'90%', marginTop:30, borderRadius:35,alignItems:'center', flexDirection:'row'}}>
        <Image style={{height:30,width:30, resizeMode:'contain', marginLeft:20}} source={require("../../../assets/images/faq_white.png")}></Image>
            <PoppinsTextLeftMedium style={{color:"white", fontSize:24, fontWeight:'600', marginHorizontal:20}} content={"FAQs"}></PoppinsTextLeftMedium>
      </View>
      
      <View>
      <PoppinsTextMedium style={{color:"black", fontSize:24, fontWeight:'600', marginHorizontal:20, marginTop:20, fontWeight:'800'}} content={"Social Media"}></PoppinsTextMedium>
      <PoppinsTextMedium style={{color:"black", fontSize:20, fontWeight:'600', marginHorizontal:20, marginTop:10, fontWeight:'600'}} content={"For more updates, please follow us on"}></PoppinsTextMedium>
      <View style={{flexDirection:'row',justifyContent:'center', alignItems:'center',marginTop:30}}>

        <TouchableOpacity style={{marginRight:20, }} onPress={()=>{}}>
        <Image style={{height:40,width:40,resizeMode:'cover'}} source={require("../../../assets/images/facebook.png")}></Image>
        </TouchableOpacity>

        <TouchableOpacity style={{marginRight:30, }} onPress={()=>{}}>
        <Image style={{height:40,width:40,resizeMode:'cover'}} source={require("../../../assets/images/instagram.png")}></Image>
        </TouchableOpacity>

        <TouchableOpacity style={{marginRight:25, }} onPress={()=>{}}>
        <Image style={{height:50,width:50,resizeMode:'cover',marginTop:5}} source={require("../../../assets/images/youtube.png")}></Image>
        </TouchableOpacity>

        <TouchableOpacity style={{marginRight:20, }} onPress={()=>{}}>
        <Image style={{height:40,width:40,resizeMode:'cover'}} source={require("../../../assets/images/linkedin.png")}></Image>
        </TouchableOpacity>              
      </View>

      <Image style={{resizeMode:'contain', height:100, marginTop:40}} source={require("../../../assets/images/phone_with_wire.png")}></Image>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default HelpAndSupport;
