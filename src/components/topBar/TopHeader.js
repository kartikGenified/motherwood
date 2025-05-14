//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import PoppinsTextMedium from '../electrons/customFonts/PoppinsTextMedium';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';



// create a component
const TopHeader = () => {

    const ternaryThemeColor = useSelector(
        (state) => state.apptheme.ternaryThemeColor
      );
    
      const secondaryThemeColor = useSelector(
        (state) => state.apptheme.secondaryThemeColor
      );
      const userData = useSelector((state) => state.appusersdata.userData);
      const navigation = useNavigation()

      const {t} = useTranslation()

    return (
        <View
        style={{
          height: 70,
          width: "100%",
          backgroundColor: secondaryThemeColor,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
        }}
      >
        <TouchableOpacity
          style={{
            height: 20,
            width: 20,
            position: "absolute",
            left: 20,
            marginTop: 10,
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
            color: "#000",
            marginTop: 5,
            position: "absolute",
            left: 60,
            fontWeight: "bold",
          }}
          content={t("Recieved Points Summary")}
        ></PoppinsTextMedium>
      </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
});

//make this component available to the app
export default TopHeader;
