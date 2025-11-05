import React from "react";
import { View, TouchableOpacity, Image, StyleSheet } from "react-native";
import PoppinsTextMedium from "@/components/electrons/customFonts/PoppinsTextMedium";

const OptionCard = ({ option, isMandatory, onPress }) => {
	if (!option) return null;

	return (
		<TouchableOpacity
			style={[
				styles.optionCard,
				option.verified && styles.verifiedCard,
				// Only style as optional if it's actually optional AND not mandatory in combinations
				option.isOptional && !isMandatory && styles.optionalCard,
			]}
			onPress={option.onPress || (() => onPress?.(option.id))}
		>
			<Image source={option.icon} style={styles.optionIcon} />
			<View style={styles.optionTextContainer}>
				<View style={styles.labelContainer}>
					<PoppinsTextMedium style={styles.optionText} content={option.label} />
					{isMandatory && <PoppinsTextMedium style={styles.mandatoryAsterisk} content="*" />}
					{/* Show optional text only if it's optional AND not part of mandatory combinations */}
					{option.isOptional && !isMandatory && (
						<PoppinsTextMedium style={styles.optionalText} content="(Optional)" />
					)}
				</View>
				{option.matchRules && (
					<PoppinsTextMedium
						style={styles.matchRuleText}
						content={option.verified ? option.matchRules.success : option.matchRules.error}
					/>
				)}
			</View>
			<Image
				source={
					option.verified
						? require("./assets/images/verifiedKyc.png")
						: require("./assets/images/notVerifiedKyc.png")
				}
				style={styles.statusIcon}
			/>
		</TouchableOpacity>
	);
};
export default OptionCard;
const styles = StyleSheet.create({
	optionCard: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#fff",
		borderRadius: 8,
		padding: 16,
		marginBottom: 8,
		borderWidth: 1,
		borderColor: "#e0e0e0",
	},
	optionTextContainer: {
		flex: 1,
	},
	optionText: {
		fontSize: 16,
		color: "#333",
	},
	optionIcon: {
		width: 38,
		height: 38,
		padding: 4,
		resizeMode: "contain",
		marginRight: 12,
	},
	verifiedCard: {
		borderColor: "#4CAF50",
		backgroundColor: "#F1F8E9",
	},
	statusIcon: {
		width: 24,
		height: 24,
		resizeMode: "contain",
	},
	optionalCard: {
		justifyContent: "space-between",
		borderColor: "#e0e0e0",
	},
	labelContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	optionalText: {
		color: "#666",
		fontSize: 12,
		marginLeft: 4,
		fontStyle: "italic",
	},
	matchRuleText: {
		fontSize: 12,
		color: "#666",
		marginTop: 4,
	},
	mandatoryAsterisk: {
		color: "red",
		fontSize: 16,
		marginLeft: 2,
	},
});
