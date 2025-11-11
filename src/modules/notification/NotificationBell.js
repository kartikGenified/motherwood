import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect } from "react";
import RotateViewAnimation from "@/components/animations/RotateViewAnimation";
import Bell from "react-native-vector-icons/FontAwesome";
import { useNotificationCountMutation } from "./apis/notificationsApi";
import useNotification from "./useNotification";
import { PoppinsTextMedium } from "@/components/electrons/customFonts";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

const NotificationBell = () => {
  const navigation = useNavigation();
  const focused = useIsFocused();
  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  );

    const [
      getNotificationCount,
      {
        data: notificationCountData,
        error: notificationCountError,
        isLoading: getNotificationCountIsLoading,
        isError: getNotificationCountIsError,
      },
    ] = useNotificationCountMutation();
    const {newNotification} = useNotification();


    useEffect(() => {
      getNotificationCount();
    }, [newNotification, focused]);
  
	const BellComponent = () => {
		return (
			<TouchableOpacity
				style={{ height: 30, width: 30 }}
				onPress={() => {
					navigation.navigate("Notification");
				}}
			>
				<Bell name="bell" size={30} color={ternaryThemeColor}></Bell>
			</TouchableOpacity>
		);
	};
	return (
		<>
			<RotateViewAnimation
				outputRange={["0deg", "30deg", "-30deg", "0deg"]}
				inputRange={[0, 1, 2, 3]}
				comp={BellComponent}
				style={{ height: 30, width: 30 }}
			></RotateViewAnimation>
			{notificationCountData?.body?.notification_count != 0 && (
				<View
					style={{
						backgroundColor: "orange",
						height: 20,
						width: 20,
						borderRadius: 10,
						position: "absolute",
						right: 0,
						top: -6,
					}}
				>
					<PoppinsTextMedium
						style={{ color: "white", fontSize: 14, fontWeight: "bold" }}
						content={notificationCountData?.body?.notification_count}
					></PoppinsTextMedium>
				</View>
			)}
		</>
	);
};

export default NotificationBell;
