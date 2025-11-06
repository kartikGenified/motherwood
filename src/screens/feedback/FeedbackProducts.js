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
  TextInput,
  FlatList
} from "react-native";
import { useSelector } from "react-redux";
import FeedbackTextArea from "../../components/modals/feedback/FeedbackTextArea";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import ButtonWithPlane from "../../components/atoms/buttons/ButtonWithPlane";
import StarRating from "react-native-star-rating";
import FeedbackModal from "../../components/modals/feedback/FeedbackModal";
import { useAddFeedbackMutation, useGetProductFeedbackMutation } from "../../apiServices/feedbackApi/FeedbackApi";
import * as Keychain from "react-native-keychain";
import ErrorModal from "../../components/modals/ErrorModal";
import { useTranslation } from "react-i18next";
import FastImage from "react-native-fast-image";
import { clientOfficialName } from "../../utils/HandleClientSetup";
import SocialBottomBar from "../../components/socialBar/SocialBottomBar";
import { useGetProductListMutation } from "../../apiServices/product/getProducts";
import BottomModal from "../../components/modals/BottomModal";
import Close from "react-native-vector-icons/Ionicons";
import Search from "react-native-vector-icons/AntDesign";
import Cross from "react-native-vector-icons/Entypo"
import { useUploadSingleFileMutation } from "../../apiServices/imageApi/imageApi";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { Image as RNCompressor } from "react-native-compressor"; // Import for compression
import {
  useGetProductCategoryListQuery,
  useGetProductsByCategoryMutation,
} from "../../apiServices/product/getProducts";
import DropDownWithSearch from "../../components/atoms/dropdown/DropDownWithSearch";
import TopHeader from "@/components/topBar/TopHeader";



const FeedbackProducts = ({ navigation }) => {
  //states
  const [token, setToken] = useState();
  const [starCount, setStarCount] = useState(0);
  const [image, setImage] = useState();
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const [uploadedImage, setUploadedImage] = useState()
  const [productData, setProductData] = useState()
  const [modal, setModal] = useState(false);
  const [category, setCategory] = useState(null);
  const [thickness, setThickness] = useState(null);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [thicknessOptions, setThicknessOptions] = useState([]);
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
    addFeedbackFunc,
    {
      data: addFeedbackData,
      error: addFeedbackError,
      isError: addFeedbackIsError,
      isLoading: addFeedbackIsLoading,
    },
  ] = useAddFeedbackMutation();

  const [
    uploadImageFunc,
    {
      data: uploadImageData,
      error: uploadImageError,
      isLoading: uploadImageIsLoading,
      isError: uploadImageIsError,
    },
  ] = useUploadSingleFileMutation();

  const {
    data: productCategoryData,
    error: productCategoryError,
    isLoading: productCategoryIsLoading,
  } = useGetProductCategoryListQuery({ token });

  const [getProductsByCategory, {
    data: productsByCategoryData,
    error: productsByCategoryError,
    isLoading: productsByCategoryIsLoading,
  }] = useGetProductsByCategoryMutation();

  useEffect(() => {
    const getToken = async () => {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) setToken(credentials.username);
    };
    getToken();
  }, []);

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


  useEffect(() => {
    if (productCategoryData) {
      console.log("productCategoryData", productCategoryData);
      const formattedData = (productCategoryData.body || []).map((item) => ({
        name: item.name,
        id: item.id,
      }));
      setCategoryOptions(formattedData);
      if (!category || !formattedData.find(c => c.id === category?.id)) {
        setCategory(null);
      }
    } else if (productCategoryError) {
      console.log("productCategoryError", productCategoryError);
    }
  }, [productCategoryData, productCategoryError]);

  useEffect(() => {
    console.log('categoryOptions', categoryOptions);
    console.log('category', category);
  }, [categoryOptions, category]);

  const handleCategoryChange = (selectedCategory) => {
    let cat = selectedCategory?.value || selectedCategory;
    setCategory(cat);
    setThickness(null);
    if (cat) {
      getProductsByCategory({
        token,
        categoryId: cat.id,
      });
    } else {
      setThicknessOptions([]);
    }
  };

  useEffect(() => {
    if (productsByCategoryData) {
      setThicknessOptions(
        productsByCategoryData.body.data.map((item) => ({ ...item, name: item.classification, pName: item.name }))
      );
    } else if (productsByCategoryError) {
      console.log("productsByCategoryError", productsByCategoryError);
    }
  }, [productsByCategoryData, productsByCategoryError]);

  const handleThicknessChange = (selectedThickness) => {
    setThickness(selectedThickness);
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
    const trimmedFeedback = (feedback || "").trim();
    if (!category) {
      setError(true);
      setMessage(t("Please select a category"));
      return;
    }
    if (!thickness) {
      setError(true);
      setMessage(t("Please select a thickness"));
      return;
    }
    if (!trimmedFeedback) {
      setError(true);
      setMessage(t("Please enter your feedback"));
      return;
    }
    if (!starCount || starCount === 0) {
      setError(true);
      setMessage(t("Please provide a rating"));
      return;
    }
    console.log("tokenmnnnnn", token);
    if (!token) {
      setError(true);
      setMessage(t("Something went wrong. Please try again later."));
      return;
    }
    let obj = {
      token: token,
      body: {
        feedback: trimmedFeedback,
        rating: starCount + "",
        platform_id: "1",
        platform: Platform.OS,
        name: userName,
        product_code: thickness?.product_code,
        product_name: thickness?.pName || thickness?.name,
        image: uploadedImage,
      },
    };
    console.log("addFeedbackObj", obj);
    addFeedbackFunc(obj);
  };

  useEffect(() => {
    if (addFeedbackData?.success) {
      setFeedback("");
      setStarCount(0);
      setIsSuccessModalVisible(true);
    }
    if (addFeedbackError) {
      setError(true);
      setMessage(t("Something went wrong. Please try again later."));
    }
  }, [addFeedbackData, addFeedbackError]);

  const modalClose = () => {
    setModal(false);
  };

  const handleSearchThickness=(s)=>{
    if (s != "") {
      if (s.length > 1) {
        const filteredData = thicknessOptions.filter((item) =>
          item.name.toLowerCase().includes(s.toLowerCase())
        );
        setThicknessOptions(filteredData);
      }
    } else {
      setThicknessOptions(
        productsByCategoryData.body.data.map((item) => ({ ...item, name: item.classification, pName: item.name }))
      );
    }
  }

  const handleSearchCategory = (s) => {
    if (s != "") {
      if (s.length > 1) {
        const filteredData = categoryOptions.filter((item) =>
          item.name.toLowerCase().includes(s.toLowerCase())
        );
        setCategoryOptions(filteredData);
      }
    } else {
      setCategoryOptions(
        productCategoryData?.body?.map((item) => ({
          name: item.name,
          id: item.master_id,
        }))
      );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: "white" }]}>
      <BottomModal
        modalClose={modalClose}
        message={message}
        canGoBack={true}
        openModal={modal}
        // comp={Comp}
        // handleCompResp={handleCompResp}
      ></BottomModal>
      <TopHeader title={t("Feedback For Product")} />

      <ScrollView
        contentContainerStyle={{
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View style={styles.marginTopTen}>
          <Image
            style={styles.feedbackImage}
            source={require("../../../assets/images/feedback_illustrator.png")}
          />
        </View>
        {/* Cascading Category and Thickness Dropdowns */}
        <View style={{ width: '90%', marginTop: 20 }}>
          <PoppinsTextMedium style={{ color: 'black', fontWeight: '600', marginBottom: 5, fontSize:16 }} content={t("Select Category")} />
          <DropDownWithSearch
            handleSearchData={(t) => handleSearchCategory(t)}
            data={categoryOptions}
            value={category}
            handleData={handleCategoryChange}
            placeholder={t("Select Category")}
          />
        </View>
        <View style={{ width: '90%', marginTop: 10 , marginBottom:10}}>
          <PoppinsTextMedium style={{ color: 'black', fontWeight: '600', marginBottom: 5 , fontSize:16, marginTop:10}} content={t("Select Thickness")} />
          <DropDownWithSearch
            handleSearchData={(t) => handleSearchThickness(t)}
            data={thicknessOptions}
            value={thickness}
            handleData={handleThicknessChange}
            placeholder={t("Select Thickness")}
          />
        </View>
        {uploadedImage && 
           <Image
           style={{ height: 200, width: 200, resizeMode: "contain",marginTop:20 }}
           source={{uri:uploadedImage}}
         ></Image>
          }
        <TouchableOpacity
        onPress={()=>{
          handleOpenImageGallery()
        }}
          style={{
            backgroundColor: "#FFF8E7",
            height: 100,
            marginHorizontal: 30,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: ternaryThemeColor,
            borderStyle: "dotted",
            alignItems: "center",
            justifyContent: "center",
            width: "90%",
            marginTop: 20,
          }}
        >
          <Image
            style={{ height: 40, width: 60, resizeMode: "contain" }}
            source={require("../../../assets/images/camera_red.png")}
          ></Image>
          <PoppinsTextMedium
            style={{ marginTop: 10, color: "black" }}
            content={t("Upload Image")}
          ></PoppinsTextMedium>
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
                  fontWeight: "600",
                  marginTop: 20,
                }}
                content={t("how would you rate {{appName}} App", { appName: clientOfficialName })}
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

        <View style={{ width: "100%" }}>
          <FeedbackTextArea
            onFeedbackChange={handleFeedbackChange}
            placeholder={t("Type Something Here...")}
          />

          <View style={{ marginHorizontal: "5%" , marginBottom:30}}>
            <ButtonWithPlane
              title={t("SUBMIT")}
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

      <SocialBottomBar showRelative={true}></SocialBottomBar>
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
    alignItems: "center",
    justifyContent: "center",
  },
  feedbackImage: {
    height: 160,
    width: 300,
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

export default FeedbackProducts;
