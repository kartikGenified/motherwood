import { View, Image } from 'react-native'
import React from 'react'
import FastImage from 'react-native-fast-image';

const Loader = ({ loading }) => {
  const gifUri = Image.resolveAssetSource(
    require("@assets/gif/loaderNew.gif")
  ).uri;

  if (!loading) {
    return null;
  }

  return (
    <View style={{ height: 200, width: "100%" }}>
      <FastImage
        style={{
          width: 100,
          height: 100,
          alignSelf: "center",
        }}
        source={{
          uri: gifUri, // Update the path to your GIF
          priority: FastImage.priority.normal,
        }}
        resizeMode={FastImage.resizeMode.contain}
      />
    </View>
  )
}

export default Loader