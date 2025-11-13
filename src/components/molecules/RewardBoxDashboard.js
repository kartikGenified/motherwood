import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useFetchUserPointsMutation } from '../../apiServices/workflow/rewards/GetPointsApi';
import * as Keychain from 'react-native-keychain';
import FastImage from 'react-native-fast-image';
import { useTranslation } from 'react-i18next';
import RewardRectangular from '../atoms/RewardRectangular';
import AppTutorial from '../atoms/AppTutorial';
const RewardBoxDashboard = ({ refreshing }) => {
    // Selectors
    const workflow = useSelector(state => state.appWorkflow.program);
    const ternaryThemeColor = useSelector(state => state.apptheme.ternaryThemeColor);
    const secondaryThemeColor = useSelector(state => state.apptheme.secondaryThemeColor);
    const id = useSelector(state => state.appusersdata.id);
    
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

    // Effects
    useEffect(() => {
        fetchPoints();
    }, []);

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
            
            <AppTutorial
                stepNumber={4}
                content="Check your all points"
                placement="bottom"
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
            </AppTutorial>
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
});

export default RewardBoxDashboard;