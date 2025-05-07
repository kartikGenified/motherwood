import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  ScrollView,
  Dimensions,
  Text,
} from "react-native";
import { useSelector } from "react-redux";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import { useTranslation } from "react-i18next";
import QR from "react-native-vector-icons/FontAwesome";
import PoppinsTextLeftMedium from "../../components/electrons/customFonts/PoppinsTextLeftMedium";
import ButtonProceed from "../../components/atoms/buttons/ButtonProceed";
import { useAssignApiMutation } from "../../apiServices/assignTo/AssignToAPi";
import * as Keychain from "react-native-keychain";
import MessageModal from "../../components/modals/MessageModal";
import ErrorModal from "../../components/modals/ErrorModal";
import TopBar from "../../components/topBar/TopBar";

const PostAssignmentScreen = ({ navigation, route }) => {
  const [qrList, setQrList] = useState([]);
  const [message, setMessage] = useState();
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showProceed, setShowProceed] = useState(false);
  const addedQrList = route.params.addedQrList;
  const userData = route.params.userData;
  const { t } = useTranslation();
  //   const addedQrList = route.params.addedQrList;
  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  );

  const [
    assignApiFunc,
    {
      data: assignApiData,
      error: assignApiError,
      isLoading: assignApiIsLoading,
      isError: assignApiIsError,
    },
  ] = useAssignApiMutation();

  useEffect(() => {
    if (addedQrList) {
      let tempQrList = [];
      for (var i = 0; i < addedQrList.length; i++) {
        tempQrList.push(addedQrList[i].id);
      }
      if (tempQrList.length == addedQrList.length) {
        setQrList(tempQrList);
        setShowProceed(true);
      }
    }
  }, [addedQrList]);

  useEffect(() => {
    if (assignApiData) {
      console.log("assignApiData", assignApiData);
      if (assignApiData.status == 200) {
        setSuccess(true);
        setMessage("Successfully assigned");
      }
    } else if (assignApiError) {
      setError(true);
      setMessage(assignApiError.message);
      console.log("assignApiError", assignApiError);
    }
  }, [assignApiData, assignApiError]);

  const handleSubmission = async () => {
    console.log("pressed");
    const body = {
      sell_to_app_user_id: userData.id,
      qr_id: qrList,
    };
    const credentials = await Keychain.getGenericPassword();
    const token = credentials.username;
    const params = {
      body: body,
      token: token,
    };
    console.log("assignApiFunc", JSON.stringify(params));
    assignApiFunc(params);
  };
  const modalClose = () => {
    setError(false);
    setSuccess(false);
  };

  return (
    <View
      style={{
        height: "100%",
        width: "100%",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        flex: 1,
      }}
    >
      {/* <View
        style={{
          height: "8%",
          width: "100%",
          backgroundColor: ternaryThemeColor,
          alignItems: "center",
          justifyContent: "flex-start",
          flexDirection: "row",

          // marginTop: 10,
        }}
      >
        <TouchableOpacity
          style={{ height: 20, width: 20, marginLeft: 10 }}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Image
            style={{ height: 20, width: 20, resizeMode: "contain" }}
            source={require("../../../assets/images/blackBack.png")}
          ></Image>
        </TouchableOpacity>

        <PoppinsTextMedium
          style={{ fontSize: 20, color: "#ffffff", marginLeft: 10 }}
          content={t("Assigned Items ")}
        ></PoppinsTextMedium>

        {error && (
          <ErrorModal
            modalClose={modalClose}
            message={message}
            openModal={error}
          ></ErrorModal>
        )}

      </View> */}
              {success && (
          <MessageModal
            modalClose={modalClose}
            title={"Thanks"}
            message={message}
            openModal={success}
            navigateTo="Dashboard"
            buttonText="Close"
          ></MessageModal>
        )}
      <TopBar title="Assigned Items"></TopBar>
      <PoppinsTextMedium
        style={{
          color: "black",
          fontSize: 16,
          fontWeight: "700",
          marginTop: 20,
          marginLeft: 30,
        }}
        content="Assigning To"
      ></PoppinsTextMedium>

      <View
        style={{
          width: "90%",
          alignSelf: "center",
          marginTop: 10,
          height:'70%',
        }}
      >
        <FlatList
          
          contentContainerStyle={{
            alignItems: "center",
            justifyContent: "center",
            marginTop: 0,
            width: "100%",

          }}
          style={{ width: "100%" }}
          data={addedQrList}
          renderItem={({ item, index }) => (
            <View
              style={{
                marginTop: 20,
                backgroundColor: "white",
                padding: 25,
                width: 350,
                borderRadius: 10,
              }}
            >
              <View style={{ width: "100%", backgroundColor: "white" }}>
                <View style={{ flexDirection: "row" }}>
                  <PoppinsTextLeftMedium
                    style={{ color: ternaryThemeColor, fontSize: 14 }}
                    content={`Name : `}
                  ></PoppinsTextLeftMedium>
                  <PoppinsTextLeftMedium
                    style={{ color: "#242424", fontSize: 14 }}
                    content={`${userData.name}`}
                  ></PoppinsTextLeftMedium>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  backgroundColor: "white",
                }}
              >
                <PoppinsTextLeftMedium
                  style={{ color: ternaryThemeColor, fontSize: 14 }}
                  content={`User Type : `}
                ></PoppinsTextLeftMedium>

                <PoppinsTextLeftMedium
                  style={{ color: "#242424", fontSize: 14 }}
                  content={`${userData.user_type}`}
                ></PoppinsTextLeftMedium>
              </View>

              <View style={{ width: "100%", backgroundColor: "white" }}>
                {/* <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                  }}
                >
                  <PoppinsTextMedium
                    style={{
                      color: "black",
                      fontSize: 14,
                      textAlign: "left",
                      fontWeight: "600",
                      marginLeft: 4,
                    }}
                    content={index + 1}
                  ></PoppinsTextMedium>
                  <QR
                    style={{ marginLeft: 10 }}
                    size={24}
                    color={"black"}
                    name={"qrcode"}
                  ></QR>
                </View> */}

                <View style={{ flexDirection: "row", width: "100%" }}>
                  <PoppinsTextLeftMedium
                    style={{
                      color: ternaryThemeColor,
                      fontSize: 14,
                      textAlign: "left",
                      fontWeight: "600",
                    }}
                    content={`Visible code:`}
                  ></PoppinsTextLeftMedium>
                  <PoppinsTextLeftMedium
                    style={{
                      color: "#242424",
                      fontSize: 14,
                      textAlign: "left",
                      fontWeight: "600",
                    }}
                    content={`${item.batch_running_code}`}
                  ></PoppinsTextLeftMedium>
                </View>

                <View style={{ flexDirection: "row" }}>
                  <PoppinsTextLeftMedium
                    style={{
                      color: ternaryThemeColor,
                      fontSize: 14,
                      textAlign: "left",
                    }}
                    content={`Product code: `}
                  ></PoppinsTextLeftMedium>
                  <PoppinsTextLeftMedium
                    style={{
                      color: "#242424",
                      fontSize: 14,
                      textAlign: "left",
                    }}
                    content={`${item.product_code}`}
                  ></PoppinsTextLeftMedium>
                </View>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
        
      </View>
      <View style={{width:'100%',alignItems:'center',justifyContent:'center'}}>
      {showProceed && (

<ButtonProceed
containerStyle={{width:'64%',height:50}}
  handleOperation={handleSubmission}
  style={{ color: "white"}}
  content="Proceed"
></ButtonProceed>

)}
      </View>
          
    </View>
  );
};

const styles = StyleSheet.create({});

export default PostAssignmentScreen;
