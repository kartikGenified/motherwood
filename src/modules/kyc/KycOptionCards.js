import React from 'react';
import {
    View,
    TouchableOpacity,
    Image,
    StyleSheet,
} from 'react-native';
import { useSelector } from 'react-redux';
import PoppinsTextMedium from '@/components/electrons/customFonts/PoppinsTextMedium';
import AadharVerify from './AadharVerify';
import { useTranslation } from 'react-i18next';
import OptionCard from './OptionCard';

const KycOptionCards = ({
    panVerified,
    gstVerified,
    bankVerified,
    upiVerified,
    aadhaarVerified,
    preVerifiedDocs,
    setBankModalVisible,
    setUpiModalVisible,
    handleSelectOption,
    getKycDynamic,
    verifiedAadharDetails
}) => {
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
        const { t } = useTranslation();
 
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
                label: t('PAN Card KYC'),
                icon: require('./assets/images/pankyc.png'),
                verified: panVerified || preVerifiedDocs.pan,
                enabled: enabled_options.pan,
                apiDetails: api_details.pan,
                isOptional: optional.includes('pan') // For display only
            },
            {
                id: 'gstin',
                label: 'GSTIN',
                icon: require('./assets/images/gstinkyc.png'),
                verified: gstVerified || preVerifiedDocs.gstin,
                enabled: enabled_options.gstin,
                apiDetails: api_details.gstin,
                isOptional: optional.includes('gstin') // For display only
            },
            {
                id: 'bank',
                label: 'Bank Account',
                icon: require('./assets/images/bankColor.png'),
                verified: bankVerified,
                enabled: enabled_options.bank,
                isOptional: optional.includes('bank'), // Use from config
                onPress: () => setBankModalVisible(true)
            },
            {
                id: 'upi',
                label: 'UPI ID',
                icon: require('./assets/images/upi.png'),
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
                        if(combo ==="aadhaar") {
                            return (
                                <AadharVerify 
                                    verifiedAadharDetails={verifiedAadharDetails}
                                    preVerifiedDocs={preVerifiedDocs}
                                    getKycDynamicFunc={getKycDynamic}
                                    optionCard={{
                            id: 'aadhaar',
                            label: t('Aadhaar KYC'),
                            icon: require('./assets/images/aadhaarkyc.png'),
                            verified: aadhaarVerified || preVerifiedDocs.aadhaar,
                            // verified: aadhaarVerified,
                            enabled: enabled_options.aadhaar,
                            apiDetails: api_details.aadhaar,
                            matchRules: match_rules.aadhaar,
                            isOptional: optional.includes('aadhaar'), // For display only
                        }} />
                        );
                        }
 
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
                                        onPress={handleSelectOption}
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
                                                        onPress={handleSelectOption}
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
 
        return (
            <View style={styles.kycOptionsContainer}>
                <View style={{width:'100%'}}>
                    <PoppinsTextMedium
                        style={styles.kycTitle}
                        content={t("Complete Your KYC")}
                    />
 
                    <PoppinsTextMedium
                        style={styles.kycSubtitle}
                        content={t("Complete verification details")}
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
                                onPress={handleSelectOption}
                            />
                        ))
                    }
                </View>
            </View>
        );
    };

const styles = StyleSheet.create({
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
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
});

export default KycOptionCards;