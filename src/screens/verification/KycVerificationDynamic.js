import React, { useEffect, useId, useState, useRef, useCallback, useMemo } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Modal,
    Text,
    ActivityIndicator,
    TouchableWithoutFeedback,
    Keyboard
} from "react-native";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import { useSelector, useDispatch } from "react-redux";
import Icon from "react-native-vector-icons/Entypo";
import * as Keychain from "react-native-keychain";
import ErrorModal from "../../components/modals/ErrorModal";
import RectanglarUnderlinedTextInput from "../../components/atoms/input/RectanglarUnderlinedTextInput";
import RectangularUnderlinedDropDown from "../../components/atoms/dropdown/RectangularUnderlinedDropDown";
import { useVerifyPanMutation } from "../../apiServices/verification/PanVerificationApi";
import { useListAccountsMutation } from "../../apiServices/bankAccount/ListBankAccount";
import {
    useSendAadharOtpMutation,
    useVerifyAadharMutation,
} from "../../apiServices/verification/AadharVerificationApi";
import { useVerifyGstMutation } from "../../apiServices/verification/GstinVerificationApi";
import TextInputRectangularWithPlaceholder from "../../components/atoms/input/TextInputRectangularWithPlaceholder";
import SuccessModal from "../../components/modals/SuccessModal";
import MessageModal from "../../components/modals/MessageModal";
import { useIsFocused } from "@react-navigation/native";
import { useAddBankDetailsMutation } from "../../apiServices/bankAccount/AddBankAccount";
import {
    useGetkycDynamicMutation,
    useUpdateKycDynamicMutation,
} from "../../apiServices/kyc/KycDynamicApi";
import {
    setKycCompleted,
    setKycData,
} from "../../../redux/slices/userKycStatusSlice";
import FastImage from "react-native-fast-image";
import { gifUri } from "../../utils/GifUrl";
import { useTranslation } from "react-i18next";
import { useVerifyDocKycMutation } from "../../apiServices/verification/VerificationDocKycApi";
import AadharVerify from "./AadharVerify";
// import { is } from "immer/dist/internal";
 
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
        gstin: false
    });
 
    const verificationGlobalData = useRef({
        gstin: "",
        gstin_details: null,
        pan:"",
        pan_details: null,
        aadhaar: "",
        aadhar_details: null
    });
 
    //  this state to track which documents are already verified from API
    const [preVerifiedDocs, setPreVerifiedDocs] = useState({
        aadhaar: false,
        pan: false,
        gstin: false,
    });
 
    const userData = useSelector((state) => state.appusersdata.userData);
    const ternaryThemeColor = useSelector(
        (state) => state.apptheme.ternaryThemeColor
    ) ? useSelector((state) => state.apptheme.ternaryThemeColor) : "grey";
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
    const [
        getKycDynamicFunc,
        { data: getKycStatusData, error: getKycStatusError }
    ] = useGetkycDynamicMutation();
 
    const [
        verifyDocKycFunc,
        { data: verifyDocKycData, error: verifyDocKycError, isLoading: verifyDocKycIsLoading }
    ] = useVerifyDocKycMutation();
 
    useEffect(() => {
        if (listAccountData?.body) {
            const hasBankAccount = listAccountData.body.some(item =>
                item.transfer_mode === "banktransfer" && item.status === "1"
            );
            const hasUpiAccount = listAccountData.body.some(item =>
                item.transfer_mode === "upi" && item.status === "1"
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
            console.log('verifyDocKycFunc API response:');
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
            console.error('Error in verifyDocKycFunc:');
            console.error('Error details:', JSON.stringify(verifyDocKycError, null, 2));
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
    }
 
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
                        setAadhar(userData.aadhar || '');
                        setVerifiedAadharDetails(userData.aadhar_details);
                    }
 
                    if (userData.is_valid_pan && userData.pan_details) {
                        setPan(userData.pan || '');
                        setName(userData.pan_details.name || '');
                    }
 
                    if (userData.is_valid_gstin && userData.gstin_details) {
                        setGstin(userData.gstin || '');
                        setBusinessName(userData.gstin_details.legal_name_of_business || '');
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
            console.log('verifyDocKycFunc API call in progress...');
        }
    }, [verifyDocKycIsLoading]);
 
    // Handle option selection
    const handleSelectOption = (option) => {
        if (option === 'pan') {
            setPanModalVisible(true);
        } else if (option === 'gstin') {
            setGstModalVisible(true);
        } else if (option === 'bank') {
            setBankModalVisible(true);
        } else if (option === 'upi') {
            setUpiModalVisible(true);
        }
    };
 
    useEffect(() => {
        const refetchData = async () => {
            const credentials = await Keychain.getGenericPassword();
            if (credentials) {
                console.log(
                    "Credentials successfully loaded for user " + credentials.username
                );
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
        handleVerifyDocKyc(verificationGlobalData.current.gstin_details, 'gstin')
        .then(() => {
            console.log('GSTIN verifyDocKyc API call successful');
            setGstVerified(true);
        })
        .catch(error => {
            console.error('Failed to send GST data to verifyDocKyc:', error);
            // Reset submission state on failure
            verificationCalledRef.current.gstin = false;
        });
    }, [callSubmitGstin]);
 
    useEffect(() => {
        console.log("callSubmitPan", callSubmitPan);
        if (!callSubmitPan) {
            return;
        }
        handleVerifyDocKyc(verificationGlobalData.current.pan_details, 'pan')
        .then(() => {
            console.log('PAN verifyDocKyc API call successful');
            setPanVerified(true);
        })
        .catch(error => {
            console.error('Failed to send PAN data to verifyDocKyc:', error);
            // Reset submission state on failure
            verificationCalledRef.current.pan = false;
        });
    }, [callSubmitPan]);
 
    useEffect(() => {
        console.log("callSubmitAadhaar", callSubmitAadhaar);
        if (!callSubmitAadhaar) {
            return;
        }
        handleVerifyDocKyc(verificationGlobalData.current.aadhar_details, 'aadhaar')
        .then(() => {
            console.log('Aadhaar verifyDocKyc API call successful');
            setAadhaarVerified(true);
        })
        .catch(error => {
            console.error('Failed to send Aadhaar data to verifyDocKyc:', error);
            // Reset submission state on failure
            verificationCalledRef.current.aadhaar = false;
        });
    }, [callSubmitAadhaar]);
 
 
    const handleVerifyDocKyc = async (verificationData, docType) => {
        try {
            const normalizedDocType = (docType || '').toString().trim().toLowerCase();
            console.log('handleVerifyDocKyc entry:', { normalizedDocType, keys: Object.keys(verificationData || {}) });
 
            const credentials = await Keychain.getGenericPassword();
            if (!credentials) throw new Error('No authentication credentials found');
 
            const token = credentials.username;
 
            // Prepare request body in required format
            let requestBody = {};
 
            if (normalizedDocType === 'pan') {
                requestBody = {
                    pan: verificationData?.pan,
                    pan_details: verificationData?.data ? verificationData.data : verificationData
                };
            }
            else if (normalizedDocType === 'aadhaar') {
                // Prefer the original user-entered value if present
                const unmaskedAadhaar = verificationData?.aadhaar ||
                    verificationData?.aadhar ||
                    verificationData?.aadhaar_number ||
                    verificationData?.aadhaar_uid;
 
                const cleanAadhaar = unmaskedAadhaar ? unmaskedAadhaar.replace(/\D/g, '') : '';
 
                console.log('Sending Aadhaar to API - Clean:', cleanAadhaar);
 
                requestBody = {
                    aadhar: cleanAadhaar, // Keep as entered (digits only), not masked
                    aadhar_details: verificationData
                };
            } else if (normalizedDocType === 'gstin') {
                const effectiveGstin = verificationData?.data?.gstin || verificationData?.GSTIN || verificationData?.gstin || verificationData?.body?.data?.gstin || verificationData?.body?.GST;
                requestBody = {
                    gstin: effectiveGstin,
                    gstin_details: verificationData?.data || verificationData?.body?.data || verificationData
                };
                console.log('GSTIN Request Body One :', JSON.stringify(requestBody, null, 2));
            } else {
                console.log('handleVerifyDocKyc: unknown docType, skipping build', normalizedDocType);
            }
 
            console.log('Final Request Body:', JSON.stringify(requestBody, null, 2));
            const params = {
                token: token,
                body: requestBody
            };
 
            verificationCalledRef.current[normalizedDocType] = true;
            const result = await verifyDocKycFunc(params).unwrap();
 
            console.log('verifyDocKycFunc API call success for:', normalizedDocType);
            return result;
        } catch (error) {
            console.error('Exception in handleVerifyDocKyc for:', docType, error);
            const key = (docType || '').toString().trim().toLowerCase();
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
                gstin: false
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
 


 
    // NEW PAN Verification Dialog
    const PanVerificationDialog = React.memo(({ visible, onClose, refetchKycStatus }) => {
        const isPreVerified = preVerifiedDocs.pan;
        const [localPan, setLocalPan] = useState(pan ? pan : '');
        const [localName, setLocalName] = useState(name ? name : '');
        const [isVerified, setIsVerified] = useState(isPreVerified);
        const [errorMessage, setErrorMessage] = useState(null);
        const [verifiedApiData, setVerifiedApiData] = useState(null);
        const [hasSubmitted, setHasSubmitted] = useState(false);
        const [isSubmitting, setIsSubmitting] = useState(false);
 
 
        // Reset states when dialog opens
        useEffect(() => {
            if (visible) {
                console.log('PAN Dialog opened');
                verificationCalledRef.current.pan = false;
                setHasSubmitted(false);
                setIsSubmitting(false);
 
                // For pre-verified cases, set hasSubmitted to true
                if (isPreVerified) {
                    setHasSubmitted(true);
                }
            }
        }, [visible, isPreVerified]);
 
        const [
            verifyPanFunc,
            { data: verifyPanData, error: verifyPanError, isLoading: verifyPanIsLoading }
        ] = useVerifyPanMutation();
 
        // Handle PAN verification response
        useEffect(() => {
            if (verifyPanData) {
                console.log('PAN verification response received:', JSON.stringify(verifyPanData, null, 2));
 
                if (verifyPanData.success) {
                    console.log('PAN verification successful!');
                    setVerifiedApiData(verifyPanData);
 
                    // Extract data from the API response
                    const responseBody = verifyPanData.body || {};
                    const responseData = responseBody.body?.data || responseBody.body || responseBody;
                    const verifiedPan = responseData.pan || responseData.PAN;
                    const verifiedName = responseData.registered_name || responseData.full_name || responseData.name;
 
                    if (verifiedPan) {
                        setLocalPan(verifiedPan);
                        setLocalName(verifiedName || '');
                        setIsVerified(true);
                        setErrorMessage(null);
                    }
                }
            }
 
            if (verifyPanError) {
                console.log('PAN verification failed:', JSON.stringify(verifyPanError, null, 2));
                const errorMsg = verifyPanError.data?.message || verifyPanError.message || 'Failed to verify PAN';
                setErrorMessage(errorMsg);
                setIsVerified(false);
            }
        }, [verifyPanData, verifyPanError, setPanVerified, setPan, setName]);
 
        // Function to handle PAN verification submission
        const handleSubmitVerification = useCallback(() => {
            if (!verifiedApiData || hasSubmitted || verificationCalledRef.current.pan) {
                console.log('PAN already submitted or no verification data');
                return;
            }
 
            console.log('Submitting PAN verification data...');
            setIsSubmitting(true);
 
            const responseBody = verifiedApiData.body || {};
            const responseData = responseBody.data || responseBody;
 
            const effectivePan = responseData.pan || responseData.PAN || localPan;
            const effectiveName = responseData.registered_name ||
                responseData.full_name ||
                responseData.name ||
                localName;
 
            // Prepare complete payload with ALL available data from API response
            const panVerificationData = {
                // Basic identification
                pan: effectivePan,
                name: effectiveName,
 
                // Include ALL data from the API response
                ...responseData,
 
                // Additional metadata
                verification_source: 'pan_api',
                verified_at: new Date().toISOString(),
                verification_status: 'verified'
            };
 
            console.log('Submitting to verifyDocKyc:', JSON.stringify(panVerificationData, null, 2));
 
            // Mark as submitted
            // verificationCalledRef.current.pan = true;
 
            verificationGlobalData.current.pan = effectivePan;
            verificationGlobalData.current.pan_details = panVerificationData;
 
            setCallSubmitPan(true);
            onClose();
        }, [verifiedApiData, localPan, localName, handleVerifyDocKyc, refetchKycStatus, hasSubmitted, setPanVerified]);
 
 
        const handlePanChange = useCallback(
            (text) => {
                if (isPreVerified || isVerified) return;
 
                const upperText = text.toUpperCase().replace(/[^A-Z0-9]/g, '');
                setLocalPan(upperText);
                setErrorMessage(null);
                setVerifiedApiData(null);
                setHasSubmitted(false);
 
                if (upperText.length === 10) {
                    console.log('PAN input reached 10 chars, verifying:', upperText);
                    verifyPanFunc({ pan: upperText })
                        .unwrap()
                        .then(res => {
                            console.log('PAN verify API success:', JSON.stringify(res));
                        })
                        .catch((error) => {
                            console.log('PAN verify API error:', JSON.stringify(error));
                            setErrorMessage(error.data?.message || error.message || 'Failed to verify PAN');
                            setIsVerified(false);
                        });
                }
            },
            [isVerified, isPreVerified, verifyPanFunc]
        );
 
        const handleNameChange = useCallback(
            (text) => {
                if (isPreVerified) return;
                setLocalName(text);
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
            console.log('Dialog close requested');
            onClose();
        }, [onClose]);
 
        // Determine button text
        const getButtonText = useCallback(() => {
            if (verifyPanIsLoading) return "Verifying...";
            if (isSubmitting) return "Submitting...";
            if (hasSubmitted) return "Done";
            if (isVerified) return "Submit Verification";
            if (isPreVerified) return "Done";
            return "Verify PAN";
        }, [verifyPanIsLoading, isSubmitting, hasSubmitted, isVerified, isPreVerified]);
 
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
                        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
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
                                content={isPreVerified ? "PAN Already Verified" : "Kindly Enter Your PAN Details"}
                            />
 
                        <Image
                            style={styles.documentImage}
                            source={require("../../../assets/images/panColor.png")}
                        />
 
 
                            {/* PAN Input */}
                            <View style={styles.inputContainer}>
                                <PoppinsTextMedium style={styles.inputLabel} content="Enter PAN" />
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        maxLength={10}
                                        value={localPan}
                                        onChangeText={handlePanChange}
                                        style={[styles.inputField, (isPreVerified || isVerified) && styles.disabledInput]}
                                        placeholder="ABCDE1234F"
                                        placeholderTextColor="#999"
                                        autoCapitalize="characters"
                                        autoCorrect={false}
                                        blurOnSubmit={false}
                                        autoComplete="off"
                                        editable={!isPreVerified && !isVerified}
                                        selectTextOnFocus={!isPreVerified && !isVerified}
                                    />
                                    {verifyPanIsLoading ? (
                                        <FastImage
                                            style={styles.loadingIcon}
                                            source={{ uri: gifUri }}
                                            resizeMode={FastImage.resizeMode.contain}
                                        />
                                    ) : (isVerified || isPreVerified) && (
                                        <Image style={styles.verifiedIcon} source={require("../../../assets/images/tickBlue.png")} />
                                    )}
                                </View>
                                {errorMessage && <PoppinsTextMedium style={styles.errorText} content={errorMessage} />}
                            </View>
 
                            {/* Name */}
                            <View style={styles.inputContainer}>
                                <PoppinsTextMedium style={styles.inputLabel} content="Name" />
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        value={localName}
                                        onChangeText={handleNameChange}
                                        style={[styles.inputField, (isPreVerified || isVerified) && styles.disabledInput]}
                                        placeholder="Enter Name"
                                        placeholderTextColor="#999"
                                        editable={!isPreVerified && !isVerified}
                                    />
                                </View>
                            </View>
 
 
 
                            {/* Verified Data Box */}
                            {(isVerified || isPreVerified) && (
                                <View style={[styles.dataBox, { marginBottom: 20 }]}>
                                    <View style={{ flexDirection: "row", width: "100%" }}>
                                        <PoppinsTextMedium content="PAN: " style={styles.dataLabel} />
                                        <PoppinsTextMedium content={localPan} style={styles.dataValue} />
                                    </View>
                                    <View style={{ flexDirection: "row", width: "100%", marginTop: 10 }}>
                                        <PoppinsTextMedium content="Name: " style={styles.dataLabel} />
                                        <PoppinsTextMedium
                                            content={localName}
                                            style={[styles.dataValue, { flex: 1, flexWrap: 'wrap' }]}
                                        />
                                    </View>
                                    {isPreVerified && (
                                        <View style={{ flexDirection: "row", width: "100%", marginTop: 10 }}>
                                            <PoppinsTextMedium content="Status:" style={styles.dataLabel} />
                                            <PoppinsTextMedium content="Verified ✓" style={[styles.dataValue, { color: 'green' }]} />
                                        </View>
                                    )}
                                    {hasSubmitted && (
                                        <View style={{ flexDirection: "row", width: "100%", marginTop: 10 }}>
                                            <PoppinsTextMedium content="Submission:" style={styles.dataLabel} />
                                            <PoppinsTextMedium content="Submitted ✓" style={[styles.dataValue, { color: 'green' }]} />
                                        </View>
                                    )}
                                </View>
                            )}
                            {/* Status Message */}
                            {hasSubmitted && (
                                <View style={styles.statusContainer}>
                                    <PoppinsTextMedium
                                        style={[styles.statusText, { color: 'green' }]}
                                        content="✓ PAN verified and submitted successfully"
                                    />
                                </View>
                            )}
                               <TouchableOpacity
                                style={[
                                    styles.submitButton,
                                    {
                                        backgroundColor: ternaryThemeColor,
                                        opacity: (verifyPanIsLoading || isSubmitting) ? 0.7 : 1
                                    }
                                ]}
                                onPress={handleMainButtonPress}
                                disabled={verifyPanIsLoading || isSubmitting}
                            >
                                {isSubmitting ? (
                                    <FastImage
                                        style={styles.buttonLoadingIcon}
                                        source={{ uri: gifUri }}
                                        resizeMode={FastImage.resizeMode.contain}
                                    />
                                ) : (
                                    <PoppinsTextMedium
                                        style={styles.submitButtonText}
                                        content={getButtonText()}
                                    />
                                )}
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                </TouchableWithoutFeedback>
            </Modal>
        );
    });
 
    // NEW GST Verification Dialog
    const GstVerificationDialog = React.memo(({ visible, onClose, refetchKycStatus }) => {
        // const isPreVerified = preVerifiedDocs.gstin || gstVerified; 
        const isPreVerified = preVerifiedDocs.gstin; 
        const [localGstin, setLocalGstin] = useState(gstin ? gstin : '');
        const [localBusinessName, setLocalBusinessName] = useState(businessName ? businessName : '');
        const [isVerified, setIsVerified] = useState(isPreVerified);
        const [errorMessage, setErrorMessage] = useState(null);
        const [verifiedApiData, setVerifiedApiData] = useState(null);
        const [hasSubmitted, setHasSubmitted] = useState(false);
        const [isSubmitting, setIsSubmitting] = useState(false);
 
        // Reset states when dialog opens
        useEffect(() => {
            if (visible) {
                console.log('GSTIN Dialog opened');
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
            { data: verifyGstData, error: verifyGstError, isLoading: verifyGstIsLoading }
        ] = useVerifyGstMutation();
 
        // const logGstinState = () => {
        useEffect(() => {
            console.log('Current GSTIN states:', {
                "preVerifiedDocs.gstin": preVerifiedDocs.gstin,
                "isVerified": isVerified,
                "isPreVerified": isPreVerified,
                "hasSubmitted": hasSubmitted,
                "isSubmitting": isSubmitting,
                "localGstin": localGstin,
                "gstVerified": gstVerified,
                "gstin": gstin,
            })
        }, [preVerifiedDocs.gstin, isVerified, isPreVerified, hasSubmitted, isSubmitting, localGstin, gstVerified, gstin]);
        // Handle GST verification response
        useEffect(() => {
            if (verifyGstData) {
                console.log('GST verification response received:', JSON.stringify(verifyGstData, null, 2));
 
                if (verifyGstData.success) {
                    console.log('GST verification successful!');
                    // setVerifiedGstinApiData(verifyGstData);
                    setVerifiedApiData(verifyGstData);
 
                    // Extract data from the API response
                    const responseBody = verifyGstData.body || {};
                    const responseData = responseBody.data || responseBody;
 
                    const verifiedGstin = responseData.gstin || responseData.GST;
                    const verifiedBusinessName = responseData.trade_name_of_business || responseData.legal_name_of_business || 
                                               responseData.business_name ||
                                               responseData.trade_name ||
                                               responseData.legalName;
                    if (verifiedGstin) {
                        setLocalGstin(verifiedGstin);
                        setLocalBusinessName(verifiedBusinessName || '');
                        setIsVerified(true);
                        setErrorMessage(null);
                    }
                }
            }
 
            if (verifyGstError) {
                // console.log('GST verification failed:', JSON.stringify(verifyGstError, null, 2));
                const errorMsg = verifyGstError.data?.message || verifyGstError.message || 'Failed to verify GSTIN';
                setErrorMessage(errorMsg);
                setIsVerified(false);
            }
        }, [verifyGstData, verifyGstError, setGstVerified, setGstin, setBusinessName]);
 
        // Function to handle GSTIN verification submission
        const handleSubmitVerification = useCallback(() => {
            if (!verifiedApiData || hasSubmitted || verificationCalledRef.current.gstin) {
                console.log('GSTIN already submitted or no verification data');
                return;
            }
 
            console.log('Submitting GSTIN verification data...');
            setIsSubmitting(true);
 
            const responseBody = verifiedApiData.body || {};
            const responseData = responseBody.data || responseBody;
 
            const effectiveGstin = responseData.gstin || responseData.GST || localGstin;
            const effectiveBusinessName = responseData.legal_name_of_business || 
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
                verification_source: 'gstin_api',
                verified_at: new Date().toISOString(),
                verification_status: 'verified'
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
        }, [verifiedApiData, localGstin, localBusinessName, handleVerifyDocKyc, refetchKycStatus, hasSubmitted, setGstVerified]);
 
        const handleGstinChange = useCallback(
            (text) => {
                if (isPreVerified || isVerified) return;
 
                const upperText = text.toUpperCase().replace(/[^A-Z0-9]/g, '');
                setLocalGstin(upperText);
                setErrorMessage(null);
                setVerifiedApiData(null);
                setHasSubmitted(false);
 
                if (upperText.length === 15) {
                    // console.log('GSTIN input reached 15 chars, verifying:', upperText);
                    verifyGstFunc({ gstin: upperText })
                        .unwrap()
                        .then(res => {
                            // console.log('GSTIN verify API success:', JSON.stringify(res));
                        })
                        .catch((error) => {
                            // console.log('GSTIN verify API error:', JSON.stringify(error));
                            setErrorMessage(error.data?.message || error.message || 'Failed to verify GSTIN');
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
            console.log('Dialog close requested');
            onClose();
        }, [onClose]);
 
        // Determine button text
        const getButtonText = useCallback(() => {
            if (verifyGstIsLoading) return "Verifying...";
            if (isSubmitting) return "Submitting...";
            if (hasSubmitted) return "Done";
            if (isVerified) return "Submit Verification";
            if (isPreVerified) return "Done";
            return "Verify GSTIN";
        }, [verifyGstIsLoading, isSubmitting, hasSubmitted, isVerified, isPreVerified]);
 
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
                        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
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
                                content={isPreVerified ? "GSTIN Already Verified" : "Kindly Enter Your GSTIN Details"}
                            />
 
                            <Image style={styles.documentImage} source={require("../../../assets/images/gstindummy.jpeg")} />
 
                            {/* GSTIN Input */}
                            <View style={styles.inputContainer}>
                                <PoppinsTextMedium style={styles.inputLabel} content="Enter GSTIN" />
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        maxLength={15}
                                        value={localGstin}
                                        onChangeText={handleGstinChange}
                                        style={[styles.inputField, (isPreVerified || isVerified) && styles.disabledInput]}
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
                                    ) : (isVerified || isPreVerified) && (
                                        <Image style={styles.verifiedIcon} source={require("../../../assets/images/tickBlue.png")} />
                                    )}
                                </View>
                                {errorMessage && <PoppinsTextMedium style={styles.errorText} content={errorMessage} />}
                            </View>
 
                            {/* Business Name */}
                            <View style={styles.inputContainer}>
                                <PoppinsTextMedium style={styles.inputLabel} content="Business Name" />
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        value={localBusinessName}
                                        onChangeText={handleBusinessNameChange}
                                        style={[styles.inputField, (isPreVerified || isVerified) && styles.disabledInput]}
                                        placeholder="Enter Business Name"
                                        placeholderTextColor="#999"
                                        editable={!isPreVerified && !isVerified}
                                    />
                                </View>
                            </View>
 
 
                            {/* Verified Data Box */}
                            {(isVerified || isPreVerified) && (
                                <View style={[styles.dataBox, { marginBottom: 20 }]}>
                                    <View style={{ flexDirection: "row", width: "100%" }}>
                                        <PoppinsTextMedium content="GSTIN:" style={styles.dataLabel} />
                                        <PoppinsTextMedium content={localGstin} style={styles.dataValue} />
                                    </View>
                                    <View style={{ flexDirection: "row", width: "100%", marginTop: 10 }}>
                                        <PoppinsTextMedium content="Business Name:" style={styles.dataLabel} />
                                        <PoppinsTextMedium 
                                            content={localBusinessName} 
                                            style={[styles.dataValue, { flex: 1, flexWrap: 'wrap' }]} 
                                        />
                                    </View>
                                    {isPreVerified && (
                                        <View style={{ flexDirection: "row", width: "100%", marginTop: 10 }}>
                                            <PoppinsTextMedium content="Status:" style={styles.dataLabel} />
                                            <PoppinsTextMedium content="Verified ✓" style={[styles.dataValue, { color: 'green' }]} />
                                        </View>
                                    )}
                                    {hasSubmitted && (
                                        <View style={{ flexDirection: "row", width: "100%", marginTop: 10 }}>
                                            <PoppinsTextMedium content="Submission:" style={styles.dataLabel} />
                                            <PoppinsTextMedium content="Submitted ✓" style={[styles.dataValue, { color: 'green' }]} />
                                        </View>
                                    )}
                                </View>
                            )}
 
                             {/* Status Message */}
                             {hasSubmitted && (
                                <View style={styles.statusContainer}>
                                    <PoppinsTextMedium
                                        style={[styles.statusText, { color: 'green' }]}
                                        content="✓ GSTIN verified and submitted successfully"
                                    />
                                </View>
                            )}
 
 
                            <TouchableOpacity
                                style={[
                                    styles.submitButton,
                                    {
                                        backgroundColor: ternaryThemeColor,
                                        opacity: (verifyGstIsLoading || isSubmitting) ? 0.7 : 1
                                    }
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
                                    <PoppinsTextMedium
                                        style={styles.submitButtonText}
                                        content={getButtonText()}
                                    />
                                )}
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                </TouchableWithoutFeedback>
            </Modal>
        );
    });
 
    const KycOptionCards = () => {
        const kycConfig = useSelector((state) => state.kycDataSlice.kycData);
 
        if (!kycConfig) {
            return (
                <View style={styles.errorContainer}>
                    <PoppinsTextMedium
                        content="Failed to load KYC options"
                        style={styles.errorText}
                    />
                </View>
            );
        }
 
        const {
            enabled_options = {},
            valid_combinations = [],
            api_details = {},
            match_rules = {},
            optional = [] // Keep this for display purposes
        } = kycConfig;
 
        // All possible KYC options with their configurations
        const allOptions = [
            // {
            //     id: 'aadhaar',
            //     label: 'Aadhaar KYC',
            //     icon: require('../../../assets/images/aadhaarkyc.png'),
            //     verified: aadhaarVerified || preVerifiedDocs.aadhaar,
            //     enabled: enabled_options.aadhaar,
            //     apiDetails: api_details.aadhaar,
            //     matchRules: match_rules.aadhaar,
            //     isOptional: optional.includes('aadhaar') // For display only
            // },
            {
                id: 'pan',
                label: 'PAN Card KYC',
                icon: require('../../../assets/images/pankyc.png'),
                verified: panVerified || preVerifiedDocs.pan,
                enabled: enabled_options.pan,
                apiDetails: api_details.pan,
                isOptional: optional.includes('pan') // For display only
            },
            {
                id: 'gstin',
                label: 'GSTIN',
                icon: require('../../../assets/images/gstinkyc.png'),
                verified: gstVerified || preVerifiedDocs.gstin,
                enabled: enabled_options.gstin,
                apiDetails: api_details.gstin,
                isOptional: optional.includes('gstin') // For display only
            },
            {
                id: 'bank',
                label: 'Bank Account',
                icon: require('../../../assets/images/bankColor.png'),
                verified: bankVerified,
                enabled: enabled_options.bank,
                isOptional: optional.includes('bank'), // Use from config
                onPress: () => setBankModalVisible(true)
            },
            {
                id: 'upi',
                label: 'UPI ID',
                icon: require('../../../assets/images/upi.png'),
                verified: upiVerified,
                enabled: enabled_options.upi,
                isOptional: optional.includes('upi'), // Use from config
                onPress: () => setUpiModalVisible(true)
            }
 
 
        ].filter(opt => opt.enabled);
 
        const renderCombinationOptions = () => {
            if (!valid_combinations || valid_combinations.length === 0) {
                return null;
            }
 
            return (
                <>
                    {valid_combinations.map((combo, comboIndex) => {
                        const elements = combo.split('-');
                        const isSingleMandatory = elements.length === 1;
 
                        return (
                            <React.Fragment key={`combo-${comboIndex}`}>
                                {comboIndex > 0 && (
                                    <View style={styles.orSeparator}>
                                        <View style={styles.orLine} />
                                        <View style={styles.orLine} />
                                    </View>
                                )}
 
                                {isSingleMandatory ? (
                                    <OptionCard
                                        option={allOptions.find(opt => opt.id === combo)}
                                        isMandatory={true}
                                    />
                                ) : (
                                    <View style={styles.combinationContainer}>
                                        {elements.map((element, elementIndex) => {
                                            const option = allOptions.find(opt => opt.id === element);
                                            if (!option) return null;
 
                                            return (
                                                <React.Fragment key={`element-${elementIndex}`}>
                                                    <OptionCard
                                                        option={option}
                                                        isMandatory={true}
                                                    />
                                                    {elementIndex < elements.length - 1 && (
                                                        <View style={styles.orSeparator}>
                                                            <View style={styles.orLine} />
                                                            <PoppinsTextMedium style={styles.orText} content="OR" />
                                                            <View style={styles.orLine} />
                                                        </View>
                                                    )}
                                                </React.Fragment>
                                            );
                                        })}
                                    </View>
                                )}
                            </React.Fragment>
                        );
                    })}
                </>
            );
        };
 
        const OptionCard = ({ option, isMandatory }) => {
            if (!option) return null;
 
            return (
                <TouchableOpacity
                    style={[
                        styles.optionCard,
                        option.verified && styles.verifiedCard,
                        // Only style as optional if it's actually optional AND not mandatory in combinations
                        (option.isOptional && !isMandatory) && styles.optionalCard
                    ]}
                    onPress={option.onPress || (() => handleSelectOption(option.id))}
                >
                    <Image source={option.icon} style={styles.optionIcon} />
                    <View style={styles.optionTextContainer}>
                        <View style={styles.labelContainer}>
                            <PoppinsTextMedium
                                style={styles.optionText}
                                content={option.label}
                            />
                            {isMandatory && (
                                <PoppinsTextMedium
                                    style={styles.mandatoryAsterisk}
                                    content="*"
                                />
                            )}
                            {/* Show optional text only if it's optional AND not part of mandatory combinations */}
                            {option.isOptional && !isMandatory && (
                                <PoppinsTextMedium
                                    style={styles.optionalText}
                                    content="(Optional)"
                                />
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
                        source={option.verified
                            ? require('../../../assets/images/verifiedKyc.png')
                            : require('../../../assets/images/notVerifiedKyc.png')}
                        style={styles.statusIcon}
                    />
                </TouchableOpacity>
            );
        };
 
        return (
            <View style={styles.kycOptionsContainer}>
                <View style={{width:'100%'}}>
                    <PoppinsTextMedium
                        style={styles.kycTitle}
                        content="Complete Your KYC"
                    />
 
                    <PoppinsTextMedium
                        style={styles.kycSubtitle}
                        content="Complete verification details"
                    />
 
                    {renderCombinationOptions()}
 
                    {/* Render optional items that are not in valid_combinations */}
                    {allOptions
                        .filter(opt => opt.isOptional && !valid_combinations.some(combo => combo.includes(opt.id)))
                        .map(option => (
                            <OptionCard
                                key={option.id}
                                option={option}
                                isMandatory={false}
                            />
                        ))
                    }
                    <AadharVerify 
                    verifiedAadharDetails={verifiedAadharDetails}
                    preVerifiedDocs={preVerifiedDocs}
                    getKycDynamicFunc={getKycDynamic}
                    optionCard={{
                        id: 'aadhaar',
                        label: 'Aadhaar KYC',
                        icon: require('../../../assets/images/aadhaarkyc.png'),
                        verified: aadhaarVerified || preVerifiedDocs.aadhaar,
                        // verified: aadhaarVerified,
                        enabled: enabled_options.aadhaar,
                        apiDetails: api_details.aadhaar,
                        matchRules: match_rules.aadhaar,
                        isOptional: optional.includes('aadhaar'), // For display only
                    }} />
                </View>
            </View>
        );
    };
 
    // Bank Account Modal
    const BankAccountModal = ({ visible, onClose }) => {
        // Check if we have existing bank account data
        const hasExistingBankAccount = listAccountData &&
            listAccountData.body &&
            listAccountData.body.some(item => item.transfer_mode === "banktransfer");
 
        const existingBankDetails = hasExistingBankAccount ?
            listAccountData.body.find(item => item.transfer_mode === "banktransfer") : null;
 
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
        const [selectedBankName, setSelectedBankName] = useState(
            existingBankDetails?.bene_bank || ""
        );
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
            "Yes Bank"
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
 
            if (!selectedBankName || !selectedIfscCode || !selectedAccountNumber || !selectedBeneficiaryName || !bankAccountType) {
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
                console.error('Error submitting bank details:', error);
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
                            style={{ width: '100%' }}
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
                                        backgroundColor: '#4CAF50',
                                        opacity: addBankDetailsIsLoading ? 0.7 : 1
                                    }
                                ]}
                                onPress={submitData}
                                disabled={addBankDetailsIsLoading}
                            >
                                {addBankDetailsIsLoading ? (
                                    <ActivityIndicator color="white" size="small" />
                                ) : (
                                    <PoppinsTextMedium
                                        style={styles.submitButtonText}
                                        content="Submit"
                                    />
                                )}
                            </TouchableOpacity>
                        )}
 
                        {hasExistingBankAccount && (
                            <TouchableOpacity
                                style={[styles.submitButton, { backgroundColor: '#2196F3' }]}
                                onPress={handleClose}
                            >
                                <PoppinsTextMedium
                                    style={styles.submitButtonText}
                                    content="Close"
                                />
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
        const hasExistingUpi = listAccountData &&
            listAccountData.body &&
            listAccountData.body.some(item => item.transfer_mode === "upi");
 
        const existingUpiDetails = hasExistingUpi ?
            listAccountData.body.find(item => item.transfer_mode === "upi") : null;
 
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
                    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
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
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => onClose(false)}
                        >
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
                                                        .split(' ')
                                                        .map(n => n[0])
                                                        .join('')
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
                                                style={{ color: "#353535", fontSize: 16, fontWeight: "600", marginBottom: 10 }}
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
                                            style={{ color: "red", fontSize: 16, width: "80%", alignSelf: 'center' }}
                                            content={addBankDetailsError.data?.message || "Error verifying UPI"}
                                        />
                                    )}
 
                                    {!verificationData ? (
                                        <TouchableOpacity
                                            style={[styles.submitButton, { backgroundColor: '#2196F3' }]}
                                            onPress={verifyUpi}
                                            disabled={addBankDetailsIsLoading}
                                        >
                                            {addBankDetailsIsLoading ? (
                                                <ActivityIndicator color="white" />
                                            ) : (
                                                <PoppinsTextMedium
                                                    style={styles.submitButtonText}
                                                    content="Verify"
                                                />
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
                                                style={[styles.submitButton, { backgroundColor: '#4CAF50' }]}
                                                onPress={confirmUpi}
                                                disabled={addBankDetailsIsLoading}
                                            >
                                                {addBankDetailsIsLoading ? (
                                                    <ActivityIndicator color="white" />
                                                ) : (
                                                    <PoppinsTextMedium
                                                        style={styles.submitButtonText}
                                                        content="Confirm"
                                                    />
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
                    <PoppinsTextMedium
                        style={styles.loaderText}
                        content="Loading KYC verification..."
                    />
                </View>
            ) : (
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.keyboardAvoidingView}
                >
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Image
                                style={styles.backIcon}
                                source={require("../../../assets/images/backIcon.png")}
                            />
                        </TouchableOpacity>
                        <PoppinsTextMedium
                            content="Verify your KYC"
                            style={styles.headerTitle}
                        />
                    </View>
 
                    <ScrollView style={styles.scrollView}>
                        <View style={styles.contentContainer}>
                            <Image
                                style={styles.kycLogo}
                                source={require("../../../assets/images/kyclogo.png")}
                            />
                            <KycOptionCards />
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            )}
            {/* Modals */}
          
            <PanVerificationDialog
                visible={panModalVisible}
                onClose={closePanModal}
                refetchKycStatus={getKycDynamicFunc}
 
            />
 
            {/* <GstVerificationDialog
                visible={gstModalVisible}
                onClose={closeGstModal}
            /> */}
 
            <GstVerificationDialog
                visible={gstModalVisible}
                onClose={closeGstModal}
                refetchKycStatus={getKycDynamicFunc}
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
                <ErrorModal
                    modalClose={() => setError(false)}
                    message={message}
                    openModal={error}
                />
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
        width: '100%',
        resizeMode: "contain",
    },
    proceedButton: {
        height: 50,
        width: 200,
        borderRadius: 4,
        marginTop: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    proceedButtonText: {
        fontWeight: "bold",
        fontSize: 20,
        color: "white",
    },
 
    // Modal styles
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        maxHeight: '90%',
    },
    inputField: {
        flex: 1,
        height: 40,
        fontSize: 14,
        color: 'black',
        paddingVertical: 0, // Important for Android
    },
    submitButton: {
        height: 50,
        borderRadius: 5,
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeButton: {
        alignSelf: 'flex-end',
        padding: 5,
    },
    modalTitle: {
        color: "black",
        fontSize: 16,
        marginBottom: 0,
        fontWeight:'bold',
        textAlign: 'center'
    },
    documentImage: {
        height: 100,
        width: "100%",
        resizeMode: 'contain',
        alignSelf: 'center',
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
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#DDDDDD',
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    verifiedIcon: {
        height: 22,
        width: 22,
        resizeMode: 'contain',
        marginLeft: 10,
    },
    loadingIcon: {
        width: 20,
        height: 20,
        marginLeft: 10,
    },
    otpSentText: {
        fontWeight: "700",
        fontSize: 16,
        marginTop: 10,
        textAlign: 'center',
    },
    submitButtonText: {
        fontWeight: 'bold',
        fontSize: 18,
        color: 'white',
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
        fontSize: 14
    },
    dataValue: {
        fontWeight: "600",
        color: "#919191",
        fontSize: 14,
        marginLeft: 10,
    },
    // KYC Options styles
    kycOptionsContainer: {
        padding: 10,
        paddingTop: 0,
        width:'90%'
    },
    kycTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
        textAlign: 'center',
    },
    kycSubtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
        textAlign: 'center',
    },
    optionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    verifiedCard: {
        borderColor: '#4CAF50',
        backgroundColor: '#F1F8E9',
    },
    optionalCard: {
        justifyContent: 'space-between',
        borderColor: '#e0e0e0',
    },
    optionTextContainer: {
        flex: 1,
    },
    optionText: {
        fontSize: 16,
        color: '#333',
    },
    optionIcon: {
        width: 38,
        height: 38,
        padding: 4,
        resizeMode: 'contain',
        marginRight: 12,
    },
    statusIcon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
    orSeparator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
    },
    orLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#e0e0e0',
    },
    orText: {
        marginHorizontal: 10,
        color: '#999',
        fontSize: 14,
    },
    optionalSection: {
        marginTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 16,
    },
    optionalTitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
        fontStyle: 'italic',
    },
    matchRuleText: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 4,
    },
    combinationContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    inlineOrSeparator: {
        marginHorizontal: 8,
    },
    inlineOrText: {
        color: '#666',
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    mandatoryAsterisk: {
        color: 'red',
        fontSize: 16,
        marginLeft: 2,
    },
    fullScreenLoader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    loaderText: {
        marginTop: 16,
        color: '#666',
        fontSize: 16,
        textAlign: 'center',
    },
    preVerifiedContainer: {
        width: '100%',
        marginBottom: 20,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 15,
        padding: 12,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    detailLabel: {
        fontSize: 14,
        color: '#6c757d',
        flex: 1,
    },
    detailValue: {
        fontSize: 14,
        color: '#212529',
        flex: 2,
        textAlign: 'right',
        marginRight: 10,
    },
    preVerifiedText: {
        fontSize: 12,
        color: '#6c757d',
        textAlign: 'center',
        fontStyle: 'italic',
        marginTop: 10,
    },
    bankFormContainer: {
        width: '100%',
        alignItems: 'center',
    },
    existingAccountNote: {
        backgroundColor: '#FFF3CD',
        padding: 12,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#FFEEBA',
        marginTop: 15,
        width: '100%',
    },
    noteText: {
        color: '#856404',
        fontSize: 12,
        textAlign: 'center',
    },
    scrollContent: {
        paddingBottom: 20,
    },
    optionalText: {
        color: '#666',
        fontSize: 12,
        marginLeft: 4,
        fontStyle: 'italic',
    },
    disabledCard: {
        opacity: 0.6,
    },
    disabledIcon: {
        opacity: 0.5,
    },
    disabledText: {
        color: '#999',
        fontSize: 12,
        marginLeft: 4,
        fontStyle: 'italic',
    },
    modalContainerBottom: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContentBottom: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: '90%',
    },
    sendOtpButton: {
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    sendOtpButtonText: {
        color: 'white',
        fontSize: 16,
    },
    loadingIconSmall: {
        width: 20,
        height: 20,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        textAlign:'center',
        marginBottom: 15,
    },
 
    maskedAadhaarText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 15,
        color: '#666',
    },
    verifyButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        minHeight: 50,
    },
    verifyButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
 
    buttonLoadingIcon: {
        width: 30,
        height: 30,
    },
});
 
export default KycVerificationDynamic;