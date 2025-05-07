import React, { useEffect, useId, useState, useRef } from "react";
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
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import PoppinsText from "../../components/electrons/customFonts/PoppinsText";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import { useSelector, useDispatch } from "react-redux";
import Icon from "react-native-vector-icons/Entypo";
import LinearGradient from "react-native-linear-gradient";
import { useRedeemGiftsMutation } from "../../apiServices/gifts/RedeemGifts";
import * as Keychain from "react-native-keychain";
import ErrorModal from "../../components/modals/ErrorModal";
import { useVerifyPanMutation } from "../../apiServices/verification/PanVerificationApi";
import {
  useSendAadharOtpMutation,
  useVerifyAadharMutation,
} from "../../apiServices/verification/AadharVerificationApi";
import { useVerifyGstMutation } from "../../apiServices/verification/GstinVerificationApi";
import SuccessModal from "../../components/modals/SuccessModal";
import MessageModal from "../../components/modals/MessageModal";
import {
  useGetkycStatusMutation,
  useUpdateKycStatusMutation,
} from "../../apiServices/kyc/KycStatusApi";
import {
  setKycCompleted,
  setKycData,
} from "../../../redux/slices/userKycStatusSlice";
import FastImage from "react-native-fast-image";
import { gifUri } from "../../utils/GifUrl";
import { useTranslation } from "react-i18next";

const KycVerificationNewScreen = ({ navigation }) => {
  const [kycArray, setKycArray] = useState([]);
  const [showPan, setShowPan] = useState(false);
  const [showGst, setShowGst] = useState(false);
  const [showAadhar, setShowAadhar] = useState(false);
  const [panVerified, setPanVerified] = useState(false);
  const [aadhaarVerified, setAadhaarVerified] = useState(false);
  const [gstVerified, setGstVerified] = useState(false);
  const [verified, setVerified] = useState([]);
  const [pan, setPan] = useState("");
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [gstin, setGstin] = useState("");
  const [isManuallyApproved, setIsManuallyApproved] = useState();
  const [message, setMessage] = useState();
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [aadhar, setAadhar] = useState("");
  const [otp, setOtp] = useState("");
  const [aadhaarOtpSent, setAadhaarOtpSent] = useState(false);
  const [verifiedAadharDetails, setVerifiedAadharDetails] = useState(false);
  const inpref = useRef(null);
  // const [address, setAddress] = useState()
  // const [splitAddress , setSplitAddress] = useState()
  const dispatch = useDispatch();
  // const kycOptions = useSelector((state) => state.apptheme.kycOptions);
  const kycOptions = {
    "enabled_options": {
        "aadhaar": true,
        "pan": true,
        "gstin": true,
    },
    "api_details": {
        "aadhaar": {
            "api_url": "kyc/verifyAadhaar",
            "fields": ["full_name", "mobile", "state"],
            "display_fields": ["full_name", "mobile", "state"],
            "push_fields": ["full_name", "mobile"]
        }
    },
    "valid_combinations": [
        "aadhaar",
        "pan-gstin",
    ],
    "match_rules": {
        "aadhaar": {
            "name": "Dhruv",
            "error": "Aadhaar name must match with registered name",
            "success": "Aadhaar name matched"
        },
    }
}

  const userData = useSelector((state) => state.appusersdata.userData);
  const kycData = useSelector((state) => state.kycDataSlice.kycData);
  console.log("dahjsgydfghgvwqhbbcjbqwhghcv", kycData);

  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  )
    ? useSelector((state) => state.apptheme.ternaryThemeColor)
    : "grey";
  console.log("kyc options ", kycData, kycOptions);
  const manualApproval = useSelector((state) => state.appusers.manualApproval);

  const width = Dimensions.get("window").width;

  const { t } = useTranslation();

  let temp = {};

  console.log(userData);

  useEffect(() => {
    if (manualApproval.includes(userData.user_type)) {
      setIsManuallyApproved(true);
    } else {
      setIsManuallyApproved(false);
    }
  }, []);

  const [
    getKycStatusFunc,
    {
      data: getKycStatusData,
      error: getKycStatusError,
      isLoading: getKycStatusIsLoading,
      isError: getKycStatusIsError,
    },
  ] = useGetkycStatusMutation();

  const [
    verifyPanFunc,
    {
      data: verifyPanData,
      error: verifyPanError,
      isLoading: verifyPanIsLoading,
      isError: verifyPanIsError,
    },
  ] = useVerifyPanMutation();

  const [
    sendAadharOtpFunc,
    {
      data: sendAadharOtpData,
      error: sendAadharOtpError,
      isLoading: sendAadharOtpIsLoading,
      isError: sendAadharOtpIsError,
    },
  ] = useSendAadharOtpMutation();

  const [
    verifyAadharFunc,
    {
      data: verifyAadharData,
      error: verifyAadharError,
      isLoading: verifyAadharIsLoading,
      isError: verifyAadharIsError,
    },
  ] = useVerifyAadharMutation();

  const [
    updateKycStatusFunc,
    {
      data: updateKycStatusData,
      error: updateKycStatusError,
      isLoading: updateKycStatusIsLoading,
      isError: updateKycStatusIsError,
    },
  ] = useUpdateKycStatusMutation();

  useEffect(() => {
    if (updateKycStatusData) {
      console.log("updateKycStatusData", updateKycStatusData);
      if (updateKycStatusData.success) {
        dispatch(setKycCompleted());
        setSuccess(true);
        setMessage(t("Kyc Completed"));
        console.log("Success");
      }
    } else if (updateKycStatusError) {
      console.log("updateKycStatusError", updateKycStatusError);
      setError(true);
      setMessage("Unable to update kyc status");
    }
  }, [updateKycStatusData, updateKycStatusError]);

  const [
    verifyGstFunc,
    {
      data: verifyGstData,
      error: verifyGstError,
      isLoading: verifyGstIsLoading,
      isError: verifyGstIsError,
    },
  ] = useVerifyGstMutation();

  useEffect(() => {
    const getToken = async () => {
      try {
        // Retrieve the credentials
        const credentials = await Keychain.getGenericPassword();
        if (credentials) {
          // console.log(
          //   'Credentials successfully loaded for user ' + credentials?.username
          // );
          const token = credentials?.username;
          // console.log("token from dashboard ", token)

          token && getKycStatusFunc(token);

          getMembership();
        } else {
          // console.log('No credentials stored');
        }
      } catch (error) {
        // console.log("Keychain couldn't be accessed!", error);
      }
    };
    getToken();
  }, []);

  useEffect(() => {
    if (getKycStatusData) {
      console.log("getKycStatusData", getKycStatusData);
      if (getKycStatusData?.success) {
        getVerificationForUser({ aadhar: false, gstin: false, pan: false });
        // getVerificationForUser(getKycStatusData?.body);

        // if(!getKycStatusData?.body?.aadhar)
        // {
        //     setShowAadhar(true)
        // }
        //  if(!getKycStatusData?.body?.gstin)
        // {
        //     setShowGst(true)
        // }
        //  if(!getKycStatusData?.body?.pan)
        // {
        //     setShowPan(true)
        // }

        dispatch(setKycData(getKycStatusData?.body));
      }
    } else if (getKycStatusError) {
      console.log("getKycStatusError", getKycStatusError);
      if (getKycStatusError.status == 401) {
        const handleLogout = async () => {
          try {
            await AsyncStorage.removeItem("loginData");
            navigation.navigate("Splash");
            navigation.reset({ index: 0, routes: [{ name: "Splash" }] }); // Navigate to Splash screen
          } catch (e) {
            console.log("error deleting loginData", e);
          }
        };
        handleLogout();
      } else {
        setError(true);
        setMessage("Can't get KYC status kindly retry after sometime.");
      }
      // console.log("getKycStatusError", getKycStatusError)
    }
  }, [getKycStatusData, getKycStatusError]);

  useEffect(() => {
    if (verifyAadharData) {
      console.log("verifyAadharData", verifyAadharData);
      if (verifyAadharData.success) {
        var dateArray = verifyAadharData?.body?.dob?.split("-");
        var formattedDate =
          dateArray[2] + "-" + dateArray[1] + "-" + dateArray[0];
        const aadhar_details = {
          address: verifyAadharData?.body?.address,
          split_address: verifyAadharData?.body?.split_address,
          gender: verifyAadharData?.body?.gender,
          dob: formattedDate,
        };
        setVerifiedAadharDetails(aadhar_details);

        console.log("SUCCESS AADHAAR");
        // handleVerification("aadhar_details",aadhar_details)
        const temp1 = { type: "aadhar", value: aadhar };
        // const temp2 = { type: "aadhar_details", value: aadhar_details };
        setVerified([...verified, temp1]);
        setAadhaarVerified(true);
      }
    } else if (verifyAadharError) {
      console.log("verifyAadharError", verifyAadharError);
      setAadhar("");
      setError(true);
      setMessage(verifyAadharError?.data?.message);
    }
  }, [verifyAadharError, verifyAadharData]);

  useEffect(() => {
    if (sendAadharOtpData) {
      console.log("sendAadharOtpData", sendAadharOtpData);
      // setRefId(sendAadharOtpData.body.ref_id)
      if (sendAadharOtpData.success) {
        setAadhaarOtpSent(true);
        console.log("otp sent");
      }
    } else if (sendAadharOtpError) {
      console.log("sendAadharOtpError", sendAadharOtpError);
      setError(true);
      if (sendAadharOtpError.data?.Error?.message !== undefined) {
        setMessage(sendAadharOtpError.data?.Error?.message);
      } else {
        setMessage(sendAadharOtpError.data?.message);
      }
    }
  }, [sendAadharOtpData, sendAadharOtpError]);

  //  useEffect(()=>{
  //   console.log("aadhaar",aadhar)

  //  },[aadhar])

  useEffect(() => {
    if (verifyGstData) {
      console.log("verifyGstData", verifyGstData);
      if (verifyGstData.success) {
        const temp = { type: "gstin", value: verifyGstData.body?.GSTIN };
        setVerified([...verified, temp]);
        setGstVerified(true);
      }
    }
    if (verifyGstError) {
      console.log("verifyGstError", verifyGstError);
      setError(true);
      setGstin("");
      setMessage(verifyGstError.data?.message);
    }
  }, [verifyGstData, verifyGstError]);

  useEffect(() => {
    if (verifyPanData) {
      console.log("verifyPanData", verifyPanData);
      if (verifyPanData.success) {
        // setName(verifyPanData.body.registered_name)
        // setPan(verifyPanData.body.pan)
        console.log("SUCCESS PAN");
        const temp = { type: "pan", value: verifyPanData.body?.pan };
        setVerified([...verified, temp]);
        setPanVerified(true);
      }
    }
    if (verifyPanError) {
      setPan("");
      setError(true);
      // handlePanInput("")
      setMessage(verifyPanError.data?.message);
      console.log("verifyPanError", verifyPanError);
    }
  }, [verifyPanData, verifyPanError]);

  console.log(pan);

  const handlePanInput = (text) => {
    setPan(text);
    console.log("pan value", text);
    if (text.length === 10) {
      const data = {
        pan: text,
      };
      verifyPanFunc(data);
    }
  };

  const handleAadhaar = (text) => {
    // setFinalAadhar(aadhar)
    setAadhar(text);
    if (text.length === 12) {
      const data = {
        aadhaar_number: text,
      };
      sendAadharOtpFunc(data);
      console.log(data);
    }
  };

  //  useEffect(()=>{

  //  },[otp])
  const handleOtpInput = (text) => {
    setOtp(text);
    if (text.length === 6) {
      handleOtp(text);
    }
  };

  const handleOtp = (otp) => {
    const data = {
      ref_id: sendAadharOtpData?.body.ref_id,
      otp: otp,
    };
    verifyAadharFunc(data);
  };

  // const showAndHideVerificationComponents=(element,tempVerificationArray)=>{
  //   console.log("showAndHideVerificationComponents",element)
  //   console.log("tempVerificationArray", kycArray)
  //    if(kycArray.length!==0)
  //    {

  //   const remainingArray = kycArray.filter((item,index)=>{
  //     return item.toLowerCase()!==element.toLowerCase()
  //   })
  //   // setVerified(remainingArray)
  //   showVerificationFields(remainingArray)
  //   console.log("removed element is",element,"remaining array is",remainingArray)

  //    }

  // }

  const modalClose = () => {
    setError(false);
    setSuccess(false);
  };

  console.log("verified array status", verified);

  const handleRegistrationFormSubmission = async () => {
    console.log("verified array", JSON.stringify(verified));

    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      console.log(
        "Credentials successfully loaded for user " + credentials.username
      );
      const token = credentials.username;
      const inputFormData = {};
      // inputFormData["user_type"] = userData.user_type;
      // inputFormData["user_type_id"] = userData.user_type_id;
      // inputFormData["is_approved_needed"] = isManuallyApproved;
      // inputFormData["name"] = userData.name;
      // inputFormData["mobile"] = userData.mobile;

      console.log("kkkkkk", kycData);

      for (var i = 0; i < verified.length; i++) {
        console.log("verified", verified[i]);
        if (verified[i].type !== "aadhar_details") {
          inputFormData[`is_valid_${verified[i].type}`] = true;
        }
        inputFormData[verified[i].type] = verified[i].value;
      }

      let toVerify = []; // New array to store fields that need verification

      // Iterate over kycArray and filter based on kycData
      const filteredKycArray = kycArray.filter((item) => {
        // Convert the item name to lowercase to match keys in kycData
        const key = item.toLowerCase();
        console.log("Keyyyy", key);
        // If the value in kycData is true, add to toVerify array, remove from kycArray
        if (kycData[key]) {
          toVerify.push(item);
          return false; // Remove item from kycArray
        }
        return true; // Keep item in kycArray
      });

      console.log("Filtered KYC Array: ", filteredKycArray);

      let body;
      if (verifiedAadharDetails) {
        body = { ...inputFormData, aadhar_details: verifiedAadharDetails };
      } else {
        body = inputFormData;
      }

      const params = { body: body, id: userData.id };
      console.log("booddy", kycArray);
      console.log(
        "handleRegistrationFormSubmission",
        filteredKycArray,
        verified
      );
      const isAllKycVerified = filteredKycArray.every((type) =>
        verified.some((item) => item.type === type)
      );
      console.log(
        "checked for kyc completion in both the array and returned",
        isAllKycVerified
      );

      if (Object.keys(body).length === 0) {
        if (!isAllKycVerified) {
          setError(true);
          console.log("final1", JSON.stringify(body));
          setMessage(t("Kindly submit valid details to continue"));
        }
      } else if (isAllKycVerified) {
        updateKycStatusFunc(params);
        console.log("final", JSON.stringify(body));
      }

      // console.log("responseArray",body)
    }
  };

  const handleGstInput = (text) => {
    console.log("gstin input", text);
    setGstin(text);
    if (text.length === 15) {
      const data = {
        gstin: text,
        // "business_name":"TEst"
      };
      verifyGstFunc(data);
    }
  };

  const getVerificationForUser = (data) => {
    const userType = userData.user_type;
    const keys = Object.keys(kycOptions);
    const values = Object.values(kycOptions);
    let tempArr = [];
    console.log("kyc option keys and values", keys, values, data);
    for (var i = 0; i < values.length; i++) {
      if (values[i].taken)
        if (values[i].users.includes(userType)) {
          tempArr.push(keys[i]);
        }
    }
    console.log("temparray in kyc comp", tempArr);

    if (tempArr.includes("PAN")) {
      if (data.pan) {
        setShowPan(false);
        setPanVerified(true);
        const index = tempArr.indexOf("PAN");
        if (index > -1) {
          // only splice array when item is found
          tempArr.splice(index, 1); // 2nd parameter means remove one item only
        }
      }
    }

    if (tempArr.includes("Aadhar")) {
      if (data.aadhar) {
        setShowAadhar(false);
        setAadhaarVerified(true);
        const index = tempArr.indexOf("Aadhar");
        if (index > -1) {
          // only splice array when item is found
          tempArr.splice(index, 1); // 2nd parameter means remove one item only
        }
      }
    }

    if (tempArr.includes("GSTIN")) {
      if (data.gstin) {
        setShowGst(false);
        setGstVerified(true);
        const index = tempArr.indexOf("GSTIN");
        if (index > -1) {
          // only splice array when item is found
          tempArr.splice(index, 1); // 2nd parameter means remove one item only
        }
      }
    }

    console.log("tempArrScreen", tempArr, data);
    if (tempArr[0] == "Aadhar") {
      setShowAadhar(true);
    } else if (tempArr[0] == "GSTIN") {
      setShowGst(true);
    } else if (tempArr[0] == "PAN") {
      setShowPan(true);
    }
    setKycArray(tempArr);
  };

  console.log(showAadhar, showPan, showGst);
  const PANDataBox = ({ panNumber, name }) => {
    return (
      <View
        style={{
          width: "90%",
          borderStyle: "dashed",
          borderWidth: 1,
          borderColor: ternaryThemeColor, // Make sure "ternaryThemeColor" is defined
          borderRadius: 5,
          alignItems: "flex-start",
          justifyContent: "center",
          padding: 10,
          marginTop: 10,
        }}
      >
        <View style={{ flexDirection: "row", width: "100%" }}>
          <PoppinsTextMedium
            content="PAN Number : "
            style={{ fontWeight: "700", color: "#919191", fontSize: 14 }}
          ></PoppinsTextMedium>
          <PoppinsTextMedium
            content={panNumber}
            style={{
              fontWeight: "600",
              color: "#919191",
              fontSize: 14,
              marginLeft: 10,
            }}
          ></PoppinsTextMedium>
        </View>
        <View style={{ flexDirection: "row", width: "100%", marginTop: 10 }}>
          <PoppinsTextMedium
            content="Name : "
            style={{ fontWeight: "700", color: "#919191", fontSize: 14 }}
          ></PoppinsTextMedium>
          <PoppinsTextMedium
            content={name}
            style={{ fontWeight: "600", color: "#919191", fontSize: 14 }}
          ></PoppinsTextMedium>
        </View>
      </View>
    );
  };

  const GSTDataBox = ({ gstin, businessName }) => {
    return (
      <View
        style={{
          width: "90%",
          borderStyle: "dashed",
          borderWidth: 1,
          borderColor: ternaryThemeColor,
          borderRadius: 5,
          flexWrap: "wrap",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: 10,
          marginTop: 10,
          marginBottom: 20,
        }}
      >
        <View style={{ flexDirection: "row", width: "100%" }}>
          <PoppinsTextMedium
            content="GSTIN:"
            style={{ fontWeight: "700", color: "#919191", fontSize: 14 }}
          ></PoppinsTextMedium>
          <PoppinsTextMedium
            style={{
              fontWeight: "600",
              color: "#919191",
              fontSize: 14,
              marginLeft: 10,
            }}
            content={gstin}
          ></PoppinsTextMedium>
        </View>
        <View style={{ flexDirection: "row", width: "100%", marginTop: 10 }}>
          <PoppinsTextMedium
            content="Business Name:"
            style={{ fontWeight: "700", color: "#919191", fontSize: 14 }}
          ></PoppinsTextMedium>
          <PoppinsTextMedium
            style={{
              fontWeight: "600",
              color: "#919191",
              fontSize: 14,
              width: 200,
            }}
            content={businessName}
          ></PoppinsTextMedium>
        </View>
      </View>
    );
  };

  const AadharDataBox = ({ dob, name, gender, address }) => {
    return (
      <View
        style={{
          width: "90%",
          borderStyle: "dashed",
          borderWidth: 1,
          borderColor: ternaryThemeColor,
          borderRadius: 5,
          flexWrap: "wrap",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: 10,
          marginTop: 10,
        }}
      >
        <View style={{ flexDirection: "row", width: "90%" }}>
          <PoppinsTextMedium
            content="Name :"
            style={{ fontWeight: "700", color: "#919191", fontSize: 14 }}
          ></PoppinsTextMedium>
          <PoppinsTextMedium
            content={name}
            style={{
              fontWeight: "600",
              color: "#919191",
              fontSize: 14,
              marginLeft: 10,
            }}
          ></PoppinsTextMedium>
        </View>
        <View style={{ flexDirection: "row", width: "90%", marginTop: 10 }}>
          <PoppinsTextMedium
            content="DOB :"
            style={{ fontWeight: "700", color: "#919191", fontSize: 14 }}
          ></PoppinsTextMedium>
          <PoppinsTextMedium
            content={dob}
            style={{
              fontWeight: "600",
              color: "#919191",
              fontSize: 14,
              marginLeft: 10,
            }}
          ></PoppinsTextMedium>
        </View>
        <View style={{ flexDirection: "row", width: "90%", marginTop: 10 }}>
          <PoppinsTextMedium
            content="Gender :"
            style={{ fontWeight: "700", color: "#919191", fontSize: 14 }}
          ></PoppinsTextMedium>
          <PoppinsTextMedium
            content={gender}
            style={{
              fontWeight: "600",
              color: "#919191",
              fontSize: 14,
              marginLeft: 10,
            }}
          ></PoppinsTextMedium>
        </View>
        <View style={{ flexDirection: "row", width: "90%", marginTop: 10 }}>
          <PoppinsTextMedium
            content="Address:"
            style={{ fontWeight: "700", color: "#919191", fontSize: 14 }}
          ></PoppinsTextMedium>
          <PoppinsTextMedium
            content={address}
            style={{ fontWeight: "600", color: "#919191", fontSize: 14 }}
          ></PoppinsTextMedium>
        </View>
      </View>
    );
  };
  const handleKycSelection = (name) => {
    console.log("handleKycSelection", name);
    if (name == "PAN") {
      setShowPan(true);
      setShowAadhar(false);
      setShowGst(false);
    } else if (name == "Aadhar") {
      setShowAadhar(true);
      setShowGst(false);
      setShowPan(false);
    } else if (name == "GSTIN") {
      setShowGst(true);
      setShowAadhar(false);
      setShowPan(false);
    }
  };

  const SelectKycComp = (props) => {
    const width = 100 / kycArray?.length;
    console.log("selectKycComp", kycArray, width);

    const KycBar = (props) => {
      const name = props.name;

      const handleColor = () => {
        if (name == "Aadhar") {
          if (aadhaarVerified) {
            return "green";
          } else {
            return "red";
          }
        }
        if (name == "PAN") {
          if (panVerified) {
            return "green";
          } else {
            return "red";
          }
        }
        if (name == "GSTIN") {
          if (gstVerified) {
            return "green";
          } else {
            return "red";
          }
        }
      };

      return (
        <TouchableOpacity
          onPress={() => {
            handleKycSelection(name);
          }}
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: `${width - 2}%`,
            height: 50,
            borderRadius: 10,
            elevation: 2,
            backgroundColor: handleColor(),
            margin: 4,
          }}
        >
          <PoppinsTextMedium
            style={{ color: "white", fontSize: 18 }}
            content={name}
          ></PoppinsTextMedium>
        </TouchableOpacity>
      );
    };
    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "space-evenly",
          flexDirection: "row",
          width: "100%",
          backgroundColor: ternaryThemeColor,
        }}
      >
        {kycArray.map((item, index) => {
          return <KycBar key={index} name={item}></KycBar>;
        })}
      </View>
    );
  };

  //   const handleSelect = (data) => {
  //     if ((data = "pan" && !panVerified)) {
  //       setShowPan(true);
  //     } else if ((data = "aadhar" && !aadhaarVerified)) {
  //       setShowAadhar(true);
  //     } else if ((data = "gstin" && !gstVerified)) {
  //       setShowGst(true);
  //     }
  //   };

  const KycProgress = (props) => {
    const showsPan = props.showPan;
    const showsAadhar = props.showAadhar;
    const showsGst = props.showGst;
    console.log("show kyc details", showsAadhar, showsGst, showsPan);
    const Circle = (props) => {
      const completed = props.completed;
      const color = completed ? "yellow" : "white";
      const title = props.title;
      const index = props.index;
      const data = props.data;
      const length = data?.length;
      const margin = index === 0 ? 0 : 100 / length;

      console.log(
        "margin ",
        margin * index,
        " at index ",
        index,
        margin,
        length
      );
      return (
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <View
            style={{
              height: 26,
              width: 26,
              borderRadius: 13,
              backgroundColor: color,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {completed && (
              <Image
                source={require("../../../assets/images/tickBlue.png")}
                style={{ height: 20, width: 20, resizeMode: "center" }}
              ></Image>
            )}
          </View>
          <PoppinsTextMedium
            style={{ color: "white", fontSize: 12, marginTop: 4 }}
            content={title.toUpperCase()}
          ></PoppinsTextMedium>
        </View>
      );
    };

    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <View
          style={{
            height: "10%",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {kycArray.length !== 0 && (
            <View
              style={{ height: 2, width: "80%", backgroundColor: "white" }}
            ></View>
          )}
          <View
            style={{
              width: "90%",
              justifyContent: "space-between",
              flexDirection: "row",
            }}
          >
            {kycArray &&
              kycArray.map((item, index) => {
                return (
                  <Circle
                    data={kycArray}
                    key={index}
                    completed={
                      item === "PAN"
                        ? showsPan
                        : item === "GSTIN"
                        ? showsGst
                        : showsAadhar
                    }
                    title={item}
                    index={index}
                  ></Circle>
                );
              })}
            {kycArray.length == 1 && (
              <Circle
                key={1}
                data={kycArray}
                completed={true}
                title="Complete"
                index={1}
              ></Circle>
            )}
            {/* <Circle key={} completed={true } title="Complete" index={3}></Circle> */}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: "white",
        width: "100%",
        height: "100%",
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{
          width: "100%",
          height: "25%",
          alignItems: "flex-start",
          justifyContent: "flex-start",
        }}
      >
        <View
          style={{
            width: "100%",
            height: "100%",
            alignItems: "flex-start",
            justifyContent: "flex-start",
          }}
        >
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              marginBottom: 10,
              marginTop: 10,
              height: "30%",
            }}
          >
            <TouchableOpacity
              style={{}}
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Image
                style={{
                  height: 40,
                  width: 40,
                  resizeMode: "contain",
                }}
                source={require("../../../assets/images/backIcon.png")}
              ></Image>
            </TouchableOpacity>

            <PoppinsTextMedium
              content="Verify your KYC"
              style={{
                color: "black",
                fontSize: 18,
                fontWeight: "700",
                marginLeft: 10,
              }}
            ></PoppinsTextMedium>
          </View>

          <View style={{ height: "65%", width: "100%" }}>
            <SelectKycComp></SelectKycComp>
          </View>
        </View>
      </KeyboardAvoidingView>
      {/* <KycProgress
        showPan={panVerified}
        showAadhar={aadhaarVerified}
        showGst={gstVerified}
      ></KycProgress> */}
      <ScrollView
        style={{
          width: "100%",
          height: "72%",
          backgroundColor: "white",
        }}
      >
        <View
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "white",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 0,
          }}
        >
          {showPan && (
            <View
              style={{
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 0,
              }}
            >
              <PoppinsTextMedium
                style={{
                  color: "black",
                  fontSize: 16,
                }}
                content={t("Kindly Enter Your PAN Details")}
              >
                {" "}
              </PoppinsTextMedium>
              <Image
                style={{ height: 200, width: 200, resizeMode: "contain" }}
                source={require("../../../assets/images/pan.jpg")}
              ></Image>
              <View
                style={{
                  height: 70,
                  width: "90%",
                  borderWidth: 1,
                  borderColor: "#DDDDDD",
                  alignItems: "flex-start",
                  marginTop: 40,
                }}
              >
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "white",
                    bottom: 10,
                    left: 20,
                  }}
                >
                  <PoppinsTextMedium
                    style={{
                      color: "#919191",
                      fontSize: 16,
                      marginLeft: 4,
                      marginRight: 4,
                    }}
                    content={t("Enter Pan Number")}
                  >
                    {" "}
                  </PoppinsTextMedium>
                </View>
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "flex-start",
                    flexDirection: "row",
                    width: "100%",
                    height: 40,
                  }}
                >
                  <TextInput
                    maxLength={10}
                    value={pan ? pan : verifyPanData?.body?.pan}
                    onChangeText={(text) => {
                      handlePanInput(text.toUpperCase());
                    }}
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      width: "82%",
                      height: 40,
                      fontSize: 16,
                      letterSpacing: 1,
                      marginLeft: 20,
                      color: "black",
                    }}
                    placeholder="DBJUU1234"
                  ></TextInput>
                  {verifyPanData && (
                    <View
                      style={{
                        width: "14%",
                        height: 40,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Image
                        style={{ height: 22, width: 22, resizeMode: "contain" }}
                        source={require("../../../assets/images/tickBlue.png")}
                      ></Image>
                    </View>
                  )}
                  {verifyPanIsLoading && (
                    <View
                      style={{
                        width: "14%",
                        height: 40,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <FastImage
                        style={{
                          width: 20,
                          height: 20,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        source={{
                          uri: gifUri, // Update the path to your GIF
                          priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.contain}
                      />
                    </View>
                  )}
                </View>
              </View>
              <View
                style={{
                  height: 70,
                  width: "90%",
                  borderWidth: 1,
                  borderColor: "#DDDDDD",
                  alignItems: "flex-start",
                  marginTop: 20,
                }}
              >
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "white",
                    bottom: 10,
                    left: 20,
                  }}
                >
                  <PoppinsTextMedium
                    style={{
                      color: "#919191",
                      fontSize: 16,
                      marginLeft: 4,
                      marginRight: 4,
                    }}
                    content={t("Enter Your Name")}
                  >
                    {" "}
                  </PoppinsTextMedium>
                </View>
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "flex-start",
                    flexDirection: "row",
                    width: "100%",
                    height: 40,
                  }}
                >
                  <TextInput
                    value={
                      name !== "" ? name : verifyPanData?.body?.registered_name
                    }
                    onChangeText={(text) => {
                      setName(text);
                    }}
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      width: "82%",
                      height: 40,
                      fontSize: 16,
                      letterSpacing: 1,
                      marginLeft: 20,
                      color: "black",
                    }}
                    placeholder={t("Enter Your Name")}
                  ></TextInput>
                </View>
              </View>

              {verifyPanData && (
                <PANDataBox
                  name={verifyPanData.body?.registered_name}
                  panNumber={verifyPanData.body?.pan}
                ></PANDataBox>
              )}
            </View>
          )}
          {showAadhar && (
            <View
              style={{
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 20,
              }}
            >
              <PoppinsTextMedium
                style={{
                  color: "black",
                  fontSize: 16,
                }}
                content={t("Kindly Enter Your Aadhaar Details")}
              >
                {" "}
              </PoppinsTextMedium>
              <Image
                style={{ height: 200, width: 200, resizeMode: "contain" }}
                source={require("../../../assets/images/aadhardummy.jpeg")}
              ></Image>

              <View
                style={{
                  height: 70,
                  width: "90%",
                  borderWidth: 1,
                  borderColor: "#DDDDDD",
                  alignItems: "flex-start",
                  marginTop: 20,
                }}
              >
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "white",
                    bottom: 10,
                    left: 20,
                  }}
                >
                  <PoppinsTextMedium
                    style={{
                      color: "#919191",
                      fontSize: 16,
                      marginLeft: 4,
                      marginRight: 4,
                    }}
                    content={t("Enter Aadhar Number")}
                  >
                    {" "}
                  </PoppinsTextMedium>
                </View>
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "flex-start",
                    flexDirection: "row",
                    width: "100%",
                    height: 40,
                  }}
                >
                  <TextInput
                    ref={inpref}
                    maxLength={12}
                    value={aadhar}
                    onChangeText={(text) => {
                      handleAadhaar(text);
                    }}
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      width: "82%",
                      height: 40,
                      fontSize: 16,
                      letterSpacing: 1,
                      marginLeft: 20,
                      color: "black",
                    }}
                    placeholderTextColor="black"
                    placeholder="Enter Aadhar Number"
                  ></TextInput>
                  {verifyAadharData && (
                    <View
                      style={{
                        width: "14%",
                        height: 40,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Image
                        style={{ height: 22, width: 22, resizeMode: "contain" }}
                        source={require("../../../assets/images/tickBlue.png")}
                      ></Image>
                    </View>
                  )}
                  {sendAadharOtpIsLoading && (
                    <View
                      style={{
                        width: "14%",
                        height: 40,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <FastImage
                        style={{
                          width: 20,
                          height: 20,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        source={{
                          uri: gifUri, // Update the path to your GIF
                          priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.contain}
                      />
                    </View>
                  )}
                </View>
              </View>
              {aadhaarOtpSent && (
                <View
                  style={{
                    alignItems: "flex-start",
                    justifyContent: "center",
                    width: "100%",
                  }}
                >
                  <PoppinsTextMedium
                    style={{
                      color: ternaryThemeColor,
                      fontWeight: "700",
                      fontSize: 16,
                      marginLeft: 30,
                      marginTop: 10,
                    }}
                    content="OTP Sent"
                  ></PoppinsTextMedium>
                </View>
              )}
              <View
                style={{
                  height: 70,
                  width: "90%",
                  borderWidth: 1,
                  borderColor: "#DDDDDD",
                  alignItems: "flex-start",
                  marginTop: 20,
                }}
              >
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "white",
                    bottom: 10,
                    left: 20,
                  }}
                >
                  <PoppinsTextMedium
                    style={{
                      color: "#919191",
                      fontSize: 16,
                      marginLeft: 4,
                      marginRight: 4,
                    }}
                    content={t("Enter OTP")}
                  >
                    {" "}
                  </PoppinsTextMedium>
                </View>
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "flex-start",
                    flexDirection: "row",
                    width: "100%",
                    height: 40,
                  }}
                >
                  <TextInput
                    textContentType="oneTimeCode"
                    value={otp}
                    onChangeText={(text) => {
                      handleOtpInput(text);
                    }}
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      width: "82%",
                      height: 40,
                      fontSize: 16,
                      letterSpacing: 1,
                      marginLeft: 20,
                      color: "black",
                    }}
                    placeholderTextColor="black"
                    placeholder="Enter OTP"
                  ></TextInput>
                  {verifyAadharIsLoading && (
                    <View
                      style={{
                        width: "14%",
                        height: 40,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <FastImage
                        style={{
                          width: 20,
                          height: 20,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        source={{
                          uri: gifUri, // Update the path to your GIF
                          priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.contain}
                      />
                    </View>
                  )}
                </View>
              </View>
              {verifyAadharData && (
                <AadharDataBox
                  dob={verifyAadharData.body?.dob}
                  name={verifyAadharData.body?.name}
                  gender={verifyAadharData.body?.gender}
                  address={verifyAadharData.body?.address}
                ></AadharDataBox>
              )}
            </View>
          )}
          {showGst && (
            <View
              style={{
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 20,
              }}
            >
              <PoppinsTextMedium
                style={{
                  color: "black",
                  fontSize: 16,
                }}
                content={t("Kindly Enter Your GSTIN Details")}
              >
                {" "}
              </PoppinsTextMedium>
              <Image
                style={{ height: 200, width: 200, resizeMode: "contain" }}
                source={require("../../../assets/images/gstindummy.jpeg")}
              ></Image>

              <View
                style={{
                  height: 70,
                  width: "90%",
                  borderWidth: 1,
                  borderColor: "#DDDDDD",
                  alignItems: "flex-start",
                  marginTop: 20,
                }}
              >
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "white",
                    bottom: 10,
                    left: 20,
                  }}
                >
                  <PoppinsTextMedium
                    style={{
                      color: "#919191",
                      fontSize: 16,
                      marginLeft: 4,
                      marginRight: 4,
                    }}
                    content={t("Enter GSTIN")}
                  >
                    {" "}
                  </PoppinsTextMedium>
                </View>
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                    width: "100%",
                    height: 40,
                  }}
                >
                  <TextInput
                    maxLength={15}
                    value={gstin ? gstin : verifyGstData?.body?.GSTIN}
                    onChangeText={(text) => {
                      handleGstInput(text);
                    }}
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      width: "82%",
                      height: 40,
                      fontSize: 16,
                      letterSpacing: 1,
                      marginLeft: 20,
                      color: "black",
                    }}
                    placeholder={t("Enter GSTIN")}
                  ></TextInput>
                  <View
                    style={{
                      width: "14%",
                      height: 40,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {verifyGstData && (
                      <Image
                        style={{ height: 22, width: 22, resizeMode: "contain" }}
                        source={require("../../../assets/images/tickBlue.png")}
                      ></Image>
                    )}

                    {verifyGstIsLoading && (
                      <FastImage
                        style={{
                          width: 20,
                          height: 20,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        source={{
                          uri: gifUri, // Update the path to your GIF
                          priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.contain}
                      />
                    )}
                  </View>
                </View>
              </View>
              <View
                style={{
                  height: 70,
                  width: "90%",
                  borderWidth: 1,
                  borderColor: "#DDDDDD",
                  alignItems: "flex-start",
                  marginTop: 20,
                }}
              >
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "white",
                    bottom: 10,
                    left: 20,
                  }}
                >
                  <PoppinsTextMedium
                    style={{
                      color: "#919191",
                      fontSize: 16,
                      marginLeft: 4,
                      marginRight: 4,
                    }}
                    content={t("Business Name")}
                  >
                    {" "}
                  </PoppinsTextMedium>
                </View>
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "flex-start",
                    flexDirection: "row",
                    width: "100%",
                    height: 40,
                  }}
                >
                  <TextInput
                    value={
                      verifyGstData
                        ? verifyGstData.body?.legal_name_of_business
                        : businessName
                    }
                    onChangeText={(text) => {
                      handleGstInput(text);
                    }}
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      width: "82%",
                      height: 40,
                      fontSize: 16,
                      letterSpacing: 1,
                      marginLeft: 20,
                      color: "black",
                    }}
                    placeholder={t("Business Name")}
                  ></TextInput>
                </View>
              </View>

              {verifyGstData && (
                <GSTDataBox
                  businessName={verifyGstData.body?.legal_name_of_business}
                  gstin={verifyGstData.body?.GSTIN}
                ></GSTDataBox>
              )}
            </View>
          )}

          <TouchableOpacity
            style={{
              backgroundColor: ternaryThemeColor,
              height: 50,
              width: 200,
              borderRadius: 4,
              marginTop: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => {
              handleRegistrationFormSubmission();
            }}
          >
            <PoppinsTextMedium
              style={{
                alignSelf: "center",
                fontWeight: "bold",
                fontSize: 20,
                color: "white",
              }}
              content={t("Proceed")}
            ></PoppinsTextMedium>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {error && (
        <ErrorModal
          modalClose={modalClose}
          message={message}
          openModal={error}
          // navigateTo="Dashboard"
        ></ErrorModal>
      )}
      {success && (
        <MessageModal
          modalClose={modalClose}
          message={message}
          openModal={success}
          navigateTo="Dashboard"
        ></MessageModal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({});

export default KycVerificationNewScreen;
