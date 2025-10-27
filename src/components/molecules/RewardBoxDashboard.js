import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { useFetchUserPointsMutation } from '../../apiServices/workflow/rewards/GetPointsApi';
import * as Keychain from 'react-native-keychain';
import FastImage from 'react-native-fast-image';
import { useTranslation } from 'react-i18next';
import RewardRectangular from '../atoms/RewardRectangular';
import Tooltip from 'react-native-walkthrough-tooltip';
import { setAlreadyWalkedThrough, setStepId } from '../../../redux/slices/walkThroughSlice';
import { useIsFocused } from '@react-navigation/native';
const RewardBoxDashboard = ({ refreshing }) => {
    const [walkThrough, setWalkThrough] = useState(true);
    const focused = useIsFocused();
    
    // Selectors
    const workflow = useSelector(state => state.appWorkflow.program);
    const ternaryThemeColor = useSelector(state => state.apptheme.ternaryThemeColor);
    const secondaryThemeColor = useSelector(state => state.apptheme.secondaryThemeColor);
    const id = useSelector(state => state.appusersdata.id);
    const stepId = useSelector(state => state.walkThrough.stepId);
    
    const { t } = useTranslation();
    const dispatch = useDispatch();
    
    const gifUri = useMemo(() => 
        Image.resolveAssetSource(require('../../../assets/gif/loaderNew.gif')).uri
    , []);

    const [userPointFunc, {
        data: userPointData,
        error: userPointError,
        isLoading: userPointIsLoading,
    }] = useFetchUserPointsMutation();

    // Memoized calculations
    const pointsData = useMemo(() => {
        if (!userPointData?.body) return null;
        
        const { point_balance, point_reserved, point_redeemed } = userPointData.body;
        const balanceNum = Number(point_balance) || 0;
        const reservedNum = Number(point_reserved) || 0;
        const redeemedNum = Number(point_redeemed) || 0;
        
        return {
            balance: balanceNum,
            reserved: reservedNum,
            redeemed: redeemedNum,
            earned: (balanceNum + reservedNum).toFixed(2),
            wallet: point_balance,
        };
    }, [userPointData]);

    const fetchPoints = useCallback(async () => {
        try {
            const credentials = await Keychain.getGenericPassword();
            if (!credentials || !id) return;
            
            const token = credentials.username;
            const params = {
                userId: id,
                token: token
            };
            userPointFunc(params);
        } catch (error) {
            console.error('Error fetching points:', error);
        }
    }, [id, userPointFunc]);

    const checkWalkThroughStatus = useCallback(async () => {
        try {
            const value = await AsyncStorage.getItem("isAlreadyWalkedThrough");
            if (value) {
                setWalkThrough(false);
            } else {
                setWalkThrough(true);
                dispatch(setStepId(4));
            }
        } catch (error) {
            console.error("Error checking walkthrough status:", error);
        }
    }, [dispatch]);

    const storeWalkThroughData = useCallback(async () => {
        try {
            await AsyncStorage.setItem('isAlreadyWalkedThrough', "true");
        } catch (error) {
            console.error("Error storing walkthrough data:", error);
        }
    }, []);

    const handleNextStep = useCallback(() => {
        dispatch(setStepId(stepId + 1));
    }, [dispatch, stepId]);

    const handleSkip = useCallback(() => {
        storeWalkThroughData();
        dispatch(setAlreadyWalkedThrough(true));
        setWalkThrough(false);
    }, [dispatch, storeWalkThroughData]);
    

    // Effects
    useEffect(() => {
        checkWalkThroughStatus();
    }, [checkWalkThroughStatus]);

    useEffect(() => {
        if (focused) {
            fetchPoints();
        }
    }, [focused, fetchPoints]);

    useEffect(() => {
        if (refreshing) {
            fetchPoints();
        }
    }, [refreshing, fetchPoints]);

    useEffect(() => {
        if (userPointError) {
            console.error("User point error:", userPointError);
        }
    }, [userPointError]);
    return (
        <View style={[styles.container, { backgroundColor: secondaryThemeColor }]}>
            {userPointIsLoading && (
                <FastImage
                    style={styles.loadingGif}
                    source={{
                        uri: gifUri,
                        priority: FastImage.priority.normal,
                    }}
                    resizeMode={FastImage.resizeMode.contain}
                />
            )}
            
            <Tooltip
                isVisible={walkThrough && stepId === 4}
                content={
                    <View style={styles.tooltipContent}>
                        <Text style={styles.tooltipText}>
                            Check your all points
                        </Text>
                        <View style={styles.tooltipButtonContainer}>
                            <TouchableOpacity
                                style={styles.nextButton(ternaryThemeColor)}
                                onPress={handleNextStep}
                            >
                                <Text style={styles.buttonText}>Next</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
                placement="bottom"
                animated
                onClose={() => setWalkThrough(false)}
                tooltipStyle={styles.tooltip}
                contentStyle={[styles.tooltipContentStyle, { borderColor: ternaryThemeColor }]}
            >
                <View style={styles.rewardContainer}>
                    {workflow?.includes("Static Coupon") && (
                        <RewardRectangular 
                            color="#FFE2E6" 
                            image={require('../../../assets/images/voucher.png')} 
                            title="My Coupons"
                        />
                    )}
                    
                    {workflow?.includes("Cashback") && (
                        <RewardRectangular 
                            color="#FFF4DE" 
                            image={require('../../../assets/images/cashback.png')} 
                            title="Cashback"
                        />
                    )}

                    {workflow?.includes("Wheel") && (
                        <RewardRectangular 
                            color="#FFE2E6" 
                            image={require('../../../assets/images/cashback.png')} 
                            title="Spin Wheel"
                        />
                    )}
                    
                    {pointsData && (
                        <RewardRectangular 
                            amount={pointsData.earned} 
                            color="#F0FCE7" 
                            image={require('../../../assets/images/current_point.png')} 
                            title={t("Earned Points")}
                        />
                    )}
                    
                    {pointsData && (
                        <RewardRectangular 
                            amount={pointsData.wallet} 
                            color="#FFFCCF" 
                            image={require('../../../assets/images/rp.png')} 
                            title={t("Wallet Points")}
                        />
                    )}

                    {pointsData && (
                        <RewardRectangular 
                            amount={pointsData.redeemed} 
                            color="#E4FFFB" 
                            image={require('../../../assets/images/rc.png')} 
                            title={t("Redeemed Points")}
                        />
                    )}
                </View>
            </Tooltip>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        borderRadius: 14,
        elevation: 4,
        height: 80,
    },
    loadingGif: {
        width: 100,
        height: 100,
        alignSelf: 'center',
        marginTop: 20,
    },
    rewardContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tooltipContent: {
        alignItems: 'center',
    },
    tooltipText: {
        color: 'black',
        textAlign: 'center',
        marginBottom: 10,
        fontWeight: 'bold',
    },
    tooltipButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tooltip: {
        borderRadius: 30,
    },
    tooltipContentStyle: {
        backgroundColor: 'white',
        minHeight: 100,
        borderWidth: 2,
        borderRadius: 10,
        width: 200,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    skipButton: (color) => ({
        backgroundColor: color,
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 5,
        marginRight: 12,
    }),
    nextButton: (color) => ({
        backgroundColor: color,
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 5,
    }),
});

export default RewardBoxDashboard;