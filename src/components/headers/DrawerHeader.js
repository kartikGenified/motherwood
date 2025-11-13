import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import { useSelector } from "react-redux";
import { useNavigation, DrawerActions } from "@react-navigation/core";
import { useTranslation } from "react-i18next";
import {NotificationBell} from "@/modules/notification";
import AppTutorial from "../atoms/AppTutorial";

const DrawerHeader = (props) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  );
  const icon = useSelector((state) => state.apptheme.icon);

  return (
    <View
      style={{
        height: 60,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
        backgroundColor: "white",
      }}
    >
      <AppTutorial
        stepNumber={1}
        content="Hamburger button (Select for more menu)"
        placement="right"
      >
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
          style={{ marginLeft: 10 }}
        >
          <Icon name="bars" size={30} color={ternaryThemeColor} />
        </TouchableOpacity>
      </AppTutorial>

      <Image
        style={{ height: 50, width: 80, resizeMode: "cover", marginLeft: 10 }}
        source={{ uri: icon }}
      ></Image>
      <View style={{ position: "absolute", right: 10, top: 20 }}>
        <AppTutorial
          stepNumber={2}
          content="Check Notifications"
          placement="left"
        >
          <NotificationBell/>
        </AppTutorial>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default DrawerHeader;
