//import liraries
import React, { Component, useEffect, useState } from "react";
import { Image, ScrollView } from "react-native";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import { useNavigation } from "@react-navigation/native";
import { useOrderHistoryDetailsMutation } from "../../apiServices/workflow/rewards/GetPointsApi";
import * as Keychain from "react-native-keychain";
import ErrorModal from "../../components/modals/ErrorModal";
import MessageModal from "../../components/modals/MessageModal";
import moment from "moment";

// create a component
const PointsTransferSuccess = (params) => {
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState();
  const navigation = useNavigation();
  const data = params?.route?.params?.getPointTransferData?.body;
  console.log("praaaaa", data);
  const orderNo = params?.route?.params?.item?.id;
  const item = params?.route?.params?.getPointTransferData?.body;
  console.log("item params", item);

  const modalClose = () => {
    setError(false);
    setSuccess(false);
  };

  const demodata = [
    {
      pname: "akr",
      qty: 2,
      pts: 10,
      amount: 100,
    },
    {
      pname: "ded",
      qty: 2,
      pts: 10,
      amount: 100,
    },
  ];
  return (
    <View style={styles.container}>
      <View
        style={{
          alignItems: "center",
          justifyContent: "flex-start",
          flexDirection: "row",
          width: "100%",
          marginTop: 10,
          height: 40,
          marginLeft: 20,

        }}
      >
        {/* <TouchableOpacity
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
        </TouchableOpacity> */}
        {/* <PoppinsTextMedium content="Points History" style={{ marginLeft: 10, fontSize: 16, fontWeight: '600', color: '#171717' }}></PoppinsTextMedium> */}
        {/* <PoppinsTextMedium
          content={"Order Details"}
          style={{
            marginLeft: 10,
            fontSize: 18,
            fontWeight: "800",
            color: "#171717",
          }}
        ></PoppinsTextMedium> */}
      </View>

      <ScrollView>
        <View style={{ alignItems: "center", width: "100%" }}>
          <View
            style={{
              height: 60,
              width: 240,
              // backgroundColor:'red'
              borderWidth: 1,
              borderColor: "#85BFF1",
              borderStyle: "dotted",
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 30,
              backgroundColor: "#EBF3FA",
              marginTop: 20,
              borderRadius: 10,
            }}
          >
            <Image
              style={{ height: 30, width: 30 }}
              source={require("../../../assets/images/greenTick.png")}
            ></Image>
            <Text style={{ fontSize: 18, marginLeft: 4, color: "black" }}>
              Status :{" "}
            </Text>
            <Text
              style={{
                fontSize: 18,
                marginLeft: 4,
                color: "black",
                fontWeight: "500",
              }}
            >
              {data.orderDetail?.status == 1
                ? "Success"
                : data.orderDetail?.status == 0
                ? "Pending"
                : data.orderDetail?.status == 2
                ? "Rejected"
                : ""}
            </Text>
          </View>
          <View style={{ flexDirection: "row", marginTop: 20 }}>
            <Text style={{ fontSize: 22, marginTop: 7, color: "black" }}>
              Transfer Points :{" "}
            </Text>

            {data && (
              <Text
                style={{
                  backgroundColor: "#B6202D",
                  padding: 8,
                  paddingHorizontal: 15,
                  borderRadius: 20,
                  color: "white",
                  fontWeight: "bold",
                  fontSize: 20,
                }}
              >
                {data?.orderDetail?.points}
              </Text>
            )}
          </View>
          <View style={{width:'100%', flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
            <Image source={require("../../../assets/images/Date.png")} style={{height:20,width:50,resizeMode:'contain',marginTop:20}}></Image>
            <Text style={{color:'black',width:100,marginTop:19}}>{moment(data?.orderDetail?.voucher_date).format("DD MMM YYYY")}</Text>
                      <Image source={require("../../../assets/images/clock.png")} style={{height:20,width:50,resizeMode:'contain',marginTop:20}}></Image>
            <Text style={{color:'black',width:100,marginTop:19}}>{moment(data?.orderDetail?.voucher_date).format("HH:MM")}</Text>
          </View>
          {/* <View
            style={{
              borderTopWidth: 1,
              width: "90%",
              marginTop: 30,
              borderColor: "#dddddd",
            }}
          >
            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <Image
                source={require("../../../assets/images/Date.png")}
                style={{ height: 20, width: 20, marginTop: 2 }}
              ></Image>
              <Text style={{ fontSize: 16, marginLeft: 10, color: "black" ,fontWeight:'600' }}>
                Order Date :
              </Text>
              <Text style={{ fontSize: 16, marginLeft: 7, color: "black", }}>
              </Text>
            </View>
            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <Image
                source={require("../../../assets/images/Date.png")}
                style={{ height: 20, width: 20, marginTop: 2 }}
              ></Image>
              <Text style={{ fontSize: 16, marginLeft: 10, color: "black" ,fontWeight:'600'}}>
                Sync Date :
              </Text>
              <Text style={{ fontSize: 16, marginLeft: 7, color: "black" }}>
         
              </Text>
            </View>
            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <Image
                source={require("../../../assets/images/Date.png")}
                style={{ height: 20, width: 20, marginTop: 2 }}
              ></Image>
              <Text style={{ fontSize: 16, marginLeft: 10, color: "black",fontWeight:'600' }}>
                Edit Date :
              </Text>
              <Text style={{ fontSize: 16, marginLeft: 7, color: "black" }}>
      
              </Text>
            </View>
          </View> */}
        </View>
        <View
          style={{
            width: "100%",
            backgroundColor: "#F7F7F7",
            padding: 10,
            marginTop: 10,
          }}
        >
          {console.log("body", data)}
          <View
            style={{
              flexDirection: "row",
              marginTop: 10,
              width: "100%",
              flexWrap: "wrap",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                marginLeft: 10,
                color: "black",
                fontWeight: "400",
              }}
            >
              Channel/ Partner ID :
            </Text>
            <Text
              style={{
                fontSize: 16,
                marginLeft: 7,
                color: "black",
                fontWeight: "400",
              }}
            >
              {data?.orderDetail?.seller_app_user_id}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              marginTop: 10,
              width: "100%",
              flexWrap: "wrap",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                marginLeft: 10,
                color: "black",
                fontWeight: "400",
              }}
            >
              Total SKU :
            </Text>
            <Text
              style={{
                fontSize: 16,
                marginLeft: 7,
                color: "black",
                fontWeight: "400",
              }}
            >
              {item?.orderDetail?.total_sku}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              marginTop: 10,
              width: "100%",
              flexWrap: "wrap",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                marginLeft: 10,
                color: "black",
                fontWeight: "400",
              }}
            >
              Quantity :
            </Text>
            <Text
              style={{
                fontSize: 16,
                marginLeft: 7,
                color: "black",
                fontWeight: "400",
              }}
            >
              {item?.orderDetail?.qty}
            </Text>
          </View>
        </View>

        <ScrollView
          horizontal={true}
          contentContainerStyle={{
            flexDirection: "column",
            paddingBottom: 40,
          }}
          style={{
            marginTop: 30,
            alignSelf: "center",
          }}
        >
          <View
            style={{
              height: 70,
              backgroundColor: "#B6202D", // changed from #67B145
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                height: 70,
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 10,
                width: 150,
                borderRightWidth: 1,
                borderColor: "white",
              }}
            >
              <Text style={{ color: "white", fontWeight: "600" }}>
                Product Name
              </Text>
            </View>

            <View
              style={{
                height: 70,
                width: 100,
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 10,
                borderRightWidth: 1,
                borderColor: "white",
              }}
            >
              <Text style={{ color: "white", fontWeight: "600" }}>
                Thickness
              </Text>
            </View>

            <View
              style={{
                height: 70,
                width: 80,
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 10,
                borderRightWidth: 1,
                borderColor: "white",
              }}
            >
              <Text style={{ color: "white", fontWeight: "600" }}>QTY</Text>
            </View>

            <View
              style={{
                height: 70,
                width: 80,
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 10,
                borderRightWidth: 1,
                borderColor: "white",
              }}
            >
              <Text style={{ color: "white", fontWeight: "600" }}>Pts</Text>
            </View>
          </View>

          {data?.orderDetail?.orderLineDetail?.map((item, index) => {
            return (
              <View
                style={{ backgroundColor: "#E7E5C5", flexDirection: "row" }}
                key={index}
              >
                <View
                  style={{
                    alignItems: "center",
                    width: 150,
                    height: 40,
                    justifyContent: "center",
                    borderRightWidth: 1,
                    borderColor: "white",
                    paddingHorizontal: 10,
                  }}
                >
                  <Text
                    style={{
                      color: "#000000",
                      fontWeight: item["rank"] > 1 ? "800" : "600",
                    }}
                  >
                    {item?.product_code}
                  </Text>
                </View>

                <View
                  style={{
                    alignItems: "center",
                    height: 40,
                    width: 100,
                    justifyContent: "center",
                    borderRightWidth: 1,
                    borderColor: "white",
                    paddingHorizontal: 10,
                  }}
                >
                  <Text style={{ color: "#000000", fontWeight: "600" }}>
                    {item?.unique_col}
                  </Text>
                </View>

                <View
                  style={{
                    alignItems: "center",
                    width: 80,
                    height: 40,
                    justifyContent: "center",
                    borderRightWidth: 1,
                    borderColor: "white",
                    paddingHorizontal: 10,
                  }}
                >
                  <Text style={{ color: "#000000", fontWeight: "600" }}>
                    {item?.qty}
                  </Text>
                </View>

                <View
                  style={{
                    alignItems: "center",
                    width: 80,
                    height: 40,
                    justifyContent: "center",
                    borderRightWidth: 1,
                    borderColor: "white",
                    paddingHorizontal: 10,
                  }}
                >
                  <Text
                    style={{
                      color: "#000000",
                      fontWeight: "600",
                      textAlign: "right",
                    }}
                  >
                    {item?.points}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </ScrollView>
      {error && (
        <ErrorModal
          modalClose={modalClose}
          message={message}
          openModal={error}
        ></ErrorModal>
      )}
      {success && (
        <MessageModal
          modalClose={modalClose}
          message={message}
          openModal={success}
        ></MessageModal>
      )}
      <TouchableOpacity style={{alignSelf:'center',width:160, backgroundColor:'black',alignItems:'center',height:40,justifyContent:'center', borderRadius:20,marginBottom:30}} onPress={()=>{navigation.replace("Dashboard")}}>
        <Text style={{color:'white',width:160, textAlign:'center'}}>Done</Text>
      </TouchableOpacity>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8E7",
  },
});

//make this component available to the app
export default PointsTransferSuccess;
