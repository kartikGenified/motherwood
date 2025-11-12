import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import InternetModal from "../../components/modals/InternetModal";
import ErrorModal from "../../components/modals/ErrorModal";
import { ActivityIndicator, MD2Colors } from "react-native-paper";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import { useInternetSpeedContext } from "../../Contexts/useInternetSpeedContext";
import { useTranslation } from "react-i18next";
import i18n from "./i18n";
import useSplashData from "../../hooks/useSplashData";

const Splash = ({ navigation }) => {
  const dispatch = useDispatch();
  
  const { t } = useTranslation();
  
  // Use the custom hook for all splash data logic
  const {
    sessionData,
    currentAppVersion,
    minVersionSupport,
    isLoading: hookIsLoading,
    error: splashError,
    minVersionData,
    isSlowInternet,
    setError: setSplashError,
  } = useSplashData();

  // Local state for UI
  const [connected, setConnected] = useState(true);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  
  const apiCallStatus = useSelector((state) => state.splashApi.apiCallStatus);
  const isConnected = useSelector((state) => state.internet.isConnected);
  
  const allApiArray = [
    "getAppThemeData", 
    // "getTermsData", 
    // "getPolicyData", 
    "getLegalData",
    "getWorkflowData", 
    "getDashboardData", 
    "getAppMenuData", 
    "getFormData", 
    "getBannerData", 
    "getUsersData"
  ];
  // Initialize language
  useEffect(() => {
    AsyncStorage.getItem('selectedLanguage')
    .then(lang => {
      if(lang){
        i18n.changeLanguage(lang);
      }
    })
  }, []);

  // Handle splash error
  useEffect(() => {
    if (splashError) {
      setError(true);
      setMessage(splashError);
    }
  }, [splashError]);

  // Navigation logic based on API completion
  useEffect(() => {
    let fallbackTimer;
    console.log("session data", sessionData);
  
    if (sessionData) {
      const allApisComplete = areAllApisComplete(apiCallStatus, allApiArray);
  
      if (allApisComplete ) {
        if(minVersionSupport){
          setTimeout(() => {
            navigation.reset({ index: 0, routes: [{ name: "Dashboard" }] });
          }, 2000);
        }
      } else {
        fallbackTimer = setTimeout(() => {
          const missingApis = allApiArray.filter(api => !apiCallStatus?.includes(api));
          console.log("Timeout: Missing APIs:", missingApis);
          navigation.reset({ index: 0, routes: [{ name: "OtpLogin" }] });
        }, 4000);
      }
    } else {
      fallbackTimer = setTimeout(() => {
        const missingApis = allApiArray.filter(api => !apiCallStatus?.includes(api));
        console.log("Timeout: Missing APIs:", missingApis);
        navigation.reset({ index: 0, routes: [{ name: "OtpLogin" }] });
      }, 4000);
    }
  
    return () => clearTimeout(fallbackTimer);
  }, [apiCallStatus, sessionData, minVersionSupport]);

  // Check internet status
  useEffect(() => {
    console.log("internet status", isConnected);
    setConnected(isConnected.isInternetReachable);
  }, [isConnected]);

  // Helper function to check if all APIs are complete
  const areAllApisComplete = (apiCallStatus, allApiArray) => {
    return allApiArray.every(api => apiCallStatus?.includes(api));
  };

  const modalClose = () => {
    setError(false);
  };
  // UI Components
  const NoInternetComp = () => (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        width: "90%",
        zIndex: 1,
      }}
    >
      <Text style={{ color: "black" }}>No Internet Connection</Text>
      <Text style={{ color: "black" }}>
        Please check your internet connection and try again.
      </Text>
    </View>
  );

  return (
    <ImageBackground 
      style={{ flex: 1 }} 
      source={require('../../../assets/images/SplashMotherWood.jpg')}
    >
      {console.log("isSlow", isConnected.isInternetReachable)}
      
      {!connected && (
        <InternetModal visible={!connected} comp={NoInternetComp} />
      )}

      {error && (
        <ErrorModal
          modalClose={modalClose}
          message={message}
          openModal={error}
        />
      )}

      <View
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 10,
        }}
      >
      </View>
        <View style={{ position: "absolute", bottom: 130, height: 40, justifyContent: "center", width:'100%' }}>
          <ActivityIndicator
            size={"medium"}
            animating={true}
            color={MD2Colors.yellow800}
          />
          <PoppinsTextMedium
            style={{
              color: "white",
              marginTop: 4,
              fontWeight: "800",
              fontSize: 20,
            }}
            content="Please Wait"
          />
        </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({});

export default Splash;
