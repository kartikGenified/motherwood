import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import LinearGradient from "react-native-linear-gradient";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import FastImage from "react-native-fast-image";
import FlipAnimation from "../../components/animations/FlipAnimation";
const ComingSoonScreen = ({ navigation }) => {
  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  );
  const { t } = useTranslation();

  const gifUri = Image.resolveAssetSource(
    require("../../../assets/gif/coming.gif")
  ).uri;

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff20" }}>
      {/* Header */}
      <View
        style={{
          height: 60,
          width: "100%",
          backgroundColor: "#FFF8E7",
          alignItems: "flex-start",
          justifyContent: "center",
          flexDirection: "row",
        }}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Image
            style={styles.backIcon}
            source={require("../../../assets/images/blackBack.png")}
          />
        </TouchableOpacity>

        <PoppinsTextMedium
          style={styles.headerText}
          content={t("Coming Soon")}
        />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <View>
     

          <View style={{...styles.card,  }}>
          <Image
            style={{
              height: 250,
              width: 250,
              resizeMode: "contain",
              borderRadius: 20,
            }}
            source={require("../../../assets/images/soon.jpg")}
          />
          <FastImage
                    style={{ width: 100, height: 100, alignSelf: 'center', marginBottom:20}}
                    source={{
                        uri: gifUri, // Update the path to your GIF
                        priority: FastImage.priority.normal,
                    }}
                    resizeMode={FastImage.resizeMode.contain}
                />
          <Text style={{marginBottom:10, fontSize:20, fontWeight:'bold', color:'black', marginTop:-5}}>{t("Something awesome is on the way. Stay tuned!")}</Text>

            {/* <Text style={styles.cardText}>Please Wait until We are working on this screen and will be provided as soon as possible, Thanks</Text> */}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: {
    height: 20,
    width: 20,
    position: "absolute",
    left: 20,
    marginTop: 20,
  },
  backIcon: {
    height: 20,
    width: 20,
    resizeMode: "contain",
  },
  headerText: {
    fontSize: 20,
    color: "black",
    marginTop: 15,
    position: "absolute",
    fontWeight:'700',
    left: 50,
  },
  content: {
    justifyContent: "center",
    // marginTop: 50,
    alignItems: "center",
    flex: 1,
    width: "100%",
  },
  card: {
    width: "80%",
    padding: 30,
    alignSelf:'center',
    justifyContent:'center',
    backgroundColor: "#fff",
    borderRadius: 15,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: "#e0eafc",
    justifyContent: "center",
    alignItems: "center",
  },
  cardText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2b2b2b",
    textAlign: "justify",
    letterSpacing: 1,
    
  },
});

export default ComingSoonScreen;
