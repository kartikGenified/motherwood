//import liraries
import React, { Component, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
} from "react-native";
import { useSelector } from "react-redux";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import SocialBottomBar from "../../components/socialBar/SocialBottomBar";
import { useApproveUserForSalesMutation } from "../../apiServices/approveUser/ApproveUserApi";
import { TextInput } from "react-native-paper";
import PincodeDropDown from "../../components/atoms/dropdown/PincodeDropDown";
import { setError } from "../../../redux/slices/errorSlice";
import * as Keychain from "react-native-keychain";
import ErrorModal from "../../components/modals/ErrorModal";
import MessageModal from "../../components/modals/MessageModal";
import Close from "react-native-vector-icons/Ionicons";

// create a component
const UserManagementDetails = (params) => {
  const [reason, setReason] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const secondaryThemeColor = useSelector(
    (state) => state.apptheme.secondaryThemeColor
  );

  const navigation = useNavigation();
  const userData = useSelector((state) => state.appusersdata.userData);

  const route = params?.route?.params?.data;
  console.log("route", route);

  const { t } = useTranslation();

  const [
    approveUserForSalesFunc,
    {
      data: approveUserForSalesData,
      error: approveUserForSalesError,
      isLoading: approveUserForSalesIsLoading,
      isError: approveUserForSalesIsError,
    },
  ] = useApproveUserForSalesMutation();


  useEffect(() => {
    if (approveUserForSalesData) {
      console.log("approveUserForSalesData", approveUserForSalesData);
      setMessage(approveUserForSalesData.message)
      setSuccess(true)
    } else if (approveUserForSalesError) {
      console.log("approveUserForSalesError", approveUserForSalesError);
      setError(true)
      setMessage(approveUserForSalesError?.data?.message)
    }
  }, [approveUserForSalesData, approveUserForSalesError]);


  const handleChildComponentData = (data) => {
    console.log("reason", data);
    setReason(data);
  };

  const handleStatus = async (status) => {
    const credentials = await Keychain.getGenericPassword();
    const token = credentials.username;
    const params = {
      token: token,
      userId: route.id,
      status: status,
    };

    if (status == "APPROVED") {
      approveUserForSalesFunc(params);
    } else {
      setModalVisible(true);
    }
  };

  const submitApproval = async() => {
    const credentials = await Keychain.getGenericPassword();
    const token = credentials.username;
    const params = {
      token: token,
      userId: route.id,
      status: "REJECTED",
      reason: reason,
    };

    if(reason) 
    {
      approveUserForSalesFunc(params);
    } 
    else 
    {
      setError(true);
      setMessage("Kindly enter a reason before rejecting the request");
    }
  };

  const modalClose = () => {
    setError(false);
    setSuccess(false);
    setMessage("");
  };

  const SingleComponent = ({ title, value }) => {
    return (
      <View
        style={{
          justifyContent: "space-between",
          borderBottomWidth: 1,
          borderColor: "#9F9F9F",
          backgroundColor: "white",
          flexDirection: "row",
          paddingHorizontal: 20,
          height: 55,
          alignItems: "center",
          marginHorizontal: 20,
        }}
      >
        <Text style={{ color: "#9F9F9F", fontSize: 18 }}>{title}</Text>
        <Text style={{ color: "black" }}>{value}</Text>
      </View>
    );
  };

  return (
    <View style={{ height: "100%", width: "100%", flex: 1 }}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View
              style={{
                width: "100%",
                backgroundColor: "#C2142C",
                height: 40,
                justifyContent: "center",
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              }}
            >
              <PoppinsTextMedium
                style={{ position: "absolute", left: 20, color: "white" }}
                content="Select Reason"
              ></PoppinsTextMedium>
              <Close
              onPress={()=>{
                setModalVisible(false)
              }}
                style={{ position: "absolute", right: 10 }}
                name="close"
                size={17}
                color="#ffffff"
              />
            </View>
            <View
              style={{
                paddingRight: 10,
                paddingLeft: 10,
                paddingBottom: 10,
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View style={{ width: "100%", alignItems: "flex-start" }}>
                <PoppinsTextMedium
                  content="Select"
                  style={{
                    color: "black",
                    marginLeft: 30,
                    marginTop: 10,
                    fontWeight: "700",
                    fontSize: 16,
                  }}
                ></PoppinsTextMedium>
                <View
                  style={{
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PincodeDropDown
                    header="Select Reason"
                    data={[
                      "Not a Contractor/Carpenter",
                      "Unable to Contact",
                      "Not Traceable",
                      "Not belonging to my territory",
                      "Others",
                    ]}
                    handleData={handleChildComponentData}
                  ></PincodeDropDown>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => {
                  submitApproval();
                }}
                style={{
                  height: 50,
                  width: "40%",
                  backgroundColor: "black",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 20,
                  borderRadius: 8,
                }}
              >
                <PoppinsTextMedium
                  style={{ color: "white" }}
                  content="Submit"
                ></PoppinsTextMedium>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <ScrollView
        contentContainerStyle={{}}
        style={{ minHeight: "90%", backgroundColor: "white" }}
      >
        {error && (
          <ErrorModal
            modalClose={modalClose}
            message={message}
            openModal={error}
            navigateTo={"UserManagement"}
          ></ErrorModal>
        )}
        {success && (
          <MessageModal
            modalClose={modalClose}
            title={"Thanks"}
            message={message}
            openModal={success}
            navigateTo={"UserManagement"}

          ></MessageModal>
        )}

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

        <SingleComponent title={"Customer ID"} value={route?.id} />
        <SingleComponent title={"User Type"} value={route?.user_type} />
        <SingleComponent title={"Name"} value={route?.name} />
        {/* <SingleComponent title={"Customer Code"} value={route?.name}/> */}
        <SingleComponent title={"Mobile No"} value={route?.mobile} />
        <SingleComponent
          title={"Branch"}
          value={route?.city ? route?.city : "N/A"}
        />
        <SingleComponent
          title={"Location"}
          value={route?.city ? route?.city : "N/A"}
        />
        <SingleComponent
          title={"Geo Location"}
          value={route?.city ? route?.city : "N/A"}
        />
        <SingleComponent
          title={"Aproval Status"}
          value={route?.city ? route?.city : "N/A"}
        />
        <SingleComponent
          title={"Aproval By"}
          value={route?.city ? route?.city : "N/A"}
        />

        <View
          style={{
            margin: 10,
            justifyContent: "space-between",
            flexDirection: "row",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("KycViewOtherUsers", { data: route });
            }}
          >
            <Text style={{ fontSize: 18, color: "#B6202D" }}>View KYC</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate("AddedUserScanList", {
                data: route,
              });
            }}
          >
            <Text style={{ fontSize: 18, color: "#B6202D" }}>
              View Point History
            </Text>
          </TouchableOpacity>
        </View>

        {route.status == "1" && !route?.extra_status?.approved && (
          <View
            style={{
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                margin: 10,
                justifyContent: "center",
                flexDirection: "row",
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: "green",
                  padding: 8,
                  width: 100,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 8,
                }}
                onPress={() => {
                  handleStatus("APPROVED");
                }}
              >
                <Text
                  style={{ fontSize: 16, color: "white", fontWeight: "700" }}
                >
                  APPROVE
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  backgroundColor: "#C2142C",
                  padding: 8,
                  width: 100,
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: 20,
                  borderRadius: 8,
                }}
                onPress={() => {
                  handleStatus("REJECTED");
                }}
              >
                <Text
                  style={{ fontSize: 16, color: "white", fontWeight: "700" }}
                >
                  REJECT
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
      <SocialBottomBar showRelative={true} />
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(52, 52, 52, 0.8)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
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
    width: "84%",
    minHeight: 240,
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
export default UserManagementDetails;
