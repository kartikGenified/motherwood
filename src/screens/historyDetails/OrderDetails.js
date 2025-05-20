//import liraries
import React, { Component, useEffect,useState } from "react";
import { Image, ScrollView } from "react-native";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import { useNavigation } from "@react-navigation/native";
import { useOrderHistoryDetailsMutation } from "../../apiServices/workflow/rewards/GetPointsApi";
import * as Keychain from "react-native-keychain";
import ErrorModal from "../../components/modals/ErrorModal";
import MessageModal from "../../components/modals/MessageModal";


// create a component
const OrderDetails = (params) => {
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState();
  const navigation = useNavigation()
  console.log("praaaaa",params?.route?.params?.item?.id)
  const orderNo = params?.route?.params?.item?.id
  const item = params?.route?.params?.item
  console.log("item params", item)
  const [
    fetchOrderDetails,
    {
      data: fetchOrderDetailsData,
      error: fetchOrderDetailsError,
      isLoading: fetchOrderDetailsIsLoading,
      isError: fetchOrderDetailsIsError,
    },
  ] = useOrderHistoryDetailsMutation();

  useEffect(()=>{
    (async () => {
      const credentials = await Keychain.getGenericPassword();
      const token = credentials.username;
      const data = {
        id:orderNo,
        token:token
      }
      fetchOrderDetails(data)


    })();
  },[])

  useEffect(()=>{
    if(fetchOrderDetailsData){
      console.log("fetchOrderDetailsData", JSON.stringify(fetchOrderDetailsData));
      
    }
    else if(fetchOrderDetailsError){
      console.log("fetchOrderDetailsError", fetchOrderDetailsError);
      setError(true)
      setMessage("Unable to fetch order history details")
    }
  },[fetchOrderDetailsData,fetchOrderDetailsError])

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
          backgroundColor: "white",
        }}
      >
        <TouchableOpacity
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
        </TouchableOpacity>
        {/* <PoppinsTextMedium content="Points History" style={{ marginLeft: 10, fontSize: 16, fontWeight: '600', color: '#171717' }}></PoppinsTextMedium> */}
        <PoppinsTextMedium
          content={"Order Details"}
          style={{
            marginLeft: 10,
            fontSize: 18,
            fontWeight: "500",
            color: "#171717",
          }}
        ></PoppinsTextMedium>
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
            <Text style={{ fontSize: 18, marginLeft: 4, color: "black",fontWeight:'500' }}>
              {item.status == 1 ? "Success" : item.status == 0 ? "Pending" :item.status == 2 ? "Rejected" : ""}
            </Text>
          </View>
          <View style={{ flexDirection: "row", marginTop: 20 }}>
            <Text style={{ fontSize: 22, marginTop: 7, color: "black" }}>
              Points :{" "}
            </Text>

            {params?.route?.params?.item &&  <Text
              style={{
                backgroundColor: "#FFD11E",
                padding: 8,
                paddingHorizontal: 15,
                borderRadius: 20,
                color: "black",
                fontWeight: "bold",
                fontSize: 20,
              }}
            >
              {params?.route?.params?.item?.points}
            </Text>}
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
            backgroundColor: "#D1DFEA",
            padding: 10,
            marginTop: 10,
          }}
        >
          <View style={{ flexDirection: "row", marginTop: 10,width: "100%",flexWrap:'wrap' }}>
            <Text style={{ fontSize: 14, marginLeft: 10, color: "black",fontWeight:'400' }}>
              Order No :
            </Text>
            <Text style={{ fontSize: 14, marginLeft: 7, color: "black",fontWeight:'400' }}>
              {item?.order_no}
            </Text>
          </View>
          <View style={{ flexDirection: "row", marginTop: 10,width: "100%",flexWrap:'wrap' }}>
            <Text style={{ fontSize: 16, marginLeft: 10, color: "black" ,fontWeight:'400'}}>
              Total SKU :
            </Text>
            <Text style={{ fontSize: 16, marginLeft: 7, color: "black",fontWeight:'400' }}>
              {item?.total_sku}
            </Text>
          </View>
          <View style={{ flexDirection: "row", marginTop: 10,width: "100%",flexWrap:'wrap' }}>
            <Text style={{ fontSize: 16, marginLeft: 10, color: "black",fontWeight:'400' }}>
              Quantity :
            </Text>
            <Text style={{ fontSize: 16, marginLeft: 7, color: "black" ,fontWeight:'400'}}>
          {item?.qty}
            </Text>
          </View>
        </View>

        <ScrollView
          horizontal={true}
          contentContainerStyle={{ flexDirection: "column" ,paddingBottom:40 }}
          style={{
            marginTop: 30,
            width: "90%",

            alignSelf: "center",
          }}
        >
          <View
            style={{
              height: 70,
              backgroundColor: "#67B145",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                height: 70,
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 70,
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
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 40,
                borderRightWidth: 1,
                borderColor: "white",
              }}
            >
              <Text style={{ color: "white", fontWeight: "600" }}>Thickness</Text>
            </View>

            <View
              style={{
                height: 70,
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 40,
                borderRightWidth: 1,
                borderColor: "white",
              }}
            >
              <Text style={{ color: "white", fontWeight: "600" }}>QTY</Text>
            </View>

            <View
              style={{
                height: 70,
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 40,
                borderRightWidth: 1,
                borderColor: "white",
              }}
            >
              <Text style={{ color: "white", fontWeight: "600" }}>Pts</Text>
            </View>
          </View>
              
          {fetchOrderDetailsData?.body.orderLine?.map((item, index) => {
            return(
              <View style={{ backgroundColor: "#E7E5C5", flexDirection: "row" }}>
              <View
                style={{
                  alignItems: "center",
                  width: 225,
                  height: 40,
                  justifyContent: "center",
                  marginLeft:6
                }}
              >
                <Text style={{color:'#000000', fontWeight: item['rank']>1 ? '800':'600'}}>{item.product_name}</Text>
              </View>

              <View
                style={{
                  alignItems: "center",
                  width: 104,
                  height: 40,
                  justifyContent: "center",
                }}
              >
                <Text style={{color:'#000000', fontWeight:'600'}}>{item.classification}</Text>
              </View>

              <View
                style={{
                  alignItems: "center",
                  width: 109,
                  height: 40,
                  justifyContent: "center",
                }}
              >
                <Text style={{color:'#000000', fontWeight:'600'}}>{item.qty}</Text>
              </View>

              <View
                style={{
                  alignItems: "center",
                  width: 129,
                  height: 40,
                  justifyContent: "center",
                }}
              >
                <Text  style={{color:'#000000', fontWeight:'600',textAlign:'right', marginLeft:20}}>{item.points}</Text>
              </View>
            </View>
            )
          
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
export default OrderDetails;
