//import liraries
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  Modal,
} from "react-native";
import { useDeleteDreamGiftMutation, useSelectedDreamGiftMutation } from "../../apiServices/dreamGift/DreamGiftApi";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import * as Keychain from "react-native-keychain";
import { useDispatch, useSelector } from "react-redux";
import ConfettiCannon from "react-native-confetti-cannon";
import {
  setSelectedGift,
  setIsAchieved,
  setNavigationFromDreamGift,
} from "../../../redux/slices/dreamGiftSlice";
import FastImage from "react-native-fast-image";
import Delete from 'react-native-vector-icons/MaterialCommunityIcons'

// create a component
const DreamCard = () => {
  const [dreamGift, setDreamGift] = useState();
  const [dreamGiftId, setDreamGiftId] = useState();
  const [profilePercentage, setProfilePercentage] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const focused = useIsFocused();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const gifUri = Image.resolveAssetSource(require('../../../assets/gif/loaderNew.gif')).uri;
  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  );
  const userData = useSelector(state => state.appusersdata.userData)

  const [
    deleteDreamGiftFunc,
    {
      data: deleteDreamGiftData,
      error: deleteDreamGiftError,
      isLoading: deleteDreamGiftIsLoading,
      isError: deleteDreamGiftIsError
    }
  ] = useDeleteDreamGiftMutation();

  const [
    selectedDreamFunc,
    {
      data: selectedDreamData,
      error: selectedDreamError,
      isLoading: selectedDreamisLoading,
      isError: selectedDreamIsError,
    },
  ] = useSelectedDreamGiftMutation();

  useEffect(() => {
    const fetchPoints = async () => {
      const credentials = await Keychain.getGenericPassword();
      const token = credentials.username;
      const params = {
        token: token,
      };
      selectedDreamFunc(params);
    };
    fetchPoints();
  }, [focused, deleteDreamGiftData]);

  useEffect(() => {
    if (deleteDreamGiftData) {
      setModalVisible(false);
    }
  }, [deleteDreamGiftData, deleteDreamGiftError]);

  useEffect(() => {
    if (selectedDreamData) {
      setDreamGift(selectedDreamData?.body?.[0]?.gift);
      setDreamGiftId(selectedDreamData?.body[0]?.id);
      setProfilePercentage(selectedDreamData?.body?.[0]?.perc);
      
      if (selectedDreamData?.body[0]?.is_achieved) {
        dispatch(setSelectedGift(selectedDreamData?.body?.[0]?.gift));
        dispatch(setIsAchieved(true));
      }
    }
  }, [selectedDreamData, selectedDreamError]);

  const navigateToredeem = async () => {
    dispatch(setNavigationFromDreamGift(true));
    navigation.replace("CartList", {
      cart: [dreamGift],
      schemeType: "",
      schemeID: "",
    });
  };

  const hideModal = () => {
    setModalVisible(false);
  };

  const deleteData = async () => {
    const credentials = await Keychain.getGenericPassword();
    const token = credentials.username;
    const params = {
      token: token,
      dreamGiftId: dreamGiftId,
    };
    deleteDreamGiftFunc(params);
  };

  return (
    dreamGift && (
      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible && modalVisible}
          onRequestClose={hideModal}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text
                style={{
                  color: ternaryThemeColor,
                  fontSize: 24,
                  fontWeight: "600",
                }}
              >
                Delete Current Dream Gift
              </Text>
              <Text
                style={{
                  color: ternaryThemeColor,
                  fontSize: 18,
                  fontWeight: "500",
                  textAlign: "center",
                  marginTop: 30,
                }}
              >
                Are you sure you want to delete current dream gift ?
              </Text>
              {!deleteDreamGiftIsLoading && (
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', width: '100%', marginTop: 30 }}>
                  <TouchableOpacity
                    style={{ height: 36, paddingLeft: 10, paddingRight: 10, borderRadius: 4, backgroundColor: 'grey' }}
                    onPress={hideModal}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 24,
                        fontWeight: "600",
                      }}
                    >
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ height: 36, paddingLeft: 10, paddingRight: 10, borderRadius: 4, backgroundColor: 'grey' }}
                    onPress={deleteData}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 24,
                        fontWeight: "600",
                      }}
                    >
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
              {deleteDreamGiftIsLoading && (
                <FastImage
                  style={{ width: 100, height: 100, alignSelf: 'center', marginTop: '60%' }}
                  source={{
                    uri: gifUri,
                    priority: FastImage.priority.normal,
                  }}
                  resizeMode={FastImage.resizeMode.contain}
                />
              )}
              {deleteDreamGiftData && deleteDreamGiftData.status == 200 && (
                <Text
                  style={{
                    color: ternaryThemeColor,
                    fontSize: 16,
                    fontWeight: "500",
                    textAlign: "center",
                    marginTop: 30,
                  }}
                >
                  Dream gift Deleted Successfully!!
                </Text>
              )}
              {deleteDreamGiftIsError && (
                <Text
                  style={{
                    color: ternaryThemeColor,
                    fontSize: 16,
                    fontWeight: "500",
                    textAlign: "center",
                    marginTop: 30,
                  }}
                >
                  There was a problem in deleting your dream gift.
                </Text>
              )}
            </View>
          </View>
        </Modal>
        {dreamGift && (
          <View
            style={{
              width: "90%",
              alignItems: "center",
              backgroundColor: (userData?.user_type.toLowerCase() == "carpenter" || userData?.user_type.toLowerCase() == "oem" || userData?.user_type.toLowerCase() == "directoem" || userData?.user_type.toLowerCase() == "carpenter") ? '#00A79D' : ternaryThemeColor,
              borderRadius: 10,
              marginBottom: 20,
            }}
          >
            <View style={{ borderRadius: 40, borderTopLeftRadius: 20 }}>
              <ImageBackground
                style={{
                  height: 140,
                  width: "100%",
                  flexDirection: "row",
                  borderRadius: 40,
                }}
            source={require("../../../assets/images/carBackRed.png")}
              >
                <View style={{ width: "50%", justifyContent: "center" }}>
                  <Image
                    style={{
                      height: 100,
                      width: 140,
                      resizeMode: "contain",
                    }}
                    source={{ uri: dreamGift.images[0] }}
                  />
                </View>
                <View style={{ width: "50%", alignItems: "center" }}>
                  <Image
                    style={{
                      height: 30,
                      width: "80%",
                      resizeMode: "contain",
                    }}
                    source={require("../../../assets/images/congratulation.png")}
                  />
                  <Text
                    style={{ color: "white", fontSize: 12, fontWeight: "500" }}
                  >
                    Your Dream Gift
                  </Text>
                  <Image
                    style={{
                      height: 10,
                      marginTop: 10,
                      width: 20,
                      resizeMode: "contain",
                    }}
                    source={require("../../../assets/images/downArrow.png")}
                  />
                  <Text
                    style={{
                      color: "white",
                      fontSize: 13,
                      width: "60%",
                      fontWeight: "bold",
                      textAlign: "center",
                      letterSpacing: 1.2,
                    }}
                  >
                    {dreamGift.gift_name}
                  </Text>
                </View>
              </ImageBackground>
            </View>
            <View
              style={{
                backgroundColor: (userData?.user_type.toLowerCase() == "carpenter" || userData?.user_type.toLowerCase() == "oem" || userData?.user_type.toLowerCase() == "directoem" || userData?.user_type.toLowerCase() == "carpenter") ? '#00A79D' : ternaryThemeColor,
                height: 60,
                width: "90%",
                marginBottom: 40,
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 15,
                  fontWeight: "800",
                  textAlign: "center",
                  marginTop: 10,
                }}
              >
                Every step brings you closer!
              </Text>
              {profilePercentage >= 0 && (
                <View style={{ width: 280 }}>
                  <View
                    style={{
                      height: 20,
                      borderRadius: 10,
                      backgroundColor: "white",
                      marginTop: 10,
                      flexDirection: "row",
                    }}
                  >
                    <View
                      style={{
                        height: 30,
                        width: 30,
                        position: "absolute",
                        top: -5,
                        left: -10,
                        backgroundColor: "black",
                        borderRadius: 40,
                      }}
                    />
                    <View
                      style={{
                        position: "absolute",
                        top: 25,
                        left: 1,
                      }}
                    >
                      <Text
                        style={{
                          color: "#fff",
                          fontWeight: "800",
                          fontSize: 18,
                        }}
                      >
                        {selectedDreamData?.body?.length > 0 && (Number(selectedDreamData?.body[0]?.point_balance) >
                          Number(selectedDreamData?.body[0]?.value)
                          ? Number(selectedDreamData?.body[0]?.value)
                          : Number(selectedDreamData?.body[0]?.point_balance))}
                      </Text>
                    </View>
                    <View
                      style={{
                        position: "absolute",
                        top: 25,
                        right: 1,
                      }}
                    >
                      <Text
                        style={{
                          color: "#fff",
                          fontWeight: "800",
                          fontSize: 18,
                        }}
                      >
                        {selectedDreamData?.body?.length > 0 && (Number(selectedDreamData?.body[0]?.value)
                          ? Number(selectedDreamData?.body[0]?.value)
                          : 0)}
                      </Text>
                    </View>
                    <View
                      style={[
                        {
                          height: 20,
                          borderRadius: 10,
                        },
                        {
                          width: `${Number(profilePercentage)}%`,
                          backgroundColor:
                            profilePercentage == 0 ? "green" : "black",
                        },
                      ]}
                    />
                    {profilePercentage && (
                      <Text
                        style={{
                          color: "white",
                          marginLeft:
                            profilePercentage < 9
                              ? 0
                              : profilePercentage >= 4 && profilePercentage < 6
                                ? -18
                                : -30,
                          textAlign: "center",
                          textAlignVertical: "center",
                          fontSize: 12,
                        }}
                      >
                        {profilePercentage && Math.floor(profilePercentage) + "%"}
                      </Text>
                    )}
                  </View>
                </View>
              )}
              {profilePercentage == 100 && (
                <View style={{ width: "50%" }}>
                  <ConfettiCannon
                    fadeOut={true}
                    fallSpeed={5000}
                    explosionSpeed={100}
                    autoStart={true}
                    count={100}
                    origin={{ x: -10, y: 0 }}
                  />
                </View>
              )}
            </View>
            {selectedDreamData?.body[0]?.is_achieved && (
              <View style={{ marginBottom: 30, flexDirection: 'row' }}>
                <TouchableOpacity
                  onPress={navigateToredeem}
                  style={{
                    padding: 10,
                    backgroundColor: "black",
                    borderWidth: 1,
                    borderRadius: 10,
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>
                    Redeem Your Dream Gift
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            <TouchableOpacity style={{ position: 'absolute', right: 10, bottom: 70 }} onPress={() => {
              setModalVisible(!modalVisible)
            }}>
              <Delete name="delete-circle" size={30} color={"#DDDDDD"} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    )
  );
};

// define your styles
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(52, 52, 52, 0.8)'
  },
  modalView: {
    padding: 40,
    margin: 10,
    backgroundColor: "#ECFCFC",
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

//make this component available to the app
export default DreamCard;
