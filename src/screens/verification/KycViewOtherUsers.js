import React, { useRef, useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Touchable,
  ScrollView,
  TextInput,
  Text,
} from "react-native";
import Info from "react-native-vector-icons/AntDesign";
import { useDispatch, useSelector } from "react-redux";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import { useTranslation } from "react-i18next";
import BottomModal from "../../components/modals/BottomModal";
import { useVerifyGstMutation } from "../../apiServices/verification/GstinVerificationApi";
import {
  useGetkycStatusMutation,
  useGetkycStatusOfOtherUserByUserIdMutation,
  useUpdateKycStatusMutation,
} from "../../apiServices/kyc/KycStatusApi";
import {
  useSendAadharOtpMutation,
  useVerifyAadharMutation,
} from "../../apiServices/verification/AadharVerificationApi";
import { useVerifyPanMutation } from "../../apiServices/verification/PanVerificationApi";
import FastImage from "react-native-fast-image";
import { gifUri } from "../../utils/GifUrl";
import { onPress } from "deprecated-react-native-prop-types/DeprecatedTextPropTypes";
import { useListAccountsMutation } from "../../apiServices/bankAccount/ListBankAccount";
import * as Keychain from "react-native-keychain";
import RectanglarUnderlinedTextInput from "../../components/atoms/input/RectanglarUnderlinedTextInput";
import RectangularUnderlinedDropDown from "../../components/atoms/dropdown/RectangularUnderlinedDropDown";
import { useAddBankDetailsMutation } from "../../apiServices/bankAccount/AddBankAccount";
import TextInputRectangularWithPlaceholder from "../../components/atoms/input/TextInputRectangularWithPlaceholder";
import { setKycData } from "../../../redux/slices/userKycStatusSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import SocialBottomBar from "../../components/socialBar/SocialBottomBar";
const KycViewOtherUsers = ({ navigation, route}) => {
  const [modalContent, setModalContent] = useState();
  const [modal, setModal] = useState(false);
  const [kycArray, setKycArray] = useState([]);
  const [error, setError] = useState(false)
  const [message, setMessage] = useState("")
  const [success, setSuccess] = useState(false)
  const [panVerified, setPanVerified] = useState(false);
  const [aadharVerified, setAadharVerified] = useState(false);
  const [gstinVerified, setGstinVerified] = useState(false);
  const [upiVerified, setUpiVerified] = useState(false);
  const [bankAccountVerified, setBankAccountVerified] = useState(false);
  const [verifiedArray, setVerifiedArray] = useState([]);
  const inpref = useRef(null);
  const focused = useIsFocused();
  const kycData = useSelector((state) => state.kycDataSlice.kycData);
  console.log("kycData data final", kycData);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const dataUser = route.params.data

  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  );

  const secondaryThemeColor = useSelector(
    (state) => state.apptheme.secondaryThemeColor
  );
  const userData = useSelector((state) => state.appusersdata.userData);

  const [
    listAccountFunc,
    {
      data: listAccountData,
      error: listAccountError,
      isLoading: listAccountIsLoading,
      isError: listAccountIsError,
    },
  ] = useListAccountsMutation();

  

  const [
    getKycStatusFunc,
    {
      data: getKycStatusData,
      error: getKycStatusError,
      isLoading: getKycStatusIsLoading,
      isError: getKycStatusIsError,
    },
  ] = useGetkycStatusOfOtherUserByUserIdMutation();

  useEffect(() => {
    const fetchOnPageActive = async () => {
      try {
        // Retrieve the credentials
        const credentials = await Keychain.getGenericPassword();
        if (credentials) {
          // console.log(
          //   'Credentials successfully loaded for user ' + credentials?.username
          // );
          const token = credentials?.username;
          console.log("token from dashboard getKycStatusFunc ", token);
          const data = {
            token:token,
            userId:dataUser?.id
          }
          data && getKycStatusFunc(data);
        } else {
          // console.log('No credentials stored');
        }
      } catch (error) {
        // console.log("Keychain couldn't be accessed!", error);
      }
    };

    fetchOnPageActive();
    console.log("uyghjcghjasvhjfbjkhgqwgfjgcqwjkbjkckj");
  }, [focused, modal, panVerified, aadharVerified, gstinVerified]);

  useEffect(() => {
    if (getKycStatusData) {
      console.log("getKycStatusData", getKycStatusData);
      if (getKycStatusData?.success) {
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
    const refetchData = async () => {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        console.log(
          "Credentials successfully loaded for user " + credentials.username
        );
        const token = credentials.username;
        const userId = userData.id;

        const params = {
          token: token,
          userId: userId,
        };
        listAccountFunc(params);
      }
    };
    refetchData();
  }, []);

  useEffect(() => {
    console.log("firstlistAccountData", JSON.stringify(listAccountData));

    listAccountData &&
      listAccountData?.body.map((item, index) => {
        if (Object.keys(item.bene_details).includes("upi_id")) {
          setUpiVerified(true);
        }
        if (Object.keys(item.bene_details).includes("bank_account")) {
          setBankAccountVerified(true);
        }
      });
  }, [listAccountData]);

  useEffect(() => {
    if (upiVerified) {
      setVerifiedArray([...verifiedArray, "upi"]);
    }
    if (bankAccountVerified) {
      setVerifiedArray([...verifiedArray, "bank"]);
    }
  }, [upiVerified, bankAccountVerified]);

  const modalClose = () => {
    setModal(false);
  };

  const AadhaarComp = () => {
    const [showAadhar, setShowAadhar] = useState(false);
    const [error, setError] = useState("");
    const [aadhaarVerified, setAadhaarVerified] = useState(false);
    const [aadhar, setAadhar] = useState("");
    const [otp, setOtp] = useState("");
    const [aadhaarOtpSent, setAadhaarOtpSent] = useState(false);
    const [verifiedAadharDetails, setVerifiedAadharDetails] = useState(false);

    const [
      updateKycStatusFunc,
      {
        data: updateKycStatusData,
        error: updateKycStatusError,
        isLoading: updateKycStatusIsLoading,
        isError: updateKycStatusIsError,
      },
    ] = useUpdateKycStatusMutation();

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

    useEffect(() => {
      if (updateKycStatusData) {
        console.log("updateKycStatusData", updateKycStatusData);
        if (updateKycStatusData.success) {
          setModal(false);
          setAadhaarVerified(true);
        }
      } else if (updateKycStatusError) {
        console.log("updateKycStatusError", updateKycStatusError);
      }
    }, [updateKycStatusData, updateKycStatusError]);

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

          setAadhaarVerified(true);
        }
      } else if (verifyAadharError) {
        console.log("verifyAadharError", verifyAadharError);
        setAadhar("");
        setError(verifyAadharError?.data?.message);
        //   setMessage(verifyAadharError?.data?.message);
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
        //   setError(true);
        if (sendAadharOtpError.data?.Error?.message !== undefined) {
          setError(sendAadharOtpError.data?.Error?.message);
        } else {
          setError(sendAadharOtpError.data?.message);
        }
      }
    }, [sendAadharOtpData, sendAadharOtpError]);

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

    const handleAadharUpdate = () => {
      const payload = {
        aadhar: aadhar,
        aadhar_details: verifiedAadharDetails,
        is_valid_aadhar: true,
      };

      const params = { body: payload, id: userData.id };
      updateKycStatusFunc(params);
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

    return (
      <View
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 20,
        }}
      >
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
        {error.length != 0 && (
          <PoppinsTextMedium
            style={{
              color: "red",
              fontSize: 16,
            }}
            content={t(error)}
          />
        )}

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
        {sendAadharOtpData && (
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
        )}
        {verifyAadharData && (
          <AadharDataBox
            dob={verifyAadharData.body?.dob}
            name={verifyAadharData.body?.name}
            gender={verifyAadharData.body?.gender}
            address={verifyAadharData.body?.address}
          ></AadharDataBox>
        )}
        {verifyAadharData && (
          <TouchableOpacity
            style={{
              alignItems: "center",
              justifyContent: "center",
              height: 50,
              width: 120,
              backgroundColor: ternaryThemeColor,
              marginTop: 10,
              borderRadius: 10,
            }}
            onPress={() => {
              handleAadharUpdate();
            }}
          >
            <PoppinsTextMedium
              style={{
                color: "white",
                fontSize: 16,
              }}
              content={t("Proceed")}
            >
              {" "}
            </PoppinsTextMedium>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const PanComp = () => {
    const [showPan, setShowPan] = useState(false);
    const [panVerified, setPanVerified] = useState(false);
    const [pan, setPan] = useState("");
    const [name, setName] = useState("");
    const [businessName, setBusinessName] = useState("");
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
      updateKycStatusFunc,
      {
        data: updateKycStatusData,
        error: updateKycStatusError,
        isLoading: updateKycStatusIsLoading,
        isError: updateKycStatusIsError,
      },
    ] = useUpdateKycStatusMutation();

    useEffect(() => {
      if (verifyPanData) {
        console.log("verifyPanData", verifyPanData);
        if (verifyPanData.success) {
          // setName(verifyPanData.body.registered_name)
          // setPan(verifyPanData.body.pan)
          console.log("SUCCESS PAN");
          setPanVerified(true);
        }
      }
      if (verifyPanError) {
        setPan("");
        // handlePanInput("")
        console.log("verifyPanError", verifyPanError);
      }
    }, [verifyPanData, verifyPanError]);

    useEffect(() => {
      if (updateKycStatusData) {
        console.log("updateKycStatusData", updateKycStatusData);
        if (updateKycStatusData.success) {
          setModal(false);
          setPanVerified(true);
        }
      } else if (updateKycStatusError) {
        console.log("updateKycStatusError", updateKycStatusError);
      }
    }, [updateKycStatusData, updateKycStatusError]);

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

    const handlePanUpdate = () => {
      const payload = {
        pan: pan,
        pan_details: verifyPanData?.body,
        is_valid_pan: true,
      };

      const params = { body: payload, id: userData.id };
      updateKycStatusFunc(params);
    };

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
    return (
      <View
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 20,
        }}
      >
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
        {verifyPanError && (
          <PoppinsTextMedium
            style={{
              color: "red",
              fontSize: 16,
              marginLeft: 4,
              marginRight: 4,
            }}
            content={t(verifyPanError.data?.message)}
          >
            {" "}
          </PoppinsTextMedium>
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
              value={name !== "" ? name : verifyPanData?.body?.registered_name}
              onChangeText={(text) => {
                setName(text);
              }}
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: "82%",
                height: 40,
                fontSize: 16,
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

        {verifyPanData && (
          <TouchableOpacity
            style={{
              alignItems: "center",
              justifyContent: "center",
              height: 50,
              width: 120,
              backgroundColor: ternaryThemeColor,
              marginTop: 20,
            }}
            onPress={() => {
              handlePanUpdate();
            }}
          >
            <PoppinsTextMedium
              style={{
                color: "white",
                fontSize: 16,
              }}
              content={t("Proceed")}
            >
              {" "}
            </PoppinsTextMedium>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const GstinComp = () => {
    const [showGst, setShowGst] = useState(false);
    const [gstVerified, setGstVerified] = useState(false);
    const [gstin, setGstin] = useState("");
    const [businessName, setBusinessName] = useState("");
    const [
      updateKycStatusFunc,
      {
        data: updateKycStatusData,
        error: updateKycStatusError,
        isLoading: updateKycStatusIsLoading,
        isError: updateKycStatusIsError,
      },
    ] = useUpdateKycStatusMutation();
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
      if (verifyGstData) {
        console.log("verifyGstData", verifyGstData);
        if (verifyGstData.success) {
          setGstVerified(true);
        }
      }
      if (verifyGstError) {
        console.log("verifyGstError", verifyGstError);
        setGstin("");
      }
    }, [verifyGstData, verifyGstError]);

    useEffect(() => {
      if (updateKycStatusData) {
        console.log("updateKycStatusData", updateKycStatusData);
        if (updateKycStatusData.success) {
          setModal(false);
          setGstVerified(true);
        }
      } else if (updateKycStatusError) {
        console.log("updateKycStatusError", updateKycStatusError);
      }
    }, [updateKycStatusData, updateKycStatusError]);

    const handleGstInput = (text) => {
      console.log("gstin input", text);
      setGstin(text);
      if (text.length === 15) {
        const data = {
          gstin: text,
        };
        verifyGstFunc(data);
      }
    };

    const handleGstinUpdate = () => {
      const payload = {
        gstin: gstin,
        gstin_details: verifyGstData?.body,
        is_valid_gstin: true,
      };

      const params = { body: payload, id: userData.id };
      updateKycStatusFunc(params);
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
    return (
      <View
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 20,
        }}
      >
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

        {verifyGstError && (
          <PoppinsTextMedium
            style={{
              color: "red",
              fontSize: 16,
              marginLeft: 4,
              marginRight: 4,
            }}
            content={t(verifyGstError.data?.message)}
          >
            {" "}
          </PoppinsTextMedium>
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

        {verifyGstData && (
          <TouchableOpacity
            style={{
              alignItems: "center",
              justifyContent: "center",
              height: 50,
              width: 120,
              backgroundColor: ternaryThemeColor,
              marginTop: 20,
            }}
            onPress={() => {
              handleGstinUpdate();
            }}
          >
            <PoppinsTextMedium
              style={{
                color: "white",
                fontSize: 16,
              }}
              content={t("Proceed")}
            >
              {" "}
            </PoppinsTextMedium>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const BankAccountComp = () => {
    const [
      addBankDetailsFunc,
      {
        data: addBankDetailsData,
        error: addBankDetailsError,
        isError: addBankDetailsIsError,
        isLoading: addBankDetailsIsLoading,
      },
    ] = useAddBankDetailsMutation();

    useEffect(() => {
      if (addBankDetailsData) {
        console.log("addBankDetailsData", addBankDetailsData);
        if (addBankDetailsData.message === "Bank Account Created") {
          setModal(false);
        }
      } else if (addBankDetailsError) {
        console.log("addBankDetailsError", addBankDetailsError);
      }
    }, [addBankDetailsData, addBankDetailsError]);

    const submitData = async () => {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        console.log(
          "Credentials successfully loaded for user " + credentials.username
        );
        const token = credentials.username;
        if (selectedAccountNumber == confirmAccountNumber) {
          const data = {
            bank: selectedBankName,
            account_no: selectedAccountNumber,
            account_holder_name: selectedBeneficiaryName,
            ifsc: selectedIfscCode,
            transfer_mode: "banktransfer",
          };
          console.log(data);
          const params = { token: token, data: data };
          console.log(params);
          addBankDetailsFunc(params);
        } else {
          alert(
            "Account number and selected account number can't be different"
          );
        }
      }
    };

    const bankNames = [
      "State Bank Of India",
      "Punjab National Bank",
      "IndusInd Bank",
      "Canara Bank",
      "Axis bank",
      "HDFC Bank",
    ];
    const accountType = [t("Current"), t("Savings")];
    var selectedBankName = "";
    var selectedIfscCode = "";
    var selectedAccountNumber = "";
    var confirmAccountNumber = "";
    var bankAccountType = "";
    var selectedBeneficiaryName = "";
    var remarks = "";
    var amount = "";

    const getBankName = (data) => {
      console.log(data);
      selectedBankName = data;
    };
    const getBankAccountType = (data) => {
      console.log(data);
      bankAccountType = data;
    };
    const getIfscCode = (data) => {
      console.log(data);
      selectedIfscCode = data;
    };
    const getAccountNumber = (data) => {
      console.log(data);
      selectedAccountNumber = data;
    };
    const getBeneficiaryName = (data) => {
      console.log(data);
      selectedBeneficiaryName = data;
    };
    const getConfirmAccountNumber = (data) => {
      console.log(data);
      confirmAccountNumber = data;
    };
    const getAmount = (data) => {
      console.log(data);
      amount = data;
    };
    const getRemarks = (data) => {
      console.log(data);
      remarks = data;
    };

    const BankDetails = () => {
      return (
        <View
          style={{
            minHeight: 180,
            width: "90%",
            backgroundColor: "white",
            borderRadius: 20,
            marginTop: 20,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <PoppinsTextMedium
            style={{ color: "black", fontWeight: "700" }}
            content={t("Bank Details")}
          ></PoppinsTextMedium>
          <RectangularUnderlinedDropDown
            header={t("Select Bank")}
            data={bankNames}
            handleData={getBankName}
          ></RectangularUnderlinedDropDown>
          <RectanglarUnderlinedTextInput
            label={t("IFSC Code")}
            handleData={getIfscCode}
            placeHolder="SBIN0010650"
            title={t("IFSC Code")}
          ></RectanglarUnderlinedTextInput>
        </View>
      );
    };
    const AccountDetails = () => {
      return (
        <View
          style={{
            minHeight: 320,
            width: "90%",
            backgroundColor: "white",
            borderRadius: 20,
            marginBottom: 20,
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <PoppinsTextMedium
            style={{
              color: "black",
              fontWeight: "700",
              marginTop: 20,
              paddingBottom: 20,
            }}
            content={t("Account Details")}
          ></PoppinsTextMedium>
          <RectanglarUnderlinedTextInput
            label={t("Account Number")}
            handleData={getAccountNumber}
            placeHolder={t("Enter Account Number")}
          ></RectanglarUnderlinedTextInput>
          <RectanglarUnderlinedTextInput
            label={t("Confirm Account Number")}
            handleData={getConfirmAccountNumber}
            placeHolder={t("Confirm Account Number")}
          ></RectanglarUnderlinedTextInput>
          <RectanglarUnderlinedTextInput
            label={t("Beneficiary Name")}
            handleData={getBeneficiaryName}
            placeHolder={t("Enter Beneficiary Name")}
          ></RectanglarUnderlinedTextInput>
          <RectangularUnderlinedDropDown
            label={t("Account Type")}
            header={t("Select Account Type")}
            data={accountType}
            handleData={getBankAccountType}
          ></RectangularUnderlinedDropDown>
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
        <BankDetails></BankDetails>
        <AccountDetails></AccountDetails>
        {addBankDetailsError && (
          <PoppinsTextMedium
            style={{ color: "red", fontSize: 16, width: "80%" }}
            content={addBankDetailsError.data.message}
          ></PoppinsTextMedium>
        )}
        <TouchableOpacity
          style={{
            alignItems: "center",
            justifyContent: "center",
            height: 50,
            width: 120,
            backgroundColor: ternaryThemeColor,
            marginTop: 20,
          }}
          onPress={() => {
            submitData();
          }}
        >
          <PoppinsTextMedium
            style={{
              color: "white",
              fontSize: 16,
            }}
            content={t("Proceed")}
          >
            {" "}
          </PoppinsTextMedium>
        </TouchableOpacity>
      </View>
    );
  };

  const AddUpiComp = () => {
    const [upi, setUpi] = useState();
    const [data, setData] = useState();
    const [name, setName] = useState();
    const [nameInitialsCapital, setNameInitialsCapital] = useState("");
    const [
      addBankDetailsFunc,
      {
        data: addBankDetailsData,
        error: addBankDetailsError,
        isError: addBankDetailsIsError,
        isLoading: addBankDetailsIsLoading,
      },
    ] = useAddBankDetailsMutation();

    const submitData = async (action) => {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        console.log(
          "Credentials successfully loaded for user " + credentials.username
        );
        const token = credentials.username;
        const data = {
          upi_id: upi,
          transfer_mode: "upi",
          action: action,
        };
        console.log(data);
        const params = { token: token, data: data };
        console.log(params);
        addBankDetailsFunc(params);
      }
    };

    const getUpiId = (data) => {
      console.log(data);
      setUpi(data);
    };

    const getInitials = (name) => {
      const initialsArray = name?.split(" ");
      let nameInitialsTemp = "";
      initialsArray.map((item) => {
        nameInitialsTemp = nameInitialsTemp + item.charAt(0).toUpperCase();
      });
      console.log("initials", nameInitialsTemp);
      setNameInitialsCapital(nameInitialsTemp);
    };

    useEffect(() => {
      if (addBankDetailsData) {
        console.log("addBankDetailsData", addBankDetailsData);
        if (addBankDetailsData.message === "Verified") {
          addBankDetailsData.body.bene_name == null &&
            getInitials(addBankDetailsData.body.bene_details.bene_name);
          setName(addBankDetailsData.body.bene_details.bene_name);
          setData(addBankDetailsData.body);
        }
        if (addBankDetailsData.message === "UPI Added") {
          setModal(false);
        }
      } else if (addBankDetailsError) {
        console.log("addBankDetailsError", addBankDetailsError);
      }
    }, [addBankDetailsData, addBankDetailsError]);

    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "flex-start",
          width: "90%",
          backgroundColor: "white",
          paddingTop: 40,
          marginTop: 20,
        }}
      >
        <TextInputRectangularWithPlaceholder
          handleData={getUpiId}
          placeHolder={t("Enter UPI ID")}
        ></TextInputRectangularWithPlaceholder>
        {addBankDetailsError && (
          <PoppinsTextMedium
            style={{ color: "red", fontSize: 16, width: "80%" }}
            content={addBankDetailsError.data.message}
          ></PoppinsTextMedium>
        )}
        <View
          style={{
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            marginTop: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              submitData("verify");
            }}
            style={{
              height: 50,
              width: 160,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#171717",
              borderWidth: 1,
              borderColor: "black",
            }}
          >
            <PoppinsTextMedium
              style={{ color: "white", fontSize: 16, width: "80%" }}
              content="Verify"
            ></PoppinsTextMedium>
          </TouchableOpacity>
        </View>

        <View
          style={{
            alignItems: "flex-start",
            justifyContent: "center",
            width: "100%",
            marginTop: 50,
          }}
        >
          {nameInitialsCapital && (
            <View
              style={{
                height: 50,
                width: 50,
                borderRadius: 2,
                backgroundColor: ternaryThemeColor,
                alignItems: "center",
                justifyContent: "center",
                marginLeft: 20,
              }}
            >
              <PoppinsTextMedium
                style={{ color: "white", fontSize: 22, fontWeight: "700" }}
                content={nameInitialsCapital}
              ></PoppinsTextMedium>
            </View>
          )}
          <View
            style={{
              width: "100%",
              alignItems: "flex-start",
              justifyContent: "center",
              borderBottomWidth: 1,
              borderColor: "#DDDDDD",
              paddingBottom: 10,
            }}
          >
            {nameInitialsCapital && (
              <PoppinsTextMedium
                style={{
                  color: "#9A9A9A",
                  fontSize: 12,
                  fontWeight: "600",
                  marginTop: 10,
                  marginLeft: 20,
                }}
                content="upi belongs to"
              ></PoppinsTextMedium>
            )}
            {nameInitialsCapital && (
              <PoppinsTextMedium
                style={{
                  color: "#353535",
                  fontSize: 12,
                  fontWeight: "600",
                  marginLeft: 20,
                }}
                content={name}
              ></PoppinsTextMedium>
            )}
          </View>

          {nameInitialsCapital && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-evenly",
                marginTop: 20,
                paddingBottom: 10,
                width: "100%",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  submitData();
                }}
                style={{
                  height: 50,
                  width: 160,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#171717",
                  borderWidth: 1,
                  borderColor: "black",
                }}
              >
                <PoppinsTextMedium
                  style={{ color: "white", fontSize: 16, width: "80%" }}
                  content="Confirm"
                ></PoppinsTextMedium>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  const handleAadhaarCompPress = () => {
    setModalContent("aadhaar");
    setModal(true);
  };
  const handlePanCompPress = () => {
    setModalContent("pan");
    setModal(true);
  };
  const handleGstinCompPress = () => {
    setModalContent("gstin");
    setModal(true);
  };
  const handleBankAccountCompPress = () => {
    setModalContent("bank");
    setModal(true);
  };
  const handleUpiCompPress = () => {
    setModalContent("upi");
    setModal(true);
  };

  const KycComp = (props) => {
    const image = props.image;
    const title = props.title;
    const verified = props.verified;

    return (
      <TouchableOpacity
        onPress={() => {
        //   props.handlePress();
        }}
        style={{
          borderWidth: 1,
          borderColor: "#DDDDDD",
          borderRadius: 14,
          height: 70,
          width: "86%",
          alignItems: "center",
          justifyContent: "space-evenly",
          flexDirection: "row",
          marginTop: 20,
        }}
      >
        <View
          style={{
            height: 60,
            width: 60,
            borderRadius: 30,
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            left: 10,
          }}
        >
          <Image
            style={{ height: 38, width: 38, resizeMode: "contain" }}
            source={image}
          ></Image>
        </View>
        <PoppinsTextMedium
          content={t(title)}
          style={{
            marginLeft: 10,
            fontSize: 20,
            fontWeight: "700",
            color: "black",
            position: "absolute",
            left: 60,
          }}
        ></PoppinsTextMedium>
        <Image
          style={{
            height: 30,
            width: 30,
            resizeMode: "contain",
            marginLeft: 20,
            position: "absolute",
            right: 20,
          }}
          source={
            verified
              ? require("../../../assets/images/verifiedKyc.png")
              : require("../../../assets/images/notVerifiedKyc.png")
          }
        ></Image>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ width: "100%", flex: 1 }}>
      <BottomModal
        modalClose={modalClose}
        type={modalContent}
        // message={message}
        canGoBack={true}
        openModal={modal}
        compAadhaar={AadhaarComp}
        compPan={PanComp}
        compGstin={GstinComp}
        compBankAccount={BankAccountComp}
        compUpiAccount={AddUpiComp}
      ></BottomModal>
      <View
        style={{
          alignItems: "center",
          justifyContent: "flex-start",
          flexDirection: "row",
          width: "100%",
          height: 60,
          backgroundColor: secondaryThemeColor,
        }}
      >
        <TouchableOpacity
          style={{ marginLeft: 10 }}
          onPress={() => {
            navigation.navigate("Dashboard");
          }}
        >
          <Image
            style={{ height: 24, width: 24, resizeMode: "contain" }}
            source={require("../../../assets/images/blackBack.png")}
          ></Image>
        </TouchableOpacity>
        <PoppinsTextMedium
          content={t("KYC")}
          style={{
            marginLeft: 10,
            fontSize: 18,
            fontWeight: "600",
            color: "black",
          }}
        ></PoppinsTextMedium>
      </View>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 10,
        }}
      >
        <Image
          style={{ height: 220, width: 220, resizeMode: "contain" }}
          source={require("../../../assets/images/kyclogo.png")}
        ></Image>
        <PoppinsTextMedium
          content={t("Complete Your KYC")}
          style={{
            marginLeft: 10,
            fontSize: 22,
            fontWeight: "800",
            color: "black",
          }}
        ></PoppinsTextMedium>
      </View>
      <ScrollView
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 20,
        }}
      >
        <KycComp
          handlePress={handleAadhaarCompPress}
          image={require("../../../assets/images/aadhaarkyc.png")}
          title="Aadhaar"
          verified={kycData?.aadhar}
        ></KycComp>
        <KycComp
          handlePress={handlePanCompPress}
          image={require("../../../assets/images/pankyc.png")}
          title="PAN Card"
          verified={kycData?.pan}
        ></KycComp>
        <KycComp
          handlePress={handleGstinCompPress}
          image={require("../../../assets/images/gstinkyc.png")}
          title="GSTIN"
          verified={kycData?.gstin}
        ></KycComp>
        <KycComp
          handlePress={handleBankAccountCompPress}
          image={require("../../../assets/images/bankaccount.png")}
          title="Add Bank Account"
          verified={bankAccountVerified}
        ></KycComp>
        <KycComp
          handlePress={handleUpiCompPress}
          image={require("../../../assets/images/upi.png")}
          title="Add UPI"
          verified={upiVerified}
        ></KycComp>
        <Text style={{ color: "black", margin: 10 }}>
          For any issues with KYC approvals, please contact our help and support
          team at <Text style={{ color: "#B6202D" }}>+91-9258262524</Text>.
        </Text>
      </ScrollView>
      <SocialBottomBar showRelative={true}></SocialBottomBar>

    </View>
  );
};

const styles = StyleSheet.create({});

export default KycViewOtherUsers;
