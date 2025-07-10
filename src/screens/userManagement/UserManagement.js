//import liraries
import React, { Component, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  FlatList,
} from "react-native";

import { useSelector } from "react-redux";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import PointsCard from "../../components/passbook/PointsCard";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import DropDownWithSearch from "../../components/atoms/dropdown/DropDownWithSearch";
import { useGetZoneWiseEmployeeUserMutation } from "../../apiServices/userMapping/userMappingApi";
import * as Keychain from "react-native-keychain";
import moment from "moment";
import { useSalesPointsDashboardMutation } from "../../apiServices/workflow/rewards/GetPointsApi";
import { useIsFocused } from "@react-navigation/native";
// create a component
const UserManagement = () => {
  const secondaryThemeColor = useSelector(
    (state) => state.apptheme.secondaryThemeColor
  );

  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState();
  const [selectedDate, setSelectedDate] = useState();
  const [employeeList, setEmployeeList] = useState();
  const [dateFrom, setDateFrom] = useState();
  const [dateTo, setDateTo] = useState();

  const status = ["Pending Users", "Approval Users", "Reject Users", "Total"];
  const dateOptions = [
    "Today",
    "Yesterday",
    "Last 3 Days",
    "Last Week",
    "Last Month",
    "Last Year",
  ];

  const { t } = useTranslation();
  const focused = useIsFocused()
  const navigation = useNavigation();



  const [
    getZoneWiseEmployeeUser,
    { data: zoneWiseData, error: zoneWiseError, isLoading: zoneWiseLoading },
  ] = useGetZoneWiseEmployeeUserMutation();

  const [salesPointFunc, { data: salesPointData, error: salesPointError }] =
    useSalesPointsDashboardMutation();

  useEffect(() => {
    fetchZoneWiseData();
  }, []);
  useEffect(() => {
    fetchZoneWiseData();
  }, [focused]);

  useEffect(() => {
    const getToken = async () => {
      const credentials = await Keychain.getGenericPassword();
      const token = credentials.username;

      salesPointFunc({ token });
    };
    getToken();
  }, []);

  useEffect(() => {
    if (searchText.length > 2 || searchText == "") {
      fetchZoneWiseData();
    }
  }, [searchText, dateFrom, dateTo, selectedStatus]);

  const fetchZoneWiseData = async () => {
    try {
      const credentials = await Keychain.getGenericPassword();
      const token = credentials.username;
      const statusMap = {
        "Pending Users": "PENDING",
        "Approval Users": "APPROVED",
        "Reject Users": "REJECTED",
      };
      const mappedStatus = statusMap[selectedStatus] || undefined;

      const params = {
        status: mappedStatus,
        userId: searchText,
        dateFrom: dateFrom,
        dateTo: dateTo,
        token: token,
      };

      const result = await getZoneWiseEmployeeUser(params);
      console.log("ZoneWiseEmployeeUser data:", result);
    } catch (err) {
      console.log("ZoneWiseEmployeeUser error:", err);
    }
  };

  useEffect(() => {
    if (zoneWiseData) {
      console.log("ZoneWiseEmployeeUser11:", zoneWiseData?.body?.users);
      setEmployeeList(zoneWiseData?.body?.users);
    }
    if (zoneWiseError) {
      console.log("ZoneWiseEmployeeUser error:", zoneWiseError);
    }
  }, [zoneWiseData, zoneWiseError]);

  const BoxOfPoints = ({
    icon,
    title,
    point,
    backgroundColor,
    borderColor,
  }) => {
    return (
      <View
        style={{
          padding: 10,
          backgroundColor: backgroundColor,
          alignItems: "center",
          paddingHorizontal: 20,
          marginHorizontal: 5,
        }}
      >
        <Image
          style={{ height: 25, width: 25, resizeMode: "contain" }}
          source={icon}
        ></Image>
        <Text style={{ color: "black", fontWeight: "600", marginTop: 10 }}>
          {title}
        </Text>
        <Text style={{ marginTop: 5, color: "black", fontWeight: "800" }}>
          {point}
        </Text>
      </View>
    );
  };

  const handleDateDropdown = (selected) => {
    let from, to;
    const today = moment();
    switch (selected) {
      case "Today":
        from = today.format("YYYY-MM-DD");
        to = today.format("YYYY-MM-DD");
        break;
      case "Yesterday":
        from = today.clone().subtract(1, "day").format("YYYY-MM-DD");
        to = today.clone().subtract(1, "day").format("YYYY-MM-DD");
        break;
      case "Last 3 Days":
        from = today.clone().subtract(2, "day").format("YYYY-MM-DD");
        to = today.format("YYYY-MM-DD");
        break;
      case "Last Week":
        from = today.clone().subtract(6, "day").format("YYYY-MM-DD");
        to = today.format("YYYY-MM-DD");
        break;
      case "Last Month":
        from = today.clone().subtract(29, "day").format("YYYY-MM-DD");
        to = today.format("YYYY-MM-DD");
        break;
      case "Last Year":
        from = today.clone().subtract(364, "day").format("YYYY-MM-DD");
        to = today.format("YYYY-MM-DD");
        break;
      default:
        from = undefined;
        to = undefined;
    }
    setSelectedDate(selected);
    setDateFrom(from);
    setDateTo(to);
    console.log("Dropdown selected:", selected, "from:", from, "to:", to);
  };

  const renderEmployeeItem = ({ item, index }) =>{ 

      // Status color logic
  let statusLabel = "Pending";
  let statusBg = "#FFFCCF";
  let statusText = "#B79A0B";

  if (item?.status == "2") {
    // Rejected
    statusLabel = "Rejected";
    statusBg = "#FFDDE0";
    statusText = "#B6202D";
  } else if (item?.status == "1") {
    // Check extra_status.approved
    if (item?.extra_status?.approved) {
      statusLabel = "Approved";
      statusBg = "#E9FFD5";
      statusText = "#5BB70B";
    } else {
      statusLabel = "Pending";
      statusBg = "#FFFCCF";
      statusText = "#B79A0B";
    }
  }

    return(
   <View
      style={{
        backgroundColor: "#B6202D",
        marginTop: 20,
        marginHorizontal: 5,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
      }}
    >
      <View
        style={{
          padding: 10,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          height: 60,
        }}
      >
        <View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                backgroundColor: "white",
                width: 30,
                height: 30,
                textAlign: "center",
                borderRadius: 20,
                fontSize: 20,
              }}
            >
              {index + 1}
            </Text>
            <Text
              style={{ color: "white", fontWeight: "600", marginLeft: 10 }}
            >{`Customer ID - ${item?.id} `}</Text>
          </View>
          <Text
            style={{
              color: "white",
              textAlign: "center",
              marginLeft: 40,
              fontWeight: "600",
            }}
          >{`Name : ${item?.name}`}</Text>
        </View>

        <View style={{}}>
          <Text
            style={{
              color: "#FBFB0B",
              fontSize: 14,
              fontWeight: "600",
              textAlign: "center",
            }}
          >
            {"User Type"}
          </Text>

          <Text style={{ textAlign: "center", color: "#FBFB0B" }}>
            {item?.user_type}
          </Text>
        </View>
      </View>

      {/* White Background */}
      <View
        style={{
          backgroundColor: "white",
          height: 90,
          padding: 10,
          borderWidth: 1,
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View>
            {item?.city && (
              <View style={{ flexDirection: "row" }}>
                <Image
                  style={{
                    width: 20,
                    height: 20,
                    resizeMode: "contain",
                    marginRight: 5,
                  }}
                  source={require("../../../assets/images/locationBlack.png")}
                ></Image>

                <Text
                  style={{ color: "black", fontWeight: "600", fontSize: 17 }}
                >
                  City :{item.city}{" "}
                </Text>
              </View>
            )}

            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <Image
                style={{
                  width: 18,
                  height: 18,
                  resizeMode: "contain",
                  marginRight: 6,
                }}
                source={require("../../../assets/images/mobileBlack.png")}
              ></Image>
              <Text style={{ color: "black", fontWeight: "600", fontSize: 17 }}>
                Mobile : {item.mobile}{" "}
              </Text>
            </View>
          </View>
          <View style={{ padding: 13, backgroundColor: statusBg }}>
            <Text style={{ textAlign: "center", color: statusText }}>
              Status
            </Text>
            <Text style={{ textAlign: "center", color: statusText }}>
              {statusLabel}
            </Text>
          </View>
        </View>
      </View>

      {/* Button */}
      <TouchableOpacity
        style={{
          backgroundColor: "black",
          height: 50,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
        }}
        onPress={()=>navigation.navigate("UserManagementDetails",{
          data:item
        })}
      >
        <Image
          style={{ width: 20, height: 20, resizeMode: "contain" }}
          source={require("../../../assets/images/userGrey.png")}
        ></Image>
        <Text style={{ color: "white", fontWeight: "600", marginLeft: 10 }}>
          View Profile
        </Text>
      </TouchableOpacity>
    </View>
    )
 
};

  return (
    <ScrollView nestedScrollEnabled={true} style={styles.container}>
      {/* coloured header */}
      <View style={{ width: "100%", backgroundColor: secondaryThemeColor }}>
        <View
          style={{
            alignItems: "center",
            justifyContent: "flex-start",
            flexDirection: "row",
            width: "100%",
            marginTop: 10,
            height: 50,
            marginLeft: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Dashboard");
            }}
          >
            <Image
              style={{ height: 30, width: 30, resizeMode: "contain" }}
              source={require("../../../assets/images/blackBack.png")}
            ></Image>
          </TouchableOpacity>
          <PoppinsTextMedium
            content={t("User Management")}
            style={{
              marginLeft: 10,
              fontSize: 18,
              fontWeight: "700",
              color: "black",
            }}
          ></PoppinsTextMedium>
        </View>
      </View>

      <View style={{ margin: 20 }}>
        <Text style={{ fontWeight: "600", color: "black" }}>
          Search by User ID{" "}
        </Text>
        <Image
          style={{
            height: 20,
            width: 20,
            position: "absolute",
            marginTop: 45,
            marginLeft: 10,
          }}
          source={require("../../../assets/images/search.png")}
        ></Image>
        <TextInput
          style={{
            borderWidth: 1,
            marginTop: 10,
            paddingHorizontal: 40,
            borderRadius: 20,
            color: "black",
            borderColor: "#DDDDDD",
          }}
          onChangeText={(text) => {
            setSearchText(text);
          }}
          value={searchText}
          placeholder="Search"
        ></TextInput>
      </View>

      <View
        style={{
          flexDirection: "row",
          width: "100%",
          justifyContent: "center",
        }}
      >
        <View style={{ width: "45%" }}>
          <Text style={{ color: "black", fontWeight: "bold" }}>
            Search by Status
          </Text>
          <DropDownWithSearch
            isSearchable={"false"}
            handleData={(data) => setSelectedStatus(data)}
            placeholder={selectedStatus || "Select Status"}
            data={status}
            value={selectedStatus}
          />
        </View>

        <View style={{ width: "45%" }}>
          <Text style={{ color: "black", fontWeight: "bold" }}>
            Search by Date
          </Text>
          <DropDownWithSearch
            handleSearchData={(t) => handleSearch(t)}
            isSearchable={"false"}
            handleData={handleDateDropdown}
            placeholder={selectedDate || "Select by Date"}
            data={dateOptions}
            value={selectedDate}
          />
        </View>
      </View>

      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={{ flexDirection: "row", marginTop: 30, marginHorizontal: 1 }}
      >
        <BoxOfPoints
          backgroundColor={"#E8FEFF"}
          borderColor={"#C3FCFE"}
          icon={require("../../../assets/images/userBlue.png")}
          title={"Total Users's"}
          point={salesPointData?.body?.users?.total_users}
        ></BoxOfPoints>
        <BoxOfPoints
          backgroundColor={"#F0FDBC"}
          borderColor={"#DEF389"}
          icon={require("../../../assets/images/checkGreen.png")}
          title={"Aproved Users's"}
          point={salesPointData?.body?.users?.total_approved_users}
        ></BoxOfPoints>
        <BoxOfPoints
          backgroundColor={"#FFFCCF"}
          borderColor={"#F6F19D"}
          icon={require("../../../assets/images/pendingYellow.png")}
          title={"Pending Users's"}
          point={salesPointData?.body?.users?.total_pending_users}
        ></BoxOfPoints>
      </ScrollView>

      <FlatList
        data={employeeList || []}
        keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
        renderItem={renderEmployeeItem}
        ListEmptyComponent={
          <Text style={{ color: "grey", textAlign: "center", marginTop: 20 }}>
            No employees found.
          </Text>
        }
      />
    </ScrollView>
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
export default UserManagement;
