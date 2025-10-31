import React, { useState, useEffect } from "react";
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
import { useGetNameMutation } from "../../apiServices/login/GetNameByMobile";
import { useSelector } from "react-redux";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import { useTranslation } from "react-i18next";
import PoppinsTextLeftMedium from "../../components/electrons/customFonts/PoppinsTextLeftMedium";
import ButtonProceed from "../../components/atoms/buttons/ButtonProceed";
import TopBar from "../../components/topBar/TopBar";
import Icon from "react-native-vector-icons/Entypo";
const AssignUser = ({ navigation, route }) => {
  const [mobileNumber, setMobileNumber] = useState();
  const [userFound, setUserFound] = useState();
  const [showButton, setShowButton] = useState(false);
  const [showProceed, setShowProceed] = useState(false);
  const [
    getNameFunc,
    {
      data: getNameData,
      error: getNameError,
      isLoading: getLoading,
      isError: getIsError,
    },
  ] = useGetNameMutation();

  const { t } = useTranslation();
  //   const addedQrList = route.params.addedQrList;
  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  );
  const secondaryThemeColor = useSelector(
    (state) => state.apptheme.secondaryThemeColor
  );
  useEffect(() => {
    if (getNameData) {
      console.log("getNameData", JSON.stringify(getNameData));
      if (Object.keys(getNameData?.body).length == 0) {
        setUserFound(false);
      } else {
        setUserFound(true);
        setShowButton(true);
      }
    } else if (getNameError) {
      console.log("getNameError", getNameError);
    } else if (!getNameData) {
      setShowButton(false);
    }
  }, [getNameData, getNameError]);

  const handleAddQr = () => {

    navigation.navigate("AssignmentScanner", { userData: getNameData?.body });
  };

  const searchUser = () => {
    const body = { mobile: mobileNumber };
    console.log("get name params", body);
    getNameFunc(body);
  };

  return (
    <View
      style={{
        flex: 1,
        height: "100%",
        width: "100%",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      <TopBar title="Assign Product"></TopBar>
      <View
        style={{
          height: "87%",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",

          // backgroundColor: ternaryThemeColor,
          position: "absolute",

          bottom: 0,
        }}
      >
        {/* <FlatList
        contentContainerStyle={{alignItems:'flex-start',justifyContent:'flex-start',marginTop:10,height:'15%'}}
                  style={{width:'96%'}}
                  data={addedQrList}
                //   numColumns={2}
                horizontal={true}
                  renderItem={({ item, index }) => (
            <View
              style={{
                width: 220,
                alignItems: "center",
                justifyContent: "flex-start",
                backgroundColor: "white",
                borderRadius: 10,
                padding:12,
                flexDirection:'row',
                margin:4
              }}
            >
                 <PoppinsTextMedium
                  style={{
                    color: "black",
                    fontSize: 14,
                    textAlign: "left",
                    fontWeight: "600",
                    marginLeft:4,
                    
                  }}
                  content={index+1}
                ></PoppinsTextMedium>
                <QR style={{marginLeft:10}} size={30} color={"black"} name={"qrcode"}></QR>
              <View style={{marginLeft:10,width:'74%',justifyContent:'flex-start',alignItems:'flex-start'}}>
                <PoppinsTextMedium
                  style={{
                    color: "black",
                    fontSize: 11,
                    textAlign: "left",
                    fontWeight: "600",
                  }}
                  content={`Visible code: ${item.batch_running_code}`}
                ></PoppinsTextMedium>
                <PoppinsTextMedium
                  style={{
                    color: "black",
                    fontSize: 11,
                    textAlign: "left",
                    fontWeight: "600",
                  }}
                  content={`Product code: ${item.product_code}`}
                ></PoppinsTextMedium>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id}
        /> */}
        <View
          style={{
            width: "100%",
            position: "absolute",
            top: 10,
            alignItems: "center",
            justifyContent: "flex-start",
            paddingBottom: 20,
          }}
        >
          <View
            style={{
              justifyContent: "flex-start",
              marginTop: 45,
              width: "100%",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PoppinsTextLeftMedium
                style={{
                  color: "black",
                  fontSize: 17,
                  textAlign: "left",
                  marginLeft: 10,
                }}
                content={t("Search user by mobile number")}
              ></PoppinsTextLeftMedium>
            </View>
            <View
              style={{
                width: "90%",
                marginTop: 20,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "white",
                borderRadius: 10,
                flexDirection: "row",
              }}
            >
              <TextInput
              placeholderTextColor={"black"}
                placeholder={t("Mobile Number")}
                keyboardType="numeric"
                value={mobileNumber}
                onChangeText={(val) => {
                  setMobileNumber(val);
                }}
                // maxLength={11}88
                style={{
                  width: "60%",
                  backgroundColor: "white",
                  borderRadius: 10,
                  color: "black",
                  letterSpacing: 3,
                  fontWeight: "700",
                  fontSize: 16,
                  marginLeft: 10,
                }}
              ></TextInput>

              <Icon
                style={{ position: "absolute", left: 10 }}
                name="magnifying-glass"
                size={30}
                color={ternaryThemeColor}
              ></Icon>
            </View>
            <TouchableOpacity
              onPress={() => {
                searchUser();
              }}
              style={{
                width: "36%",
                backgroundColor: ternaryThemeColor,
                margin: 10,
                marginTop: 40,
                padding: 10,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "#DDDDDD",
              }}
            >
              <PoppinsTextLeftMedium
                style={{ color: "white", textAlign: "center", fontSize: 17 }}
                content={t("Search")}
              ></PoppinsTextLeftMedium>
            </TouchableOpacity>
          </View>

          {getNameData && (
            <View
              style={{
                width: "100%",
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {userFound && (
                <View
                  style={{
                    padding: 20,
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                    backgroundColor: "white",
                    borderRadius: 10,
                    marginTop: 20,
                    width: "80%",
                  }}
                >
                  <View
                    style={{
                      width: "100%",
                      flexDirection: "row",
                      marginLeft: 10,
                    }}
                  >
                    <PoppinsTextMedium
                      style={{
                        color: ternaryThemeColor,
                        fontWeight: "700",
                        fontSize: 16,
                      }}
                      content={t("Name : ")}
                    ></PoppinsTextMedium>
                    <PoppinsTextMedium
                      style={{
                        color: "black",
                        fontWeight: "700",
                        fontSize: 16,
                      }}
                      content={getNameData?.body?.name}
                    ></PoppinsTextMedium>
                  </View>
             
                  <View
                    style={{
                      width: "100%",
                      flexDirection: "row",
                      marginLeft: 10,
                      marginTop:10
                    }}
                  >
                    <PoppinsTextMedium
                      style={{
                        color: ternaryThemeColor,
                        fontWeight: "700",
                        fontSize: 16,
                      }}
                      content={t("User Type : ")}
                    ></PoppinsTextMedium>
                    <PoppinsTextMedium
                      style={{
                        color: "black",
                        fontWeight: "700",
                        fontSize: 16,
                      }}
                      content={getNameData?.body?.user_type}
                    ></PoppinsTextMedium>
                  </View>
                </View>
              )}
              {!userFound && (
                <View
                  style={{
                    width: "100%",
                    marginTop: 20,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PoppinsTextLeftMedium
                    style={{
                      fontSize: 16,
                      color: ternaryThemeColor,
                      fontWeight: "700",
                    }}
                    content={t("User Not found")}
                  ></PoppinsTextLeftMedium>
                </View>
              )}
            </View>
          )}
        </View>
      </View>
      <View
        style={{

          backgroundColor: "white",
          position: "absolute",

          bottom: 20,
        }}
      >
        {/* {showButton && (
          <ButtonProceed
            handleOperation={handleAddQr}
            style={{ color: "white" }}
            content="Proceed"
            navigateTo={"AssignmentScanner"}
          ></ButtonProceed>
        )} */}

        {userFound && <TouchableOpacity  style={{alignItems:'center',backgroundColor:ternaryThemeColor , height:60, width:200, justifyContent:'center', borderRadius:8}} onPress={()=>{handleAddQr()}}>
                    <PoppinsTextLeftMedium style={{textAlign:'center', color:'white', fontSize:20}} content={t("OK")}></PoppinsTextLeftMedium>
        </TouchableOpacity>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default AssignUser;
