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
import TopHeader from "@/components/topBar/TopHeader";

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
  const socials = useSelector(
    state => state.apptheme.socials,
);
  return (
    <ScrollView
      contentContainerStyle={{
        alignItems: "center",
        justifyContent: "flex-start",
        width: "100%",
        backgroundColor: "white",
        paddingBottom: 40,
      }}
      style={{ flex: 1, backgroundColor: "white" }}
      showsVerticalScrollIndicator={false}
    >
      <TopHeader title={t("Customer Support")} />
      <View style={{ alignItems: "center", width: "100%" }}>
        <PoppinsTextMedium
          content={t("Get In Touch")}
          style={{
            fontSize: 22,
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
            fontSize: 14,
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
          height: 60,
          marginTop: 50,
          borderWidth: 1,
          borderRadius: 40,
          borderColor: ternaryThemeColor,
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
          <TouchableOpacity onPress={()=>{Linking.openURL(`mailto:${supportMail}`)}} style={{}}>
            <PoppinsTextLeftMedium
              style={{
                fontSize: 17,
                marginLeft: 20,
                color: "#303030",
                fontWeight: "600",
              }}
              content={t("Mail Us")}
            ></PoppinsTextLeftMedium>
            <PoppinsTextLeftMedium
              style={{
                fontSize: 13,
                marginLeft: 20,
                width: 230,
                color: "#303030",
                fontWeight: "700",
              }}
              content={supportMail ? supportMail : "customercare@motherwood.in"}
            ></PoppinsTextLeftMedium>
          </TouchableOpacity>
        </View>
      </View>
      {/* phone */}
      <View
        style={{
          width: "90%",
          height: 60,
          marginTop: 20,
          borderWidth: 1,
          borderRadius: 40,
          borderColor: ternaryThemeColor,
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
          <TouchableOpacity onPress={()=>{
            Linking.openURL(`tel:${supportMobile}`)
          }}>
            <PoppinsTextLeftMedium
              style={{
                fontSize: 17,
                marginLeft: 17,
                color: "#303030",
                fontWeight: "600",
              }}
              content={t("Call Us")}
            ></PoppinsTextLeftMedium>
            <PoppinsTextLeftMedium
              style={{
                fontSize: 14,
                marginLeft: 20,
                color: "#303030",
                fontWeight: "700",
                marginTop:6
              }}
              content={supportMobile ? supportMobile : ""}
            ></PoppinsTextLeftMedium>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity onPress={()=>{navigation.navigate("FAQ")}} style={{ height: 60, backgroundColor: ternaryThemeColor, width: '90%', marginTop: 14, borderRadius: 35, alignItems: 'center', flexDirection: 'row' }}>
        <Image style={{ height: 30, width: 30, resizeMode: 'contain', marginLeft: 20 }} source={require("../../../assets/images/faq_white.png")}></Image>
        <PoppinsTextLeftMedium style={{ color: "white", fontSize: 24, fontWeight: '600', marginHorizontal: 20 }} content={"FAQs"}></PoppinsTextLeftMedium>
      </TouchableOpacity>

      <View>
        <PoppinsTextMedium style={{ color: "black", fontSize: 20, fontWeight: '800', marginHorizontal: 20, marginTop: 20 }} content={t("Social Media")}></PoppinsTextMedium>
        <PoppinsTextMedium style={{ color: "black", fontSize: 14, fontWeight: '600', marginHorizontal: 20, marginTop: 10 }} content={t("For more updates, please follow us on")}></PoppinsTextMedium>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>

          <TouchableOpacity style={{ marginRight: 20, }} onPress={() => {Linking.openURL(socials?.facebook) }}>
            <Image style={{ height: 30, width: 30, resizeMode: 'cover' }} source={require("../../../assets/images/fbCircle.png")}></Image>
          </TouchableOpacity>

          <TouchableOpacity style={{ marginRight: 30, }} onPress={() => { Linking.openURL(socials.instagram)}}>
            <Image style={{ height: 30, width: 30, resizeMode: 'cover' }} source={require("../../../assets/images/instaCircle.png")}></Image>
          </TouchableOpacity>

          <TouchableOpacity style={{ marginRight: 25, }} onPress={() => { Linking.openURL(socials.youtube)}}>
            <Image style={{ height: 30, width: 30, resizeMode: 'cover', marginTop: 5 }} source={require("../../../assets/images/ytCircle.png")}></Image>
          </TouchableOpacity>

          <TouchableOpacity style={{ marginRight: 20, }} onPress={() => {Linking.openURL(socials.linkedIn) }}>
            <Image style={{ height: 30, width: 30, resizeMode: 'cover' }} source={require("../../../assets/images/linkedinCircle.png")}></Image>
          </TouchableOpacity>
        </View>

        <Image style={{ resizeMode: 'contain', height: 100, marginTop: 20 }} source={require("../../../assets/images/phone_with_wire.png")}></Image>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({});

export default HelpAndSupport;
