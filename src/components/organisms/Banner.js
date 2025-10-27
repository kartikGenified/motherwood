import GestureRecognizer from 'react-native-swipe-gestures';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import DotHorizontalList from '../molecules/DotHorizontalList';
import { useSelector, useDispatch } from 'react-redux';
import Tooltip from 'react-native-walkthrough-tooltip';
import { setAlreadyWalkedThrough, setStepId } from '../../../redux/slices/walkThroughSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
const Banner = (props) => {
  const [showImage, setShowImage] = useState(props?.images[0]);
  const [index, setIndex] = useState(0);
  const dispatch = useDispatch();
  const focused = useIsFocused();
  const stepId = useSelector((state) => state.walkThrough.stepId);
  const ternaryThemeColor = useSelector((state) => state.apptheme.ternaryThemeColor);
  const isAlreadyWalkedThrough = useSelector((state) => state.walkThrough.isAlreadyWalkedThrough);
  let walkThrough = !isAlreadyWalkedThrough
  const { t } = useTranslation();
  useEffect(() => {
    const interval = setInterval(() => {
      const newIndex = (index + 1) % props?.images?.length;
      setIndex(newIndex);
      setShowImage(props?.images[newIndex]);
    }, 4000);
    return () => clearInterval(interval);
  }, [index]);

  const storeData = async () => {
    try {
      await AsyncStorage.setItem('isAlreadyWalkedThrough', "true");
    } catch (e) {
      console.log("error", e);
    }
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem("isAlreadyWalkedThrough");
        console.log("isAlreadyWalkedThrough", value);
       
      } catch (e) {
        // saving error
        console.log("error", e);
      }
    };
    getData();
  }, []);

  const handleNextStep = () => {
    storeData();
    dispatch(setStepId(stepId + 1));
  };

  const handleSkip = () => {
    dispatch(setAlreadyWalkedThrough(true)); 
    walkThrough =false
  };

  const onSwipeLeft = () => {
    const newIndex = (index + 1) % props?.images?.length;
    setIndex(newIndex);
    setShowImage(props?.images[newIndex]);
  };

  const onSwipeRight = () => {
    const newIndex = index === 0 ? props?.images?.length - 1 : index - 1;
    setIndex(newIndex);
    setShowImage(props?.images[newIndex]);
  };

  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
  };

  return (
    <View>
      <Tooltip
        isVisible={walkThrough && stepId === 3}
        content={
          <View style={{ alignItems: "center" }}>
            <Text style={{ color: "black", textAlign: "center", marginBottom: 10, fontWeight: "bold" }}>
              {t("Swipe left or right for more banners")}
            </Text>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={styles.skipButton(ternaryThemeColor)}
                onPress={handleSkip}
              >
                <Text style={{ color: "white" }}>{t("Skip")}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.nextButton(ternaryThemeColor)}
                onPress={handleNextStep}
              >
                <Text style={{ color: "white", fontWeight: 'bold' }}>{t("Next")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
        placement="bottom"
        animated
        onClose={() => {walkThrough =false}}
        tooltipStyle={{ borderRadius: 30 }}
        contentStyle={{
          backgroundColor: "white",
          minHeight: 100,
          borderWidth: 2,
          borderRadius: 10,
          borderColor: ternaryThemeColor,
        }}
      >
        <GestureRecognizer
          onSwipeLeft={onSwipeLeft}
          onSwipeRight={onSwipeRight}
          config={config}
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <View style={{ height: 190, width: '90%', alignItems: "center", justifyContent: "center" }}>
            {showImage && (
              <Image
                style={{ height: '100%', width: '100%', borderRadius: 20, resizeMode: 'contain' }}
                source={{ uri: showImage }}
              />
            )}
            <View style={{ position: "absolute", bottom: 10 }}>
              <DotHorizontalList
                no={props.images.length}
                primaryColor="white"
                secondaryColor={ternaryThemeColor}
                selectedNo={index}
              />
            </View>
          </View>
        </GestureRecognizer>
      </Tooltip>
    </View>
  );
};

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

export default Banner;
