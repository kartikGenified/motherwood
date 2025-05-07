import React from "react";
import { Alert, Linking, Platform } from "react-native";
import { useTranslation } from "react-i18next";

const LocationPermissionDialog = ({ onPermissionGranted, onPermissionDenied, navigation }) => {
  const { t } = useTranslation();

  const handleEnableGPS = () => {
    if (Platform.OS === "ios") {
      Alert.alert(
        t("GPS Disabled"),
        t("Please enable GPS/Location to use this feature."),
        [
          { text: t("Cancel"), style: "cancel" },
          { text: "Settings", onPress: () => Linking.openSettings() },
        ],
        { cancelable: false }
      );
    } else if (Platform.OS === "android") {
      Alert.alert(
        t("Enable Location"),
        t("Enable location to use this application."),
        [
          {
            text: t("Cancel"),
            onPress: () => {
              onPermissionDenied && onPermissionDenied();
            },
            style: "cancel",
          },
          {
            text: t("Enable"),
            onPress: () => {
              // Mock enabling location services
              onPermissionGranted && onPermissionGranted();
            },
          },
        ],
        { cancelable: false }
      );
    }
  };

  const handlePermissionDenied = () => {
    Alert.alert(
      t("You denied GPS access"),
      t("To scan QR code, the app requires location access. Kindly enable GPS to start scanning."),
      [
        {
          text: t("OK"),
          onPress: () => {
            navigation.navigate("Dashboard");
          },
        },
      ]
    );
  };

  return handleEnableGPS();
};

export default LocationPermissionDialog;
