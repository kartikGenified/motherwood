import { Alert, Linking, Platform } from "react-native";
import Geolocation from "@react-native-community/geolocation";
import getLocationPermission from "../components/organisms/getLocationPermission";
import { GoogleMapsKey } from "@env";
import getCurrentLocation from "../components/organisms/getCurrentLocation";
const handleLocationPermissionAndFetch = async () => {
  const showAlert = (title, message) => {
    Alert.alert(
      title,
      message,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Settings",
          onPress: () =>
            Platform.OS === "android"
              ? Linking.openSettings()
              : Linking.openURL("app-settings:"),
        },
      ],
      { cancelable: false }
    );
  };

  const fetchLocation = async (latitude, longitude) => {
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GoogleMapsKey}`;
      const response = await fetch(url);
      const json = await response.json();

      if (json.status === "OK") {
        const formattedAddress = json?.results[0]?.formatted_address || "N/A";
        const addressComponents = json?.results[0]?.address_components || [];
        const locationJson = {
          lat: latitude,
          lon: longitude,
          address: formattedAddress,
        };

        addressComponents.forEach((component) => {
          if (component.types.includes("postal_code")) {
            locationJson.postcode = component.long_name;
          } else if (component.types.includes("country")) {
            locationJson.country = component.long_name;
          } else if (component.types.includes("administrative_area_level_1")) {
            locationJson.state = component.long_name;
          } else if (component.types.includes("locality")) {
            locationJson.city = component.long_name;
          }
        });

        return locationJson;
      } else {
        showAlert("Geocoding Error", "Failed to fetch address.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching location details:", error);
      showAlert("Error", "Unable to fetch location details.");
      return null;
    }
  };

  

  const checkAndFetchLocation = async () => {
    if (Platform.OS === "ios") {
      const permissionGranted = await getLocationPermission();
      if (permissionGranted) {
        return getCurrentLocation();
      } else {
        return null;
      }
    } else if (Platform.OS === "android") {
      const permissionGranted = await getLocationPermission();
      if (!permissionGranted) return null;

      try {
        const location = await getCurrentLocation();
        return location;
      } catch (error) {
        console.error("Error fetching current location:", error);
        return null;
      }
    }
  };

  return await checkAndFetchLocation();
};

export default handleLocationPermissionAndFetch;
