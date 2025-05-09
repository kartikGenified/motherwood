import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { BaseUrl } from "../../utils/BaseUrl";
import LinearGradient from "react-native-linear-gradient";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import PoppinsText from "../../components/electrons/customFonts/PoppinsText";
import CustomTextInput from "../../components/organisms/CustomTextInput";
import CustomTextInputNumeric from "../../components/organisms/CustomTextInputNumeric";
import ButtonNavigateArrow from "../../components/atoms/buttons/ButtonNavigateArrow";
import { useGetLoginOtpMutation } from "../../apiServices/login/otpBased/SendOtpApi";
import ButtonNavigate from "../../components/atoms/buttons/ButtonNavigate";
import ErrorModal from "../../components/modals/ErrorModal";
import { useGetNameMutation } from "../../apiServices/login/GetNameByMobile";

import { useIsFocused } from "@react-navigation/native";
import PoppinsTextLeftMedium from "../../components/electrons/customFonts/PoppinsTextLeftMedium";
import Checkbox from "../../components/atoms/checkbox/Checkbox";
import { useFetchLegalsMutation } from "../../apiServices/fetchLegal/FetchLegalApi";
import * as Keychain from "react-native-keychain";
import FastImage from "react-native-fast-image";
import { useTranslation } from "react-i18next";
import AlertModal from "../../components/modals/AlertModal";
import crashlytics from "@react-native-firebase/crashlytics";
import { appIcon, eKyc } from "../../utils/HandleClientSetup";
import TextInputInsIdePlaceholder from "../../components/atoms/input/TextInputInsIdePlaceholder";
import { useGetLoginOtpForVerificationMutation } from "../../apiServices/otp/GetOtpApi";
import SocialBottomBar from "../../components/socialBar/SocialBottomBar";

const OtpLogin = ({ navigation, route }) => {
  const [mobile, setMobile] = useState("");
  const [name, setName] = useState("test");
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState();
  const [error, setError] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [hideButton, setHideButton] = useState(false);
  const [alert, setAlert] = useState(false);
  const { t } = useTranslation();
  // fetching theme for the screen-----------------------

  const primaryThemeColor = useSelector(
    (state) => state.apptheme.primaryThemeColor
  );

  const secondaryThemeColor = useSelector(
    (state) => state.apptheme.secondaryThemeColor
  );

  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  );

  const buttonThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  );

  const icon = useSelector((state) => state.apptheme.icon);

  console.log("Icon in  select user", icon);

  // ------------------------------------------------
  const focused = useIsFocused();

  // send otp for login--------------------------------
  const [
    sendOtpFunc,
    {
      data: sendOtpData,
      error: sendOtpError,
      isLoading: sendOtpIsLoading,
      isError: sendOtpIsError,
    },
  ] = useGetLoginOtpMutation();

  //for Registration
  const [sendOtpFuncReg, {
    data: sendOtpDataReg,
    error: sendOtpErrorReg,
    isLoading: sendOtpIsLoaReg
  }] = useGetLoginOtpForVerificationMutation()

  const [
    getTermsAndCondition,
    {
      data: getTermsData,
      error: getTermsError,
      isLoading: termsLoading,
      isError: termsIsError,
    },
  ] = useFetchLegalsMutation();

  const [
    getNameFunc,
    {
      data: getNameData,
      error: getNameError,
      isLoading: getLoading,
      isError: getIsError,
    },
  ] = useGetNameMutation();

  const needsApproval = route?.params?.needsApproval;
  const user_type_id = route?.params?.userId;
  const user_type = route?.params?.userType;
  const registrationRequired = route?.params?.registrationRequired;
  console.log("registrationRequiredotpLogin", registrationRequired);
  const width = Dimensions.get("window").width;
  const navigationParams = {
    needsApproval: needsApproval,
    user_type_id: user_type_id,
    user_type: user_type,
    mobile: mobile,
    name: mobile,
    registrationRequired:registrationRequired
  };
  console.log("navigationParams", navigationParams);

  const gifUri = Image.resolveAssetSource(
    require("../../../assets/gif/loaderNew.gif")
  ).uri;

  useEffect(() => {
    fetchTerms();
    setHideButton(false);
  }, [focused, registrationRequired]);

  useEffect(() => {
    if (getTermsData) {
      console.log("getTermsData", getTermsData?.body?.data?.[0]?.files[0]);
    } else if (getTermsError) {
      console.log("gettermserror", getTermsError);
    }
  }, [getTermsData, getTermsError]);

  useEffect(() => {
    if (sendOtpData) {
      console.log("sendOtpData", sendOtpData);
      if (sendOtpData?.success === true && mobile.length === 10) {
        if (Object.keys(getNameData?.body).length != 0) {
          navigation.navigate("VerifyOtp", { ...navigationParams, isExisting:true });
        }
      } else {
        console.log("Trying to open error modal");
      }
      setHideButton(false);
    } else if (sendOtpError) {
      console.log("errLogin", sendOtpError);
      if (sendOtpError.status == 400) setAlert(true);
      else setError(true);
      setHideButton(false);
      setMessage(sendOtpError?.data?.message);
    }
  }, [sendOtpData, sendOtpError]);

  useEffect(() => {
    if (sendOtpDataReg) {
      console.log("sendOtpDataReg", sendOtpDataReg);
      if (sendOtpDataReg?.success === true && mobile.length === 10) {
          
          navigation.navigate("VerifyOtp", { ...navigationParams, isExisting:false });

      }
      setHideButton(false);
    } else if (sendOtpErrorReg) {
      console.log("errReg", sendOtpErrorReg);
      if (sendOtpErrorReg.status == 400) setAlert(true);
      else setError(true);
      setHideButton(false);
      setMessage(sendOtpErrorReg?.data?.message);
    }
  }, [sendOtpDataReg, sendOtpErrorReg]);

  useEffect(() => {
    if (getNameData) {
      console.log("getNameData", getNameData);
      if (getNameData?.success) {
        setName(getNameData?.body.name);
      }
    } else if (getNameError) {
      console.log("getNameError", getNameError);
    }
  }, [getNameData, getNameError]);



  const getMobile = (data) => {
    // console.log(data)
    const reg = "^([0|+[0-9]{1,5})?([6-9][0-9]{9})$";
    const mobReg = new RegExp(reg);

    setMobile(data);
    if (data !== undefined) {
      if (data.length === 10) {
        if (mobReg.test(data)) {
          getNameFunc({ mobile: data });
          Keyboard.dismiss();
        } else {
          setError(true);
          setMessage(t("Please enter a valid mobile number"));
        }
      }
    }
  };

  const fetchTerms = async () => {
    const credentials = await Keychain.getGenericPassword();
    const token = credentials.username;
    const params = {
      type: "term-and-condition",
    };
    getTermsAndCondition(params);
  };

  const getName = (data) => {
    const nameRegex = /^[a-zA-Z\s-]+$/;
    console.log("Data getting function", data);
    if (data !== undefined) {
      setName(data);
    }
  };

  const getCheckBoxData = (data) => {
    setIsChecked(data);
    console.log("Checkbox data", data);
  };

  const navigateToOtp = () => {
    sendOtpFunc({ mobile, name, user_type, user_type_id });
    setHideButton(true);

  };
  const handleButtonPress = () => {

    if (isChecked) {
      console.log("handleButtonPress", getNameData, isChecked, name, mobile);
      if (
        mobile !== undefined &&
        mobile.length !== 0 
      ) {
        if (getNameData && getNameData.message === "Not Found"){
          if (mobile?.length == 10) {
            if (registrationRequired) {
              const params = { mobile: mobile, name: mobile, user_type_id: user_type_id, user_type: user_type,type:'registration' }
              sendOtpFuncReg(params)
            } 
          } else {
            setError(true);
            setMessage(t("Please enter your 10 digit mobile number"));
          }

        }
        else{
          if (mobile?.length == 10) {
            sendOtpFunc({ mobile, name, user_type, user_type_id });

          }
          else {
            setError(true);
            setMessage(t("Please enter your 10 digit mobile number"));
          }
        }
      } else {
        if (mobile?.length != 10) {
          setError(true);
          setMessage(t("Please enter your 10 digit mobile number"));
        } else if (name == undefined || name == "") {
          const params = { mobile: mobile, name: mobile, user_type_id: user_type_id, user_type: user_type,type:'registration' }
          sendOtpFuncReg(params)
        }
      }
    } else {
      setError(true); 
      setMessage(t("Please Accept Terms and Condition"));
    }
  };

  const modalClose = () => {
    setError(false);
    setAlert(false);
  };
  return (
    <LinearGradient colors={["#F0F8F6", "#F0F8F6"]} style={styles.container}>
      <View
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            height: 120,
            width: "100%",
            alignItems: "center",
            justifyContent: "center",

            flexDirection: "row",
          }}
        >
          <TouchableOpacity
            style={{
              height: 40,
              alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              left: 10,
              top: 20,
            }}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Image
              style={{ height: 20, width: 20, resizeMode: "contain" }}
              source={require("../../../assets/images/blackBack.png")}
            ></Image>
          </TouchableOpacity>

          <Image
            style={{
              height: 220,
              width: 220,
              resizeMode: "cover",
              top: 0,
              left: 0,
              position: "absolute",
            }}
            source={require("../../../assets/images/MotherWoodCircle.png")}
          ></Image>
        </View>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginTop: 200,
            marginLeft: 12,
          }}
        >
          <PoppinsTextMedium
            style={{ color: "#00A79D", fontSize: 28, fontWeight: "800" }}
            content={t("Welcome")}
          ></PoppinsTextMedium>
          <PoppinsTextMedium
            style={{ color: "#00A79D", fontSize: 18 }}
            content={t("Login to your account")}
          ></PoppinsTextMedium>
        </View>
      </View>

      {error && (
        <ErrorModal
          modalClose={modalClose}
          message={message}
          openModal={error}
        ></ErrorModal>
      )}
      {alert && (
        <AlertModal
          modalClose={modalClose}
          message={message}
          openModal={alert}
        ></AlertModal>
      )}
      <ScrollView contentContainerStyle={{ flex: 1 }} style={{ width: "93%" }}>
        <KeyboardAvoidingView>
          <View
            style={{
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 40,
            }}
          >
            <TextInputInsIdePlaceholder
              value={mobile}
              title="mobile"
              placeHolder="Mobile No"
              keyboardType="numeric"
              inputHolder = {"Enter Your Number"}
              maxLength={10}
              handleData={getMobile}
            />

            {/* <TextInputRectangularWithPlaceholder
              placeHolder={t("name")}
              handleData={getName}
              value={name}
              specialCharValidation={true}
            ></TextInputRectangularWithPlaceholder> */}
          </View>
        </KeyboardAvoidingView>

        <View
          style={{
            width: "100%",
            // marginTop: 20,
            marginBottom: 30,
            marginLeft: 10,
          }}
        >
          <View style={{ flexDirection: "row", marginHorizontal: 24 }}>
            <Checkbox CheckBoxData={getCheckBoxData} />
            <TouchableOpacity
            style={{flexDirection:'row'}}
              onPress={() => {
                navigation.navigate("PdfComponent", {
                  pdf: getTermsData?.body?.data?.[0]?.files[0],
                });
              }}
            >
              <PoppinsTextLeftMedium
                content={t("I hearby accept all the ")}
                style={{
                  color: "#808080",

                  marginBottom: 20,
                  fontSize: 15,
                  marginLeft: 8,
                  marginTop: 16,
                }}
              ></PoppinsTextLeftMedium>
                   <PoppinsTextLeftMedium
                content={t("Terms & Conditions")}
                style={{
                  color: "#00A79D",

                  marginBottom: 20,
                  fontSize: 15,

                  marginTop: 16,
                }}
              ></PoppinsTextLeftMedium>
            </TouchableOpacity>
          </View>
        <View style={{marginHorizontal:20, marginRight:40}}>
        <ButtonNavigateArrow
            success={success}
            handleOperation={handleButtonPress}
            backgroundColor={ isChecked ? "black" : "#000000"}
            style={{ color: "white", fontSize: 16 }}
            isLoading={sendOtpIsLoading}
            content={t("Send OTP")}
            navigateTo="VerifyOtp"
            navigationParams={navigationParams}
            mobileLength={mobile}
            needArrow={false}
            isChecked={
              isChecked && mobile?.length == 10 && name != "" && !hideButton
            }
          ></ButtonNavigateArrow>

        </View>

          {sendOtpIsLoading && (
            <FastImage
              style={{
                width: 100,
                height: 100,
                alignSelf: "center",
                marginTop: 10,
              }}
              source={{
                uri: gifUri, // Update the path to your GIF
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.contain}
            />
          )}
        </View>
      </ScrollView>
      {/* {registrationRequired && (
          <View style={{ position: "absolute", right: 20, top: 10 }}>
            <ButtonNavigate
              handleOperation={() => {
                navigation.navigate("BasicInfo", {
                  needsApproval: needsApproval,
                  userType: user_type,
                  userId: user_type_id,
                  name: name,
                  mobile: mobile,
                  registrationRequired:registrationRequired,
                  navigatingFrom: "OtpLogin",
                });
              }}
              backgroundColor="#353535"
              style={{ color: "white", fontSize: 16 }}
              content="Register"
              navigateTo="BasicInfo"
              properties={{
                needsApproval: needsApproval,
                userType: user_type,
                userId: user_type_id,
                name: name,
                mobile: mobile,
                navigatingFrom: "OtpLogin",
              }}
            ></ButtonNavigate>
          </View>
        )} */}
        <SocialBottomBar/>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    backgroundColor: "#F0F8F6",
  },
  semicircle: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  banner: {
    height: 184,
    width: "90%",
    borderRadius: 10,
  },
  userListContainer: {
    width: "100%",
    height: 600,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
});

export default OtpLogin;
