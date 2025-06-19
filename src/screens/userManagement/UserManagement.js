//import liraries
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";

import { useSelector } from "react-redux";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import PointsCard from "../../components/passbook/PointsCard";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";

// create a component
const UserManagement = () => {
  const secondaryThemeColor = useSelector(
    (state) => state.apptheme.secondaryThemeColor
  );

  const { t } = useTranslation();

  const navigation = useNavigation();

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

      <View style={{ margin: 20 }}>
        <Text style={{ fontWeight: "600", color: "black" }}>
          Search by User ID{" "}
        </Text>
        <Image
          style={{
            height: 20,
            width: 20,
            position: "absolute",
            marginTop: 45,
            marginLeft: 10,
          }}
          source={require("../../../assets/images/search.png")}
        ></Image>
        <TextInput
          style={{
            borderWidth: 1,
            marginTop: 10,
            paddingHorizontal: 40,
            borderRadius: 20,
            color: "black",
            borderColor: "#DDDDDD",
          }}
          placeholder="Search"
        ></TextInput>
      </View>

      <View style={{ flexDirection: "row", width: "100%",justifyContent:'center' }}>
        <View style={{width:'45%',}}>
            <Text style={{color:'black', fontWeight:'bold'}}>Search by Status</Text>
          <TextInput
            style={{
              borderWidth: 1,
              marginTop: 10,
              paddingHorizontal: 40,
              borderRadius: 20,
              margin:5,
              color: "black",
              borderColor: "#DDDDDD",
            }}
            placeholder="Search"
          ></TextInput>
        </View>

        <View style={{width:'45%'}}>
            <Text style={{color:'black', fontWeight:'bold'}}>Search by Date</Text>

          <TextInput
            style={{
              borderWidth: 1,
              marginTop: 10,
              paddingHorizontal: 40,
              borderRadius: 20,
              color: "black",
              borderColor: "#DDDDDD",
            }}
            placeholder="Search"
          ></TextInput>
        </View>
      </View>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});

//make this component available to the app
export default UserManagement;
