import React, { useEffect,useState } from 'react';
import { View, StyleSheet, ScrollView, Image,Text, TouchableOpacity } from 'react-native';

import { useDispatch, useSelector } from 'react-redux';
import { useFetchUserPointsMutation } from '../../apiServices/workflow/rewards/GetPointsApi';
import * as Keychain from 'react-native-keychain';
import FastImage from 'react-native-fast-image';
import { useTranslation } from 'react-i18next';
import RewardRectangular from '../atoms/RewardRectangular';
import Tooltip from 'react-native-walkthrough-tooltip';
import { setAlreadyWalkedThrough, setStepId } from '../../../redux/slices/walkThroughSlice';
import { useIsFocused } from '@react-navigation/native';
const RewardBoxDashboard = () => {
    const [walkThrough, setWalkThrough] = useState(true);
    const focused = useIsFocused()
    const workflow = useSelector(state => state.appWorkflow.program)
    const ternaryThemeColor = useSelector(
        (state) => state.apptheme.ternaryThemeColor
      )
    const id = useSelector(state => state.appusersdata.id);
    const userData = useSelector(state => state.appusersdata.userData)
    const gifUri = Image.resolveAssetSource(require('../../../assets/gif/loaderNew.gif')).uri;
    const {t} = useTranslation();
    const secondaryThemeColor = useSelector(state=>state.apptheme.secondaryThemeColor)
  const isAlreadyWalkedThrough = useSelector((state) => state.walkThrough.isAlreadyWalkedThrough);

    const dispatch = useDispatch();

  const stepId = useSelector((state) => state.walkThrough.stepId);
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
            console.log("ek plate nan " ,Math.floor( Number(userPointData?.body?.point_reserved) + Number(userPointData?.body?.point_balance)+Number(userPointData?.body?.point_redeemed)))
        }
        else if (userPointError) {
            console.log("userPointError", userPointError)
        }

    }, [userPointData, userPointError])

    useEffect(()=>{
      if(isAlreadyWalkedThrough)
      {
        setWalkThrough(false)
        
      }
      else{
        setWalkThrough(true)
        setStepId(1)
  
      }
    },[isAlreadyWalkedThrough, focused])

    const storeData = async () => {
        try {
          await AsyncStorage.setItem('isAlreadyWalkedThrough', "true");
        } catch (e) {
          console.log("error", e);
        }
      };
    
      const handleNextStep = () => {
        dispatch(setStepId(stepId + 1));
      };
    
      const handleSkip = () => {
        storeData();
        dispatch(setAlreadyWalkedThrough(true)); 
        setWalkThrough(false);
      };
    


    console.log(workflow)
    return (
        <View style={{width: '100%', borderRadius: 14, elevation: 4, backgroundColor: secondaryThemeColor, height: 80 }}>


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
<Tooltip
        isVisible={walkThrough && stepId === 4}
        content={
          <View style={{ alignItems: "center" }}>
            <Text style={{ color: "black", textAlign: "center", marginBottom: 10, fontWeight: "bold" }}>
            Check your all points
            </Text>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={styles.skipButton(ternaryThemeColor)}
                onPress={handleSkip}
              >
                <Text style={{ color: "white" }}>Skip</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.nextButton(ternaryThemeColor)}
                onPress={handleNextStep}
              >
                <Text style={{ color: "white", fontWeight: 'bold' }}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
        placement="bottom"
        animated
        onClose={() => setWalkThrough(false)}
        tooltipStyle={{ borderRadius: 30 }}
        contentStyle={{
          backgroundColor: "white",
          minHeight: 100,
          borderWidth: 2,
          borderRadius: 10,
          borderColor: ternaryThemeColor,
          width:200
        }}
      >
            <View style={{width:'100%',flexDirection:'row',alignItems:"center",justifyContent:'center'}}>
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
                    // userData && (userData?.user_type)?.toLowerCase() == 'distributor' && userPointData  && <RewardRectangular amount={userPointData.body.point_earned} color="#DCFCE7" image={require('../../../assets/images/points.png')} title={t("earned points")}></RewardRectangular>
                }
                {
                  userPointData && <RewardRectangular amount={userPointData?.body?.point_earned} color="#F0FCE7" image={require('../../../assets/images/current_point.png')} title={t("Earned Points")}></RewardRectangular>
                }
                
                {
                    // workflow?.includes("Points On Product") && userPointData && <RewardRectangular amount={userPointData.body.point_redeemed} color="#DCFCE7" image={require('../../../assets/images/reward.png')} title={t("redeemed points")}></RewardRectangular>
                }
                    {
                  <RewardRectangular amount={userPointData?.body?.point_balance} color="#FFFCCF" image={require('../../../assets/images/rp.png')} title={t("Wallet Points")}></RewardRectangular>
                }
             

                     {
                  <RewardRectangular amount={userPointData?.body?.point_redeemed} color="#E4FFFB" image={require('../../../assets/images/rc.png')} title={t("Redeemed Points")}></RewardRectangular>
                }
            
                {
                    // workflow?.includes("Points On Product") && userPointData && <RewardRectangular amount={userPointData.body.point_reserved} color="#DCFCE7" image={require('../../../assets/images/points.png')} title={t("reserved points")}></RewardRectangular>
                }
                {/* {
                    workflow?.includes("Points On Product") && userPointData && <RewardRectangular amount={((Number(userPointData.body.point_reserved) + Number(userPointData.body.point_balance)).toFixed(2))} color="#DCFCE7" image={require('../../../assets/images/points.png')} title={t("Total Points")}></RewardRectangular>
                } */}
                {/* {
                   userData && (userData?.user_type)?.toLowerCase() == 'distributor' &&  userPointData && <RewardRectangular amount={((Number(userPointData.body.point_reserved) + Number(userPointData.body.point_balance)).toFixed(2))} color="#DCFCE7" image={require('../../../assets/images/points.png')} title={t("Total Points")}></RewardRectangular>
                } */}
            </View>
            </Tooltip>

        </View>
    )
}

const styles = StyleSheet.create({
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