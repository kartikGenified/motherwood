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
import {
  useGetProductListMutation,
  useGetProductCategoryListQuery,
  useGetProductsByCategoryMutation,
} from "../../apiServices/product/getProducts";
import * as Keychain from "react-native-keychain";
import { useSelector } from "react-redux";
import SocialBottomBar from "../../components/socialBar/SocialBottomBar";

const PointsCalculator = () => {
  const [token, setToken] = useState();
  const [data, setData] = useState();
  const [fullThicknessOptions, setFullThicknessOptions] = useState([[]]);
  const [thicknessOptions, setThicknessOptions] = useState([[]]);
  const [productRows, setProductRows] = useState([
    { category: null, thickness: null, qty: 1, points: 0 },
  ]);
  const userData = useSelector((state) => state.appusersdata.userData);

  const {
    data: productCategoryData,
    error: productCategoryError,
    isLoading: productCategoryIsLoading,
  } = useGetProductCategoryListQuery({ token });

  const [
    getProductsByCategory,
    {
      data: productsByCategoryData,
      error: productsByCategoryError,
      isLoading: productsByCategoryIsLoading,
    },
  ] = useGetProductsByCategoryMutation();

  useEffect(() => {
    const getToken = async () => {
      const credentials = await Keychain.getGenericPassword();
      const upddatedToken = credentials.username;
      setToken(upddatedToken);
    };
    getToken();
  }, []);

  useEffect(() => {
    if (productCategoryData) {
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
    if (productsByCategoryData && typeof productsByCategoryData.body?.data === 'object') {
      const newOptions = productsByCategoryData.body.data.map((item) => ({
        ...item,
        name: item.classification,
        pName: item.name,
      }));
      // Find the row that just changed category (the one with null thickness)
      const rowIndex = productRows.findIndex(row => row.thickness === null);
      if (rowIndex !== -1) {
        setFullThicknessOptions((prev) => {
          const updated = [...prev];
          updated[rowIndex] = newOptions;
          return updated;
        });
        setThicknessOptions((prev) => {
          const updated = [...prev];
          updated[rowIndex] = newOptions;
          return updated;
        });
      }
    }
    if (productsByCategoryError) {
      console.log("productsByCategoryError", productsByCategoryError);
    }
  }, [productsByCategoryData, productsByCategoryError, productRows]);

  const handleQtyChange = (rowIndex, qty) => {
    const updatedRows = [...productRows];
    updatedRows[rowIndex].qty = qty;
    setProductRows(updatedRows);
  };

  const totalQty = useMemo(() => {
    return productRows.reduce((sum, row) => sum + parseInt(row.qty || 0), 0);
  }, [productRows]);

  const totalPoints = useMemo(() => {
    return productRows.reduce((sum, row) => {
      const qty = parseInt(row.qty, 10);
      const points = parseFloat(row.points);
      // Only add if both are valid numbers
      if (!isNaN(qty) && !isNaN(points)) {
        return sum + qty * points;
      }
      return sum;
    }, 0);
  }, [productRows]);

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
      // Reset thickness options for this row
      setFullThicknessOptions((prev) => {
        const updated = [...prev];
        updated[rowIndex] = [];
        return updated;
      });
      setThicknessOptions((prev) => {
        const updated = [...prev];
        updated[rowIndex] = [];
        return updated;
      });
    }
  };

  const handleThicknessChange = (rowIndex, selectedThickness) => {
    console.log("selectedThickness", selectedThickness);
    const updatedRows = [...productRows];
    // If selectedThickness is just an id (from search), find the full object from fullThicknessOptions
    let thicknessObj = selectedThickness;
    if (selectedThickness && (!selectedThickness.retailer_points && !selectedThickness.distributor_points && !selectedThickness.oem_points && !selectedThickness.contractor_points)) {
      // Try to find the full object by id or classification
      thicknessObj = (fullThicknessOptions[rowIndex] || []).find(
        (item) => item.id === selectedThickness.id || item.classification === selectedThickness.classification
      ) || selectedThickness;
    }
    updatedRows[rowIndex].thickness = thicknessObj;
    if (thicknessObj) {
      const userType = userData?.user_type;
      let points = 0;
      if (userType === "retailer") {
        points = thicknessObj.retailer_points;
      } else if (userType === "distributor") {
        points = thicknessObj.distributor_points;
      } else if (userType === "oem") {
        points = thicknessObj.oem_points;
      } else if (userType === "contractor") {
        points = thicknessObj.contractor_points;
      }
      updatedRows[rowIndex].points = points;
    } else {
      updatedRows[rowIndex].points = 0;
    }
    setProductRows(updatedRows);
    console.log("djkdkdkd", productRows);
  };

  const deleteRow = (index) => {
    const updatedRows = [...productRows];
    updatedRows.splice(index, 1);
    setProductRows(updatedRows);
  };

  const handleSearch = (s) => {
    if (s !== "") {
      if (s.length > 0) {
        const filteredData = (productCategoryData?.body || [])
          .map((item) => ({
            name: item.name,
            id: item.id,
          }))
          .filter((item) => item.name.toLowerCase().includes(s.toLowerCase()));
        setData(filteredData);
      }
    } else {
      setData(
        (productCategoryData?.body || []).map((item) => ({
          name: item.name,
          id: item.id,
        }))
      );
    }
  };

    const handleThicknessSearch = (s) => {
    if (s !== "") {
      if (s.length > 0) {
        const filteredData = (productsByCategoryData?.body?.data || [])
          .map((item) => ({...item, name: item.classification, pName: item.name }))
          .filter((item) => item.name.toLowerCase().includes(s.toLowerCase()));
        setThicknessOptions(filteredData);
      }
    } else {
      setThicknessOptions(
        (productsByCategoryData?.body?.data || []).map((item) => ({
          ...item,
          name: item.classification,
          pName: item.name,
        }))
      );
    }
  };

  const handleAddRow = () => {
    setProductRows((prev) => [
      ...prev,
      { category: null, thickness: null, qty: 1, points: 0 },
    ]);
    setFullThicknessOptions((prev) => [...prev, []]);
    setThicknessOptions((prev) => [...prev, []]);
  };

  return (
    <View style={styles.container}>
      <TopHeader title={"Point Calculator"} />
      {productRows.map((row, index) => (
        <UiList
          key={index}
          index={index}
          data={data}
          thicknessOptions={thicknessOptions[index] || []}
          handleSearch={handleSearch}
          handleThicknessSearch={(t) => handleThicknessSearch(index, t)}
          qty={row.qty}
          onDeleteRow={() => deleteRow(index)}
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
          <Text style={{ color: "white", fontSize: 16 }}>Total Qty : </Text>
          <Text style={{ color: "white", fontSize: 16 }}>{totalQty}</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginRight: 20,
          }}
        >
          <Text style={{ color: "white", fontSize: 16 }}>Total Points : </Text>
          <Image
            style={{ height: 20, width: 20, marginHorizontal: 5 }}
            source={require("../../../assets/images/coin.png")}
          />
          <Text style={{ color: "white", fontSize: 16 }}>{totalPoints}</Text>
        </View>
      </View>
      <SocialBottomBar />
    </View>
  );
};

const UiList = ({
  index,
  data,
  thicknessOptions,
  handleSearch,
  handleThicknessSearch,
  qty,
  onDeleteRow,
  onCategoryChange,
  onThicknessChange,
  onQtyChange,
  row,
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 20,
        marginHorizontal: 10,
      }}
    >
      <View>
        <PoppinsTextLeftMedium
          style={{ color: "black", fontWeight: "bold" }}
          content={"Product/ SKU"}
        />
        <View style={{ width: 180, marginRight: 10 }}>
          <DropDownWithSearch
            handleSearchData={handleSearch}
            handleData={onCategoryChange}
            placeholder={"Select Product"}
            data={data}
            value={row.category}
          />
        </View>
      </View>
      <View>
        <View
          style={{
            width: 90,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 10,
          }}
        >
          <PoppinsTextLeftMedium
            style={{ color: "black", fontWeight: "bold" }}
            content={"Thickness"}
          />
          <View style={{ width: 90 }}>
            <DropDownWithSearch
              handleSearchData={(t) => handleThicknessSearch(t)}
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
      <TouchableOpacity onPress={onDeleteRow}>
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
export default PointsCalculator;
