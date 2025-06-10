import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';

import { useSelector } from 'react-redux';
import { useFetchUserPointsMutation } from '../../apiServices/workflow/rewards/GetPointsApi';
import * as Keychain from 'react-native-keychain';
import FastImage from 'react-native-fast-image';
import { useTranslation } from 'react-i18next';
import RewardRectangular from '../atoms/RewardRectangular';

const RewardBoxDashboard = () => {
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
        <View style={{ padding: 4, width: '100%', borderRadius: 14, elevation: 4, backgroundColor: 'white', height: 120 }}>


            {userPointIsLoading &&
                <FastImage
                    style={{ width: 100, height: 100, alignSelf: 'center', marginTop: 20 }}
                    source={{
                        uri: gifUri, // Update the path to your GIF
                        priority: FastImage.priority.normal,
                    }}
                    resizeMode={FastImage.resizeMode.contain}
                />
            }

            <ScrollView contentContainerStyle={{ }} style={{width:'100%'   }} showsHorizontalScrollIndicator={false} horizontal={true}>
                {
                    workflow?.includes("Static Coupon") && <RewardRectangular color="#FFE2E6" image={require('../../../assets/images/voucher.png')} title="My Coupons"></RewardRectangular>
                }
                {
                    workflow?.includes("Cashback") && <RewardRectangular color="#FFF4DE" image={require('../../../assets/images/cashback.png')} title="Cashback"></RewardRectangular>
                }

                {
                    workflow?.includes("Wheel") && <RewardRectangular color="#FFE2E6" image={require('../../../assets/images/cashback.png')} title="Spin Wheel"></RewardRectangular>

                }
{
                    userData && (userData?.user_type)?.toLowerCase() == 'distributor' && userPointData  && <RewardRectangular amount={userPointData.body.point_earned} color="#DCFCE7" image={require('../../../assets/images/points.png')} title={t("earned points")}></RewardRectangular>
                }
                {
                  userPointData && <RewardRectangular amount={Math.floor(userPointData.body.point_earned ? userPointData.body.point_earned : 0)} color="#F0FCE7" image={require('../../../assets/images/current_point.png')} title={t("Current Points")}></RewardRectangular>
                }
                
                {
                    workflow?.includes("Points On Product") && userPointData && <RewardRectangular amount={userPointData.body.point_redeemed} color="#DCFCE7" image={require('../../../assets/images/points.png')} title={t("redeemed points")}></RewardRectangular>
                }
                    {
                  <RewardRectangular amount={Math.floor(userPointData?.body.transfer_points ? userPointData?.body.transfer_points : 0)} color="#DCF0FF" image={require('../../../assets/images/transferable.png')} title={t("Transferable points")}></RewardRectangular>
                }
                  {
                  <RewardRectangular amount={Math.floor(userPointData?.body.point_balance ? userPointData?.body.point_balance : 0)} color="#FFFCCF" image={require('../../../assets/images/balance_black.png')} title={t("balance points")}></RewardRectangular>
                }
            
                {
                    // workflow?.includes("Points On Product") && userPointData && <RewardRectangular amount={userPointData.body.point_reserved} color="#DCFCE7" image={require('../../../assets/images/points.png')} title={t("reserved points")}></RewardRectangular>
                }
                {
                    workflow?.includes("Points On Product") && userPointData && <RewardRectangular amount={((Number(userPointData.body.point_reserved) + Number(userPointData.body.point_balance)).toFixed(2))} color="#DCFCE7" image={require('../../../assets/images/points.png')} title={t("Total Points")}></RewardRectangular>
                }
                {
                   userData && (userData?.user_type)?.toLowerCase() == 'distributor' &&  userPointData && <RewardRectangular amount={((Number(userPointData.body.point_reserved) + Number(userPointData.body.point_balance)).toFixed(2))} color="#DCFCE7" image={require('../../../assets/images/points.png')} title={t("Total Points")}></RewardRectangular>
                }
            </ScrollView>

        </View>
    )
}

const styles = StyleSheet.create({})

export default RewardBoxDashboard;