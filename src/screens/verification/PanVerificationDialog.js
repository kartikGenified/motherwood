import React, { useState, useEffect, useCallback, useRef } from 'react';
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
} from 'react-native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/Entypo';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import { useVerifyPanMutation } from '../../apiServices/verification/PanVerificationApi';

const PanVerificationDialog = (({ 
    visible, 
    onClose, 
    refetchKycStatus,
    preVerifiedDocs,
    pan,
    name,
    setPanVerified,
    setPan,
    setName,
    verificationCalledRef,
    verificationGlobalData,
    setCallSubmitPan,
    handleVerifyDocKyc,
    gifUri
}) => {
        const { t } = useTranslation();
        const ternaryThemeColor = useSelector(
            (state) => state.apptheme.ternaryThemeColor
        ) ? useSelector((state) => state.apptheme.ternaryThemeColor) : "grey";
        
        const isPreVerified = preVerifiedDocs.pan;
        const [localPan, setLocalPan] = useState('');
        const [localName, setLocalName] = useState( '');
        const [isVerified, setIsVerified] = useState(isPreVerified);
        const [errorMessage, setErrorMessage] = useState(null);
        const [verifiedApiData, setVerifiedApiData] = useState(null);
        const [hasSubmitted, setHasSubmitted] = useState(false);
        const [isSubmitting, setIsSubmitting] = useState(false);
        useEffect(() => {
            setLocalPan(pan? pan : '');
            setLocalName(name ? name : '');
            setIsVerified(isPreVerified);
        }, [pan, name]);
 
 
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
                const errorMsg = verifyPanError.data?.message || verifyPanError.message || t('Failed to verify PAN');
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
                            setErrorMessage(error.data?.message || error.message || t('Failed to verify PAN'));
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
            if (verifyPanIsLoading) return t("Verifying...");
            if (isSubmitting) return t("Submitting...");
            if (hasSubmitted) return t("Done");
            if (isVerified) return t("Submit Verification");
            if (isPreVerified) return t("Done");
            return t("Verify PAN");
        }, [verifyPanIsLoading, isSubmitting, hasSubmitted, isVerified, isPreVerified, t]);
 
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
                                content={isPreVerified ? t("PAN Already Verified") : t("Kindly Enter Your PAN Details")}
                            />
 
                        <Image
                            style={styles.documentImage}
                            source={require("../../../assets/images/panColor.png")}
                        />
 
 
                            {/* PAN Input */}
                            <View style={styles.inputContainer}>
                                <PoppinsTextMedium style={styles.inputLabel} content={t("Enter PAN")} />
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
                                <PoppinsTextMedium style={styles.inputLabel} content={t("name")} />
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        value={localName}
                                        onChangeText={handleNameChange}
                                        style={[styles.inputField, (isPreVerified || isVerified) && styles.disabledInput]}
                                        placeholder={t("Enter Name")}
                                        placeholderTextColor="#999"
                                        editable={!isPreVerified && !isVerified}
                                    />
                                </View>
                            </View>
 
 
 
                            {/* Verified Data Box */}
                            {(isVerified || isPreVerified) && (
                                <View style={[styles.dataBox, { marginBottom: 20 }]}>
                                    <View style={{ flexDirection: "row", width: "100%" }}>
                                        <PoppinsTextMedium content={t("PAN") + ": "} style={styles.dataLabel} />
                                        <PoppinsTextMedium content={localPan} style={styles.dataValue} />
                                    </View>
                                    <View style={{ flexDirection: "row", width: "100%", marginTop: 10 }}>
                                        <PoppinsTextMedium content={t("name") + ": "} style={styles.dataLabel} />
                                        <PoppinsTextMedium
                                            content={localName}
                                            style={[styles.dataValue, { flex: 1, flexWrap: 'wrap' }]}
                                        />
                                    </View>
                                    {isPreVerified && (
                                        <View style={{ flexDirection: "row", width: "100%", marginTop: 10 }}>
                                            <PoppinsTextMedium content={t("Status") + ":"} style={styles.dataLabel} />
                                            <PoppinsTextMedium content={t("Verified") + " ✓"} style={[styles.dataValue, { color: 'green' }]} />
                                        </View>
                                    )}
                                    {hasSubmitted && (
                                        <View style={{ flexDirection: "row", width: "100%", marginTop: 10 }}>
                                            <PoppinsTextMedium content={t("Submission") + ":"} style={styles.dataLabel} />
                                            <PoppinsTextMedium content={t("Submitted") + " ✓"} style={[styles.dataValue, { color: 'green' }]} />
                                        </View>
                                    )}
                                </View>
                            )}
                            {/* Status Message */}
                            {hasSubmitted && (
                                <View style={styles.statusContainer}>
                                    <PoppinsTextMedium
                                        style={[styles.statusText, { color: 'green' }]}
                                        content={"✓ " +t("PAN verified and submitted successfully")}
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

const styles = StyleSheet.create({
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
    inputField: {
        flex: 1,
        height: 40,
        fontSize: 14,
        color: 'black',
        paddingVertical: 0, // Important for Android
    },
    disabledInput: {
        backgroundColor: '#f5f5f5',
        color: '#888',
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
    errorText: {
        color: 'red',
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
        fontSize: 14
    },
    dataValue: {
        fontWeight: "600",
        color: "#919191",
        fontSize: 14,
        marginLeft: 10,
    },
    statusContainer: {
        alignItems: 'center',
        marginTop: 10,
    },
    statusText: {
        fontSize: 14,
        textAlign: 'center',
    },
    submitButton: {
        height: 50,
        borderRadius: 5,
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitButtonText: {
        fontWeight: 'bold',
        fontSize: 18,
        color: 'white',
    },
    buttonLoadingIcon: {
        width: 30,
        height: 30,
    },
});

export default PanVerificationDialog;