import React, { Component, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useSelector } from "react-redux";
import FeedbackTextArea from "../../components/modals/feedback/FeedbackTextArea";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import ButtonWithPlane from "../../components/atoms/buttons/ButtonWithPlane";
import StarRating from "react-native-star-rating";
import FeedbackModal from "../../components/modals/feedback/FeedbackModal";
import { useAddFeedbackMutation } from "../../apiServices/feedbackApi/FeedbackApi";
import * as Keychain from "react-native-keychain";
import ErrorModal from "../../components/modals/ErrorModal";
import { useTranslation } from "react-i18next";
import FastImage from "react-native-fast-image";
import { clientOfficialName } from "../../utils/HandleClientSetup";
import SocialBottomBar from "../../components/socialBar/SocialBottomBar";
import { useUploadSingleFileMutation } from "../../apiServices/imageApi/imageApi";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { Image as RNCompressor } from "react-native-compressor"; // Import for compression
const Feedback = ({ navigation }) => {
  //states
  const [starCount, setStarCount] = useState(0);
  const [image, setImage] = useState();
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const [uploadedImage, setUploadedImage] = useState()

  const userData = useSelector((state) => state.appusersdata.userData);

  const userName = useSelector((state) => state.appusersdata.name);

  const gifUri = Image.resolveAssetSource(
    require("../../../assets/gif/loaderNew.gif")
  ).uri;

  const { t } = useTranslation();

  const [feedback, setFeedback] = useState("");

  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  );

  const secondaryThemeColor = useSelector(
    (state) => state.apptheme.secondaryThemeColor
  );
  const [
    uploadImageFunc,
    {
      data: uploadImageData,
      error: uploadImageError,
      isLoading: uploadImageIsLoading,
      isError: uploadImageIsError,
    },
  ] = useUploadSingleFileMutation();

  const [
    addFeedbackFunc,
    {
      data: addFeedbackData,
      error: addFeedbackError,
      isError: addFeedbackIsError,
      isLoading: addFeedbackIsLoading,
    },
  ] = useAddFeedbackMutation();

  useEffect(() => {
    if (uploadImageData) {
      
      console.log("uploadImageData",uploadImageData)
      setUploadedImage(uploadImageData?.body.fileLink)
    } else if(uploadImageError) {
      console.log("uploadImageError",uploadImageError)

    }
  }, [uploadImageData, uploadImageError]);


  const handleOpenImageGallery = async () => {
    const result = await launchImageLibrary();
    if (!result.assets || !result.assets[0]) return;

    const selectedImage = result.assets[0];
    setImage(selectedImage);

    // Compress the image
    const compressedImageUri = await RNCompressor.compress(selectedImage.uri, {
      compressionMethod: "auto",
      quality: 0.5, // Set quality (0-1) for lossy compression
      maxWidth: 1080, // Optional: specify max width
      maxHeight: 1080, // Optional: specify max height
    });

    const imageDataTemp = {
      uri: compressedImageUri,
      name: selectedImage.fileName || "compressed_image",
      type: selectedImage.type || "image/jpeg",
    };

    const uploadFile = new FormData();
    uploadFile.append("image", imageDataTemp);

    const getToken = async () => {
      const credentials = await Keychain.getGenericPassword();
      const token = credentials.username;
      uploadImageFunc({ body: uploadFile, token: token });
    };

    getToken();
  };

  const onStarRatingPress = (rating) => {
    setStarCount(rating);
  };

  const showSuccessModal = () => {
    onSubmit();
  };

  const hideSuccessModal = () => {
    setIsSuccessModalVisible(false);
    navigation.navigate("Dashboard");
  };

  const handleFeedbackChange = (text) => {
    // console.log(feedback)
    setFeedback(text);
  };

  

  const onSubmit = async () => {
    const credentials = await Keychain.getGenericPassword();

    let obj = {
      token: credentials.username,
      body: {
        feedback: feedback,
        rating: starCount + "",
        platform_id: "1",
        platform: Platform.OS,
        name: userName,
        image:uploadedImage
      },
    };
    if (feedback != "" && starCount != 0) {
      setFeedback("");
      addFeedbackFunc(obj);
    } else {
      setError(true);
      setMessage(t("Please fill all fields"));
    }
  };

  useEffect(() => {
    if (addFeedbackData?.success) {
      console.log("addFeedbackData", addFeedbackData.success);
      setFeedback(" ");
      setStarCount(0);
      setIsSuccessModalVisible(true);
    }
    if (addFeedbackError) {
      console.log("addFeedbackError", addFeedbackError);
      setError(true);
    }
  }, [addFeedbackData, addFeedbackError]);

  return (
    <View style={[styles.container, { backgroundColor: 'white' }]}>
      {/* Navigator */}
      <View
        style={{
          height: 70,
          width: "100%",
          backgroundColor: secondaryThemeColor,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
        }}
      >
        <TouchableOpacity
          style={{
            height: 20,
            width: 20,
            position: "absolute",
            left: 20,
            marginTop: 10,
          }}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Image
            style={{ height: 20, width: 20, resizeMode: "contain" }}
            source={require("../../../assets/images/blackBack.png")}
          ></Image>
        </TouchableOpacity>

        <PoppinsTextMedium
          style={{
            fontSize: 20,
            color: "#000",
            marginTop: 5,
            position: "absolute",
            left: 60,
            fontWeight: "bold",
          }}
          content={t("Feedback For App")}
        ></PoppinsTextMedium>
      </View>
      {/* navigator */}

      <ScrollView contentContainerStyle={{ width: "100%" }}>
        <View style={{ backgroundColor: "#ffffff", flex: 1, height: "100%" }}>
          <View style={styles.marginTopTen}>
            <Image
              style={styles.feedbackImage}
              source={require("../../../assets/images/feedback_illustrator.png")}
            />
          </View>

          {uploadedImage && 
           <Image
           style={{ height: 200, width: 200, resizeMode: "contain",marginTop:20 }}
           source={{uri:uploadedImage}}
         ></Image>
          }

          <TouchableOpacity onPress={()=>{
            handleOpenImageGallery()
          }} style={{backgroundColor:'#FFF8E7',height:100, marginHorizontal:30, borderRadius:10, borderWidth:1, borderColor:ternaryThemeColor, borderStyle:'dotted',alignItems:'center',justifyContent:'center'}}>
            <Image style={{height:40,width:60,resizeMode:'contain'}} source={require("../../../assets/images/camera_red.png")}></Image>
            <PoppinsTextMedium style={{marginTop:10, color:'black'}} content={"Upload Image"}></PoppinsTextMedium>
          </TouchableOpacity>

          <View>
            <View style={{ alignItems: "center" }}>
              <View>
                <PoppinsTextMedium
                  style={{
                    marginRight: 10,
                    fontSize: 16,
                    color: "#000",
                    marginLeft: 30,
                    fontWeight:'600',
                    marginTop: 20,
                  }}
                  content={t(`how would you rate ${clientOfficialName} App`)}
                ></PoppinsTextMedium>
              </View>

              <View style={styles.StarRating}>
                <StarRating
                  disabled={false}
                  maxStars={5}
                  rating={starCount}
                  selectedStar={(rating) => onStarRatingPress(rating)}
                  fullStarColor={"gold"}
                  starSize={40}
                />
              </View>
              <View>
                <PoppinsTextMedium
                  style={{
                    marginRight: 10,
                    fontSize: 16,
                    color: "#58585a",
                    marginLeft: 30,
                  }}
                  content={t("Describe your experience")}
                ></PoppinsTextMedium>
              </View>
            </View>
          </View>

          <View>
            <FeedbackTextArea
              onFeedbackChange={handleFeedbackChange}
              placeholder={t("Type Something Here...")}
            />
          </View>

          <View style={{ marginHorizontal: "5%" }}>
            <ButtonWithPlane
              title={t("submit")}
              navigate=""
              plane={false}
              type={"feedback"}
              onModalPress={showSuccessModal}
            ></ButtonWithPlane>
          </View>
        </View>
      </ScrollView>

      <FeedbackModal
        isVisible={isSuccessModalVisible}
        user={userData.name}
        onClose={hideSuccessModal}
      />
          {/* <SocialBottomBar/> */}
      {addFeedbackIsLoading && (
        <FastImage
          style={{
            width: 100,
            height: 100,
            alignSelf: "center",
            marginTop: "60%",
          }}
          source={{
            uri: gifUri, // Update the path to your GIF
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.contain}
        />
      )}
      {error && (
        <ErrorModal
          warning={true}
          modalClose={() => {
            setError(false);
          }}
          message={message}
          openModal={error}
        ></ErrorModal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navigator: {
    height: 50,
    width: "100%",
    backgroundColor: "transparent",
    alignItems: "flex-start",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 10,
  },
  navigatorIcon: {
    height: 20,
    width: 20,
    position: "absolute",
    marginTop: 10,
  },
  navigatorImage: {
    height: 20,
    width: 20,
    resizeMode: "contain",
  },
  marginTopTen: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  feedbackImage: {
    height: 160,
    width: "90%",
    resizeMode: "contain",
  },
  feedbackText: {
    color: "#58585a",
    fontSize: 15,
    fontWeight: "400",
  },
  StarRating: {
    marginTop: 10,
    marginBottom: 30,
  },
  FeedbackStars: {},
});

export default Feedback;
