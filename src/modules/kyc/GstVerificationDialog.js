import React, { useState, useEffect, useCallback, useRef } from "react";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	Modal,
	KeyboardAvoidingView,
	Platform,
	TouchableWithoutFeedback,
	Keyboard,
	Image,
	StyleSheet,
} from "react-native";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import FastImage from "react-native-fast-image";
import Icon from "react-native-vector-icons/Entypo";
import PoppinsTextMedium from "@/components/electrons/customFonts/PoppinsTextMedium";
import { useVerifyGstMutation } from "./apis/GstinVerificationApi";

const GstVerificationDialog = React.memo(
	({
		visible,
		onClose,
		refetchKycStatus,
		preVerifiedDocs,
		gstin,
		businessName,
		gstVerified,
		setGstVerified,
		setGstin,
		setBusinessName,
		verificationCalledRef,
		verificationGlobalData,
		setCallSubmitGstin,
		handleVerifyDocKyc,
		gifUri,
	}) => {
		const { t } = useTranslation();
		const ternaryThemeColor = useSelector((state) => state.apptheme.ternaryThemeColor)
			? useSelector((state) => state.apptheme.ternaryThemeColor)
			: "grey";

		// const isPreVerified = preVerifiedDocs.gstin || gstVerified;
		const isPreVerified = preVerifiedDocs.gstin;
		const [localGstin, setLocalGstin] = useState("");
		const [localBusinessName, setLocalBusinessName] = useState("");
		const [isVerified, setIsVerified] = useState(isPreVerified);
		const [errorMessage, setErrorMessage] = useState(null);
		const [verifiedApiData, setVerifiedApiData] = useState(null);
		const [hasSubmitted, setHasSubmitted] = useState(false);
		const [isSubmitting, setIsSubmitting] = useState(false);

		useEffect(() => {
			setLocalBusinessName(businessName ? businessName : "");
			setLocalGstin(gstin ? gstin : "");
		}, [businessName, gstin]);

		// Reset states when dialog opens
		useEffect(() => {
			if (visible) {
				console.log("GSTIN Dialog opened");
				// setLocalGstin("07AAACK0251C2Z");
				verificationCalledRef.current.gstin = false;
				setHasSubmitted(false);
				setIsSubmitting(false);

				// For pre-verified cases, set hasSubmitted to true
				if (isPreVerified) {
					setHasSubmitted(true);
				}
			}
		}, [visible]);

		const [
			verifyGstFunc,
			{ data: verifyGstData, error: verifyGstError, isLoading: verifyGstIsLoading },
		] = useVerifyGstMutation();

		// const logGstinState = () => {
		useEffect(() => {
			console.log("Current GSTIN states:", {
				"preVerifiedDocs.gstin": preVerifiedDocs.gstin,
				isVerified: isVerified,
				isPreVerified: isPreVerified,
				hasSubmitted: hasSubmitted,
				isSubmitting: isSubmitting,
				localGstin: localGstin,
				gstVerified: gstVerified,
				gstin: gstin,
			});
		}, [
			preVerifiedDocs.gstin,
			isVerified,
			isPreVerified,
			hasSubmitted,
			isSubmitting,
			localGstin,
			gstVerified,
			gstin,
		]);
		// Handle GST verification response
		useEffect(() => {
			if (verifyGstData) {
				console.log("GST verification response received:", JSON.stringify(verifyGstData, null, 2));

				if (verifyGstData.success) {
					console.log("GST verification successful!");
					// setVerifiedGstinApiData(verifyGstData);
					setVerifiedApiData(verifyGstData);

					// Extract data from the API response
					const responseBody = verifyGstData.body || {};
					const responseData = responseBody.data || responseBody;

					const verifiedGstin = responseData.gstin || responseData.GST;
					const verifiedBusinessName =
						responseData.trade_name_of_business ||
						responseData.legal_name_of_business ||
						responseData.business_name ||
						responseData.trade_name ||
						responseData.legalName;
					if (verifiedGstin) {
						setLocalGstin(verifiedGstin);
						setLocalBusinessName(verifiedBusinessName || "");
						setIsVerified(true);
						setErrorMessage(null);
					}
				}
			}

			if (verifyGstError) {
				// console.log('GST verification failed:', JSON.stringify(verifyGstError, null, 2));
				const errorMsg =
					verifyGstError.data?.message || verifyGstError.message || t("Failed to verify GSTIN");
				setErrorMessage(errorMsg);
				setIsVerified(false);
			}
		}, [verifyGstData, verifyGstError, setGstVerified, setGstin, setBusinessName]);

		// Function to handle GSTIN verification submission
		const handleSubmitVerification = useCallback(() => {
			if (!verifiedApiData || hasSubmitted || verificationCalledRef.current.gstin) {
				console.log("GSTIN already submitted or no verification data");
				return;
			}

			console.log("Submitting GSTIN verification data...");
			setIsSubmitting(true);

			const responseBody = verifiedApiData.body || {};
			const responseData = responseBody.data || responseBody;

			const effectiveGstin = responseData.gstin || responseData.GST || localGstin;
			const effectiveBusinessName =
				responseData.legal_name_of_business ||
				responseData.business_name ||
				responseData.trade_name ||
				responseData.legalName ||
				localBusinessName;

			// Prepare complete payload with ALL available data from API response
			const gstinVerificationData = {
				// Basic identification
				gstin: effectiveGstin,
				business_name: effectiveBusinessName,

				// Include ALL data from the API response
				...responseData,

				// Additional metadata
				verification_source: "gstin_api",
				verified_at: new Date().toISOString(),
				verification_status: "verified",
			};

			// console.log('Submitting to verifyDocKyc:', JSON.stringify(gstinVerificationData, null, 2));

			// Mark as submitted
			// verificationCalledRef.current.gstin = true;
			verificationGlobalData.current.gstin = effectiveGstin;
			verificationGlobalData.current.gstin_details = gstinVerificationData;

			setCallSubmitGstin(true);
			onClose();
			// Submit to backend API
			// handleVerifyDocKyc(gstinVerificationData, 'gstin')
			//     .then(() => {
			//         console.log('GSTIN verifyDocKyc API call successful');
			//         setHasSubmitted(true);
			//         setIsSubmitting(false);
			//         refetchKycStatus?.();
			//     })
			//     .catch(error => {
			//         console.error('Failed to send GST data to verifyDocKyc:', error);
			//         // Reset submission state on failure
			//         verificationCalledRef.current.gstin = false;
			//         setIsSubmitting(false);
			//         setGstVerified(false);
			//     });
		}, [
			verifiedApiData,
			localGstin,
			localBusinessName,
			handleVerifyDocKyc,
			refetchKycStatus,
			hasSubmitted,
			setGstVerified,
		]);

		const handleGstinChange = useCallback(
			(text) => {
				if (isPreVerified || isVerified) return;

				const upperText = text.toUpperCase().replace(/[^A-Z0-9]/g, "");
				setLocalGstin(upperText);
				setErrorMessage(null);
				setVerifiedApiData(null);
				setHasSubmitted(false);

				if (upperText.length === 15) {
					// console.log('GSTIN input reached 15 chars, verifying:', upperText);
					verifyGstFunc({ gstin: upperText })
						.unwrap()
						.then((res) => {
							// console.log('GSTIN verify API success:', JSON.stringify(res));
						})
						.catch((error) => {
							// console.log('GSTIN verify API error:', JSON.stringify(error));
							setErrorMessage(error.data?.message || error.message || t("Failed to verify GSTIN"));
							setIsVerified(false);
						});
				}
			},
			[isVerified, isPreVerified, verifyGstFunc]
		);

		const handleBusinessNameChange = useCallback(
			(text) => {
				if (isPreVerified) return;
				setLocalBusinessName(text);
			},
			[isPreVerified]
		);
		const handleMainButtonPress = useCallback(() => {
			if (isVerified && !hasSubmitted) {
				handleSubmitVerification();
			} else if (isPreVerified && !hasSubmitted) {
				// Handle pre-verified case that hasn't been submitted
				handleSubmitVerification();
			} else {
				onClose();
			}
		}, [isVerified, hasSubmitted, isPreVerified, handleSubmitVerification, onClose]);

		const handleClose = useCallback(() => {
			console.log("Dialog close requested");
			onClose();
		}, [onClose]);

		// Determine button text
		const getButtonText = useCallback(() => {
			if (verifyGstIsLoading) return t("Verifying...");
			if (isSubmitting) return t("Submitting...");
			if (hasSubmitted) return t("Done");
			if (isVerified) return t("Submit Verification");
			if (isPreVerified) return t("Done");
			return t("Verify GSTIN");
		}, [verifyGstIsLoading, isSubmitting, hasSubmitted, isVerified, isPreVerified, t]);

		return (
			<Modal
				visible={visible}
				animationType="slide"
				transparent={true}
				onRequestClose={handleClose}
				hardwareAccelerated={true}
				statusBarTranslucent={true}
			>
				<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
					<KeyboardAvoidingView
						behavior={Platform.OS === "ios" ? "padding" : "height"}
						style={styles.modalContainer}
						keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
					>
						<View style={styles.modalContent}>
							{/* Close Button */}
							<TouchableOpacity
								style={styles.closeButton}
								onPress={handleClose}
								hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
							>
								<Icon name="cross" size={24} color="#000" />
							</TouchableOpacity>

							{/* Title */}
							<PoppinsTextMedium
								style={styles.modalTitle}
								content={
									isPreVerified ? t("GSTIN Already Verified") : t("Kindly Enter Your GSTIN Details")
								}
							/>

							<Image
								style={styles.documentImage}
								source={require("../../../assets/images/gstindummy.jpeg")}
							/>

							{/* GSTIN Input */}
							<View style={styles.inputContainer}>
								<PoppinsTextMedium style={styles.inputLabel} content={t("Enter GSTIN")} />
								<View style={styles.inputWrapper}>
									<TextInput
										maxLength={15}
										value={localGstin}
										onChangeText={handleGstinChange}
										style={[
											styles.inputField,
											(isPreVerified || isVerified) && styles.disabledInput,
										]}
										placeholder="22AAAAA0000A1Z5"
										placeholderTextColor="#999"
										autoCapitalize="characters"
										autoCorrect={false}
										blurOnSubmit={false}
										autoComplete="off"
										editable={!isPreVerified && !isVerified}
										selectTextOnFocus={!isPreVerified && !isVerified}
									/>
									{verifyGstIsLoading ? (
										<FastImage
											style={styles.loadingIcon}
											source={{ uri: gifUri }}
											resizeMode={FastImage.resizeMode.contain}
										/>
									) : (
										(isVerified || isPreVerified) && (
											<Image
												style={styles.verifiedIcon}
												source={require("../../../assets/images/tickBlue.png")}
											/>
										)
									)}
								</View>
								{errorMessage && (
									<PoppinsTextMedium style={styles.errorText} content={errorMessage} />
								)}
							</View>

							{/* Business Name */}
							<View style={styles.inputContainer}>
								<PoppinsTextMedium style={styles.inputLabel} content={t("Business Name")} />
								<View style={styles.inputWrapper}>
									<TextInput
										value={localBusinessName}
										onChangeText={handleBusinessNameChange}
										style={[
											styles.inputField,
											(isPreVerified || isVerified) && styles.disabledInput,
										]}
										placeholder={t("Enter Business Name")}
										placeholderTextColor="#999"
										editable={!isPreVerified && !isVerified}
									/>
								</View>
							</View>

							{/* Verified Data Box */}
							{(isVerified || isPreVerified) && (
								<View style={[styles.dataBox, { marginBottom: 20 }]}>
									<View style={{ flexDirection: "row", width: "100%" }}>
										<PoppinsTextMedium content={t("GSTIN") + ":"} style={styles.dataLabel} />
										<PoppinsTextMedium content={localGstin} style={styles.dataValue} />
									</View>
									<View style={{ flexDirection: "row", width: "100%", marginTop: 10 }}>
										<Text>
											<PoppinsTextMedium
												content={t("Business Name") + ":"}
												style={styles.dataLabel}
											/>
											<PoppinsTextMedium content={localBusinessName} style={styles.dataValue} />
										</Text>
									</View>
									{isPreVerified && (
										<View style={{ flexDirection: "row", width: "100%", marginTop: 10 }}>
											<PoppinsTextMedium content={t("Status") + ":"} style={styles.dataLabel} />
											<PoppinsTextMedium
												content={t("Verified") + " ✓"}
												style={[styles.dataValue, { color: "green" }]}
											/>
										</View>
									)}
									{hasSubmitted && (
										<View style={{ flexDirection: "row", width: "100%", marginTop: 10 }}>
											<PoppinsTextMedium content={t("Submission") + ":"} style={styles.dataLabel} />
											<PoppinsTextMedium
												content={t("Submitted") + " ✓"}
												style={[styles.dataValue, { color: "green" }]}
											/>
										</View>
									)}
								</View>
							)}

							{/* Status Message */}
							{hasSubmitted && (
								<View style={styles.statusContainer}>
									<PoppinsTextMedium
										style={[styles.statusText, { color: "green" }]}
										content={"✓ " + t("GSTIN verified and submitted successfully")}
									/>
								</View>
							)}

							<TouchableOpacity
								style={[
									styles.submitButton,
									{
										backgroundColor: ternaryThemeColor,
										opacity: verifyGstIsLoading || isSubmitting ? 0.7 : 1,
									},
								]}
								onPress={handleMainButtonPress}
								disabled={verifyGstIsLoading || isSubmitting}
							>
								{isSubmitting ? (
									<FastImage
										style={styles.buttonLoadingIcon}
										source={{ uri: gifUri }}
										resizeMode={FastImage.resizeMode.contain}
									/>
								) : (
									<PoppinsTextMedium style={styles.submitButtonText} content={getButtonText()} />
								)}
							</TouchableOpacity>
						</View>
					</KeyboardAvoidingView>
				</TouchableWithoutFeedback>
			</Modal>
		);
	}
);

const styles = StyleSheet.create({
	// Modal styles
	modalContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0,0,0,0.5)",
	},
	modalContent: {
		width: "90%",
		backgroundColor: "white",
		borderRadius: 10,
		padding: 20,
		maxHeight: "90%",
	},
	closeButton: {
		alignSelf: "flex-end",
		padding: 5,
	},
	modalTitle: {
		color: "black",
		fontSize: 16,
		marginBottom: 0,
		fontWeight: "bold",
		textAlign: "center",
	},
	documentImage: {
		height: 100,
		width: "100%",
		resizeMode: "contain",
		alignSelf: "center",
		marginBottom: 0,
	},
	inputContainer: {
		marginTop: 5,
	},
	inputLabel: {
		color: "#919191",
		fontSize: 16,
		marginBottom: 0,
	},
	inputWrapper: {
		flexDirection: "row",
		alignItems: "center",
		borderWidth: 1,
		borderColor: "#DDDDDD",
		borderRadius: 5,
		paddingHorizontal: 10,
	},
	inputField: {
		flex: 1,
		height: 40,
		fontSize: 14,
		color: "black",
		paddingVertical: 0, // Important for Android
	},
	disabledInput: {
		backgroundColor: "#f5f5f5",
		color: "#888",
	},
	verifiedIcon: {
		height: 22,
		width: 22,
		resizeMode: "contain",
		marginLeft: 10,
	},
	loadingIcon: {
		width: 20,
		height: 20,
		marginLeft: 10,
	},
	errorText: {
		color: "red",
		fontSize: 12,
		marginTop: 4,
	},
	dataBox: {
		width: "100%",
		borderStyle: "dashed",
		borderWidth: 1,
		borderColor: "#DDDDDD",
		borderRadius: 5,
		alignItems: "flex-start",
		justifyContent: "center",
		padding: 10,
		marginTop: 10,
	},
	dataLabel: {
		fontWeight: "700",
		color: "#919191",
		fontSize: 14,
	},
	dataValue: {
		fontWeight: "600",
		color: "#919191",
		fontSize: 14,
		marginLeft: 10,
	},
	statusContainer: {
		alignItems: "center",
		marginTop: 10,
	},
	statusText: {
		fontSize: 14,
		textAlign: "center",
	},
	submitButton: {
		height: 50,
		borderRadius: 5,
		marginTop: 20,
		alignItems: "center",
		justifyContent: "center",
	},
	submitButtonText: {
		fontWeight: "bold",
		fontSize: 18,
		color: "white",
	},
	buttonLoadingIcon: {
		width: 30,
		height: 30,
	},
});

export default GstVerificationDialog;
