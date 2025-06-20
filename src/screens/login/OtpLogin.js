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
import Mobile from 'react-native-vector-icons/AntDesign'
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
  const [name, setName] = useState();
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState();
  const [error, setError] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [navigationParams, setNavigationParams] = useState()
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
  const [
    sendOtpFuncReg,
    {
      data: sendOtpDataReg,
      error: sendOtpErrorReg,
      isLoading: sendOtpIsLoaReg,
    },
  ] = useGetLoginOtpForVerificationMutation();

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
  
  const registrationRequired = route?.params?.registrationRequired;
  console.log("registrationRequiredotpLogin", registrationRequired);
  const width = Dimensions.get("window").width;
  var pattern = /^(0|[+91]{3})?[6-9][0-9]{9}$/;
  

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
    if (getNameData) {
      console.log("getNameData", getNameData);
      if (getNameData?.success) {
        if(Object.keys(getNameData?.body).length!=0)
        {
          setName(getNameData?.body?.name);
          const tempNavigationParams = {
            needsApproval: needsApproval,
            user_type_id: getNameData?.body?.user_type_id,
            user_type: getNameData?.body?.user_type,
            mobile: mobile,
            name: name ? name : mobile,
            registrationRequired: registrationRequired,
          };
          setNavigationParams(tempNavigationParams)
        }
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

  

  const getCheckBoxData = (data) => {
    setIsChecked(data);
    console.log("Checkbox data", data);
  };

  const handleNavigation=()=>{
    if(name)
    {
      navigation.navigate("VerifyOtp",{...navigationParams, isExisting:true})
    }
    else{
      navigation.navigate("SelectUser",navigationParams)
    }
  }

  
 

  const modalClose = () => {
    setError(false);
    setAlert(false);
  };
  return (
    <KeyboardAvoidingView style={{height:'100%'}}>
    <ScrollView
      contentContainerStyle={{alignItems:'center', justifyContent:'center'}}
      style={{ width: "100%" }}
    >
      <View
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        
         
        <View style={{alignItems:'flex-start',width:'100%'}}>
          <Image
            style={{
              height:200,
              width:200,
              resizeMode: "contain",
              
            }}
            source={require("../../../assets/images/MotherWoodCircle.png")}
          ></Image>
          </View>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginLeft: 12,
          }}
        >
          <PoppinsTextMedium
            style={{ color: "#00A79D", fontSize: 28, fontWeight: "800" }}
            content={t("Welcome")}
          ></PoppinsTextMedium>
          <PoppinsTextMedium
            style={{ color: "#00A79D", fontSize: 16 }}
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
      <View style={{flexDirection:"row",
            marginTop: 20,
            alignItems:'center',
            justifyContent:'center',
            width:'100%',
          }}>
        <View
          style={{
            width: "80%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TextInputInsIdePlaceholder
            value={mobile}
            title="mobile"
            placeHolder="Mobile No"
            keyboardType="numeric"
            inputHolder={"Enter Your Number"}
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
        <View style={{alignItems:'center', justifyContent:'center',backgroundColor:"white",height:70,width:'10%'}}>
          <Mobile name="mobile1" size={30} color={"grey"}></Mobile>
        </View>
      </View>

      <View
        style={{
          width: "100%",
          // marginTop: 20,
          marginBottom: 20,
          marginLeft: 10,
        }}
      >
        <View style={{ flexDirection: "row", marginHorizontal: 24 }}>
          <Checkbox CheckBoxData={getCheckBoxData} />
          <TouchableOpacity
            style={{ flexDirection: "row" }}
            onPress={() => {
              navigation.navigate("PdfComponent", {
                pdf: getTermsData?.body?.data?.[0]?.files[0],
              });
            }}
          >
            <PoppinsTextLeftMedium
              content={t("I hearby accept all the ")}
              style={{
                color: "black",

                marginBottom: 20,
                fontSize: 14,
                marginLeft: 8,
                marginTop: 16,
              }}
            ></PoppinsTextLeftMedium>
            <PoppinsTextLeftMedium
              content={t("Terms & Conditions")}
              style={{
                color: "#00A79D",

                marginBottom: 20,
                fontSize: 13,

                marginTop: 16,
              }}
            ></PoppinsTextLeftMedium>
          </TouchableOpacity>
        </View>
        {/* <View style={{ marginHorizontal: 20, marginRight: 40 }}>
          <ButtonNavigateArrow
            success={success}
            handleOperation={handleButtonPress}
            backgroundColor={isChecked ? "black" : "#000000"}
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
        </View> */}

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
      
          
            {/* <ButtonNavigate
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
            ></ButtonNavigate> */}

            {
              <TouchableOpacity onPress={()=>{
                handleNavigation()
              }} style={{alignItems:'center', justifyContent:'center', height:50,width:'86%',backgroundColor:"black",borderRadius:4}}>
                <PoppinsTextLeftMedium style={{color:'white', fontSize:20}} content ="Send OTP"></PoppinsTextLeftMedium>
              </TouchableOpacity>
            }

       
        
    </ScrollView>
    <SocialBottomBar />
    </KeyboardAvoidingView>
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
