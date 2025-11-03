//import liraries
import { useNavigation } from "@react-navigation/native";
import React, { Component, useEffect, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	ImageBackground,
	Image,
	TouchableOpacity,
	ScrollView,
} from "react-native";
import { useSelector } from "react-redux";
import ConfettiCannon from "react-native-confetti-cannon";
import { useAddDreamGiftMutation } from "../../apiServices/dreamGift/DreamGiftApi";
import { t } from "i18next";
import { useTranslation } from "react-i18next";

// create a component
const DreamGiftDetails = (params) => {
	const [isTertiary, setIsTertiary] = useState();

	const [image, setImage] = useState(params.route.params.gift.gift.images[0]);

	console.log("DreamGiftDetails: params", JSON.stringify(params.route.params.gift));

	const navigation = useNavigation();
	const { t } = useTranslation();
	const ternaryThemeColor = useSelector((state) => state.apptheme.ternaryThemeColor);
	const userData = useSelector((state) => state.appusersdata.userData);

	useEffect(() => {
		if (
			userData?.user_type?.toLowerCase() == "contractor" ||
			userData?.user_type?.toLowerCase() == "carpenter" ||
			userData?.user_type?.toLowerCase() == "oem" ||
			userData?.user_type?.toLowerCase() == "directoem"
		) {
			setIsTertiary(true);
		} else {
			setIsTertiary(false);
		}
	}, [userData]);

	const target = params.route.params.gift.target;
	const current = params.route.params.gift.current;
	let collect = Number(target) - Number(current);
	collect = collect > 0 ? collect : 0;
	const giftItem = params.route.params.item;

	console.log("My gift Item", giftItem);

	const DottedBorder = () => {
		return (
			<View style={styles.dottedBorderContainer}>
				<View style={styles.rowContainer}>
					<Text style={styles.rowText}>{t("Points in Your Wallet")}</Text>
					<View style={styles.pointsContainer}>
						<Image
							style={styles.coinImage}
							source={require("../../../assets/images/normalCoin.png")}
						></Image>
						<Text style={styles.pointsText}>{current}</Text>
					</View>
				</View>
				<View style={styles.divider}></View>

				<View style={styles.rowContainer}>
					<Text style={styles.rowText}>{t("Dream Gift Points")}</Text>
					<View style={styles.pointsContainer}>
						<Image
							style={styles.coinImage}
							source={require("../../../assets/images/normalCoin.png")}
						></Image>
						<Text style={styles.pointsText}>{target}</Text>
					</View>
				</View>
				<View style={styles.divider}></View>
				<View style={styles.collectContainer}>
					<Text style={styles.collectText}>{t("Collect")}</Text>
					<View style={styles.collectPointsContainer}>
						<Image
							style={styles.coinImage}
							source={require("../../../assets/images/normalCoin.png")}
						></Image>
						<Text style={styles.pointsText}>{collect}</Text>
					</View>
					<Text style={styles.collectDescriptionText}>{t("in total and")}</Text>
					<Text style={styles.collectDescriptionText}>{t("and make this gift Yours!")}</Text>
				</View>
			</View>
		);
	};
	return (
		<ImageBackground
			style={styles.backgroundImage}
			resizeMode="cover"
			source={
				isTertiary
					? require("../../../assets/images/transparentBackgroundBlue.png")
					: require("../../../assets/images/transparentBackgroundred.png")
			}
		>
			<ScrollView contentContainerStyle={styles.scrollContainer}>
				<Image
					style={styles.congratulationImage}
					source={require("../../../assets/images/congratulation.png")}
				></Image>
				<Text style={styles.dreamGiftTitle}>{t("Your Dream Gift")}</Text>
				<Image
					style={styles.downArrowImage}
					source={require("../../../assets/images/downArrow.png")}
				></Image>
				<Text style={styles.giftNameText}>{giftItem?.name}</Text>
				{image && <Image style={styles.giftImage} source={{ uri: image }}></Image>}

				<DottedBorder></DottedBorder>
				<TouchableOpacity
					onPress={() => {
						navigation.navigate("Dashboard");
					}}
					style={styles.submitButton}
				>
					<Text style={styles.submitButtonText}>{t("Submit")}</Text>
				</TouchableOpacity>
			</ScrollView>

			<ConfettiCannon
				fallSpeed={3500}
				explosionSpeed={100}
				autoStart={true}
				count={150}
				origin={{ x: -10, y: 0 }}
			/>
		</ImageBackground>
	);
};

// define your styles
const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	backgroundImage: {
		flex: 1,
	},
	scrollContainer: {
		alignItems: "center",
		marginTop: 10,
	},
	congratulationImage: {
		marginLeft: 10,
		height: 100,
		width: "80%",
		resizeMode: "contain",
	},
	dreamGiftTitle: {
		color: "white",
		fontSize: 27,
		fontWeight: "500",
	},
	downArrowImage: {
		height: 40,
		marginTop: 5,
		width: 30,
		resizeMode: "contain",
	},
	giftNameText: {
		color: "white",
		fontSize: 29,
		width: "60%",
		fontWeight: "bold",
		marginTop: 5,
		textAlign: "center",
		letterSpacing: 1.2,
	},
	giftImage: {
		height: 200,
		marginTop: 0,
		width: "80%",
		borderRadius: 20,
		resizeMode: "contain",
	},
	dottedBorderContainer: {
		borderWidth: 1,
		backgroundColor: "white",
		width: "80%",
		marginTop: 10,
		borderStyle: "dotted",
	},
	rowContainer: {
		marginTop: 10,
		height: 30,
		justifyContent: "space-between",
		marginHorizontal: 20,
		flexDirection: "row",
		marginBottom: 10,
	},
	rowText: {
		textAlignVertical: "center",
		color: "black",
		fontWeight: "600",
	},
	pointsContainer: {
		flexDirection: "row",
		backgroundColor: "#B6202D",
		padding: 5,
		borderRadius: 20,
		paddingHorizontal: 10,
	},
	coinImage: {
		height: 20,
		width: 20,
		resizeMode: "contain",
		marginRight: 5,
	},
	pointsText: {
		color: "white",
	},
	divider: {
		borderWidth: 0.8,
		width: "90%",
		alignSelf: "center",
		borderColor: "#DDDDDD",
	},
	collectContainer: {
		height: 50,
		justifyContent: "center",
		marginLeft: 10,
		flexDirection: "row",
		flexWrap: "wrap",
		marginTop: 10,
		marginBottom: 10,
	},
	collectText: {
		textAlignVertical: "center",
		color: "black",
		marginRight: 10,
		fontWeight: "600",
		fontSize: 16,
	},
	collectPointsContainer: {
		height: 30,
		alignItems: "center",
		backgroundColor: "black",
		flexDirection: "row",
		paddingHorizontal: 10,
		borderRadius: 20,
	},
	collectDescriptionText: {
		textAlignVertical: "center",
		color: "black",
		marginLeft: 5,
		fontSize: 16,
		fontWeight: "600",
	},
	submitButton: {
		alignItems: "center",
		justifyContent: "center",
		marginTop: 40,
		marginBottom: 100,
		backgroundColor: "black",
		width: 100,
		height: 40,
		borderRadius: 5,
	},
	submitButtonText: {
		color: "white",
		fontSize: 15,
	},
});

//make this component available to the app
export default DreamGiftDetails;
