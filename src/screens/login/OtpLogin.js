import React, { useEffect, useState } from "react";
import {
	Dimensions,
	Image,
	Keyboard,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import { useSelector } from "react-redux";
import { useGetLoginOtpMutation } from "../../apiServices/login/otpBased/SendOtpApi";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import { useIsFocused } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import FastImage from "react-native-fast-image";
import * as Keychain from "react-native-keychain";
import Mobile from 'react-native-vector-icons/AntDesign';
import { useFetchLegalsMutation } from "../../apiServices/fetchLegal/FetchLegalApi";
import { useGetNameMutation } from "../../apiServices/login/GetNameByMobile";
import { useGetLoginOtpForVerificationMutation } from "../../apiServices/otp/GetOtpApi";
import BackUi from "../../components/atoms/BackUi";
import Checkbox from "../../components/atoms/checkbox/Checkbox";
import TextInputInsIdePlaceholder from "../../components/atoms/input/TextInputInsIdePlaceholder";
import PoppinsTextLeftMedium from "../../components/electrons/customFonts/PoppinsTextLeftMedium";

const OtpLogin = ({ navigation, route }) => {
  const [mobile, setMobile] = useState("");
  const [name, setName] = useState();
  const [nameData, setNameData] = useState()
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState();
  const [error, setError] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [navigationParams, setNavigationParams] = useState()
  const [hideButton, setHideButton] = useState(false);
  const [alert, setAlert] = useState(false);
  const { t } = useTranslation();

  
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

  

  const gifUri = Image.resolveAssetSource(
    require("../../../assets/gif/loaderNew.gif")
  ).uri;

	useEffect(() => {
		fetchTerms();
	}, []);

  useEffect(() => {
    setHideButton(false);
  }, [focused, registrationRequired]);

  useEffect(() => {
    if (sendOtpData && nameData) {
      console.log("sendOtpData", sendOtpData);
      if (sendOtpData?.success === true) {
        if (Object.keys(nameData).length != 0) {
          navigation.navigate("VerifyOtp", navigationParams );
        }
      } else {
        console.log("Trying to open error modal");
      }
      setHideButton(false);
    } else if (sendOtpError) {
      console.log("err", sendOtpError);
      if (sendOtpError.status == 400) setAlert(true);
      else setError(true);
      setHideButton(false);
      setMessage(sendOtpError?.data?.message);
    }
  }, [sendOtpData, sendOtpError]);

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
      if (getNameData?.success && getNameData?.body) {
        if(Object.keys(getNameData?.body).length!=0)
        {
          setName(getNameData?.body?.name);
          setNameData(getNameData?.body)
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
        else{
          const tempNavigationParams = {
            needsApproval: needsApproval,
            
            mobile: mobile,
            
            registrationRequired: registrationRequired,
          };
          setNavigationParams(tempNavigationParams)
        }
      }
    } else if (getNameError) {
      console.log("getNameError", getNameError);
    }
  }, [getNameData, getNameError]);

  const navigateToOtp = (data,mob) => {
    if(data)
    {
      console.log("navigateToOtp",data)
      console.log("isRunning?")
      const mobile = mob
      const name = data?.name.trim()
      const user_type = data?.user_type.trim()
      const user_type_id = String(data?.user_type_id)
      sendOtpFunc({ mobile, name, user_type, user_type_id });
      setHideButton(true);
    }
    
    // navigation.navigate('VerifyOtp',{navigationParams})
  };

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
    getTermsAndCondition({type: "term-and-condition" });
  };

  

  const getCheckBoxData = (data) => {
    setIsChecked(data);
    console.log("Checkbox data", data);
  };

  const handleNavigation=()=>{
    if(name && nameData && isChecked)
    {
      navigateToOtp(nameData, mobile);
    }
    else
    {
      if(mobile && mobile.length==10 && isChecked)
      {
        navigation.navigate("SelectUser",navigationParams)
      }
      else
      {
        setError(true)
        setMessage(t("Kindly Enter Mobile Number and Check Terms and Condition Before Proceeding"))
      }
    }
  }

  return (
    <BackUi
      scrollable
      keyboardAvoidingEnabled
      errorMessage={error ? message : undefined}
      alertMessage={alert ? message : undefined}
      scrollContentContainerStyle={styles.scrollContent}
    >
      <View style={styles.container}>
        
         
        <View style={styles.imageContainer}>
          <Image
            style={styles.logo}
            source={require("../../../assets/images/sathiLogoWithCircle.png")}
          ></Image>
          </View>
        <View style={styles.welcomeContainer}>
          <PoppinsTextMedium
            style={styles.welcomeTitle}
            content={t("welcome")}
          ></PoppinsTextMedium>
          <PoppinsTextMedium
            style={styles.welcomeSubtitle}
            content={t("Login to your account")}
          ></PoppinsTextMedium>
        </View>
      </View>

      {/* Error and Alert handled by BackUi via props */}
      <View style={styles.inputRow}>
        <View style={styles.inputContainer}>
          <TextInputInsIdePlaceholder
            value={mobile}
            title="mobile"
            placeHolder={t("Mobile No")}
            keyboardType="numeric"
            inputHolder={t("Enter Your Number")}
            maxLength={10}
            handleData={getMobile}
          />

        
        </View>
        <View style={styles.iconContainer}>
          <Mobile name="mobile1" size={30} color={"grey"}></Mobile>
        </View>
      </View>

      <View style={styles.checkboxContainer}>
        <View style={styles.checkboxRow}>
          <Checkbox CheckBoxData={getCheckBoxData} />
          
            <PoppinsTextLeftMedium
              content={t("I hearby accept all the ")}
              style={styles.termsText}
            ></PoppinsTextLeftMedium>
            <TouchableOpacity
            onPress={() => {
              navigation.navigate("PdfComponent", {
                pdf: getTermsData?.body?.data?.[0]?.files[0],
              });
            }}
          >
            <PoppinsTextLeftMedium
              content={t("Terms & Conditions")}
              style={styles.termsLink}
            ></PoppinsTextLeftMedium>
          </TouchableOpacity>
        </View>
      
        {sendOtpIsLoading && (
          <FastImage
            style={styles.loader}
            source={{
              uri: gifUri, // Update the path to your GIF
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
        )}
      </View>
      
          
           

            {
              <TouchableOpacity onPress={handleNavigation} style={styles.proceedButton}>
                <PoppinsTextLeftMedium style={styles.proceedButtonText} content={t("Proceed")}></PoppinsTextLeftMedium>
              </TouchableOpacity>
            }
    </BackUi>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  imageContainer: {
    alignItems: 'center',
    width: '100%',
    justifyContent: 'flex-start',
    height: 240,
  },
  logo: {
    height: 200,
    width: '100%',
    resizeMode: "cover",
  },
  welcomeContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  welcomeTitle: {
    color: "#00A79D",
    fontSize: 28,
    fontWeight: "800",
  },
  welcomeSubtitle: {
    color: "#00A79D",
    fontSize: 16,
  },
  inputRow: {
    flexDirection: "row",
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  inputContainer: {
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "white",
    height: 70,
    width: '10%',
  },
  checkboxContainer: {
    width: "100%",
    marginBottom: 20,
    marginLeft: 10,
  },
  checkboxRow: {
    flexDirection: "row",
    marginHorizontal: 24,
  },
  termsText: {
    color: "black",
    marginBottom: 20,
    fontSize: 14,
    marginLeft: 8,
    marginTop: 16,
  },
  termsLink: {
    color: "#00A79D",
    marginBottom: 20,
    fontSize: 13,
    marginTop: 16,
  },
  loader: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginTop: 10,
  },
  proceedButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: '86%',
    backgroundColor: "black",
    borderRadius: 4,
  },
  proceedButtonText: {
    color: 'white',
    fontSize: 20,
  },
  scrollContent: {
    alignItems: "center",
    justifyContent: "flex-start",
    paddingBottom: 80,
  },
});

export default OtpLogin;
