//import liraries
import React, { Component } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { useSelector } from "react-redux";
import PoppinsTextLeftMedium from "../../components/electrons/customFonts/PoppinsTextLeftMedium";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";

// create a component
const PointsTransferSuccess = () => {
  const secondaryThemeColor = useSelector(
    (state) => state.apptheme.secondaryThemeColor
  );
  return (
    <View style={{ ...styles.container, backgroundColor: secondaryThemeColor }}>
      <View
        style={{
          marginTop: 30,
          backgroundColor: "#EBF3FA",
          borderColor: "#85BFF1",
          borderWidth: 1,
          height: 50,
          width: 250,
          alignSelf: "center",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <Image
          style={{ height: 30, width: 30, marginRight: 10 }}
          source={require("../../../assets/images/greenTick.png")}
        ></Image>
        <PoppinsTextLeftMedium
          style={{ fontSize: 18, color: "black" }}
          content={"Status : "}
        ></PoppinsTextLeftMedium>
        <PoppinsTextLeftMedium
          style={{ fontSize: 18, color: "black" }}
          content={"Success"}
        ></PoppinsTextLeftMedium>
      </View>

      <View
        style={{ flexDirection: "row", alignSelf: "center", marginTop: 20 }}
      >
        <PoppinsTextMedium
          style={{ fontSize: 23, color: "black", fontWeight: "800" }}
          content={"Transfer Points : "}
        ></PoppinsTextMedium>
        <View
          style={{
            height: 40,
            backgroundColor: "#B6202D",
            width: 70,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 30,
          }}
        >
          <PoppinsTextMedium
            style={{ fontSize: 20, fontWeight: "bold", color: "white" }}
            content={"900"}
          ></PoppinsTextMedium>
        </View>
      </View>
      <View
        style={{
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "center",
          marginTop: 10,
        }}
      >
        <Image
          style={{ width: 25, height: 25, resizeMode: "contain" }}
          source={require("../../../assets/images/Date.png")}
        ></Image>
        <PoppinsTextLeftMedium
          style={{ marginLeft: 10, color: "black" }}
          content={"2 Jan 2025"}
        ></PoppinsTextLeftMedium>
        <PoppinsTextLeftMedium
          style={{ marginLeft: 10, color: "black" }}
          content={"|"}
        ></PoppinsTextLeftMedium>
        <Image
          style={{
            width: 22,
            height: 25,
            resizeMode: "contain",
            marginLeft: 10,
          }}
          source={require("../../../assets/images/clock.png")}
        ></Image>

        <PoppinsTextLeftMedium
          style={{ marginLeft: 10, color: "black" }}
          content={"10:30PM"}
        ></PoppinsTextLeftMedium>
      </View>

      <View
        style={{
          backgroundColor: "#F7F7F7",
          height: 140,
          marginTop: 30,
          padding: 20,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <PoppinsTextLeftMedium
            content={"Channel/ Partner ID : "}
            style={{}}
          ></PoppinsTextLeftMedium>
          <PoppinsTextLeftMedium
            content={"MWDD"}
            style={{}}
          ></PoppinsTextLeftMedium>
        </View>
        
        <View style={{ flexDirection: "row", marginTop:10 }}>
          <PoppinsTextLeftMedium
            content={"Channel/ Partner ID : "}
            style={{}}
          ></PoppinsTextLeftMedium>
          <PoppinsTextLeftMedium
            content={"MWDD"}
            style={{}}
          ></PoppinsTextLeftMedium>
        </View>

        <View style={{ flexDirection: "row", marginTop:10 }}>
          <PoppinsTextLeftMedium
            content={"Channel/ Partner ID : "}
            style={{}}
          ></PoppinsTextLeftMedium>
          <PoppinsTextLeftMedium
            content={"MWDD"}
            style={{}}
          ></PoppinsTextLeftMedium>
        </View>

        <View style={{ flexDirection: "row", marginTop:10 }}>
          <PoppinsTextLeftMedium
            content={"Channel/ Partner ID : "}
            style={{}}
          ></PoppinsTextLeftMedium>
          <PoppinsTextLeftMedium
            content={"MWDD"}
            style={{}}
          ></PoppinsTextLeftMedium>
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
export default PointsTransferSuccess;
