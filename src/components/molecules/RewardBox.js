import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import RewardSquare from '../atoms/RewardSquare';
import { useSelector } from 'react-redux';
import { useFetchUserPointsMutation } from '../../apiServices/workflow/rewards/GetPointsApi';
import * as Keychain from 'react-native-keychain';
import FastImage from 'react-native-fast-image';
import { useTranslation } from 'react-i18next';

const RewardBox = () => {
    const workflow = useSelector(state => state.appWorkflow.program)
    const id = useSelector(state => state.appusersdata.id);
    const userData = useSelector(state => state.appusersdata.userData)
    const gifUri = Image.resolveAssetSource(require('../../../assets/gif/loaderNew.gif')).uri;
    const {t} = useTranslation();

    console.log("asbfhjsahjvchjashvhhavshj",userData)
    const [userPointFunc, {
        data: userPointData,
        error: userPointError,
        isLoading: userPointIsLoading,
        isError: userPointIsError
    }] = useFetchUserPointsMutation();

    useEffect(() => {
        fetchPoints()
    }, []);

    const fetchPoints = async () => {
        const credentials = await Keychain.getGenericPassword();
        const token = credentials.username;
        const params = {
            userId: id,
            token: token
        }
        userPointFunc(params)
    }

    useEffect(() => {
        if (userPointData) {
            console.log("userPointData", userPointData)
        }
        else if (userPointError) {
            console.log("userPointError", userPointError)
        }

    }, [userPointData, userPointError])


    console.log(workflow)
    return (
        <View style={{ padding: 4, width: '100%', borderRadius: 14, elevation: 4, backgroundColor: 'white', height: 170 }}>



            {/* <ScrollView contentContainerStyle={{ }} style={{width:'100%'   }} showsHorizontalScrollIndicator={false} horizontal={true}>
             */}
             <View style={{width:'100%',flexDirection:'row',alignItems:'center', justifyContent:'center'}}>
                {
                    workflow?.includes("Static Coupon") && <RewardSquare color="#FFE2E6" image={require('../../../assets/images/voucher.png')} title="My Coupons"></RewardSquare>
                }
                {
                    workflow?.includes("Cashback") && <RewardSquare color="#FFF4DE" image={require('../../../assets/images/cashback.png')} title="Cashback"></RewardSquare>
                }

                {
                    workflow?.includes("Wheel") && <RewardSquare color="#FFE2E6" image={require('../../../assets/images/cashback.png')} title="Spin Wheel"></RewardSquare>

                }

                {
                //   userPointData && <RewardSquare amount={Math.floor( Number(userPointData.body.point_earned)-(Number(userPointData.body.point_reserved) + Number(userPointData.body.point_balance)+Number(userPointData?.body.point_redeemed)))} color="#F0FCE7" image={require('../../../assets/images/current_point.png')} title={t("Current Points")}></RewardSquare>
                }
                {
                    userData && (userData?.user_type)?.toLowerCase() == 'distributor' && userPointData  && <RewardSquare amount={userPointData.body.point_earned} color="#DCFCE7" image={require('../../../assets/images/points.png')} title={t("earned points")}></RewardSquare>
                }
                {
                    workflow?.includes("Points On Product") && userPointData && <RewardSquare amount={userPointData.body.point_redeemed} color="#DCFCE7" image={require('../../../assets/images/points.png')} title={t("redeemed points")}></RewardSquare>
                }
                    {
                  <RewardSquare amount={Math.floor(userPointData?.body.transfer_points ? userPointData?.body.transfer_points : 0)} color="#F0FCE7" image={require('../../../assets/images/transferable.png')} title={t("Transferable points")}></RewardSquare>
                }
                {
                  <RewardSquare amount={Math.floor(userPointData?.body.point_balance ? userPointData?.body.point_balance : 0)} color="#DCF0FF" image={require('../../../assets/images/balance_black.png')} title={t("balance points")}></RewardSquare>
                }
            
                {
                    // workflow?.includes("Points On Product") && userPointData && <RewardSquare amount={userPointData.body.point_reserved} color="#DCFCE7" image={require('../../../assets/images/points.png')} title={t("reserved points")}></RewardSquare>
                }
                {
                    workflow?.includes("Points On Product") && userPointData && <RewardSquare amount={((Number(userPointData.body.point_reserved) + Number(userPointData.body.point_balance)).toFixed(2))} color="#DCFCE7" image={require('../../../assets/images/points.png')} title={t("Total Points")}></RewardSquare>
                }
                {
                   userData && (userData?.user_type)?.toLowerCase() == 'distributor' &&  userPointData && <RewardSquare amount={((Number(userPointData.body.point_reserved) + Number(userPointData.body.point_balance)).toFixed(2))} color="#DCFCE7" image={require('../../../assets/images/points.png')} title={t("Total Points")}></RewardSquare>
                }
                </View>
            {/* </ScrollView> */}

        </View>
    )
}

const styles = StyleSheet.create({})

export default RewardBox;