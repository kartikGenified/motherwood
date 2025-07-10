import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Text,
} from "react-native";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import { useSelector, useDispatch } from "react-redux";
import Plus from "react-native-vector-icons/AntDesign";
import PoppinsText from "../../components/electrons/customFonts/PoppinsText";
import {
  useGetAllAddressMutation,
  useDeleteAddressMutation,
} from "../../apiServices/userAddress/UserAddressApi";
import * as Keychain from "react-native-keychain";
import PoppinsTextLeftMedium from "../../components/electrons/customFonts/PoppinsTextLeftMedium";
import { useIsFocused } from "@react-navigation/native";
import { addAddress } from "../../../redux/slices/redemptionAddressSlice";
import { useTranslation } from "react-i18next";
import SocialBottomBar from "../../components/socialBar/SocialBottomBar";
const ListAddress = ({ navigation, route }) => {
  const [selectedIndex, setSelectedIndex] = useState();
  const [selectedAddress, setSelectedAddress] = useState();
  const [addressList, setAddressList] = useState();
  const focused = useIsFocused();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const schemeType = route.params?.schemeType;
  const schemeID = route.params?.schemeID;
  const type = route?.params?.type
  const navigatingFrom = route?.params?.navigatingFrom
  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  );
  const secondaryThemeColor = useSelector(
    state => state.apptheme.secondaryThemeColor,
  )
  const [
    getAllAddressFunc,
    { data: getAllAddressData, error: getAllAddressError },
  ] = useGetAllAddressMutation();

  const [
    deleteAddressFunc,
    { data: deleteAddressData, error: deleteAddressError },
  ] = useDeleteAddressMutation();

  const setAddress = (data) => {
    console.log("Selected", data);
    setSelectedIndex(data.index);
    setSelectedAddress(data);
    // setSelectedAddress(data)
    dispatch(addAddress(data));
  };
  useEffect(() => {
    const getToken = async () => {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        console.log(
          "Credentials successfully loaded for user " + credentials.username
        );
        const token = credentials.username;
        const params = { token: token };
        getAllAddressFunc(params);
      }
    };
    getToken();
  }, []);
  useEffect(() => {
    const getToken = async () => {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        console.log(
          "Credentials successfully loaded for user " + credentials.username
        );
        const token = credentials.username;
        const params = { token: token };
        getAllAddressFunc(params);
      }
    };
    getToken();
  }, [deleteAddressData, focused]);
  useEffect(() => {
    if (deleteAddressData) {
      console.log("deleteAddressData", deleteAddressData);
      if (deleteAddressData.success) {
        console.log("success");
      }
    } else if (deleteAddressError) {
      console.log("deleteAddressError", deleteAddressError);
    }
  }, [deleteAddressData, deleteAddressError]);

  useEffect(() => {
    if (getAllAddressData) {
      console.log("getAllAddressData", getAllAddressData);
      if (getAllAddressData.success) {
        setAddressList(getAllAddressData.body);
      }
    } else if (getAllAddressError) {
      console.log("getAllAddressError", getAllAddressError);
    }
  }, [getAllAddressData, getAllAddressError]);

  const deleteAddress = (data) => {
    // console.log("address json", data)
    const getToken = async () => {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        console.log(
          "Credentials successfully loaded for user " + credentials.username
        );
        const token = credentials.username;
        const params = { token: token, data: data };
        console.log("address json", params);
        deleteAddressFunc(params);
      }
    };
    getToken();
  };

  // const AddressComponent = (props) => {
  //   const [selected, setSelected] = useState(false);
  //   const address = props.address;
  //   const city = props.city;
  //   const state = props.state;
  //   const country = props.country;
  //   const index = props.index;
  //   const district = props.district;
  //   const pincode = props.pincode;
  //   const selectedIndex = props.selectedIndex;
  //   const data = props.data;
  //   const addressJson = {
  //     index: index,
  //     city: city,
  //     district: district,
  //     state: state,
  //     country: country,
  //     pincode: pincode,
  //     data:data
  //   };

  //   // useEffect(() => {
  //   //   console.log("props.isSelected", props.isSelected=="1");
  //   //   if (props.isSelected == "1") {
  //   //     setSelected(true);
  //   //     // props.setAddress(addressJson);
  //   //   }
  //   // }, [props.isSelected]);

  //   // useEffect(() => {
  //   //   if (selectedIndex === index) {
  //   //     setSelected(true);
  //   //     props.setAddress(addressJson);
  //   //   } else {
  //   //     setSelected(false);
  //   //   }
  //   // }, [selected, selectedIndex]);

  //   const setSelectedAddress = (selectedData) => {
  //     console.log("adessjksajdjsahjhd",data,selectedData)
  //     const myPromise = new Promise((resolve, reject) => {
  //       if (selectedData === true) {
  //         resolve(addressJson);
  //       } else {
  //         reject();
  //       }
  //     });

  //     myPromise.then(function () {
  //       props.setAddress(addressJson)

  //     }, function () {
  //       console.log("Promise failed");
  //     });
  //     setSelected(selectedData);
  //   };

  //   const deleteAddress = () => {
  //     props.deleteAddress(data);
  //   };

  //   return (
  //     <View
  //       style={{
  //         alignItems: "center",
  //         justifyContent: "center",
  //         width: "90%",
  //         borderWidth: 1,
  //         borderColor: "#DDDDDD",
  //         borderRadius: 10,
  //         flexDirection: "row",
  //         paddingTop: 10,
  //         paddingBottom: 10,
  //         marginTop: 20,
  //       }}
  //     >
  //       <View
  //         style={{
  //           alignItems: "center",
  //           justifyContent: "center",
  //           width: "10%",
  //         }}
  //       >
  //         <TouchableOpacity
  //           onPress={() => {

  //             setSelectedAddress(!selected);
  //           }}
  //           style={{
  //             height: 30,
  //             width: 30,
  //             borderRadius: 15,
  //             backgroundColor: "white",
  //             borderWidth: 1,
  //             borderColor: "#DDDDDD",
  //             alignItems: "center",
  //             justifyContent: "center",
  //           }}
  //         >
  //           {selected && (
  //             <Image
  //               style={{ height: 24, width: 24, resizeMode: "contain" }}
  //               source={require("../../../assets/images/greenTick.png")}
  //             ></Image>
  //           )}
  //         </TouchableOpacity>
  //       </View>
  //       <View
  //         style={{
  //           alignItems: "flex-start",
  //           justifyContent: "center",
  //           width: "70%",
  //         }}
  //       >
  //         <PoppinsTextLeftMedium
  //           style={{ color: "black", fontSize: 16, marginLeft: 10 }}
  //           content={`Address : ${address}`}
  //         ></PoppinsTextLeftMedium>
  //         <PoppinsTextMedium
  //           style={{ color: "black", fontSize: 16, marginLeft: 10 }}
  //           content={`City : ${city}`}
  //         ></PoppinsTextMedium>
  //         <PoppinsTextMedium
  //           style={{ color: "black", fontSize: 16, marginLeft: 10 }}
  //           content={`District : ${district}`}
  //         ></PoppinsTextMedium>
  //         <PoppinsTextMedium
  //           style={{ color: "black", fontSize: 16, marginLeft: 10 }}
  //           content={`State : ${state}`}
  //         ></PoppinsTextMedium>
  //         <PoppinsTextMedium
  //           style={{ color: "black", fontSize: 16, marginLeft: 10 }}
  //           content={`Pincode : ${pincode}`}
  //         ></PoppinsTextMedium>
  //       </View>
  //       <View
  //         style={{
  //           alignItems: "center",
  //           justifyContent: "center",
  //           width: "10%",
  //         }}
  //       >
  //         <TouchableOpacity
  //           onPress={() => {
  //             deleteAddress();
  //           }}
  //           style={{
  //             height: 30,
  //             width: 30,
  //             borderRadius: 15,
  //             backgroundColor: "white",
  //             alignItems: "center",
  //             justifyContent: "center",
  //           }}
  //         >
  //           {
  //             <Image
  //               style={{ height: 30, width: 30, resizeMode: "contain" }}
  //               source={require("../../../assets/images/delete.png")}
  //             ></Image>
  //           }
  //         </TouchableOpacity>
  //       </View>
  //     </View>
  //   );
  // };
  const AddressComponent = (props) => {
    const { address, city, state, country, index, district, pincode } = props;
    const [selected, setSelected] = useState(false);
    const addressJson = {
      address,
      index,
      city,
      district,
      state,
      country,
      pincode,
      id: props.data.id,
    };

    const toggleSelection = () => {
      props.setAddress(addressJson);

      setSelected(!selected); // If you want to toggle selection, uncomment this and remove 'selected' state
    };

    const deleteAddress = () => {
      props.deleteAddress(props?.data);
    };

    console.log("Address data from address component", props.data);
    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          width: "90%",
          // borderBottomWidth: 1,
          // borderColor: "#DDDDDD",
          borderRadius: 10,
          flexDirection: "row",
          paddingTop: 10,
          paddingBottom: 10,
          marginTop: 20,
        }}
      >
        {/* Selection Toggle */}
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: "10%",
          }}
        >
          <TouchableOpacity
            onPress={toggleSelection}
            style={{
              height: 30,
              width: 30,
              borderRadius: 15,
              backgroundColor: "white",
              borderWidth: 1,
              borderColor: "#DDDDDD",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {props.selectedIndex == index && (
              <Image
                style={{ height: 24, width: 24, resizeMode: "contain" }}
                source={require("../../../assets/images/greenTick.png")}
              />
            )}
          </TouchableOpacity>
        </View>

        {/* Address Details */}
        <View
          style={{
            alignItems: "flex-start",
            justifyContent: "center",
            width: "70%",
          }}
        >
          <PoppinsTextLeftMedium
            style={{
              color: "black",
              fontSize: 16,
              marginLeft: 10,
              marginTop: 10,
              fontWeight: "600",
            }}
            content={`${t("Address")} : ${address}`}
          />
          <PoppinsTextLeftMedium
            style={{
              color: "black",
              fontSize: 16,
              marginLeft: 10,
              marginTop: 20,
              fontWeight: "600",
            }}
            content={`${t("City")} : ${city}`}
          />
          <PoppinsTextLeftMedium
            style={{
              color: "black",
              fontSize: 16,
              marginLeft: 10,
              marginTop: 20,
              fontWeight: "600",
            }}
            content={`${t("District")} : ${district}`}
          />
          <PoppinsTextLeftMedium
            style={{
              color: "black",
              fontSize: 16,
              marginLeft: 10,
              marginTop: 20,
              fontWeight: "600",
            }}
            content={`${t("State")} : ${state}`}
          />
          <PoppinsTextLeftMedium
            style={{
              color: "black",
              fontSize: 16,
              marginLeft: 10,
              marginBottom: 10,
              marginTop: 20,
              fontWeight: "600",
            }}
            content={`${t("Pincode")} : ${pincode}`}
          />
        </View>

        {/* Delete Button */}
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: "10%",
          }}
        >
          <TouchableOpacity
            onPress={deleteAddress}
            style={{
              height: 30,
              width: 30,
              borderRadius: 15,
              backgroundColor: "white",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              style={{ height: 30, width: 30, resizeMode: "contain" }}
              source={require("../../../assets/images/delete.png")}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "flex-start",
        height: "100%",
        width: "100%",
        backgroundColor: secondaryThemeColor,
        flex: 1,
      }}
    >
      <View
        style={{
          alignItems: "center",
          justifyContent: "flex-start",
          flexDirection: "row",
          width: "100%",
          backgroundColor:'#FFF8E7',
          marginTop: 0,
          height: "10%",
          marginLeft: 20,
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
        <PoppinsTextMedium
          content={t("Added Address")}
          style={{
            marginLeft: 10,
            fontSize: 16,
            fontWeight: "700",
            color: "black",
          }}
        ></PoppinsTextMedium>
      </View>
      <View
        style={{
          height: "70%",
          width: "100%",
          alignItems: "center",
          justifyContent: "flex-start",
          backgroundColor: "white",
        }}
      >
        <ScrollView
          contentContainerStyle={{
            alignItems: "center",
            justifyContent: "center",
          }}
          style={{ width: "100%" }}
        >
          {
            getAllAddressData?.body?.[0] &&
            <View
            style={{
              backgroundColor: "#D6D4D4",
              height: 120,
              width: "90%",
              borderTopLeftRadius: 15,
              borderTopRightRadius: 15,
              alignItems: "center",
              marginTop: 30,
              justifyContent: "center",
              padding: 30,
            }}
          >
            <Text style={{ textAlign: "center", fontSize: 18, color: "black", fontWeight:'700' }}>
              Would you like to deliver to the same address ?
            </Text>
          </View>
            
          }
      
          {addressList &&
            addressList.map((item, index) => {
              return (
                <AddressComponent
                  key={index}
                  data={item}
                  deleteAddress={deleteAddress}
                  isSelected={item.status}
                  selectedIndex={selectedIndex}
                  setAddress={setAddress}
                  address={item.address}
                  city={item.city}
                  state={item.state}
                  district={item.district}
                  pincode={item.pincode}
                  country="India"
                  index={index}
                ></AddressComponent>
              );
            })}
        {getAllAddressData?.body?.[0] &&
          <View style={{ flexDirection: "row", width: "90%", marginTop: 20 ,justifyContent:'center'}}>
          <View
            style={{
              borderTopWidth: 1,
              borderColor: "#DDDDDD",
              width: "35%",
              marginTop:20
            }}
          ></View>
          <View
            style={{
              borderWidth: 1,
              borderColor:'#DDDDDD',
              height: 50,
              width: 50,
              borderRadius:25,

              alignItems: "center",
              justifyContent: "center",

            }}
          >
            <Text style={{fontSize:18, color:'black', fontWeight:'800'}}>OR</Text>
          </View>
          
          <View
            style={{
              borderTopWidth: 1,
              borderColor: "#DDDDDD",
              width: "35%",
              marginTop:20
            }}
          ></View>
        </View>
        }

        
          <TouchableOpacity onPress={()=>{
            navigation.navigate("AddAddress",{type:type});
          }} style={{marginTop:20, paddingHorizontal:40, backgroundColor:ternaryThemeColor, borderRadius:30,paddingVertical:10}}>
            <Text style={{color:'white', fontSize:18}}>Add New Address</Text>
          </TouchableOpacity>
        
        </ScrollView>
      </View>
      <View
        style={{
          height: "10%",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",

        }}
      >
        <TouchableOpacity
          style={{
            height: 50,
            width: 300,
            backgroundColor: "#000000",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 30,
          }}
          onPress={() => {
            if (selectedAddress) {
              navigation.replace("OtpVerification", {
                type: type == "dream" ? "dream" : "Gift",
                schemeType: schemeType,
                schemeID: schemeID,
              });
            } else {
              alert(t("Please select an address first"));
            }
          }}
        >
          <PoppinsTextMedium
            style={{ fontSize: 18, color: "white", fontWeight: "700" }}
            content={t("Submit")}
          ></PoppinsTextMedium>
        </TouchableOpacity>
        {/* {
          (addressList && !addressList.length > 0) &&
          <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            
          }}
        >
          <PoppinsText
            content={t("Add Address")}
            style={{ color: "#D5B60B", fontSize: 14 }}
          ></PoppinsText>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("AddAddress",{type:type});
            }}
            style={{
              backgroundColor:'white',
              height: 55,
              width: 55,
              elevation:1,
              borderRadius:30,
              alignItems: "center",
              justifyContent: "center",
              marginLeft: 10,
            }}
          >
            <Plus name="pluscircle" size={30} color={"#D5B60B"}></Plus>
          </TouchableOpacity>
        </View>
        } */}
     
      </View>
      <View style={{height:'10%',alignItems:'center',justifyContent:'center',width:'100%'}}>
        <SocialBottomBar showRelative={true}></SocialBottomBar>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default ListAddress;
