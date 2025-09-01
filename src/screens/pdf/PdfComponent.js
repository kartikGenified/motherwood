import React, { useEffect } from "react";
import {
  StyleSheet,
  View,
  BackHandler,
  ActivityIndicator,
  Text,
} from "react-native";
import Pdf from "react-native-pdf";
import TopHeader from "../../components/topBar/TopHeader";
import SocialBottomBar from "../../components/socialBar/SocialBottomBar";

const PdfComponent = ({ route, navigation }) => {
  const pdf = route?.params?.pdf;
  const pdfLink = pdf == null ? "" : pdf;
  const title = route.params.title;
  const source =
    pdf == null ? { uri: "", cache: true } : { uri: pdfLink, cache: true };

  useEffect(() => {
    const handleBackPress = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress
    );

    return () => backHandler.remove();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <TopHeader title={title} />
      
      {/* Content area that grows and pushes footer down */}
      <View style={styles.content}>
        {pdf && (
          <Pdf
            trustAllCerts={false}
            source={source}
            onLoadComplete={(numberOfPages) => {
              console.log(`Number of pages: ${numberOfPages}`);
            }}
            onPageChanged={(page, numberOfPages) => {
              console.log(`Current page: ${page}`);
            }}
            activityIndicatorProps={{ color: "blue" }}
            onError={(error) => {
              console.log(error);
            }}
            renderActivityIndicator={(progress) => (
              <View style={styles.loader}>
                <ActivityIndicator size="large" color="red" />
                <Text style={{ color: "red" }}>
                  {(progress * 100).toFixed(0)}%
                </Text>
              </View>
            )}
            style={styles.pdf}
          />
        )}
      </View>

      {/* Bottom bar stays at bottom */}
      <SocialBottomBar showRelative={true} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // take full screen
  },
  content: {
    flex: 1, // PDF takes all remaining space above footer
  },
  pdf: {
    flex: 1, // PDF fills content space
  },
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default PdfComponent;
