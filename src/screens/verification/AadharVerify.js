import React, {  useEffect } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import WebView from "react-native-webview";
import { useTranslation } from 'react-i18next';
import {
  useAadharKycGenerateMutation,
  useAadharKycStatusMutation,
} from "@/apiServices/kyc/AadharKyc";
import PoppinsTextMedium from "@/components/electrons/customFonts/PoppinsTextMedium";
import OptionCard from "./OptionCard";

import { Platform } from "react-native";
import * as Keychain from "react-native-keychain";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";
import { TextInput } from "react-native";

const AadharVerify = (props) => {
  const { t } = useTranslation();
  const { optionCard, preVerifiedDocs, verifiedAadharDetails, getKycDynamicFunc} = props;
  const [webviewVisible, setWebviewVisible] = React.useState(false);
  const [aadhaarModalVisible, setAadhaarModalVisible] = React.useState(false);
  const [aadharVerified, setAadharVerified] = React.useState(false);
  const ternaryThemeColor = useSelector((state) => state.apptheme.ternaryThemeColor) || "grey";
  const [inputAadhaar, setInputAadhaar] = React.useState("");

  const onNavigationStateChange = (navState) => {
    // console.log("url", navState.url);

    if (navState.url.includes("success=true")) {
      setTimeout(() => {
        aadharCallback();
      }, 1000);
    }
  };
  const [aadharKycGenerateFunc, { data: aadharKycGenerateData, error: aadharKycGenerateError }] =
    useAadharKycGenerateMutation();
  const [aadharKycStatusFunc, { data: aadharKycStatusData, error: aadharKycStatusError }] =
    useAadharKycStatusMutation();
  const aadharCallback = () => {
    setWebviewVisible(false);
    getAadharStatus();
  };
  const AadharDataBox = ({ aadhaar, dob, name, gender, address }) => {
    return (
      <View style={styles.dataBox}>
        <View style={{ flexDirection: "row", width: "90%" }}>
          <PoppinsTextMedium content={t("Aadhaar No") + " :"} style={styles.dataLabel} />
          <PoppinsTextMedium content={aadhaar} style={styles.dataValue} />
        </View>
        <View style={{ flexDirection: "row", width: "90%", marginTop: 10 }}>
          <PoppinsTextMedium content={t("name") + " :"} style={styles.dataLabel} />
          <PoppinsTextMedium content={name} style={styles.dataValue} />
        </View>
        <View style={{ flexDirection: "row", width: "90%", marginTop: 10 }}>
          <PoppinsTextMedium content={t("DOB") + " :"} style={styles.dataLabel} />
          <PoppinsTextMedium content={dob} style={styles.dataValue} />
        </View>
        <View style={{ flexDirection: "row", width: "90%", marginTop: 10 }}>
          <PoppinsTextMedium content={t("Gender") + " :"} style={styles.dataLabel} />
          <PoppinsTextMedium content={gender} style={styles.dataValue} />
        </View>
        <View style={{ flexDirection: "row", width: "90%", marginTop: 10 }}>
          <PoppinsTextMedium content={t("address") + ":"} style={styles.dataLabel} />
          <PoppinsTextMedium content={`${address?.house || ""}, ${address?.locality || ""}, ${address?.vtc || ""}, ${address?.dist || ""}, ${address?.state || ""}, ${address?.pincode || ""}`} style={styles.dataValue} />
        </View>
      </View>
    );
  };

  const verifyAadhaar = async (aadhaar) => {
    setInputAadhaar(aadhaar);
    try {
        const credentials = await Keychain.getGenericPassword();
        if (!credentials) throw new Error('No authentication credentials found');
        const body = {
            data: {
                "aadhaar": aadhaar
            },
            token: credentials.username
          }
        aadharKycGenerateFunc(body);
    } catch (error) {
        console.error("Error handling Aadhar KYC:", error);
    }
  };
  useEffect(() => {
    if (aadharKycGenerateData) {
      if (aadharKycGenerateData?.success) {
        // console.log("Aadhar KYC Generate Data:", aadharKycGenerateData.body);
        if (aadharKycGenerateData.body?.verification_link) {
          setWebviewVisible(true);
        }
        // Handle successful Aadhar KYC generation
      }
    }

    if (aadharKycGenerateError) {
      console.log("Error generating Aadhar KYC:", aadharKycGenerateError);
      Toast.show({
        type: "error",
        text1: aadharKycGenerateError?.data?.message || "Error generating Aadhaar KYC, please try again.",
      });
    }
  }, [aadharKycGenerateData, aadharKycGenerateError]);
  useEffect(() => {
    console.log("aadharKycStatusData", aadharKycStatusData, aadharKycStatusError);

    if (aadharKycStatusData) {
      // console.log("aadharKycStatusData", aadharKycStatusData);

      if (aadharKycStatusData?.success) {
        // console.log("Aadhar KYC Status Data:", aadharKycStatusData.body);
        // Handle successful Aadhar KYC generation
        // 0 - api failed
        // 1 - success
        // 2 - pending
        // 3 - failure
        // 4 - invalid aadhaar number going to error 500
        if(aadharKycStatusData.body?.status === "1"){
          Toast.show({
            type: "success",
            text1: t("Aadhaar KYC is verified."),
          });
          setAadharVerified(true);
          getKycDynamicFunc();
          // setAadharName(aadharKycStatusData?.body?.response?.name);
        }else{
          Toast.show({
            type: "error",
            text1: t("Aadhaar KYC verification failed, please try again."),
          });
          // setAadharVerified(false);
          // setAadhar("");
          // setAadharNumber("");
          // setAadharName("");
        }
      }
    }

    if (aadharKycStatusError) {
      console.log("Error status Aadhar KYC:", aadharKycStatusError);
      Toast.show({
        type: "error",
        text1: aadharKycStatusError?.data?.message || "Error verifying Aadhaar KYC, please try again.",
      });
      
    }
  }, [aadharKycStatusData, aadharKycStatusError]);
  const getAadharStatus = async () => {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        const body = {
          data: {
              "aadhaar": inputAadhaar
          },
          token: credentials?.username
        }

        aadharKycStatusFunc(body);
      } 
    } catch (error) {
      console.log("Keychain couldn't be accessed!", error);
    }
  };

  const AadhaarVerificationDialog = (
    ({ visible, onClose, refetchKycStatus, initialAadhar = "" }) => {
      console.log("AadhaarVerificationDialog rendered with visible:", visible);
      const [localAadhaar, setLocalAadhaar] = React.useState(initialAadhar);

      const isPreVerified = preVerifiedDocs.aadhaar;
      console.log("isPreVerified:", isPreVerified);

      const onHandleOk = ()=>{
        if(isPreVerified){
          onClose();
        }else{
          if(localAadhaar.length !== 12 || !/^\d{12}$/.test(localAadhaar)){
            Toast.show({
              type: "error",
              text1: t("Invalid Aadhaar number."),
            });
            return;
          }
          verifyAadhaar(localAadhaar);
          onClose();
        }
      }

      // Determine button text and behavior
      return (
        <Modal
          visible={visible}
          animationType="slide"
          transparent={true}
          onRequestClose={onClose}
          onDismiss={onClose}
          hardwareAccelerated={true}
          statusBarTranslucent={true}
        >

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalContainer}
          >
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Icon name="cross" size={24} color="#000" />
              </TouchableOpacity>

              {/* <View style={styles.headerRow}> */}
              <PoppinsTextMedium
                style={styles.modalTitle}
                content={
                  isPreVerified ? t("Your Aadhaar Details") : t("Kindly Enter Your Aadhaar Details")
                }
              />
              {/* </View> */}

              {isPreVerified && (
                <>
                <Image
                style={styles.documentImage}
                source={require("../../../assets/images/addharColor.png")}
              />

              <View style={styles.preVerifiedContainer}>
                {verifiedAadharDetails && (
                  <AadharDataBox
                    aadhaar={verifiedAadharDetails.aadhaar}
                    dob={verifiedAadharDetails.dob}
                    name={verifiedAadharDetails.name}
                    gender={verifiedAadharDetails.gender}
                    address={verifiedAadharDetails.split_address}
                  />
                )}

                <PoppinsTextMedium
                  style={styles.preVerifiedText}
                  content={t("Your Aadhaar has been verified and cannot be edited")}
                />
              </View>
              <View style={{}}>
                <PoppinsTextMedium
                  style={[styles.statusText, { color: "green" }]}
                  content={"✓ " + t("Aadhaar verified and submitted successfully")}
                />
              </View>
                </>
              )}
              {!isPreVerified && (
                <>
              <TextInput
                    maxLength={12}
                    value={localAadhaar}
                    onChangeText={setLocalAadhaar}
                    style={styles.inputField}
                    placeholder="Enter Aadhaar Number"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                />
                </>
              )}

              
              

              {/* Status Message */}

              

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  {
                    backgroundColor: ternaryThemeColor,
                  }
                ]}
                onPress={ onHandleOk }
              >

                <PoppinsTextMedium
                  style={styles.submitButtonText}
                  content={ isPreVerified ? t('Done') : t('Verify')}
                />
              </TouchableOpacity>
            </View>
            <Toast position="bottom" />
          </KeyboardAvoidingView>
        </Modal>
      );
    }
  );

  return (
    <View style={{ flex: 1 }}>

      <OptionCard
          option={{ ...optionCard , verified: preVerifiedDocs.aadhaar || aadharVerified }}
          onPress={()=>setAadhaarModalVisible(true)}
          isMandatory={!optionCard.isOptional}
        />
      <Modal
        visible={webviewVisible}
        animationType="slide"
        transparent={false}
        // onRequestClose={() => {
        //   setWebviewVisible(false);
        //   // getAadharStatus();
        // }}
      >
        <View style={{ flex: 1 }}>
          <TouchableOpacity onPress={aadharCallback}>
            <Image
              style={{
                height: 24,
                width: 24,
                resizeMode: "contain",
                margin: 20,
              }}
              source={require("../../../assets/images/blackBack.png")}
            ></Image>
          </TouchableOpacity>
          <WebView
            source={{ uri: aadharKycGenerateData?.body?.verification_link }}
            style={{ flex: 1, height: "100%", width: "100%" }}
            onNavigationStateChange={onNavigationStateChange}
            startInLoadingState={true}

          />
        </View>
      </Modal>
      <AadhaarVerificationDialog
        visible={aadhaarModalVisible}
        onClose={() => setAadhaarModalVisible(false)}
        refetchKycStatus={()=>{}}
        initialAadhar={""}
      />
    </View>
  );
};

export default AadharVerify;

const styles = StyleSheet.create({
  dataBox: {
    width: "100%",
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 5,
    alignItems: "flex-start",
    justifyContent: "center",
    padding: 10,
    paddingRight: 20,
    marginTop: 10,
  },
  dataLabel: {
    fontWeight: "700",
    color: "#919191",
    fontSize: 14,
  },
  dataValue: {
    fontWeight: "600",
    color: "#919191",
    fontSize: 14,
    marginLeft: 10,
  },
  preVerifiedText: {
    fontSize: 12,
    color: "#6c757d",
    textAlign: "center",
    fontStyle: "italic",
    marginTop: 10,
  },
  modalTitle: {
    color: "black",
    fontSize: 16,
    marginBottom: 0,
    fontWeight: "bold",
    textAlign: "center",
  },
  documentImage: {
    height: 100,
    width: "100%",
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 0,
  },
  preVerifiedContainer: {
    width: "100%",
    marginBottom: 20,
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    maxHeight: "90%",
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  submitButton: {
    height: 50,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'white',
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 5,
  },
  inputField: {
    // height: 40,
    borderColor:'#DDDDDD',
    borderWidth:1,
    borderRadius:10,
    fontSize: 14,
    color: 'black',
    paddingHorizontal:15,
    marginVertical:20
},
});
