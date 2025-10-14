import React, { Component, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import Down from "react-native-vector-icons/Entypo";
import * as Keychain from "react-native-keychain";
import { useGetZoneWiseEmployeeUserMutation } from "../../apiServices/userMapping/userMappingApi";
import TopHeader from "../../components/topBar/TopHeader";
import SocialBottomBar from "../../components/socialBar/SocialBottomBar";

const SearchInfluencer = () => {
  const [employeeList, setEmployeeList] = useState();
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState()
  const [selectedStatus, setSelectedStatus] = useState();
  const [showList, setShowList] = useState(false);
  const [selectedUser, setSelectedUser] = useState("SELECT USER");
  const secondaryThemeColor = useSelector(
    (state) => state.apptheme.secondaryThemeColor
  );
  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  )

  const [
    getZoneWiseEmployeeUser,
    { data: zoneWiseData, error: zoneWiseError, isLoading: zoneWiseLoading },
  ] = useGetZoneWiseEmployeeUserMutation();

  useEffect(() => {
    fetchZoneWiseData();
  }, []);

  const fetchZoneWiseData = async () => {
    try {
      const credentials = await Keychain.getGenericPassword();
      const token = credentials.username;
      const statusMap = {
        "Pending Users": "PENDING",
        "Approval Users": "APPROVED",
        "Reject Users": "REJECTED",
      };
      const mappedStatus = undefined;

      const params = {
        status: mappedStatus,
        userId: searchText,
        dateFrom: undefined,
        dateTo: undefined,
        token: token,
      };

      const result = await getZoneWiseEmployeeUser(params);
      console.log("ZoneWiseEmployeeUser data:", result);
    } catch (err) {
      console.log("ZoneWiseEmployeeUser error:", err);
    }
  };

  useEffect(() => {
    if (zoneWiseData) {
      console.log("ZoneWiseEmployeeUser11:", zoneWiseData?.body?.users);
      setEmployeeList(zoneWiseData?.body?.users);
    } else if (zoneWiseError) {
      console.log("ZoneWiseEmployeeUser error:", zoneWiseError);
    }
  }, [zoneWiseData, zoneWiseError]);
  console.log("PointsDistribution userList", employeeList);

  const Input = (props) => {
    const image = props.image;
    const placeholder = props.placeholder;

    return (
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          height: 50,
          borderRadius: 26,
          borderWidth: 1,
          borderColor: "#DDDDDD",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 10,
          backgroundColor: "white",
        }}
      >
        <Image
          style={{ height: 20, width: 20, resizeMode: "contain" }}
          source={image}
        ></Image>
        <TextInput
          onChangeText={(text) => {
            props.handleChange(text);
          }}
          placeholderTextColor={"#717171"}
          placeholder={placeholder}
          style={{ height: "100%", width: "80%" }}
        ></TextInput>
      </View>
    );
  };

  const handleSearchByMobile = (input) => {
    const users = zoneWiseData?.body?.users || [];
  
    const matchedUsers = users.filter(user =>
      user.mobile && user.mobile.includes(input)
    );
  
    if (matchedUsers.length > 0) {
      setEmployeeList(matchedUsers)
    } else {
      setEmployeeList([])

      console.log("No users found for mobile input:", input);
    }
    setShowList(true)
  };

  
  const handleSearchByID = (input) => {
    const users = zoneWiseData?.body?.users || [];
  
    const matchedUsers = users.filter(user =>
      user.user_id && user.user_id.includes(input)
    );
  
    if (matchedUsers.length > 0) {
        setEmployeeList(matchedUsers)
    } else {
      setEmployeeList([])

      console.log("No users found for ID input:", input);
    }
    setShowList(true)

  };

  const Comp = (props) => {
    const index = props.index;
    const id = props.data.user_id
    const name = props.data.name
    const userType = props.data.user_type
    const branch = props.data.branch
    const zone = props.data.zone
    const mob = props.data.mobile
    const status = props.data.extra_status.approved
    return (
      <View
        style={{
          height: 160,
          width: "100%",
          alignItems: "center",
          justifyContent: "flex-start",
          borderWidth:1,
          borderColor:'#DDDDDD',
          borderRadius:16,
          marginTop:10
        }}
      >
        <View
          style={{
            height:'34%',
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            backgroundColor:ternaryThemeColor,
            width:'100%',
            borderTopRightRadius:16,
            borderTopLeftRadius:16,
            
          }}
        >
          <View
            style={{
              height: 30,
              width: 30,
              borderRadius: 15,
              backgroundColor: "white",
              alignItems: "center",
              justifyContent: "center",
              marginLeft:10,
              marginRight:20,
              margin:10
            }}
          >
            <PoppinsTextMedium
              content={index}
              style={{ color: "black", fontSize: 14 }}
            ></PoppinsTextMedium>
          </View>
          <View style={{alignItems:"center", justifyContent:'center'}}>
          <PoppinsTextMedium
              content={`ID -  ${id}`}
              style={{ color: "white", fontSize: 14 }}
            ></PoppinsTextMedium>
            <PoppinsTextMedium
              content={`Name -  ${name}`}
              style={{ color: "white", fontSize: 14 }}
            ></PoppinsTextMedium>
          </View>
          <View style={{borderLeftWidth:1,borderColor:"#990E1A",height:'90%',alignItems:"center", justifyContent:'center',position:'absolute',right:20}}>
          <PoppinsTextMedium
              content={`User Type`}
              style={{ color: "#FBFB0B", fontSize: 14, marginLeft:10 }}
            ></PoppinsTextMedium>
            <PoppinsTextMedium
              content={userType}
              style={{ color: "#FBFB0B", fontSize: 14, marginLeft:10 }}
            ></PoppinsTextMedium>
          </View>
        </View>
        <View style={{width:'100%',alignItems:'flex-start', justifyContent:'center'}}>
            <View style={{alignItems:'center', justifyContent:'center', flexDirection:'row',marginLeft:20,marginTop:10, width:'100%'}}>
                <Image style={{height:16,width:16,resizeMode:'contain', position:'absolute' ,left:0, top:4}} source={require('../../../assets/images/locationBlack.png')}></Image>
                <PoppinsTextMedium
              content={`Branch : ${branch}`}
              style={{ color: "#2A2929", fontSize: 12, position:'absolute' ,left:20, top:4 }}
            ></PoppinsTextMedium>
            </View>
            <View style={{alignItems:'center', justifyContent:'center', flexDirection:'row',marginLeft:20,marginTop:4, width:'100%'}}>
                <Image style={{height:16,width:16,resizeMode:'contain', position:'absolute' ,left:0, top:20}} source={require('../../../assets/images/locationBlack.png')}></Image>
                <PoppinsTextMedium
              content={`Zone : ${zone}`}
              style={{ color: "#2A2929", fontSize: 12, position:'absolute',left:20, top:20 }}
            ></PoppinsTextMedium>
            </View>
            <View style={{alignItems:'center', justifyContent:'center', flexDirection:'row',marginLeft:20,marginTop:4, width:'100%'}}>
                <Image style={{height:16,width:16,resizeMode:'contain', position:'absolute' ,left:0, top:38}} source={require('../../../assets/images/phoneoutline.png')}></Image>
                <PoppinsTextMedium
              content={`Mobile No : ${mob}`}
              style={{ color: "#2A2929", fontSize: 12, position:'absolute',left:20, top:38 }}
            ></PoppinsTextMedium>
            </View>
            <View style={{alignItems:'center', justifyContent:'center', flexDirection:'row',marginLeft:20,marginTop:4, width:'100%'}}>
                <Image style={{height:16,width:16,resizeMode:'contain', position:'absolute' ,left:0, top:56}} source={status == 'approved' ? require('../../../assets/images/checked.png') :  require('../../../assets/images/pendingYellow.png')}></Image>
                <PoppinsTextMedium
              content={`Approval Status : ${status}`}
              style={{ color: status == 'approved' ? "#5BB70B" : "#B79A0B", fontSize: 12, position:'absolute',left:20, top:56 }}
            ></PoppinsTextMedium>
            </View>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
  >
      <View style={{ flex: 0.92 }}>
        <TopHeader title={"Search Influencer"} />
  
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View
            style={{
              marginBottom:20,
              width: "100%",
              backgroundColor: secondaryThemeColor,
              alignItems: "center",
              justifyContent: "flex-start",
              paddingBottom:10
            }}
          >
            {/* Mobile Input */}
            <View
              style={{
                width: "90%",
                alignItems: "flex-start",
                justifyContent: "center",
                marginTop: 20,
              }}
            >
              <PoppinsTextMedium
                content={"Mobile No"}
                style={{ color: "#1A1818", marginLeft: 15, fontSize: 16 }}
              />

<View
        style={{
          width: "100%",
          flexDirection: "row",
          height: 50,
          borderRadius: 26,
          borderWidth: 1,
          borderColor: "#DDDDDD",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 10,
          backgroundColor: "white",
        }}
      >
        <Image
          style={{ height: 20, width: 20, resizeMode: "contain" }}
          source={require("../../../assets/images/phoneoutline.png")}
        ></Image>
        <TextInput
          onChangeText={(text) => {
            handleSearchByMobile(text)
          }}
          placeholderTextColor={"black"}
          placeholder={"Mobile No"}
          maxLength={10}
          keyboardType="numeric"
          style={{ height: "100%", width: "80%",color:'black' }}
        ></TextInput>
      </View>
              
            </View>
  
            {/* User ID Input */}
            <View
              style={{
                width: "90%",
                alignItems: "flex-start",
                justifyContent: "center",
                marginTop: 10,
              }}
            >
              <PoppinsTextMedium
                content={"Search by User ID"}
                style={{ color: "#1A1818", marginLeft: 15, fontSize: 16 }}
              />
              <View
        style={{
          width: "100%",
          flexDirection: "row",
          height: 50,
          borderRadius: 26,
          borderWidth: 1,
          borderColor: "#DDDDDD",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 10,
          backgroundColor: "white",
        }}
      >
        <Image
          style={{ height: 20, width: 20, resizeMode: "contain" }}
          source={require("../../../assets/images/phoneoutline.png")}
        ></Image>
        <TextInput
          onChangeText={(text) => {
            handleSearchByID(text);
          }}
          placeholderTextColor={"black"}
          placeholder={"Search by User ID"}
          style={{ height: "100%", width: "80%",color:'black' }}
        ></TextInput>
      </View>
              
            </View>
  
            {/* Submit Button */}
            {/* <TouchableOpacity
              style={{
                height: 50,
                width: "90%",
                backgroundColor: "black",
                marginTop: 20,
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PoppinsTextMedium
                content={"SUBMIT"}
                style={{ color: "white", fontSize: 18, fontWeight: "700" }}
              />
            </TouchableOpacity> */}
          </View>
  
          {/* Result List */}
          <View
            style={{
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ScrollView style={{ width: "90%" }}>
              {showList && employeeList && employeeList.map((item, index) => (
                <Comp key={index} data={item} index={index + 1} />
              ))}
            </ScrollView>
          </View>
       

        </ScrollView>
  
      </View>
    <SocialBottomBar />

  </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({});

export default SearchInfluencer;
