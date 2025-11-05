import { useIsFocused } from "@react-navigation/native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
	ActivityIndicator,
	Image,
	Keyboard,
	KeyboardAvoidingView,
	Modal,
	Platform,
	ScrollView,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import FastImage from "react-native-fast-image";
import * as Keychain from "react-native-keychain";
import Icon from "react-native-vector-icons/Entypo";
import { useDispatch, useSelector } from "react-redux";
import { setKycData } from "@redux/slices/userKycStatusSlice";
import { useAddBankDetailsMutation } from "@/apiServices/bankAccount/AddBankAccount";
import { useListAccountsMutation } from "@/apiServices/bankAccount/ListBankAccount";
import { useVerifyDocKycMutation } from "./apis/VerificationDocKycApi";
import RectangularUnderlinedDropDown from "@/components/atoms/dropdown/RectangularUnderlinedDropDown";
import RectanglarUnderlinedTextInput from "@/components/atoms/input/RectanglarUnderlinedTextInput";
import TextInputRectangularWithPlaceholder from "@/components/atoms/input/TextInputRectangularWithPlaceholder";
import PoppinsTextMedium from "@/components/electrons/customFonts/PoppinsTextMedium";
import ErrorModal from "@/components/modals/ErrorModal";
import MessageModal from "@/components/modals/MessageModal";
import { gifUri } from "@/utils/GifUrl";
import KycOptionCards from "./KycOptionCards";
import PanVerificationDialog from "./PanVerificationDialog";
import GstVerificationDialog from "./GstVerificationDialog";
import TopHeader from "@/components/topBar/TopHeader";
import { useGetkycDynamicMutation } from "@/apiServices/kyc/KycDynamicApi";

const KycVerificationDynamic = ({ navigation }) => {
	const [panModalVisible, setPanModalVisible] = useState(false);
	const [gstModalVisible, setGstModalVisible] = useState(false);
	const [panVerified, setPanVerified] = useState(false);
	const [aadhaarVerified, setAadhaarVerified] = useState(false);
	const [gstVerified, setGstVerified] = useState(false);
	const [pan, setPan] = useState("");
	const [name, setName] = useState("");
	const [businessName, setBusinessName] = useState("");
	const [gstin, setGstin] = useState("");
	const [message, setMessage] = useState();
	const [error, setError] = useState(false);
	const [success, setSuccess] = useState(false);
	const [aadhar, setAadhar] = useState("");
	const [verifiedAadharDetails, setVerifiedAadharDetails] = useState(false);
	const [bankAccountVerified, setBankAccountVerified] = useState(false);
	const [upiVerified, setUpiVerified] = useState(false);
	const [verifiedArray, setVerifiedArray] = useState([]);
	const focused = useIsFocused();
	const [bankModalVisible, setBankModalVisible] = useState(false);
	const [upiModalVisible, setUpiModalVisible] = useState(false);
	const [bankVerified, setBankVerified] = useState(false);
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = useState(true); // Add loading state
	const [callSubmitGstin, setCallSubmitGstin] = useState(false);
	const [callSubmitPan, setCallSubmitPan] = useState(false);
	const [callSubmitAadhaar, setCallSubmitAadhaar] = useState(false);

	// Add a ref to track if verifyDocKycFunc has been called for each verification
	const verificationCalledRef = useRef({
		aadhaar: false,
		pan: false,
		gstin: false,
	});

	const verificationGlobalData = useRef({
		gstin: "",
		gstin_details: null,
		pan: "",
		pan_details: null,
		aadhaar: "",
		aadhar_details: null,
	});

	//  this state to track which documents are already verified from API
	const [preVerifiedDocs, setPreVerifiedDocs] = useState({
		aadhaar: false,
		pan: false,
		gstin: false,
	});

	const userData = useSelector((state) => state.appusersdata.userData);
	const ternaryThemeColor = useSelector((state) => state.apptheme.ternaryThemeColor)
		? useSelector((state) => state.apptheme.ternaryThemeColor)
		: "grey";
	const manualApproval = useSelector((state) => state.appusers.manualApproval);
	const { t } = useTranslation();

	// API mutation hooks
	const [
		listAccountFunc,
		{
			data: listAccountData,
			error: listAccountError,
			isLoading: listAccountIsLoading,
			isError: listAccountIsError,
		},
	] = useListAccountsMutation();
	const [getKycDynamicFunc, { data: getKycStatusData, error: getKycStatusError }] =
		useGetkycDynamicMutation();

	const [
		verifyDocKycFunc,
		{ data: verifyDocKycData, error: verifyDocKycError, isLoading: verifyDocKycIsLoading },
	] = useVerifyDocKycMutation();

	useEffect(() => {
		if (listAccountData?.body) {
			const hasBankAccount = listAccountData.body.some(
				(item) => item.transfer_mode === "banktransfer" && item.status === "1"
			);
			const hasUpiAccount = listAccountData.body.some(
				(item) => item.transfer_mode === "upi" && item.status === "1"
			);

			setBankVerified(hasBankAccount);
			setUpiVerified(hasUpiAccount);

			// console.log('Bank verified:', hasBankAccount);
			// console.log('UPI verified:', hasUpiAccount);
		}
	}, [listAccountData]);

	// Add useEffect to handle verifyDocKycFunc response
	useEffect(() => {
		if (verifyDocKycData) {
			console.log("verifyDocKycFunc API response:");
			// console.log('Response data:', JSON.stringify(verifyDocKycData, null, 2));

			if (verifyDocKycData.success) {
				// console.log('verifyDocKycFunc API call successful!');
			} else {
				// console.log('verifyDocKycFunc API returned unsuccessful:');
			}
		}
	}, [verifyDocKycData]);

	// Add useEffect to handle verifyDocKycFunc errors
	useEffect(() => {
		if (verifyDocKycError) {
			console.error("Error in verifyDocKycFunc:");
			console.error("Error details:", JSON.stringify(verifyDocKycError, null, 2));
		}
	}, [verifyDocKycError]);

	// Add useEffect to handle loading state
	useEffect(() => {
		if (verifyDocKycIsLoading) {
			// console.log('verifyDocKycFunc API call in progress...');
		}
	}, [verifyDocKycIsLoading]);

	const getKycDynamic = async () => {
		try {
			const credentials = await Keychain.getGenericPassword();
			if (credentials) {
				const token = credentials?.username;
				console.log("token from dashboard getKycDynamic ", token);
				getKycDynamicFunc(token);
			}
		} catch (error) {
			console.log("Keychain couldn't be accessed!", error);
		}
	};

	useEffect(() => {
		const fetchOnPageActive = async () => {
			try {
				setIsLoading(true); // Start loading
				// Retrieve the credentials
				const credentials = await Keychain.getGenericPassword();
				if (credentials) {
					const token = credentials?.username;
					console.log("token from dashboard getKycStatusFunc ", token);

					token && getKycDynamicFunc(token);
				} else {
					setIsLoading(false); // Stop loading if no credentials
				}
			} catch (error) {
				console.log("Keychain couldn't be accessed!", error);
				setIsLoading(false); // Stop loading on error
			}
		};

		// fetchOnPageActive();
		if (focused) {
			fetchOnPageActive();
		}
		// console.log("hdhdhhdhdhhd");
	}, [focused]);

	// KYC status fetch effect
	useEffect(() => {
		if (getKycStatusData) {
			console.log("getKycStatusDynamicOne", JSON.stringify(getKycStatusData));
			if (getKycStatusData?.success) {
				// Store the API response in Redux and local state
				dispatch(setKycData(getKycStatusData?.body));
				// console.log('Starting:', getKycStatusData?.body);
				// Set pre-verified status from API response
				const userData = getKycStatusData?.body?.userData;
				if (userData) {
					setPreVerifiedDocs({
						aadhaar: userData.is_valid_aadhar || false,
						pan: userData.is_valid_pan || false,
						gstin: userData.is_valid_gstin || false,
					});

					// Pre-fill data for verified documents
					if (userData.is_valid_aadhar && userData.aadhar_details) {
						setAadhar(userData.aadhar || "");
						setVerifiedAadharDetails({ ...userData?.aadhar_details, aadhaar: userData?.aadhar });
					}

					if (userData.is_valid_pan && userData.pan_details) {
						setPan(userData.pan || "");
						setName(userData.pan_details.name || "");
					}

					if (userData.is_valid_gstin && userData.gstin_details) {
						setGstin(userData.gstin || "");
						setBusinessName(userData.gstin_details.legal_name_of_business || "");
					}
				}
			}
			setIsLoading(false); // Stop loading when data is received
		}

		if (getKycStatusError) {
			console.log("Error fetching KYC status:", getKycStatusError);
			setIsLoading(false); // Stop loading on error
		}
	}, [getKycStatusData, getKycStatusError]);

	useEffect(() => {
		if (verifyDocKycIsLoading) {
			console.log("verifyDocKycFunc API call in progress...");
		}
	}, [verifyDocKycIsLoading]);

	// Handle option selection
	const handleSelectOption = (option) => {
		if (option === "pan") {
			setPanModalVisible(true);
		} else if (option === "gstin") {
			setGstModalVisible(true);
		} else if (option === "bank") {
			setBankModalVisible(true);
		} else if (option === "upi") {
			setUpiModalVisible(true);
		}
	};

	useEffect(() => {
		const refetchData = async () => {
			const credentials = await Keychain.getGenericPassword();
			if (credentials) {
				console.log("Credentials successfully loaded for user " + credentials.username);
				const token = credentials.username;
				const userId = userData.id;

				const params = {
					token: token,
					userId: userId,
				};
				listAccountFunc(params);
			}
		};
		refetchData();
	}, [focused]);

	useEffect(() => {
		console.log("firstlistAccountData", JSON.stringify(listAccountData));

		listAccountData &&
			listAccountData?.body.map((item, index) => {
				if (Object.keys(item.bene_details).includes("upi_id")) {
					setUpiVerified(true);
				}
				if (Object.keys(item.bene_details).includes("bank_account")) {
					setBankAccountVerified(true);
				}
			});
	}, [listAccountData]);

	useEffect(() => {
		if (upiVerified) {
			setVerifiedArray([...verifiedArray, "upi"]);
		}
		if (bankAccountVerified) {
			setVerifiedArray([...verifiedArray, "bank"]);
		}
	}, [upiVerified, bankAccountVerified]);

	// Modal close handlers

	const closePanModal = () => {
		setPanModalVisible(false);
	};

	const closeGstModal = () => {
		setGstModalVisible(false);
	};

	useEffect(() => {
		console.log("callSubmitGstin", callSubmitGstin);
		if (!callSubmitGstin) {
			return;
		}
		handleVerifyDocKyc(verificationGlobalData.current.gstin_details, "gstin")
			.then(() => {
				console.log("GSTIN verifyDocKyc API call successful");
				setGstVerified(true);
			})
			.catch((error) => {
				console.error("Failed to send GST data to verifyDocKyc:", error);
				// Reset submission state on failure
				verificationCalledRef.current.gstin = false;
			});
	}, [callSubmitGstin]);

	useEffect(() => {
		console.log("callSubmitPan", callSubmitPan);
		if (!callSubmitPan) {
			return;
		}
		handleVerifyDocKyc(verificationGlobalData.current.pan_details, "pan")
			.then(() => {
				console.log("PAN verifyDocKyc API call successful");
				setPanVerified(true);
			})
			.catch((error) => {
				console.error("Failed to send PAN data to verifyDocKyc:", error);
				// Reset submission state on failure
				verificationCalledRef.current.pan = false;
			});
	}, [callSubmitPan]);

	useEffect(() => {
		console.log("callSubmitAadhaar", callSubmitAadhaar);
		if (!callSubmitAadhaar) {
			return;
		}
		handleVerifyDocKyc(verificationGlobalData.current.aadhar_details, "aadhaar")
			.then(() => {
				console.log("Aadhaar verifyDocKyc API call successful");
				setAadhaarVerified(true);
			})
			.catch((error) => {
				console.error("Failed to send Aadhaar data to verifyDocKyc:", error);
				// Reset submission state on failure
				verificationCalledRef.current.aadhaar = false;
			});
	}, [callSubmitAadhaar]);

	const handleVerifyDocKyc = async (verificationData, docType) => {
		try {
			const normalizedDocType = (docType || "").toString().trim().toLowerCase();
			console.log("handleVerifyDocKyc entry:", {
				normalizedDocType,
				keys: Object.keys(verificationData || {}),
			});

			const credentials = await Keychain.getGenericPassword();
			if (!credentials) throw new Error("No authentication credentials found");

			const token = credentials.username;

			// Prepare request body in required format
			let requestBody = {};

			if (normalizedDocType === "pan") {
				requestBody = {
					pan: verificationData?.pan,
					pan_details: verificationData?.data ? verificationData.data : verificationData,
				};
			} else if (normalizedDocType === "aadhaar") {
				// Prefer the original user-entered value if present
				const unmaskedAadhaar =
					verificationData?.aadhaar ||
					verificationData?.aadhar ||
					verificationData?.aadhaar_number ||
					verificationData?.aadhaar_uid;

				const cleanAadhaar = unmaskedAadhaar ? unmaskedAadhaar.replace(/\D/g, "") : "";

				console.log("Sending Aadhaar to API - Clean:", cleanAadhaar);

				requestBody = {
					aadhar: cleanAadhaar, // Keep as entered (digits only), not masked
					aadhar_details: verificationData,
				};
			} else if (normalizedDocType === "gstin") {
				const effectiveGstin =
					verificationData?.data?.gstin ||
					verificationData?.GSTIN ||
					verificationData?.gstin ||
					verificationData?.body?.data?.gstin ||
					verificationData?.body?.GST;
				requestBody = {
					gstin: effectiveGstin,
					gstin_details: verificationData?.data || verificationData?.body?.data || verificationData,
				};
				console.log("GSTIN Request Body One :", JSON.stringify(requestBody, null, 2));
			} else {
				console.log("handleVerifyDocKyc: unknown docType, skipping build", normalizedDocType);
			}

			console.log("Final Request Body:", JSON.stringify(requestBody, null, 2));
			const params = {
				token: token,
				body: requestBody,
			};

			verificationCalledRef.current[normalizedDocType] = true;
			const result = await verifyDocKycFunc(params).unwrap();

			console.log("verifyDocKycFunc API call success for:", normalizedDocType);
			return result;
		} catch (error) {
			console.error("Exception in handleVerifyDocKyc for:", docType, error);
			const key = (docType || "").toString().trim().toLowerCase();
			if (key) verificationCalledRef.current[key] = false;
			throw error;
		}
	};
	useEffect(() => {
		return () => {
			// Reset all verification flags
			verificationCalledRef.current = {
				aadhaar: false,
				pan: false,
				gstin: false,
			};
		};
	}, []);

	useEffect(() => {
		if (!gstModalVisible && gstVerified) {
			// Refresh KYC data when returning from GST verification
			const refreshKycData = async () => {
				try {
					const credentials = await Keychain.getGenericPassword();
					if (credentials) {
						const token = credentials.username;
						getKycDynamicFunc(token);
					}
				} catch (error) {
					console.log("Error refreshing KYC data:", error);
				}
			};
			refreshKycData();
		}
	}, [gstModalVisible, gstVerified]);

	useEffect(() => {
		if (!panModalVisible && panVerified) {
			// Refresh KYC data when returning from Pan verification
			const refreshKycData = async () => {
				try {
					const credentials = await Keychain.getGenericPassword();
					if (credentials) {
						const token = credentials.username;
						getKycDynamicFunc(token);
					}
				} catch (error) {
					console.log("Error refreshing KYC data:", error);
				}
			};
			refreshKycData();
		}
	}, [panModalVisible, panVerified]);

	// Bank Account Modal
	const BankAccountModal = ({ visible, onClose }) => {
		// Check if we have existing bank account data
		const hasExistingBankAccount =
			listAccountData &&
			listAccountData.body &&
			listAccountData.body.some((item) => item.transfer_mode === "banktransfer");

		const existingBankDetails = hasExistingBankAccount
			? listAccountData.body.find((item) => item.transfer_mode === "banktransfer")
			: null;

		// Debug logging
		useEffect(() => {
			if (existingBankDetails) {
				// console.log('Existing Bank Details:', JSON.stringify(existingBankDetails, null, 2));
			}
		}, [existingBankDetails]);

		const [
			addBankDetailsFunc,
			{
				data: addBankDetailsData,
				error: addBankDetailsError,
				isError: addBankDetailsIsError,
				isLoading: addBankDetailsIsLoading,
			},
		] = useAddBankDetailsMutation();

		// State initialization with existing data if available - CORRECTED PROPERTY NAMES
		const [selectedBankName, setSelectedBankName] = useState(existingBankDetails?.bene_bank || "");
		const [selectedIfscCode, setSelectedIfscCode] = useState(
			existingBankDetails?.bene_details?.ifsc || ""
		);
		const [selectedAccountNumber, setSelectedAccountNumber] = useState(
			existingBankDetails?.bene_details?.bank_account || ""
		);
		const [confirmAccountNumber, setConfirmAccountNumber] = useState(
			existingBankDetails?.bene_details?.bank_account || ""
		);
		const [bankAccountType, setBankAccountType] = useState(
			existingBankDetails?.account_type || "Savings"
		);
		const [selectedBeneficiaryName, setSelectedBeneficiaryName] = useState(
			existingBankDetails?.bene_name || ""
		);

		const bankNames = [
			"Axis Bank",
			"Bandhan Bank",
			"Bank of Baroda",
			"Bank of India",
			"Bank of Maharashtra",
			"Canara Bank",
			"Central Bank of India",
			"Federal Bank",
			"HDFC Bank",
			"ICICI Bank",
			"IDBI Bank",
			"Indian Bank",
			"IndusInd Bank",
			"Kotak Mahindra Bank",
			"Karnataka Bank",
			"Punjab National Bank",
			"Punjab and Sind Bank",
			"Nainital Bank",
			"Dhanlaxmi Bank",
			"State Bank Of India",
			"Union Bank of India",
			"UCO Bank",
			"Yes Bank",
		];

		const accountType = ["Current", "Savings"];

		useEffect(() => {
			if (addBankDetailsData) {
				// console.log("addBankDetailsData", addBankDetailsData);
				if (addBankDetailsData.message === "Bank Account Created" || addBankDetailsData.success) {
					onClose(true); // Close modal and indicate success
				}
			}
		}, [addBankDetailsData]);

		useEffect(() => {
			if (addBankDetailsError) {
				// console.log("Bank account error:", addBankDetailsError);
			}
		}, [addBankDetailsError]);

		const submitData = async () => {
			// Validation
			if (selectedAccountNumber !== confirmAccountNumber) {
				Alert.alert("Error", "Account numbers don't match");
				return;
			}

			if (
				!selectedBankName ||
				!selectedIfscCode ||
				!selectedAccountNumber ||
				!selectedBeneficiaryName ||
				!bankAccountType
			) {
				Alert.alert("Error", "Please fill all required fields");
				return;
			}

			// IFSC code validation (basic format check)
			if (selectedIfscCode.length !== 11) {
				Alert.alert("Error", "IFSC code must be 11 characters long");
				return;
			}

			// Account number validation
			if (selectedAccountNumber.length < 9 || selectedAccountNumber.length > 18) {
				Alert.alert("Error", "Please enter a valid account number (9-18 digits)");
				return;
			}

			try {
				const credentials = await Keychain.getGenericPassword();
				if (credentials) {
					const token = credentials.username;
					const data = {
						bank: selectedBankName,
						account_no: selectedAccountNumber,
						account_holder_name: selectedBeneficiaryName,
						ifsc: selectedIfscCode,
						account_type: bankAccountType,
						transfer_mode: "banktransfer",
					};

					// Include ID if updating existing account
					if (hasExistingBankAccount && existingBankDetails?.id) {
						data.id = existingBankDetails.id;
					}

					const params = { token: token, data: data };
					// console.log('Submitting bank data:', params);
					await addBankDetailsFunc(params).unwrap();
				}
			} catch (error) {
				console.error("Error submitting bank details:", error);
				Alert.alert("Error", error.data?.message || "Failed to save bank details");
			}
		};

		const handleClose = () => {
			// Reset form if not submitted successfully
			if (!addBankDetailsData) {
				setSelectedBankName(existingBankDetails?.bene_bank || "");
				setSelectedIfscCode(existingBankDetails?.bene_details?.ifsc || "");
				setSelectedAccountNumber(existingBankDetails?.bene_details?.bank_account || "");
				setConfirmAccountNumber(existingBankDetails?.bene_details?.bank_account || "");
				setBankAccountType(existingBankDetails?.account_type || "Savings");
				setSelectedBeneficiaryName(existingBankDetails?.bene_name || "");
			}
			onClose(false);
		};

		return (
			<Modal
				visible={visible}
				animationType="slide"
				transparent={true}
				onRequestClose={handleClose}
			>
				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : "height"}
					style={styles.modalContainer}
				>
					<View style={styles.modalContent}>
						<TouchableOpacity
							style={styles.closeButton}
							onPress={handleClose}
							hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
						>
							<Icon name="cross" size={24} color="#000" />
						</TouchableOpacity>

						<PoppinsTextMedium
							style={styles.modalTitle}
							content={hasExistingBankAccount ? "Bank Account Details" : "Add Bank Account"}
						/>

						<ScrollView
							style={{ width: "100%" }}
							showsVerticalScrollIndicator={false}
							contentContainerStyle={styles.scrollContent}
						>
							<View style={styles.bankFormContainer}>
								<RectangularUnderlinedDropDown
									header="Select Bank*"
									data={bankNames}
									handleData={setSelectedBankName}
									value={selectedBankName}
									editable={!hasExistingBankAccount}
									required={true}
								/>

								<RectanglarUnderlinedTextInput
									label="IFSC Code*"
									handleData={setSelectedIfscCode}
									value={selectedIfscCode}
									placeHolder="SBIN0010650"
									title="IFSC Code"
									editable={!hasExistingBankAccount}
									maxLength={11}
									autoCapitalize="characters"
									required={true}
								/>

								<RectanglarUnderlinedTextInput
									label="Account Number*"
									handleData={setSelectedAccountNumber}
									value={selectedAccountNumber}
									placeHolder="Enter Account Number"
									keyboardType="numeric"
									editable={!hasExistingBankAccount}
									maxLength={18}
									required={true}
								/>

								{!hasExistingBankAccount && (
									<RectanglarUnderlinedTextInput
										label="Confirm Account Number*"
										handleData={setConfirmAccountNumber}
										value={confirmAccountNumber}
										placeHolder="Confirm Account Number"
										keyboardType="numeric"
										maxLength={18}
										required={true}
									/>
								)}

								<RectanglarUnderlinedTextInput
									label="Beneficiary Name*"
									handleData={setSelectedBeneficiaryName}
									value={selectedBeneficiaryName}
									placeHolder="Enter Beneficiary Name"
									editable={!hasExistingBankAccount}
									required={true}
								/>

								<RectangularUnderlinedDropDown
									label="Account Type*"
									header="Select Account Type"
									data={accountType}
									handleData={setBankAccountType}
									value={bankAccountType}
									editable={!hasExistingBankAccount}
									required={true}
								/>

								{addBankDetailsError && (
									<PoppinsTextMedium
										style={styles.errorText}
										content={addBankDetailsError.data?.message || "Error processing bank account"}
									/>
								)}

								{hasExistingBankAccount && (
									<View style={styles.existingAccountNote}>
										<PoppinsTextMedium
											style={styles.noteText}
											content="Bank account details are pre-filled and cannot be modified. Contact support for changes."
										/>
									</View>
								)}
							</View>
						</ScrollView>

						{!hasExistingBankAccount && (
							<TouchableOpacity
								style={[
									styles.submitButton,
									{
										backgroundColor: "#4CAF50",
										opacity: addBankDetailsIsLoading ? 0.7 : 1,
									},
								]}
								onPress={submitData}
								disabled={addBankDetailsIsLoading}
							>
								{addBankDetailsIsLoading ? (
									<ActivityIndicator color="white" size="small" />
								) : (
									<PoppinsTextMedium style={styles.submitButtonText} content="Submit" />
								)}
							</TouchableOpacity>
						)}

						{hasExistingBankAccount && (
							<TouchableOpacity
								style={[styles.submitButton, { backgroundColor: "#2196F3" }]}
								onPress={handleClose}
							>
								<PoppinsTextMedium style={styles.submitButtonText} content="Close" />
							</TouchableOpacity>
						)}
					</View>
				</KeyboardAvoidingView>
			</Modal>
		);
	};

	// UPI Modal Component
	const UpiModal = ({ visible, onClose }) => {
		// Check if we have existing UPI data
		const hasExistingUpi =
			listAccountData &&
			listAccountData.body &&
			listAccountData.body.some((item) => item.transfer_mode === "upi");

		const existingUpiDetails = hasExistingUpi
			? listAccountData.body.find((item) => item.transfer_mode === "upi")
			: null;

		const [
			addBankDetailsFunc,
			{
				data: addBankDetailsData,
				error: addBankDetailsError,
				isError: addBankDetailsIsError,
				isLoading: addBankDetailsIsLoading,
			},
		] = useAddBankDetailsMutation();

		const [upiId, setUpiId] = useState(existingUpiDetails?.bene_details?.upi_id || "");
		const [verificationData, setVerificationData] = useState(null);
		const [nameInitials, setNameInitials] = useState("");

		useEffect(() => {
			if (addBankDetailsData) {
				if (addBankDetailsData.message === "Verified") {
					const name = addBankDetailsData.body.bene_details?.bene_name || "";
					setVerificationData(addBankDetailsData.body);
					// Generate initials from name
					const initials = name
						.split(" ")
						.map((n) => n[0])
						.join("")
						.toUpperCase();
					setNameInitials(initials);
				} else if (addBankDetailsData.message === "UPI Added") {
					onClose(true); // Close modal and indicate success
				}
			}
		}, [addBankDetailsData]);

		const verifyUpi = async () => {
			if (!upiId) {
				Alert.alert("Error", "Please enter UPI ID");
				return;
			}

			const credentials = await Keychain.getGenericPassword();
			if (credentials) {
				const token = credentials.username;
				const data = {
					upi_id: upiId,
					transfer_mode: "upi",
					action: "verify",
				};

				const params = { token: token, data: data };
				addBankDetailsFunc(params);
			}
		};

		const confirmUpi = async () => {
			const credentials = await Keychain.getGenericPassword();
			if (credentials) {
				const token = credentials.username;
				const data = {
					upi_id: upiId,
					transfer_mode: "upi",
					action: "add",
				};

				const params = { token: token, data: data };
				addBankDetailsFunc(params);
			}
		};

		return (
			<Modal
				visible={visible}
				animationType="slide"
				transparent={true}
				onRequestClose={() => onClose(false)}
			>
				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : "height"}
					style={styles.modalContainer}
				>
					<View style={styles.modalContent}>
						<TouchableOpacity style={styles.closeButton} onPress={() => onClose(false)}>
							<Icon name="cross" size={24} color="#000" />
						</TouchableOpacity>

						<PoppinsTextMedium
							style={styles.modalTitle}
							content={hasExistingUpi ? "UPI Details" : "Add UPI ID"}
						/>

						<View style={styles.upiFormContainer}>
							<TextInputRectangularWithPlaceholder
								handleData={setUpiId}
								placeHolder="Enter UPI ID (e.g. name@upi)"
								value={upiId}
								editable={!hasExistingUpi && !verificationData}
							/>

							{hasExistingUpi ? (
								<View style={styles.verificationContainer}>
									<View style={styles.verifiedInfo}>
										{existingUpiDetails.bene_details?.bene_name && (
											<View style={styles.initialsCircle}>
												<PoppinsTextMedium
													style={{ color: "white", fontSize: 22, fontWeight: "700" }}
													content={existingUpiDetails.bene_details.bene_name
														.split(" ")
														.map((n) => n[0])
														.join("")
														.toUpperCase()}
												/>
											</View>
										)}
										<View style={styles.verifiedDetails}>
											<PoppinsTextMedium
												style={{ color: "#9A9A9A", fontSize: 12 }}
												content="UPI ID"
											/>
											<PoppinsTextMedium
												style={{
													color: "#353535",
													fontSize: 16,
													fontWeight: "600",
													marginBottom: 10,
												}}
												content={existingUpiDetails.bene_details?.upi_id}
											/>
											<PoppinsTextMedium
												style={{ color: "#9A9A9A", fontSize: 12 }}
												content="Account Holder Name"
											/>
											<PoppinsTextMedium
												style={{ color: "#353535", fontSize: 16, fontWeight: "600" }}
												content={existingUpiDetails.bene_details?.bene_name}
											/>
										</View>
									</View>
								</View>
							) : (
								<>
									{addBankDetailsError && (
										<PoppinsTextMedium
											style={{ color: "red", fontSize: 16, width: "80%", alignSelf: "center" }}
											content={addBankDetailsError.data?.message || "Error verifying UPI"}
										/>
									)}

									{!verificationData ? (
										<TouchableOpacity
											style={[styles.submitButton, { backgroundColor: "#2196F3" }]}
											onPress={verifyUpi}
											disabled={addBankDetailsIsLoading}
										>
											{addBankDetailsIsLoading ? (
												<ActivityIndicator color="white" />
											) : (
												<PoppinsTextMedium style={styles.submitButtonText} content="Verify" />
											)}
										</TouchableOpacity>
									) : (
										<View style={styles.verificationContainer}>
											<View style={styles.verifiedInfo}>
												{nameInitials && (
													<View style={styles.initialsCircle}>
														<PoppinsTextMedium
															style={{ color: "white", fontSize: 22, fontWeight: "700" }}
															content={nameInitials}
														/>
													</View>
												)}
												<View style={styles.verifiedDetails}>
													<PoppinsTextMedium
														style={{ color: "#9A9A9A", fontSize: 12 }}
														content="UPI belongs to"
													/>
													<PoppinsTextMedium
														style={{ color: "#353535", fontSize: 16, fontWeight: "600" }}
														content={verificationData.bene_details?.bene_name || ""}
													/>
												</View>
											</View>

											<TouchableOpacity
												style={[styles.submitButton, { backgroundColor: "#4CAF50" }]}
												onPress={confirmUpi}
												disabled={addBankDetailsIsLoading}
											>
												{addBankDetailsIsLoading ? (
													<ActivityIndicator color="white" />
												) : (
													<PoppinsTextMedium style={styles.submitButtonText} content="Confirm" />
												)}
											</TouchableOpacity>
										</View>
									)}
								</>
							)}
						</View>
					</View>
				</KeyboardAvoidingView>
			</Modal>
		);
	};

	return (
		<View style={styles.container}>
			{isLoading ? (
				<View style={styles.fullScreenLoader}>
					<ActivityIndicator size="large" color={ternaryThemeColor} />
					<PoppinsTextMedium style={styles.loaderText} content="Loading KYC verification..." />
				</View>
			) : (
				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : "height"}
					style={styles.keyboardAvoidingView}
				>
					<TopHeader title={t("Verify your KYC")} transparent />
					<ScrollView style={styles.scrollView}>
						<View style={styles.contentContainer}>
							<Image style={styles.kycLogo} source={require("@assets/images/kyclogo.png")} />
							<KycOptionCards
								verifiedAadharDetails={verifiedAadharDetails}
								preVerifiedDocs={preVerifiedDocs}
								getKycDynamic={getKycDynamic}
								panVerified={panVerified}
								gstVerified={gstVerified}
								bankVerified={bankVerified}
								upiVerified={upiVerified}
								aadhaarVerified={aadhaarVerified}
								setBankModalVisible={setBankModalVisible}
								setUpiModalVisible={setUpiModalVisible}
								handleSelectOption={handleSelectOption}
							/>
						</View>
					</ScrollView>
				</KeyboardAvoidingView>
			)}
			{/* Modals */}

			<PanVerificationDialog
				visible={panModalVisible}
				onClose={closePanModal}
				refetchKycStatus={getKycDynamicFunc}
				preVerifiedDocs={preVerifiedDocs}
				pan={pan}
				name={name}
				setPanVerified={setPanVerified}
				setPan={setPan}
				setName={setName}
				verificationCalledRef={verificationCalledRef}
				verificationGlobalData={verificationGlobalData}
				setCallSubmitPan={setCallSubmitPan}
				handleVerifyDocKyc={handleVerifyDocKyc}
				gifUri={gifUri}
			/>

			<GstVerificationDialog
				visible={gstModalVisible}
				onClose={closeGstModal}
				refetchKycStatus={getKycDynamicFunc}
				preVerifiedDocs={preVerifiedDocs}
				gstin={gstin}
				businessName={businessName}
				gstVerified={gstVerified}
				setGstVerified={setGstVerified}
				setGstin={setGstin}
				setBusinessName={setBusinessName}
				verificationCalledRef={verificationCalledRef}
				verificationGlobalData={verificationGlobalData}
				setCallSubmitGstin={setCallSubmitGstin}
				handleVerifyDocKyc={handleVerifyDocKyc}
				gifUri={gifUri}
			/>

			<BankAccountModal
				visible={bankModalVisible}
				onClose={(success) => {
					setBankModalVisible(false);
					if (success) setBankVerified(true);
				}}
			/>
			<UpiModal
				visible={upiModalVisible}
				onClose={(success) => {
					setUpiModalVisible(false);
					if (success) setUpiVerified(true);
				}}
			/>

			{/* Error and Success Modals */}
			{error && (
				<ErrorModal modalClose={() => setError(false)} message={message} openModal={error} />
			)}
			{success && (
				<MessageModal
					modalClose={() => setSuccess(false)}
					message={message}
					openModal={success}
					navigateTo="Dashboard"
				/>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "white",
	},
	keyboardAvoidingView: {
		flex: 1,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		padding: 16,
	},
	backIcon: {
		height: 40,
		width: 40,
		resizeMode: "contain",
	},
	headerTitle: {
		color: "black",
		fontSize: 18,
		fontWeight: "700",
		marginLeft: 10,
	},
	scrollView: {
		flex: 1,
	},
	contentContainer: {
		alignItems: "center",
		paddingBottom: 20,
	},
	kycLogo: {
		height: 100,
		width: "100%",
		resizeMode: "contain",
	},
	fullScreenLoader: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "white",
	},
	loaderText: {
		marginTop: 16,
		color: "#666",
		fontSize: 16,
		textAlign: "center",
	},
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
		width: "90%",
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
	// Bank form styles
	bankFormContainer: {
		width: "100%",
		alignItems: "center",
	},
	existingAccountNote: {
		backgroundColor: "#FFF3CD",
		padding: 12,
		borderRadius: 6,
		borderWidth: 1,
		borderColor: "#FFEEBA",
		marginTop: 15,
		width: "100%",
	},
	noteText: {
		color: "#856404",
		fontSize: 12,
		textAlign: "center",
	},
	scrollContent: {
		paddingBottom: 20,
	},
	// UPI form styles
	upiFormContainer: {
		width: "100%",
		alignItems: "center",
	},
	verificationContainer: {
		width: "100%",
		alignItems: "center",
		marginTop: 20,
	},
	verifiedInfo: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 20,
		width: "100%",
	},
	initialsCircle: {
		width: 50,
		height: 50,
		borderRadius: 25,
		backgroundColor: "#4CAF50",
		justifyContent: "center",
		alignItems: "center",
		marginRight: 15,
	},
	verifiedDetails: {
		flex: 1,
	},
});

export default KycVerificationDynamic;
