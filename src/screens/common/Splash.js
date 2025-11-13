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
    allApisComplete,
    criticalError,
    failedApis,
  } = useSplashData();

  // Local state for UI
  const [connected, setConnected] = useState(true);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  
  const isConnected = useSelector((state) => state.internet.isConnected);
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
    
    const handleNavigation = () => {
      console.log("session data", sessionData);
      console.log("All APIs complete", allApisComplete);
      console.log("Critical error", criticalError);
      console.log("minVersionSupport", minVersionSupport);
  
      // Wait for version check to complete before any navigation
      if (minVersionSupport === null) {
        console.log("Waiting for version check...");
        return;
      }

      // If version not supported, don't navigate - alert is shown in useSplashData
      if (minVersionSupport === false) {
        console.log("Version not supported, blocking navigation");
        return;
      }

      // If no session data, go to login immediately
      if (sessionData === null && !hookIsLoading) {
        console.log("No session data, navigating to OtpLogin");
        navigation.reset({ index: 0, routes: [{ name: "OtpLogin" }] });
        return;
      }
  
      // If we have session data and version is supported
      if (sessionData) {
        // If API loading failed or timeout, navigate to OtpLogin
        if (criticalError) {
          console.log("API error occurred, navigating to OtpLogin");
          navigation.reset({ index: 0, routes: [{ name: "OtpLogin" }] });
          return;
        }

        // If all APIs completed successfully, navigate to Dashboard immediately
        if (allApisComplete) {
          console.log("All APIs completed successfully, navigating to Dashboard");
          navigation.reset({ index: 0, routes: [{ name: "Dashboard" }] });
          return;
        } else {
          // Set fallback timer - if APIs don't complete in 4 seconds, go to OtpLogin
          fallbackTimer = setTimeout(() => {
            console.log("⏱️ Timeout: APIs did not complete in time, navigating to OtpLogin");
            navigation.reset({ index: 0, routes: [{ name: "OtpLogin" }] });
          }, 4000);
        }
      } else {
        // No session data case - set fallback timer
        fallbackTimer = setTimeout(() => {
          console.log("⏱️ Timeout: No session data timeout, navigating to OtpLogin");
          navigation.reset({ index: 0, routes: [{ name: "OtpLogin" }] });
        }, 4000);
      }
    };

    handleNavigation();
    
    return () => {
      if (fallbackTimer) {
        clearTimeout(fallbackTimer);
      }
    };
  }, [allApisComplete, sessionData, minVersionSupport, hookIsLoading, criticalError]);

  // Check internet status
  useEffect(() => {
    console.log("internet status", isConnected);
    setConnected(isConnected.isInternetReachable);
  }, [isConnected]);

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
