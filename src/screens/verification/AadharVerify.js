import React, { useCallback, useEffect } from "react";
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
} from "../../apiServices/kyc/AadharKyc";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import OptionCard from "./OptionCard";

import { Platform } from "react-native";
import * as Keychain from "react-native-keychain";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";

const AadharVerify = (props) => {
  const { t } = useTranslation();
  const { optionCard, preVerifiedDocs, verifiedAadharDetails, getKycDynamicFunc} = props;
  const [webviewVisible, setWebviewVisible] = React.useState(false);
  const [aadhaarModalVisible, setAadhaarModalVisible] = React.useState(false);
  const [aadharVerified, setAadharVerified] = React.useState(false);
  const ternaryThemeColor = useSelector((state) => state.apptheme.ternaryThemeColor) || "grey";

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
          <PoppinsTextMedium content={address} style={styles.dataValue} />
        </View>
      </View>
    );
  };

  const handleAadhar = async () => {
    // console.log("Aadhar menu");
    if (preVerifiedDocs.aadhaar || aadharVerified) {
      setAadhaarModalVisible(true);
      // console.log('Aadhar already verified');
      return;
    }

    try {
        const credentials = await Keychain.getGenericPassword();
        if (!credentials) throw new Error('No authentication credentials found');

        const token = credentials.username;
        aadharKycGenerateFunc(token);
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

        switch (aadharKycStatusData.body?.status) {
          case "0":
            Toast.show({
              type: "error",
              text1: t("Aadhar KYC API call failed. Please try again."),
            });
            break;
          case "1":
            Toast.show({
              type: "success",
              text1: t("Aadhar KYC is verified."),
            });
            setAadharVerified(true);
            getKycDynamicFunc();
            break;
          case "2":
            Toast.show({
              type: "info",
              text1: t("Aadhar KYC status is in progress. You can try again."),
            });
            break;
          case "3":
            Toast.show({
              type: "error",
              text1: t("Aadhar KYC has failed. Please try again."),
            });
            break;
          default:
            Toast.show({
              type: "error",
              text1: t("Unknown Aadhar KYC status."),
            });
        }
        
      }
    }

    if (aadharKycStatusError) {
      console.log("Error status Aadhar KYC:", aadharKycStatusError);
    }
  }, [aadharKycStatusData, aadharKycStatusError]);
  const getAadharStatus = async () => {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        const token = credentials?.username;
        console.log("Aadhar Token: ", token);

        aadharKycStatusFunc(token);
      } 
    } catch (error) {
      console.log("Keychain couldn't be accessed!", error);
    }
  };

  const AadhaarVerificationDialog = React.memo(
    ({ visible, onClose, refetchKycStatus, initialAadhar = "" }) => {
      console.log("AadhaarVerificationDialog rendered with visible:", visible);

      const isPreVerified = preVerifiedDocs.aadhaar;
      console.log("isPreVerified:", isPreVerified);

      const handleClose = useCallback(() => {
        console.log("Dialog close requested");
        onClose();
      }, [onClose]);

      // Determine button text and behavior
      return (
        <Modal
          visible={visible}
          animationType="slide"
          transparent={true}
          onRequestClose={handleClose}
          onDismiss={handleClose}
          hardwareAccelerated={true}
          statusBarTranslucent={true}
        >

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalContainer}
          >
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
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

              <Image
                style={styles.documentImage}
                source={require("../../../assets/images/addharColor.png")}
              />

              <View style={styles.preVerifiedContainer}>
                {verifiedAadharDetails && (
                  <AadharDataBox
                    aadhaar={true}
                    dob={verifiedAadharDetails.dob}
                    name={verifiedAadharDetails.name}
                    gender={verifiedAadharDetails.gender}
                    address={verifiedAadharDetails.address}
                  />
                )}

                <PoppinsTextMedium
                  style={styles.preVerifiedText}
                  content={t("Your Aadhaar has been verified and cannot be edited")}
                />
              </View>

              {/* Status Message */}

              <View style={{}}>
                <PoppinsTextMedium
                  style={[styles.statusText, { color: "green" }]}
                  content={"✓ " + t("Aadhaar verified and submitted successfully")}
                />
              </View>

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  {
                    backgroundColor: ternaryThemeColor,
                  }
                ]}
                onPress={handleClose}
              >

                <PoppinsTextMedium
                  style={styles.submitButtonText}
                  content={t('Done')}
                />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      );
    }
  );

  return (
    <View style={{ flex: 1 }}>

      <OptionCard
          option={{ ...optionCard , verified: preVerifiedDocs.aadhaar || aadharVerified }}
          onPress={handleAadhar}
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
        refetchKycStatus={getAadharStatus}
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
});
