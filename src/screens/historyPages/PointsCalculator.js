//import liraries
import React, { Component, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import TopHeader from "../../components/topBar/TopHeader";
import PoppinsTextLeftMedium from "../../components/electrons/customFonts/PoppinsTextLeftMedium";
import DropDownRegistration from "../../components/atoms/dropdown/DropDownRegistration";
import DropDownWithSearch from "../../components/atoms/dropdown/DropDownWithSearch";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import { useGetProductListMutation } from "../../apiServices/product/getProducts";
import * as Keychain from "react-native-keychain";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { use } from "i18next";
import { useSelector } from "react-redux";
import SocialBottomBar from "../../components/socialBar/SocialBottomBar";


const PointsCalculator = () => {
  const [token, setToken] = useState();
  const [data, setData] = useState();
  const [selected, setSelected] = useState();
  const [point, setPoint] = useState(0);

  const [productRows, setProductRows] = useState([
    { selected: null, qty: 1, points: 0 },
  ]);

  const [uiListArr, setUiListArr] = useState([0]); // Start with one row

  const userData = useSelector((state) => state.appusersdata.userData);

  const [
    productListFunc,
    {
      data: productListData,
      error: productListError,
      isLoading: productListIsLoading,
      isError: productListIsError,
    },
  ] = useGetProductListMutation();

  useEffect(() => {
    const getToken = async () => {
      const credentials = await Keychain.getGenericPassword();
      const upddatedToken = credentials.username;
      setToken(upddatedToken);
    };
    getToken();
  }, []);

  useEffect(() => {
    if (productListData) {
      setData(productListData?.body?.products);
    } else {
      if (productListError) console.log("productListError", productListError);
    }
  }, [productListData, productListError]);

  const handleQtyChange = (rowIndex, qty) => {
    const updatedRows = [...productRows];
    updatedRows[rowIndex].qty = qty;
    setProductRows(updatedRows);
  };

  // Calculate total qty and points
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
    updatedRows[rowIndex].selected = selectedProduct;
    updatedRows[rowIndex].points = points;
    setProductRows(updatedRows);
  };

  const handleSearch = (s) => {
    if (s.length > 2) {
      const data = {
        token: token,
        body: {
          limit: 10,
          offset: 0,
          name: s,
        },
      };
      productListFunc(data);
    }
  };

  const handleAddRow = () => {
    setProductRows((prev) => [...prev, { selected: null, qty: 1, points: 0 }]);
  };

  return (
    <View style={styles.container}>
      <TopHeader title={"Point Calculator"} />
      {productRows.map((row, index) => (
        <UiList
          key={index}
          index={index}
          data={data}
          handleSearch={handleSearch}
          selected={row.selected}
          qty={row.qty}
          onProductChange={(selected) => handleProductChange(index, selected)}
          onQtyChange={(qty) => handleQtyChange(index, qty)}
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
          height: 60,
          position: "absolute",
          bottom: 60,
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
      <SocialBottomBar />
    </View>
  );
};

const UiList = ({
  index,
  data,
  handleSearch,
  selected,
  qty,
  onProductChange,
  onQtyChange,
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
            handleData={(data) => onProductChange(data)}
            placeholder={"Select Product"}
            data={data}
            defaultValue={selected}
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
          <Text
            style={{
              marginTop: 15,
              backgroundColor: "#F1F1F1",
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 7,
            }}
          >
            1.7
          </Text>
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
export default PointsCalculator;
