//import liraries
import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import TopHeader from "../../components/topBar/TopHeader";
import PoppinsTextLeftMedium from "../../components/electrons/customFonts/PoppinsTextLeftMedium";
import DropDownRegistration from "../../components/atoms/dropdown/DropDownRegistration";

// create a component
const PointsCalculator = () => {
    let demoData = ["kkddk","kksks","jdjd"]
  return (
    <View style={styles.container}>
      <TopHeader title={"Point Calculator"}></TopHeader>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginTop: 20,
          borderBottomWidth: 0.5,
          paddingBottom: 10,
          marginHorizontal: 20,
        }}
      >
        <PoppinsTextLeftMedium
          style={{ color: "black", fontWeight: "bold" }}
          content={"Product/ SKU"}
        ></PoppinsTextLeftMedium>
        <PoppinsTextLeftMedium
          style={{ color: "black", fontWeight: "bold" }}
          content={"Thickness"}
        ></PoppinsTextLeftMedium>

        <PoppinsTextLeftMedium
          style={{ color: "black", fontWeight: "bold" }}
          content={"Qty"}
        ></PoppinsTextLeftMedium>
      </View>

      <View>
        <DropDownRegistration data={demoData} ></DropDownRegistration>
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
export default PointsCalculator;
