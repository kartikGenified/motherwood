import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  ImageBackground,
  PermissionsAndroid,
  Platform,
  Alert,
  Linking,
  BackHandler,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Geolocation from "@react-native-community/geolocation";
import InternetModal from "../../components/modals/InternetModal";
import ErrorModal from "../../components/modals/ErrorModal";
import { ActivityIndicator, MD2Colors } from "react-native-paper";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import { useInternetSpeedContext } from "../../Contexts/useInternetSpeedContext";
import { useTranslation } from "react-i18next";
import handleLocationPermissionAndFetch from "../../utils/handleLocationPermissionAndFetch";
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import i18n from "./i18n";
import useSplashData from "../../hooks/useSplashData";

const Splash = ({ navigation }) => {
  const dispatch = useDispatch();
  
  // Use the custom hook for all splash data logic
  const {
    sessionData,
    currentAppVersion,
    minVersionSupport,
    isLoading: hookIsLoading,
    error: splashError,
    minVersionData,
    setError: setSplashError,
  } = useSplashData();

  // Local state for UI and permissions
  const [connected, setConnected] = useState(true);
  const [isSlowInternet, setIsSlowInternet] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  
  const { t } = useTranslation();
  const { responseTime } = useInternetSpeedContext();
  const apiCallStatus = useSelector((state) => state.splashApi.apiCallStatus);
  const isConnected = useSelector((state) => state.internet.isConnected);
  
  const allApiArray = [
    "getAppThemeData", 
    "getTermsData", 
    "getPolicyData", 
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
  
      if (allApisComplete) {
        setTimeout(() => {
          navigation.reset({ index: 0, routes: [{ name: "Dashboard" }] });
        }, 2000);
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
  }, [apiCallStatus, sessionData]);

  // Handle version support alerts
  useEffect(() => {
    if (minVersionData) {
      console.log("getMinVersionSupportData", minVersionData);
      if (minVersionData.success) {
        if (!minVersionData?.body?.data) {
          Alert.alert(
            t("Kindly update the app to the latest version"),
            t("Your version of app is not supported anymore, kindly update"),
            [
              {
                text: t("Update"),
                onPress: () =>
                  Linking.openURL(
                    "https://play.google.com/store/apps/details?id=com.genefied.motherwood"
                  ),
              },
            ]
          );
        }
      } else {
        if (Object.keys(minVersionData?.body)?.length === 0) {
          Alert.alert(
            t("Kindly update the app to the latest version"),
            t("Your version of app is not supported anymore, kindly update"),
            [
              {
                text: "Update",
                onPress: () =>
                  Linking.openURL(
                    "https://play.google.com/store/apps/details?id=com.genefied.motherwood"
                  ),
              },
            ]
          );
        }
      }
    }
  }, [minVersionData]);

  // Initialize permissions and location on mount
  useEffect(() => {
    requestPermission();
    
    // Fetch location data
    const fetchLocationData = async () => {
      try {
        const locationData = await handleLocationPermissionAndFetch();
        if (locationData) {
          console.log("Fetched Location Data:", locationData);
        } else {
          console.log("Location fetch failed or permission denied");
        }
      } catch (error) {
        console.error("Error fetching location data:", error);
      }
    };
    fetchLocationData();

    // Request location permission
    const requestLocationPermission = async () => {
      try {
        if (Platform.OS === "android") {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: "Geolocation Permission",
              message: "Can we access your location?",
              buttonNeutral: "Ask Me Later",
              buttonNegative: "Cancel",
              buttonPositive: "OK",
            }
          );
          return granted === "granted";
        } else {
          Geolocation.requestAuthorization();
        }
      } catch (err) {
        return false;
      }
    };
    requestLocationPermission();

    dispatch({ type: "NETWORK_REQUEST" });
  }, []);
  // Handle back press on splash screen
  useEffect(() => {
    const backAction = () => {
      Alert.alert(t("Exit App"), t("Are you sure you want to exit?"), [
        {
          text: t("Cancel"),
          onPress: () => null,
          style: "cancel",
        },
        { text: t("Exit"), onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => {
      backHandler.remove();
    };
  }, []);

  // Check internet status and slow internet
  useEffect(() => {
    console.log("internet status", isConnected);
    setConnected(isConnected.isInternetReachable);
  }, [isConnected]);

  useEffect(() => {
    console.log("responseTime", responseTime);
    if (responseTime > 4000) {
      setIsSlowInternet(true);
    } else if (responseTime < 4000) {
      setIsSlowInternet(false);
    }
  }, [responseTime, connected]);

  // Helper function to check if all APIs are complete
  const areAllApisComplete = (apiCallStatus, allApiArray) => {
    return allApiArray.every(api => apiCallStatus?.includes(api));
  };

  // Notification permission functions
  const requestNotificationPermission = async () => {
    const result = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
    return result;
  };
  
  const checkNotificationPermission = async () => {
    const result = await check(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
    return result;
  };

  const requestPermission = async () => {
    const checkPermission = await checkNotificationPermission();
    console.log("notification permission status", checkPermission);
    if (checkPermission !== RESULTS.GRANTED) {
      const request = await requestNotificationPermission();
      if (request !== RESULTS.GRANTED) {
        // permission not granted
      }
    }
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
        <View style={{ position: "absolute", bottom: 60, height: 40 }}>
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
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({});

export default Splash;
