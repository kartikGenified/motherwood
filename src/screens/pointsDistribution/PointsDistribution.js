//import liraries
import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image,TextInput, FlatList } from 'react-native';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Down from 'react-native-vector-icons/Entypo'
import { useGetZoneWiseEmployeeUserMutation } from '../../apiServices/userMapping/userMappingApi';
// create a component
const PointsDistribution = ({navigation}) => {
  const [employeeList, setEmployeeList] = useState();
  const [searchText, setSearchText] = useState("");
  const [showList, setShowList] = useState(false)
  const [selectedUser, setSelectedUser] = useState("SELECT USER")
      const secondaryThemeColor = useSelector(
        (state) => state.apptheme.secondaryThemeColor
      );
      const users = useSelector((state)=>state.appusers.value)
      const userData = useSelector(state => state.appusersdata.userData)
      const userList = users.filter((item,index)=>{return (item).toLowerCase()!=(userData.user_type).toLowerCase()})
      const {t} = useTranslation()

      const [
        getZoneWiseEmployeeUser,
        { data: zoneWiseData, error: zoneWiseError, isLoading: zoneWiseLoading },
      ] = useGetZoneWiseEmployeeUserMutation();


      useEffect(() => {
        fetchZoneWiseData();
      }, []);


      const renderEmployeeItem = ({ item, index }) =>{ 

        // Status color logic
    let statusLabel = "Pending";
    let statusBg = "#FFFCCF";
    let statusText = "#B79A0B";
  
    if (item?.status == "2") {
      // Rejected
      statusLabel = "Rejected";
      statusBg = "#FFDDE0";
      statusText = "#B6202D";
    } else if (item?.status == "1") {
      // Check extra_status.approved
      if (item?.extra_status?.approved) {
        statusLabel = "Approved";
        statusBg = "#E9FFD5";
        statusText = "#5BB70B";
      } else {
        statusLabel = "Pending";
        statusBg = "#FFFCCF";
        statusText = "#B79A0B";
      }
    }
  
      return(
     <View
        style={{
          backgroundColor: "#B6202D",
          marginTop: 20,
          marginHorizontal: 5,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        }}
      >
        <View
          style={{
            padding: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            height: 60,
          }}
        >
          <View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{
                  backgroundColor: "white",
                  width: 30,
                  height: 30,
                  textAlign: "center",
                  borderRadius: 20,
                  fontSize: 20,
                }}
              >
                {index + 1}
              </Text>
              <Text
                style={{ color: "white", fontWeight: "600", marginLeft: 10 }}
              >{`Customer ID - ${item?.id} `}</Text>
            </View>
            <Text
              style={{
                color: "white",
                textAlign: "center",
                marginLeft: 40,
                fontWeight: "600",
              }}
            >{`Name : ${item?.name}`}</Text>
          </View>
  
          <View style={{}}>
            <Text
              style={{
                color: "#FBFB0B",
                fontSize: 14,
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              {"User Type"}
            </Text>
  
            <Text style={{ textAlign: "center", color: "#FBFB0B" }}>
              {item?.user_type}
            </Text>
          </View>
        </View>
  
        {/* White Background */}
        <View
          style={{
            backgroundColor: "white",
            height: 90,
            padding: 10,
            borderWidth: 1,
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <View>
              {item?.city && (
                <View style={{ flexDirection: "row" }}>
                  <Image
                    style={{
                      width: 20,
                      height: 20,
                      resizeMode: "contain",
                      marginRight: 5,
                    }}
                    source={require("../../../assets/images/locationBlack.png")}
                  ></Image>
  
                  <Text
                    style={{ color: "black", fontWeight: "600", fontSize: 17 }}
                  >
                    City :{item.city}{" "}
                  </Text>
                </View>
              )}
  
              <View style={{ flexDirection: "row", marginTop: 10 }}>
                <Image
                  style={{
                    width: 18,
                    height: 18,
                    resizeMode: "contain",
                    marginRight: 6,
                  }}
                  source={require("../../../assets/images/mobileBlack.png")}
                ></Image>
                <Text style={{ color: "black", fontWeight: "600", fontSize: 17 }}>
                  Mobile : {item.mobile}{" "}
                </Text>
              </View>
            </View>
            <View style={{ padding: 13, backgroundColor: statusBg }}>
              <Text style={{ textAlign: "center", color: statusText }}>
                Status
              </Text>
              <Text style={{ textAlign: "center", color: statusText }}>
                {statusLabel}
              </Text>
            </View>
          </View>
        </View>
  
        {/* Button */}
        <TouchableOpacity
          style={{
            backgroundColor: "black",
            height: 50,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
          }}
          onPress={()=>navigation.navigate("UserManagementDetails",{
            data:item
          })}
        >
          <Image
            style={{ width: 20, height: 20, resizeMode: "contain" }}
            source={require("../../../assets/images/userGrey.png")}
          ></Image>
          <Text style={{ color: "white", fontWeight: "600", marginLeft: 10 }}>
            View Profile
          </Text>
        </TouchableOpacity>
      </View>
      )
   
  };


      const fetchZoneWiseData = async () => {
        try {
          const credentials = await Keychain.getGenericPassword();
          const token = credentials.username;
          const statusMap = {
            "Pending Users": "PENDING",
            "Approval Users": "APPROVED",
            "Reject Users": "REJECTED",
          };
          const mappedStatus = statusMap[selectedStatus] || undefined;
    
          const params = {
            status: mappedStatus,
            userId: searchText,
            dateFrom: dateFrom,
            dateTo: dateTo,
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
        }
        if (zoneWiseError) {
          console.log("ZoneWiseEmployeeUser error:", zoneWiseError);
        }
      }, [zoneWiseData, zoneWiseError]);
      console.log("PointsDistribution userList",userList,userData)
    
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
      <View style={{alignItems:'center', justifyContent:'space-around', width:'100%',flexDirection:'row',height:60}}>
      <View style={{ width:'44%', height:'100%',position:'absolute',top:15,left:10 }}>
       
        <Image
          style={{
            height: 20,
            width: 20,
            position: "absolute",
            top:24,
            left:6
          }}
          source={require("../../../assets/images/search.png")}
        ></Image>
        <TextInput
          style={{
            borderWidth: 1,
            marginTop: 10,
            paddingHorizontal: 30,
            borderRadius: 20,
            color: "black",
            borderColor: "#DDDDDD",
          }}
          onChangeText={(text) => {
            setSearchText(text);
          }}
          value={searchText}
          placeholder="Search"
        ></TextInput>
      </View>
      <View style={{ width:'44%', height:'100%',position:'absolute',top:30,right:10 }}>
       <TouchableOpacity onPress={()=>{
        setShowList(!showList)
       }} style={{height:40,width:"100%",alignItems:"center", justifyContent:'center',backgroundColor:"#DDDDDD",borderRadius:20,flexDirection:'row'}}>
        <PoppinsTextMedium content={selectedUser} style={{color:'#717171',marginRight:20}}></PoppinsTextMedium>
        <Down name="chevron-down" size={20} color="#717171"></Down>
        
       </TouchableOpacity>
       {
          showList && 
          <View style={{alignItems:'center', justifyContent:'center',top:40, padding:10,borderRadius:10}}>
            {
              userList && 
              userList.map((item,index)=>{
                return(
                  <TouchableOpacity onPress={()=>{

                    setSelectedUser(item)
                    setShowList(!showList)

                  }} style={{height:30,width:'100%',backgroundColor:'#DDDDDD',alignItems:'center', justifyContent:'center',marginBottom:1}}>
                    <PoppinsTextMedium content={item.toUpperCase()} style={{color:'#717171', fontSize:16,}}></PoppinsTextMedium>
                  </TouchableOpacity>
                )
              })
            }
          </View>
        }
      </View>
      </View>

      <FlatList
        data={employeeList || []}
        keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
        renderItem={renderEmployeeItem}
        ListEmptyComponent={
          <Text style={{ color: "grey", textAlign: "center", marginTop: 20 }}>
            No employees found.
          </Text>
        }
      />
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems:'center',
        justifyContent:'flex-start'
    },
});

//make this component available to the app
export default PointsDistribution;
