import React, { useEffect, useId, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  ScrollView,
  Dimensions,
  Text,
  Linking,
} from "react-native";
import PoppinsText from "../../components/electrons/customFonts/PoppinsText";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import Icon from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import * as Keychain from "react-native-keychain";
import { useSelector } from "react-redux";
import { useProductCatalogueMutation } from "../../apiServices/productCatalogue/productCatalogueApi";
import Pdf from "react-native-pdf";
import FastImage from "react-native-fast-image";
import { useTranslation } from "react-i18next";
import TopHeader from "../../components/topBar/TopHeader";
import FilterComp from "../../components/molecules/FilterComp";
import useFilterDataByType from "../../hooks/customHooks/useFilterDataByType";

const ProductCatalogue = ({ navigation }) => {
  const [catalogueData, setCatalogueData] = useState();
  const [categories, setCategories] = useState()
  const [selectedCategory, setSelectedCategory] = useState();
  
  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
    
  )

  const [
    productCatalogueFunc,
    {
      data: productCatalogueData,
      error: productCatalogueError,
      isLoading: productCatalogueIsLoading,
      isError: productCatalogueIsError,
    },
  ] = useProductCatalogueMutation();
  
  const { filteredData } = useFilterDataByType(catalogueData, "type", selectedCategory);



  const gifUri = Image.resolveAssetSource(
    require("../../../assets/gif/loaderNew.gif")
  ).uri;



  const { t } = useTranslation();

  useEffect(() => {
    const getToken = async (data) => {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        console.log(
          "Credentials successfully loaded for user " + credentials.username
        );
        const token = credentials.username;
        const params = {
          token: token,
          limit: 100,
          offset: 0,
        };
        productCatalogueFunc(params);
      }
    };
    getToken();
  }, []);

  useEffect(() => {
    console.log("Filtered:", filteredData);
  }, [filteredData]);
  

  useEffect(() => {
    if (productCatalogueData) {
      console.log("productCatalogueData", productCatalogueData.body.data);
      if (productCatalogueData.success) {
        function getUniqueCategories(data) {
          const uniqueCategories = new Map();

          data.forEach((item) => {
            console.log("categoryType", item.type);
            if (!uniqueCategories.has(item.type)) {
              uniqueCategories.set(item.type, item.type);
            }
          });

          return Array.from(uniqueCategories.values());
        }

        setCatalogueData(productCatalogueData.body.data);
        setCategories(getUniqueCategories(productCatalogueData.body.data));
        
      }
    } else if (productCatalogueError) {
      console.log("productCatalogueError", productCatalogueError);
    }
  }, [productCatalogueData, productCatalogueError]);
  const height = Dimensions.get("window").height;
  

  const CatalogueItem = (props) => {
    const image = props.image;
    const title = props.title;
    const pdf = props.pdf;

    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("PdfComponent", { pdf: pdf });
        }}
        style={{
          height: 180,
          width: "44%",
          backgroundColor: "#DDDDDD",
          borderRadius: 20,
          alignItems: "center",
          justifyContent: "flex-start",
          margin: 10,
          elevation: 10,
        }}
      >
        <Image
          style={{
            height: 140,
            width: "100%",
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
            resizeMode: "contain",
          }}
          source={{ uri: image }}
        ></Image>
        <View
          style={{
            backgroundColor: "white",
            width: "100%",
            padding: 8,
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            bottom: 0,
            elevation: 8,
            borderBottomRightRadius: 20,
            borderBottomLeftRadius: 20,
          }}
        >
          <PoppinsTextMedium
            style={{ color: "black", fontSize: 17 }}
            content={title}
          ></PoppinsTextMedium>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "flex-start",
        width: "100%",
        backgroundColor: "white",
        height: "100%",
      }}
    >
      <TopHeader title={t("E-Catalogues")}></TopHeader>

      <ScrollView style={{ width: "100%", height: "90%" }}>
        <View
          style={{
            backgroundColor: "white",
            marginTop: 10,
            width: "100%",
            zIndex: 1,
          }}
        >
          <FilterComp
            setSelected={(selected)=>{ setSelectedCategory(selected);}}
            categories={categories}
          ></FilterComp>
        </View>

        <View
          style={{
            borderTopRightRadius: 30,
            borderTopLeftRadius: 30,
            backgroundColor: "white",
            minHeight: height - 100,

            alignItems: "center",
            justifyContent: "flex-start",
            width: "100%",
          }}
        >

          <View
            style={{
              marginTop: 40,
              width: "100%",
              alignItems: "center",
              justifyContent: "flex-start",
              flexWrap: "wrap",
              flexDirection: "row",
            }}
          >
            {filteredData &&
              filteredData.map((item, index) => {
                return (
                  <CatalogueItem
                    key={index}
                    title={item.name}
                    image={item.image}
                    pdf={item.files[0]}
                  ></CatalogueItem>
                );
              })}

            {productCatalogueIsLoading && (
              <FastImage
                style={{
                  width: 100,
                  height: 100,
                  alignSelf: "center",
                  justifyContent: "center",
                  marginTop: "50%",
                  marginLeft: "40%",
                }}
                source={{
                  uri: gifUri, // Update the path to your GIF
                  priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.contain}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({});

export default ProductCatalogue;
