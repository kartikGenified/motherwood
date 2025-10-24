import React, { useEffect, useState, useMemo, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useOrderHistoryDetailsMutation } from "../../apiServices/workflow/rewards/GetPointsApi";
import * as Keychain from "react-native-keychain";
import ErrorModal from "../../components/modals/ErrorModal";
import MessageModal from "../../components/modals/MessageModal";
import DateIcon from "react-native-vector-icons/MaterialIcons";
import TimeIcon from "react-native-vector-icons/Entypo";
import moment from "moment";
import SocialBottomBar from "../../components/socialBar/SocialBottomBar";
import TopHeader from "../../components/topBar/TopHeader";
import { useTranslation } from "react-i18next";



// Date and time display component
const DateTimeDisplay = ({ date }) => (
  <View style={styles.dateTimeContainer}>
    <View style={styles.dateTimeItem}>
      <DateIcon name="date-range" size={22} color="grey" />
      <Text style={styles.dateTimeText}>
        {moment(date).format("DD-MMM-YYYY")}
      </Text>
    </View>
    <View style={styles.dateDivider} />
    <View style={styles.dateTimeItem}>
      <TimeIcon name="back-in-time" size={22} color="grey" />
      <Text style={styles.dateTimeText}>
        {moment(date).format("hh:mm a")}
      </Text>
    </View>
  </View>
);

// Reference information component


// Table row component
const TableRow = ({ item }) => (
  <View style={styles.tableRow}>
    <View style={styles.productNameCell}>
      <Text style={[styles.tableCellText, { fontSize: 12 }]}>
        {item.product_name}
      </Text>
    </View>
    <View style={styles.thicknessCell}>
      <Text style={styles.tableCellText}>{item.classification}</Text>
    </View>
    <View style={styles.quantityCell}>
      <Text style={styles.tableCellText}>{item.qty}</Text>
    </View>
    <View style={styles.pointsCell}>
      <Text style={[styles.tableCellText, { marginLeft: 20 }]}>
        {item.points}
      </Text>
    </View>
  </View>
);

// Main component
const OrderDetails = ({ route }) => {
  const [modalState, setModalState] = useState({
    error: false,
    success: false,
    message: ""
  });

  const { t } = useTranslation();

  const ReferenceInfo = ({ item, routeData }) => (
  <View style={styles.referenceContainer}>
    <View style={styles.referenceRow}>
      <Text style={styles.referenceLabel}>{t("Reference Number")} :</Text>
      <Text style={styles.referenceValue}>{item?.order_no}</Text>
    </View>
    {routeData?.firm_name && (
      <View style={styles.referenceRow}>
        <Text style={styles.referenceLabel}>{t("Firm Name")} :</Text>
        <Text style={styles.referenceValue}>{routeData.firm_name}</Text>
      </View>
    )}
    <View style={styles.skuQuantityRow}>
      <View style={styles.skuQuantityItem}>
        <Text style={styles.referenceLabel}>{t("Total SKU")} :</Text>
        <Text style={styles.referenceValue}>{item?.total_sku}</Text>
      </View>
      <View style={styles.verticalDivider} />
      <View style={styles.skuQuantityItem}>
        <Text style={styles.referenceLabel}>{t("Quantity")} :</Text>
        <Text style={styles.referenceValue}>{item?.qty}</Text>
      </View>
    </View>
  </View>
);

  // Memoized route parameters
  const { item, routeData } = useMemo(() => ({
    item: route?.params?.item,
    routeData: route?.params?.routeData
  }), [route?.params]);

  const orderNo = item?.id;
  const [
    fetchOrderDetails,
    {
      data: fetchOrderDetailsData,
      error: fetchOrderDetailsError,
      isLoading: fetchOrderDetailsIsLoading,
      isError: fetchOrderDetailsIsError,
    },
  ] = useOrderHistoryDetailsMutation();

  // Fetch order details effect
  useEffect(() => {
    if (!orderNo) return;

    const fetchData = async () => {
      try {
        const credentials = await Keychain.getGenericPassword();
        const token = credentials.username;
        fetchOrderDetails({ id: orderNo, token });
      } catch (error) {
        console.error("Error fetching credentials:", error);
        setModalState({
          error: true,
          success: false,
          message: "Unable to fetch credentials"
        });
      }
    };

    fetchData();
  }, [orderNo, fetchOrderDetails]);

  // Handle API response
  useEffect(() => {
    if (fetchOrderDetailsData) {
      console.log("fetchOrderDetailsData", JSON.stringify(fetchOrderDetailsData));
    } else if (fetchOrderDetailsError) {
      console.error("fetchOrderDetailsError", fetchOrderDetailsError);
      setModalState({
        error: true,
        success: false,
        message: "Unable to fetch order history details"
      });
    }
  }, [fetchOrderDetailsData, fetchOrderDetailsError]);

  const modalClose = useCallback(() => {
    setModalState({
      error: false,
      success: false,
      message: ""
    });
  }, []);

  // Memoized order lines for table
  const orderLines = useMemo(() =>
    fetchOrderDetailsData?.body?.orderLine || [],
    [fetchOrderDetailsData]
  );
  if (fetchOrderDetailsIsLoading) {
    return (
      <View style={styles.container}>
        <TopHeader title={t("Order Details")} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading order details...</Text>
        </View>
        <SocialBottomBar />
      </View>
    );
  }

  const TableHeader = () => (
  <View style={styles.tableHeader}>
    <View style={[styles.tableHeaderCell, { paddingHorizontal: 40 }]}>
      <Text style={styles.tableHeaderText}>{t("Product Name")}</Text>
    </View>
    <View style={[styles.tableHeaderCell, { paddingHorizontal: 40 }]}>
      <Text style={styles.tableHeaderText}>{t("Thickness(MM)")}</Text>
    </View>
    <View style={[styles.tableHeaderCell, { paddingHorizontal: 40 }]}>
      <Text style={styles.tableHeaderText}>{t("QTY")}</Text>
    </View>
    <View style={[styles.tableHeaderCell, { paddingHorizontal: 40 }]}>
      <Text style={styles.tableHeaderText}>{t("PTS")}</Text>
    </View>
  </View>
);


  return (
    <View style={styles.container}>
      <TopHeader title={t("Order Details")} />

      <ScrollView style={styles.scrollView}>
        <View style={styles.mainContent}>
          {/* Points Display */}
          <View style={styles.pointsContainer}>
            <Text style={styles.pointsLabel}>{t("Points")} :</Text>
            {item && <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>{item.points}</Text>
            </View>}
          </View>

          {/* Date and Time Display */}
          {item?.voucher_date && <DateTimeDisplay date={item.voucher_date} />}
        </View>

        {/* Reference Information */}
        <ReferenceInfo item={item} routeData={routeData} />

        {/* Order Details Table */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tableContentContainer}
          style={styles.tableScrollView}
        >
          <TableHeader />
          {orderLines.map((orderItem, index) => (
            <TableRow key={`${orderItem.product_name}-${index}`} item={orderItem} />
          ))}
        </ScrollView>
      </ScrollView>

      <SocialBottomBar />

      {/* Modals */}
      {modalState.error && (
        <ErrorModal
          modalClose={modalClose}
          message={modalState.message}
          openModal={modalState.error}
        />
      )}
      {modalState.success && (
        <MessageModal
          modalClose={modalClose}
          message={modalState.message}
          openModal={modalState.success}
        />
      )}
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: "#000000",
  },
  scrollView: {
    flex: 1,
  },
  mainContent: {
    alignItems: "center",
    width: "100%",
  },
  pointsContainer: {
    flexDirection: "row",
    marginTop: 20,
    alignItems: 'center',
  },
  pointsLabel: {
    fontSize: 22,
    marginTop: 7,
    color: "#000000",
    marginRight: 8,
  },
  statusBadge: {
    backgroundColor: "#B6202D",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 70,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  statusBadgeText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 20,
  },
  dateTimeContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 10,
  },
  dateTimeItem: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  dateTimeText: {
    fontSize: 14,
    color: "#000000",
    fontWeight: "600",
    marginLeft: 4,
  },
  dateDivider: {
    height: "70%",
    width: 2,
    backgroundColor: "#000000",
    marginHorizontal: 4,
  },
  referenceContainer: {
    width: "100%",
    backgroundColor: "#F7F7F7",
    padding: 10,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  referenceRow: {
    flexDirection: "row",
    marginTop: 10,
    width: "100%",
    flexWrap: "wrap",
  },
  referenceLabel: {
    fontSize: 13,
    marginLeft: 10,
    color: "#000000",
    fontWeight: "600",
  },
  referenceValue: {
    fontSize: 13,
    marginLeft: 7,
    color: "#000000",
    fontWeight: "600",
  },
  skuQuantityRow: {
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    flexDirection: "row",
    marginTop: 10,
  },
  skuQuantityItem: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  verticalDivider: {
    height: "80%",
    width: 2,
    backgroundColor: "grey",
    marginHorizontal: 8,
  },
  tableScrollView: {
    marginTop: 30,
    width: "98%",
    alignSelf: "center",
  },
  tableContentContainer: {
    flexDirection: "column",
    paddingBottom: 40,
  },
  tableHeader: {
    height: 70,
    backgroundColor: "#B6202D",
    flexDirection: "row",
    alignItems: "center",
  },
  tableHeaderCell: {
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    borderColor: "#FFFFFF",
  },
  tableHeaderText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  tableRow: {
    backgroundColor: "#EDEDED",
    flexDirection: "row",
  },
  productNameCell: {
    alignItems: "center",
    width: 175,
    height: 40,
    justifyContent: "center",
  },
  thicknessCell: {
    alignItems: "center",
    width: 104,
    height: 40,
    justifyContent: "center",
    left: 40,
  },
  quantityCell: {
    alignItems: "center",
    width: 109,
    height: 40,
    justifyContent: "center",
    left: 70,
  },
  pointsCell: {
    alignItems: "center",
    width: 109,
    height: 40,
    justifyContent: "center",
    left: 60,
  },
  tableCellText: {
    color: "#000000",
    fontWeight: "600",
  },
});

//make this component available to the app
export default OrderDetails;
