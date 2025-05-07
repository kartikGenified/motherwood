import { PermissionsAndroid, Alert, Linking, Platform } from "react-native";

const getLocationPermission = async () => {
  try {
    
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Permission",
          message:
            "This app needs access to your location to provide location-based services.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
        console.log("location permission status here in ", granted)
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Location permission granted");
        return true;
      } else {
        console.log("Location permission denied");
        Platform.OS== 'android' &&
        Alert.alert(
          "Permission Denied",
          "Location permission is required to use this feature. Please enable it in your settings.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Settings", onPress: () => Linking.openSettings() },
          ]
        );
        return false;
      }
    
  } catch (error) {
    console.error("Error while requesting location permission:", error);
    return false;
  }
};

export default getLocationPermission;
