import GestureRecognizer from 'react-native-swipe-gestures';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import DotHorizontalList from '../molecules/DotHorizontalList';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import AppTutorial from '../atoms/AppTutorial';
const Banner = (props) => {
  const [showImage, setShowImage] = useState(props?.images[0]);
  const [index, setIndex] = useState(0);
  const ternaryThemeColor = useSelector((state) => state.apptheme.ternaryThemeColor);
  const { t } = useTranslation();
  useEffect(() => {
    const interval = setInterval(() => {
      const newIndex = (index + 1) % props?.images?.length;
      setIndex(newIndex);
      setShowImage(props?.images[newIndex]);
    }, 4000);
    return () => clearInterval(interval);
  }, [index]);

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
      <AppTutorial
        stepNumber={3}
        content="Swipe left or right for more banners"
        placement="bottom"
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
      </AppTutorial>
    </View>
  );
};

const styles = StyleSheet.create({});

export default Banner;
