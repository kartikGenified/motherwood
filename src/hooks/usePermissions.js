import { useEffect } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import Geolocation from "@react-native-community/geolocation";
import handleLocationPermissionAndFetch from "../utils/handleLocationPermissionAndFetch";

const usePermissions = () => {

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

      // Request location permissions
      const locationGranted = await initializeLocationPermissions();
      console.log("Location permission granted:", locationGranted);
      
      return {
        location: locationGranted,
      };
    } catch (error) {
      console.error("Error initializing permissions:", error);
      return {
        location: false,
      };
    }
  };

  return {
    // Individual permission functions (notification removed)
    initializeLocationPermissions,
    
    // Batch initialization
    initializeAllPermissions,
    
    // No notification permission helpers here; see useNotification hook.
  };
};

export default usePermissions;