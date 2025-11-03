import { useEffect } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import Geolocation from "@react-native-community/geolocation";
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import handleLocationPermissionAndFetch from "../utils/handleLocationPermissionAndFetch";

const usePermissions = () => {
  // Notification permission functions
  const requestNotificationPermission = async () => {
    const result = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
    return result;
  };
  
  const checkNotificationPermission = async () => {
    const result = await check(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
    return result;
  };

  const requestNotificationPermissions = async () => {
    const checkPermission = await checkNotificationPermission();
    console.log("notification permission status", checkPermission);
    if (checkPermission !== RESULTS.GRANTED) {
      const requestResult = await requestNotificationPermission();
      if (requestResult !== RESULTS.GRANTED) {
        console.log("Notification permission not granted");
        return false;
      }
    }
    return true;
  };

  // Location permission and data fetching
  const initializeLocationPermissions = async () => {
    try {
      // Fetch location data
      const locationData = await handleLocationPermissionAndFetch();
      if (locationData) {
        console.log("Fetched Location Data:", locationData);
        return locationData;
      } else {
        console.log("Location fetch failed or permission denied");
      }
    } catch (error) {
      console.error("Error fetching location data:", error);
    }

    // Request location permission
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
        return true;
      }
    } catch (err) {
      console.error("Error requesting location permission:", err);
      return false;
    }
  };

  // Initialize all permissions
  const initializeAllPermissions = async () => {
    try {
      console.log("Initializing all permissions...");
      
      // Request notification permissions
      const notificationGranted = await requestNotificationPermissions();
      console.log("Notification permission granted:", notificationGranted);
      
      // Request location permissions
      const locationGranted = await initializeLocationPermissions();
      console.log("Location permission granted:", locationGranted);
      
      return {
        notification: notificationGranted,
        location: locationGranted,
      };
    } catch (error) {
      console.error("Error initializing permissions:", error);
      return {
        notification: false,
        location: false,
      };
    }
  };

  return {
    // Individual permission functions
    requestNotificationPermissions,
    initializeLocationPermissions,
    
    // Batch initialization
    initializeAllPermissions,
    
    // Individual check functions
    checkNotificationPermission,
    requestNotificationPermission,
  };
};

export default usePermissions;