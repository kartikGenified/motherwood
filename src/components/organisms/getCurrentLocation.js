import {Alert, Linking, Platform } from "react-native";
import Geolocation from "@react-native-community/geolocation";
import {isLocationEnabled,promptForEnableLocationIfNeeded} from "react-native-android-location-enabler";
import { GoogleMapsKey } from "@env";
const getCurrentLocation = async () => {
  console.log("Attempting to retrieve current latitude and longitude");

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

  async function handleCheckPressed() {
    if (Platform.OS === 'android') {
      const checkEnabled = await isLocationEnabled();
      console.log('checkEnabled', checkEnabled)
    }
  }
  handleCheckPressed()
  return new Promise(async (resolve, reject) => {
    // Check GPS status and handle enabling it for Android
    if (Platform.OS === "android") {
      try {
        const enableResult = await promptForEnableLocationIfNeeded();
        console.log('enableResult', enableResult);
        // The user has accepted to enable the location services
        // data can be :
        //  - "already-enabled" if the location services has been already enabled
        //  - "enabled" if user has clicked on OK button in the popup
      } catch (error) {
        console.error("Failed to enable GPS:", error);
        Alert.alert(
          "GPS Disabled",
          "Location services are required to use this feature. Please enable GPS in your device settings.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Settings",
              onPress: () => Linking.openSettings(),
            },
          ]
        );
        reject(new Error("GPS Disabled"));
        return;
      }
    }

    Geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        console.log(`Latitude: ${lat}, Longitude: ${lon}`);

        try {
          const locationData = await fetchLocation(lat, lon);
          console.log("Fetched location data:", locationData);
          resolve(locationData);
        } catch (fetchError) {
          console.error("Error while fetching location details:", fetchError);
          reject(fetchError);
        }
      },
      (error) => {
        console.error("getCurrentLocation error:",error, error.code, error.message);

        if (error.code === 1) {
          Alert.alert(
            "Permission Denied",
            "Location permission is denied. Please enable it in settings."
          );
        } else if (error.code === 2) {
          Alert.alert(
            "Location Unavailable",
            "Unable to determine location. Check your GPS settings."
          );
        } else if (error.code === 3) {
          Alert.alert(
            "Timeout",
            "The request to fetch your location has timed out. Please try again."
          );
        } else {
          Alert.alert(
            "Error",
            "An unexpected error occurred while fetching your location."
          );
        }
        reject(error);
      },
      
    );
  });
};


export default getCurrentLocation