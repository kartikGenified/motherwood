//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, } from 'react-native';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import { useSelector } from 'react-redux';

// create a component
const PointsDistribution = () => {
      const secondaryThemeColor = useSelector(
        (state) => state.apptheme.secondaryThemeColor
      );
    
    return (
        <View style={styles.container}>
           {/* coloured header */}
      <View style={{ width: "100%", backgroundColor: secondaryThemeColor }}>
        <View
          style={{
            alignItems: "center",
            justifyContent: "flex-start",
            flexDirection: "row",
            width: "100%",
            marginTop: 10,
            height: 50,
            marginLeft: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Dashboard");
            }}
          >
            <Image
              style={{ height: 30, width: 30, resizeMode: "contain" }}
              source={require("../../../assets/images/blackBack.png")}
            ></Image>
          </TouchableOpacity>
          <PoppinsTextMedium
            content={t("User Management")}
            style={{
              marginLeft: 10,
              fontSize: 18,
              fontWeight: "700",
              color: "black",
            }}
          ></PoppinsTextMedium>
        </View>
      </View>

        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

//make this component available to the app
export default PointsDistribution;
