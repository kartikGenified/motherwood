//import liraries
import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useSelector } from "react-redux";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import SocialBottomBar from "../../components/socialBar/SocialBottomBar";

// create a component
const UserManagementDetails = (params) => {
  const secondaryThemeColor = useSelector(
    (state) => state.apptheme.secondaryThemeColor
  );

  const navigation = useNavigation();

  const route = params?.route?.params?.data;
  console.log("route", route);

  const { t } = useTranslation();

  const SingleComponent = ({title, value}) =>{
    return(
        <View style={{justifyContent:'space-between', borderBottomWidth:1, borderColor:"#9F9F9F", backgroundColor:'white', flexDirection:'row', paddingHorizontal:20, height:55,alignItems:'center',marginHorizontal:20}}>
            <Text style={{color:"#9F9F9F", fontSize:18}}>{title}</Text>
            <Text style={{color:'black'}}>{value}</Text>
        </View>
    )
  }

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
              navigation.goBack();
            }}
          >
            <Image
              style={{ height: 30, width: 30, resizeMode: "contain" }}
              source={require("../../../assets/images/blackBack.png")}
            ></Image>
          </TouchableOpacity>
          <PoppinsTextMedium
            content={t("View Profile")}
            style={{
              marginLeft: 10,
              fontSize: 18,
              fontWeight: "700",
              color: "black",
            }}
          ></PoppinsTextMedium>
        </View>
      </View>

       <SingleComponent title={"Customer ID"} value={route?.id}/>
       <SingleComponent title={"User Type"} value={route?.user_type}/>
       <SingleComponent title={"Name"} value={route?.name}/>
       {/* <SingleComponent title={"Customer Code"} value={route?.name}/> */}
       <SingleComponent title={"Mobile No"} value={route?.mobile}/>
       <SingleComponent title={"Branch"} value={route?.city ? route?.city :"N/A"}/>
       <SingleComponent title={"Location"} value={route?.city ? route?.city :"N/A"}/>
       <SingleComponent title={"Geo Location"} value={route?.city ? route?.city :"N/A"}/>
       <SingleComponent title={"Aproval Status"} value={route?.city ? route?.city :"N/A"}/>
       <SingleComponent title={"Aproval By"} value={route?.city ? route?.city :"N/A"}/>


            <View style={{margin:20, justifyContent:'space-between', flexDirection:'row'}}>
                <TouchableOpacity>
                <Text style={{fontSize:18, color:"#B6202D"}}>View KYC</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={()=>{
                  navigation.navigate("AddedUserScanList",{
                    data:route
                  })
                }}>
                <Text style={{fontSize:18, color:'#B6202D'}}>View Point History</Text>
                </TouchableOpacity>
            </View>
            <SocialBottomBar/>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'white'
  },
});

//make this component available to the app
export default UserManagementDetails;
