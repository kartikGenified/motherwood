//import liraries
import React, { Component, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Platform,
} from "react-native";
import TopHeader from "../../components/topBar/TopHeader";
import PoppinsTextLeftMedium from "../../components/electrons/customFonts/PoppinsTextLeftMedium";
import DropDownRegistration from "../../components/atoms/dropdown/DropDownRegistration";
import DropDownWithSearch from "../../components/atoms/dropdown/DropDownWithSearch";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import {
  useGetProductListMutation,
  useGetProductCategoryListQuery,
  useGetProductsByCategoryQuery,
  useGetProductsByCategoryMutation,
} from "../../apiServices/product/getProducts";
import * as Keychain from "react-native-keychain";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { use } from "i18next";
import { useSelector } from "react-redux";
import SocialBottomBar from "../../components/socialBar/SocialBottomBar";
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import { useNavigation } from "@react-navigation/native";
import { usePointTransferMutation } from "../../apiServices/pointsTransfer/pointTransfer";
import Geolocation from "@react-native-community/geolocation";
import ErrorModal from "../../components/modals/ErrorModal";

const PointsTransferNext = (params) => {
  const [token, setToken] = useState();
  const [data, setData] = useState();
  const [selected, setSelected] = useState();
  const [point, setPoint] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const [thickness, setTickness] = useState("")
  const [thicknessOptions, setThicknessOptions] = useState([])

  const userDetails = params.route.params.userDetails;
  console.log("userDetails", userDetails);
  const [productRows, setProductRows] = useState([
    { category: null, thickness: null, qty: 1, points: 0 },
  ]);

  const [uiListArr, setUiListArr] = useState([0]); 

  const userData = useSelector((state) => state.appusersdata.userData);



  const {
    data: productCategoryData,
    error: productCategoryError,
    isLoading: productCategoryIsLoading,
  } = useGetProductCategoryListQuery({ token });

  const [
    getPointTransferFunc,
    {
      data: getPointTransferData,
      error: getPointTransferError,
      isLoading: getPointTransferIsLoading,
      isError: getPointTransferIsError,
    },
  ] = usePointTransferMutation();

  const [
    getProductsByCategory,
    {
      data: productsByCategoryData,
      error: productsByCategoryError,
      isLoading: productsByCategoryIsLoading,
    },
  ] = useGetProductsByCategoryMutation();

  const navigation = useNavigation();

  useEffect(() => {
    const getToken = async () => {
      const credentials = await Keychain.getGenericPassword();
      const upddatedToken = credentials.username;
      setToken(upddatedToken);
    };
    getToken();
  }, []);

  useEffect(() => {
    if (getPointTransferData) {
      console.log("getPointTransferData", JSON.stringify(getPointTransferData));
      navigation.replace("PointsTransferSuccess", { getPointTransferData });
    } else {
      if (getPointTransferError) {
        setModalVisible(false);
        setTimeout(() => {
          setError(true);
        }, 1300);
        console.log("getPointTransferError", getPointTransferError);
        setMessage(getPointTransferError?.data?.message);
      }

      console.log("getPointTransferError", getPointTransferError);
      setMessage(getPointTransferError?.data?.message);
    }
  }, [getPointTransferData, getPointTransferError]);

  useEffect(() => {
    if (productCategoryData) {
      console.log("prodyuct Cat", productCategoryData);
      const formattedData = productCategoryData.body?.map((item) => ({
        name: item.name,
        id: item.id,
      }));

      setData(formattedData);
    } else {
      if (productCategoryError)
        console.log("productCategoryError", productCategoryError);
    }
  }, [productCategoryData, productCategoryError]);

  useEffect(() => {
    if (productsByCategoryData) {
      console.log("productsByCategoryData", JSON.stringify(productsByCategoryData));
      setThicknessOptions(
        productsByCategoryData.body.data.map((item) => ({...item, name: item.classification, pName: item.name}))
      );
    }
    if (productsByCategoryError) {
      console.log("productsByCategoryError", productsByCategoryError);
    }
  }, [productsByCategoryData, productsByCategoryError]);

  const handleQtyChange = (rowIndex, qty) => {
    const updatedRows = [...productRows];
    updatedRows[rowIndex].qty = qty;
    setProductRows(updatedRows);
  };

  const totalQty = useMemo(() => {
    return productRows.reduce((sum, row) => sum + parseInt(row.qty || 0), 0);
  }, [productRows]);

  const totalPoints = useMemo(() => {
    return productRows.reduce(
      (sum, row) => sum + parseInt(row.qty || 0) * row.points,
      0
    );
  }, [productRows]);

  const handleProductChange = (rowIndex, selectedProduct) => {
    console.log("OnProductChange", selectedProduct);
    const userType = userData?.user_type;
    const points =
      userType === "retailer"
        ? selectedProduct.value.retailer_points
        : userType === "distributor"
        ? selectedProduct.value.distributor_points
        : userType === "oem"
        ? selectedProduct.value.oem_points
        : userType === "contractor"
        ? selectedProduct.value.contractor_points
        : 0;

    const updatedRows = [...productRows];
    updatedRows[rowIndex].selected = selectedProduct?.value?.product_code;
    
    updatedRows[rowIndex].points = points;

    setProductRows(updatedRows);
    console.log("productRows", productRows);
  };

  const deleteRow = (index) => {
    const updatedRows = [...productRows];
    updatedRows.splice(index, 1);
    setProductRows(updatedRows);
  };

  const handleSearch = (s) => {
    if (s != "") {
      if (s.length > 1) {
        const filteredData = data.filter((item) =>
          item.name.toLowerCase().includes(s.toLowerCase())
        );
        setData(filteredData);
      }
    } else {
      setData(
        productCategoryData?.body?.map((item) => ({
          name: item.name,
          id: item.master_id,
        }))
      );
    }
  };

  const handleAddRow = () => {
    setProductRows((prev) => [...prev, { category: null, thickness: null, qty: 1, points: 0 }]);
  };

  const handleCategoryChange = (rowIndex, selectedCategory) => {
    if (selectedCategory) {
      getProductsByCategory({
        token,
        categoryId: selectedCategory?.value?.id || selectedCategory?.id,
      });
      const updatedRows = [...productRows];
      updatedRows[rowIndex].category = selectedCategory;
      updatedRows[rowIndex].thickness = null; 
      updatedRows[rowIndex].points = 0;
      setProductRows(updatedRows);
    }
  }

  const handleThicknessChange = (rowIndex, selectedThickness) => {
    const updatedRows = [...productRows];
    updatedRows[rowIndex].thickness = selectedThickness;
    if (selectedThickness) {
      const userType = userData?.user_type;
      let points = 0;
      if (userType === "retailer") points = selectedThickness.retailer_points;
      else if (userType === "distributor") points = selectedThickness.distributor_points;
      else if (userType === "oem") points = selectedThickness.oem_points;
      else if (userType === "contractor") points = selectedThickness.contractor_points;
      updatedRows[rowIndex].points = points;
    } else {
      updatedRows[rowIndex].points = 0;
    }
    setProductRows(updatedRows);
  };

  const OnYesClick = () => {
    let lat = "";
    let lon = "";
    console.log("ProductRows", productRows);
    const rowsData = productRows.map((item) => {
      return {
        skuCode: item.thickness?.product_code,
        quantity: item.qty,
      };
    });

    Geolocation.getCurrentPosition((position) => {
      lat = position.coords.latitude;
      lon = position.coords.longitude;
      console.log(`Latitude: ${lat}, Longitude: ${lon}`);
    });

    const requestData = {
      platform: Platform.OS.toUpperCase(),
      lat: lat ? lat : 5,
      log: lon ? lon : 5,
      orderIntent: "sell",
      customerCode: userDetails?.user_id,
      rows: rowsData,
    };

    console.log("requestDataaa", requestData);
    getPointTransferFunc({ token, requestData });
  };

  return (
    <View style={styles.container}>
      <TopHeader title={"Points Transfer"} />
      {productRows.map((row, index) => (
        <UiList
          key={index}
          index={index}
          data={data}
          thicknessOptions={thicknessOptions}
          handleSearch={handleSearch}
          selected={row.selected}
          qty={row.qty}
          onDeleteRow={(index) => {
            deleteRow(index);
          }}
          onProductChange={(selected) => handleProductChange(index, selected)}
          onCategoryChange={(selected) => handleCategoryChange(index, selected)}
          onThicknessChange={(selected) => handleThicknessChange(index, selected)}
          onQtyChange={(qty) => handleQtyChange(index, qty)}
          row={row}
        />
      ))}

      <TouchableOpacity
        style={{
          height: 40,
          width: 160,
          backgroundColor: "black",
          marginVertical: 20,
          marginHorizontal: 25,
          borderRadius: 10,
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={handleAddRow}
      >
        <Text style={{ color: "white", fontSize: 18 }}>+ Add Product</Text>
      </TouchableOpacity>

      <View
        style={{
          backgroundColor: "#B6202D",
          width: "100%",
          height: 50,
          position: "absolute",
          bottom: 150,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{ flexDirection: "row", alignItems: "center", marginLeft: 20 }}
        >
          <Text style={{ color: "white", fontSize: 20 }}>Total Qty : </Text>
          <Text style={{ color: "white", fontSize: 20 }}>{totalQty}</Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginRight: 20,
          }}
        >
          <Text style={{ color: "white", fontSize: 20 }}>Total Points : </Text>
          <Image
            style={{ height: 20, width: 20, marginHorizontal: 5 }}
            source={require("../../../assets/images/coin.png")}
          />
          <Text style={{ color: "white", fontSize: 20 }}>{totalPoints}</Text>
        </View>
      </View>

      <ConfirmationModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title="Are You Sure You Want To Tranfer These Points?"
        imageSource={require("../../../assets/images/alertIcon.png")}
        leftButtonText="Don't Do it!"
        rightButtonText="Yes, I am sure!"
        onLeftPress={() => {
          console.log("Yes Pressed");
          setModalVisible(false);
        }}
        onRightPress={() => {
          console.log("No Pressed");
          OnYesClick();
        }}
      />

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

      {/* Button */}
      <TouchableOpacity
        onPress={() => {
          setModalVisible(true);
        }}
        style={{
          alignSelf: "center",
          backgroundColor: "black",
          marginHorizontal: 20,
          position: "absolute",
          bottom: 65,
          height: 60,
          width: "95%",
          marginTop: 30,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 5,
        }}
      >
        <PoppinsTextLeftMedium
          style={{ color: "white", fontSize: 23, fontWeight: "bold" }}
          content="NEXT"
        ></PoppinsTextLeftMedium>
      </TouchableOpacity>
      <SocialBottomBar />
    </View>
  );
};

const UiList = ({
  index,
  data,
  thicknessOptions,
  handleSearch,
  selected,
  qty,
  onProductChange,
  onCategoryChange,
  onQtyChange,
  onDeleteRow,
  onThicknessChange,
  row,
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 20,
        marginHorizontal: 20,
      }}
    >
      <View>
        <PoppinsTextLeftMedium
          style={{ color: "black", fontWeight: "bold" }}
          content={"Product/ SKU"}
        />
        <View style={{ width: 180 }}>
          <DropDownWithSearch
            handleSearchData={(t) => handleSearch(t)}
            handleData={(data) => onCategoryChange(data)}
            placeholder={"Select Product"}
            data={data}
            value={row.category}
          />
        </View>
      </View>
      <View>
        <View
          style={{ width: 100, alignItems: "center", justifyContent: "center" }}
        >
          <PoppinsTextLeftMedium
            style={{ color: "black", fontWeight: "bold" }}
            content={"Thickness"}
          />
          <View style={{ width: 90 }}>
            <DropDownWithSearch
              handleSearchData={(t) => handleSearch(t)}
              handleData={(data) => onThicknessChange(data)}
              placeholder={"select"}
              data={thicknessOptions}
              value={row.thickness}
            />
          </View>
        </View>
      </View>
      <View>
        <PoppinsTextMedium
          style={{ color: "black", fontWeight: "bold" }}
          content={"Qty"}
        />
        <TextInput
          onChangeText={onQtyChange}
          style={{
            backgroundColor: "#F1F1F1",
            marginTop: 10,
            textAlign: "center",
            paddingHorizontal: 10,
            borderRadius: 8,
            color: "black",
          }}
          value={qty.toString()}
          keyboardType="numeric"
        />
      </View>
      <TouchableOpacity
        onPress={() => {
          onDeleteRow(index);
        }}
      >
        <Image
          style={{ height: 30, width: 30, marginTop: 37, marginLeft: 20 }}
          source={require("../../../assets/images/delete.png")}
        ></Image>
      </TouchableOpacity>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});

//make this component available to the app
export default PointsTransferNext;
