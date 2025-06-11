import React, { useEffect, useId, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  ScrollView,
  Text,
} from "react-native";
import PoppinsText from "../../components/electrons/customFonts/PoppinsText";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import { useDispatch, useSelector } from "react-redux";
import Icon from "react-native-vector-icons/Entypo";
import Plus from "react-native-vector-icons/Entypo";
import { theme } from "../../utils/HandleClientSetup";
import Minus from "react-native-vector-icons/Entypo";
import Check from "react-native-vector-icons/FontAwesome";
import LinearGradient from "react-native-linear-gradient";
import {
  useFetchGiftCatalogueByUserTypeAndCatalogueTypeMutation,
  useFetchGiftCatalogueforRedeemGiftMutation,
} from "../../apiServices/gifts/GiftApi";
import { useFetchUserPointsMutation } from "../../apiServices/workflow/rewards/GetPointsApi";
import * as Keychain from "react-native-keychain";
import ErrorModal from "../../components/modals/ErrorModal";
import SuccessModal from "../../components/modals/SuccessModal";
import MessageModal from "../../components/modals/MessageModal";
import PointHistory from "../historyPages/PointHistory";
import { useTranslation } from "react-i18next";
import { use } from "i18next";
import { check } from "react-native-permissions";
import CheckIcon from "react-native-vector-icons/AntDesign";
import { scrollTo } from "react-native-reanimated";
import { useFetchGiftsRedemptionsOfUserMutation } from "../../apiServices/workflow/RedemptionApi";
import DropDownRegistration from "../../components/atoms/dropdown/DropDownRegistration";

const RedeemGifts = ({ navigation, route }) => {
  const [search, setSearch] = useState();
  const [cart, setCart] = useState(null);
  const [distinctCategories, setDistinctCategories] = useState([]);
  const [displayContent, setDisplayContent] = useState();
  const [initailRange, setInitialRange] = useState("Select Range");
  const [showCategoriesOption, setShowCategoriesOptions] = useState(false);
  const [pointBalance, setPointBalance] = useState();
  const [message, setMessage] = useState();
  const [range, setRange] = useState()
  const [scrollToID, setScrollToID] = useState();
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const action = route.params?.action;
  const schemeType = route.params?.schemeType;
  const slabs = [
    { min: 10000, max: 25000 },
    { min: 25000, max: 50000 },
    { min: 50000, max: 100000 },
    { min: 100000, max: 500000 },
    { min: 500000, max: 999999999999 },
  ];
  const [selectedRange, setSelectedRange] = useState("all"); // Default to 'all'

  const schemeID = route.parmas?.schemeID;
  const { t } = useTranslation();
  const scrollRef = useRef(null);
  const dispatch = useDispatch();
  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  )
   
  const userData = useSelector(state => state.appusersdata.userData)

  const secondaryThemeColor = useSelector(
    (state) => state.apptheme.secondaryThemeColor
  )
   
  const userId = useSelector((state) => state.appusersdata.id);

  const selectedGift = useSelector((state) => state.dreamgift?.selectedGift);
  const navigatingFromDreamGift = useSelector(
    (state) => state.dreamgift?.navigatingFromDreamGift
  );

  console.log("sekecdmmdmkmdd", selectedGift);

  let tempPoints = 0;
  const [
    fetchGiftCatalogue,
    { data: giftCatalogueData, error: giftCatalogueError },
  ] = useFetchGiftCatalogueforRedeemGiftMutation();

  const [
    userPointFunc,
    {
      data: userPointData,
      error: userPointError,
      isLoading: userPointIsLoading,
      isError: userPointIsError,
    },
  ] = useFetchUserPointsMutation();

  useEffect(() => {
    const getData = async () => {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        console.log(
          "Credentials successfully loaded for user " + credentials.username
        );
        const token = credentials.username;
        const params = { userId: userId, token: token };
        userPointFunc(params);

        fetchGiftCatalogue({
          token: token,
          type: 1,
          limit: 1000,
          offset: 0,
        });
      }
    };
    getData();
    setCart(null);

    //for dream gift
   
  }, []);

  useEffect(() => {
    if (giftCatalogueData && selectedGift) {
      const index = giftCatalogueData.body.findIndex(
        (item) => item.gift_id === selectedGift.gift_id
      );
      if (index !== -1) setScrollToID(index);
    }
    // setSearch(selectedGift?.gift_name)
    // handleSearch()
  }, [giftCatalogueData, selectedGift]);

  // useEffect(()=>{
  //   if(giftCatalogueData)
  //     {
  //       for(var i=0;i<giftCatalogueData.body.length;i++)
  //         {
  //           if(selectedGift.gift_id == giftCatalogueData.body[i].gift_id)
  //             {
  //               setScrollToID(i);
  //             }
  //         }
  //     }

  // },[giftCatalogueData])

  useEffect(() => {
    if (giftCatalogueData) {
      console.log("giftCatalogueData", JSON.stringify(giftCatalogueData));

      const reconstructedData = transformData(giftCatalogueData.body);
      console.log("reconstructedData", JSON.stringify(reconstructedData));
      setRange(Object.keys(reconstructedData))
      setDisplayContent(reconstructedData);
    } else if (giftCatalogueError) {
      console.log("giftCatalogueError", giftCatalogueError);
    }
  }, [giftCatalogueData, giftCatalogueError]);

  // Effect for filtering the display content based on selected range
  // useEffect(() => {
  //   if (giftCatalogueData) {
  //     const filteredData = filterDataByRange(giftCatalogueData, selectedRange);
  //     setDisplayContent(filteredData);
  //   }
  // }, [selectedRange, giftCatalogueData]);

  useEffect(() => {
    if (userPointData) {
      console.log("userPointData", userPointData);
      if (userPointData.success) {
        setPointBalance(userPointData.body.point_balance);
      }
    } else if (userPointError) {
      console.log("userPointError", userPointError);
    }
  }, [userPointData, userPointError]);

  // useEffect(()=>{
  //   const scrolltoItemFunc = () =>{
  //     console.log("scrollID", scrollToID)
  //     scrollRef.current?.scrollToIndex({index:scrollToID,animated:true,})
  //   }

  //   scrolltoItemFunc()

  // },[navigatingFromDreamGift,scrollToID])

  useEffect(() => {
    if (navigatingFromDreamGift && scrollToID !== null) {
      scrollRef.current?.scrollToIndex({ index: scrollToID, animated: true });
    }
  }, [navigatingFromDreamGift, scrollToID]);

  useEffect(() => {
    console.log("cart ready to go", cart);
  }, [cart]);

  // Filtering function
  const filterDataByRange = (data, selectedRange) => {
    console.log("Selected Range:", selectedRange);

    if (!selectedRange || selectedRange === "all" || selectedRange === "All") {
      return { ...data, body: data.body }; // Return all data if "All" is selected
    }

    // Split the range string and parse min and max values directly
    const [min, max] = selectedRange.split(" - ").map(Number);
    console.log("Parsed Range:", { min, max });

    // Filter data based on points within the selected range
    const filteredBody = data.body.filter(
      (item) => item.points >= min && item.points <= max
    );

    console.log("Filtered Data:", filteredBody); // Log the filtered result

    return { ...data, body: filteredBody }; // Return the filtered data
  };

  const handleScrollToIndexFailed = (info) => {
    setTimeout(() => {
      scrollRef.current?.scrollToIndex({ index: info.index, animated: true });
    }, 100); // Adjust delay if needed
    console.log("Failed to scroll to index:", info);
  };

  const roundToTenThousand = (num) => Math.round(num / 10000) * 10000;

  const getDistinctCategories = (data) => {
    let allCategories = [];

    for (var i = 0; i < data.length; i++) {
      allCategories.push(giftCatalogueData.body[i].category);
    }
    const set = new Set(allCategories);
    const arr = Array.from(set);
    setDistinctCategories(arr);
  };

  const modalClose = () => {
    setError(false);
    setSuccess(false);
  };


  


  const transformData = (data) => {
    console.log("transformed data", data);
    // Create an empty object to hold the transformed data
    const transformed = {};

    // Iterate through each item in the data array
    data.forEach((item) => {
      // Extract the points from the item
      const { points } = item;

      // Initialize an array for the points key if it doesn't exist
      if (!transformed[points]) {
        transformed[points] = [];
      }

      // Add the current item to the array for the corresponding points
      transformed[points].push(item);
    });
    console.log("transforming data", JSON.stringify(transformed));

    return transformed;
  };
  console.log("sahdhghjasjdjabs", ternaryThemeColor);
 
 

  const Categories = (props) => {
    const image = props.image;
    const data = props.data;
    return (
      <TouchableOpacity
        onPress={() => {
          const filteredData = giftCatalogueData.body.filter((item, index) => {
            return item.category == data;
          });
          // setDisplayContent(filteredData);
          setCart(null);
        }}
        style={{
          marginLeft: 30,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            height: 40,
            width: 40,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 35,
            marginLeft: 0,
            backgroundColor: secondaryThemeColor,
          }}
        >
          <Image
            style={{ height: 30, width: 30, resizeMode: "contain" }}
            source={image}
          ></Image>
        </View>
        <PoppinsTextMedium
          style={{
            color: "black",
            fontSize: 14,
            fontWeight: "600",
            marginTop: 2,
          }}
          content={data}
        ></PoppinsTextMedium>
      </TouchableOpacity>
    );
  };
  const addItemToCart = (data, operation, count) => {
    let tempCount = 0;
    let temp = cart;
    console.log("data", data);
    if (cart.length <= 1) {
      if (operation === "plus") {
        temp.push(data);
        setCart(temp);
      } else {
        // setPointBalance(pointBalance+Number(data.points))
        const tempcart = [...cart];
        console.log("Deleted the data from cart", tempcart);
        for (var i = 0; i < tempcart.length; i++) {
          if (tempcart[i].id === data.id) {
            tempCount++;
            if (tempCount === 1) {
              tempcart.splice(i, 1);
            }
          }
        }
        console.log("tempCart11", tempcart);

        setCart(tempcart);
      }
    } else {
      alert("You can redeem one gift at a time");
    }

    console.log("cart issahdashdghashgd", cart);

    console.log(temp);
  };

  const handleAddToCart = (gift) => {
    console.log("GiftCart", gift);
    if (cart && cart.id === gift.id) {
      // If the same item is being unchecked, remove it from the cart
      setCart(null);
    } else {
      // Otherwise, add the new item to the cart
      setCart(gift);
    }
  };

  function onContinueClick() {
    if (cart !== null) {
      if (cart.value < pointBalance * 0.9) {
        navigation.replace("CartList", {
          cart: [cart],
          schemeType: schemeType,
          schemeID: schemeID,
        });
      } else {
        setError(true);
        setMessage(
          "Not Enough Points for redemption after factoring TDS . You can redeem Max. 90% of your total Balance"
        );
      }
    } else setError(true), setMessage("Cart cannot be empty");
  }

  const RewardsBox = (props) => {
    const [count, setCount] = useState(0);
    const [checked, setChecked] = useState(props.selected);
    const image = props.image;
    const points = props.points;
    const index = props.ind;
    const selected = props.selected;
    const product = props.product;
    const brand = props.brand;
    const category = props.category;
    const data = props.data;
    console.log("asdhjghwwhjqncvmnnmasc", data);

    useEffect(() => {
      console.log("selecteddddd", selected);
      setChecked(selected);
    }, [selected]);

    const handlePress = () => {
      setChecked(!checked);
      props.handleSelect(data);
    };

    const changeCounter = (operation) => {
      console.log(pointBalance, "tempPoints", tempPoints, data.points);
      if (operation === "plus") {
        console.log(Number(pointBalance), Number(data.points));
        if (tempPoints + Number(data.points) <= pointBalance) {
          if (Number(pointBalance) >= Number(data.points)) {
            if (count == 0 && cart.length == 0) {
              tempPoints = tempPoints + data.points;
              let temp = count;
              temp++;
              setCount(temp);
              props.handleOperation(data, operation, temp);
            }
          } else {
            setError(true);
            setMessage("Sorry you don't have enough Points");
          }
        }
        // else{
        //   setError(true)
        //   setMessage("You don't have enough points")
        // }
      } else {
        if (count == 1) {
          let temp = count;
          temp--;
          setCount(temp);
          props.handleOperation(data, operation, temp);
          tempPoints = tempPoints - data.points;
        }

        // setPointBalance(pointBalance+data.points)
      }
    };

    

    // console.log("display content", displayContent);

    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          backgroundColor: "#fff",
          marginTop: 20,
        }}
      >
        {theme == "1" ? (
          <TouchableOpacity
            onPress={() => {
              console.log("Pressed");
            }}
            style={{
              height: 120,
              width: "90%",
              alignItems: "center",
              justifyContent: "flex-start",
              borderWidth: 0.6,
              borderColor: "#EEEEEE",
              backgroundColor: "#FFFFFF",
              margin: 10,
              marginLeft: 20,
              elevation: 8,
            }}
          >
            <View
              style={{
                height: "40%",
                width: "100%",
                backgroundColor: secondaryThemeColor,
                alignItems: "center",
                justifyContent: "flex-start",
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  height: 50,
                  width: 50,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 0.4,
                  borderColor: "#DDDDDD",
                  backgroundColor: "white",
                  marginLeft: 20,
                  top: 14,
                }}
              >
                <Image
                  style={{ height: 40, width: 40, resizeMode: "contain" }}
                  source={{ uri: image }}
                ></Image>
              </View>
              <LinearGradient
                style={{
                  height: 30,
                  padding: 4,
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                  borderRadius: 4,
                  position: "absolute",
                  right: 80,
                }}
                colors={["#FF9100", "#E4C52B"]}
              >
                <Image
                  style={{ height: 20, width: 20, resizeMode: "contain" }}
                  source={require("../../../assets/images/coin.png")}
                ></Image>
                <PoppinsTextMedium
                  style={{
                    fontSize: 12,
                    color: "white",
                    fontWeight: "700",
                    marginLeft: 10,
                  }}
                  content={`Points : ${points}`}
                ></PoppinsTextMedium>
              </LinearGradient>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                  position: "absolute",
                  right: 10,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    if (count > 0) {
                      changeCounter("minus");
                    }
                  }}
                >
                  <Minus name="minus" color="black" size={24}></Minus>
                </TouchableOpacity>

                <View
                  style={{
                    height: 24,
                    width: 20,
                    backgroundColor: "white",

                    borderRadius: 4,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PoppinsTextMedium
                    style={{ color: "black", fontSize: 14, fontWeight: "700" }}
                    content={count}
                  ></PoppinsTextMedium>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    changeCounter("plus");
                  }}
                >
                  <Plus name="plus" color="black" size={20}></Plus>
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                height: "60%",
                alignItems: "flex-start",
                justifyContent: "center",
                marginTop: 4,
                width: "90%",
              }}
            >
              <PoppinsTextMedium
                style={{
                  color: "black",
                  fontSize: 13,
                  width: "90%",
                  marginLeft: 4,
                }}
                content={product}
              ></PoppinsTextMedium>

              <PoppinsTextMedium
                style={{ color: "#919191", fontSize: 13, width: "90%" }}
                content={category}
              ></PoppinsTextMedium>
            </View>
          </TouchableOpacity>
        ) : (
          <View
            style={{
              width: "80%",
              height: 240,
              borderRadius: 20,
              borderWidth: 2,
              borderColor: "#DDDDDD",
              alignItems: "center",
              justifyContent: "flex-start",
              padding: 10,
            }}
          >
            {checked && (
              <TouchableOpacity
                onPress={() => {}}
                style={{
                  zIndex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  // backgroundColor:ternaryThemeColor,
                  position: "absolute",
                  right: 8,
                  top: 8,
                }}
              >
                <CheckIcon
                  name="checkcircle"
                  color="#6eef6c"
                  size={24}
                ></CheckIcon>
              </TouchableOpacity>
            )}

            <View
              style={{
                alignItems: "center",
                justifyContent: "flex-start",
                width: "100%",
                height: "80%",
                marginBottom: 4,
              }}
            >
              <Image
                style={{
                  height: "64%",
                  width: "100%",
                  resizeMode: "contain",
                  zIndex: 0,
                }}
                source={{ uri: image }}
              ></Image>
              <View
                style={{
                  height: "26%",
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                <PoppinsTextMedium
                  style={{
                    color: "#494949",
                    fontSize: 11,
                    fontWeight: "700",
                    textAlign: "center",
                    marginTop: 4,
                  }}
                  content={product}
                ></PoppinsTextMedium>
                <PoppinsTextMedium
                  style={{
                    color: ternaryThemeColor,
                    fontSize: 11,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                  content={`Brand : ${data.brand}`}
                ></PoppinsTextMedium>
                {/* <View style={{ flexDirection: "row" }}>
                  <PoppinsTextMedium
                    style={{
                      color: ternaryThemeColor,
                      fontSize: 14,
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                    content={`Points   : ${data.points}`}
                  ></PoppinsTextMedium>
                  <Image
                    style={{
                      height: 13,
                      width: 13,
                      marginTop: 3,
                      marginLeft: 4,
                    }}
                    source={require("../../../assets/images/dixyCoin.png")}
                  ></Image> 
                </View> */}

                {/* <PoppinsTextMedium
                  style={{ color: '#494949', fontSize: 12, fontWeight: "bold", textAlign: 'center' }}
                  content={`Value : ${data.value}`}
                ></PoppinsTextMedium> */}
              </View>
            </View>

            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                height: "20%",
                width: "100%",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  handlePress();
                }}
                style={{
                  height: 40,
                  width: "80%",
                  backgroundColor: "black",
                  borderRadius: 20,
                  marginTop: 10,
                  marginBottom: 10,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <PoppinsTextMedium
                  content="ADD"
                  style={{ color: "white", fontSize: 16, fontWeight: "700" }}
                ></PoppinsTextMedium>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };


  const handleSearch = (data) => {
    if (theme == "2") {
      const searchOutput = giftCatalogueData.body.filter((item, index) => {
        return item.name.toLowerCase().includes(data.toLowerCase());
      });
      let newOuptut= {
        body: searchOutput
      }
      console.log("search Output is", searchOutput)
      setDisplayContent(newOuptut);
    } else {
      // const searchOutput = giftCatalogueData.body.filter((item, index) => {
      //   return item.name.toLowerCase().includes(data.toLowerCase());
      // });
      // const tempData = transformData(searchOutput)
      // console.log("Search Items",tempData)
      // setDisplayContent(tempData)
      const lowercasedQuery = data.toLowerCase();

      // Filter the giftCatalogueData based on the name
      const searchOutput = giftCatalogueData.body.filter((item) =>
        item.name.toLowerCase().includes(lowercasedQuery)
      );

      // Transform the filtered data (group by points or price range)
      const tempData = transformData(searchOutput);

      console.log("Search Results:", tempData);

      // Update the display content with the transformed search output
      setDisplayContent(tempData);
    }
  };

  
  const getRangeData=(data)=>{
    console.log("range data", data,displayContent)
    const obj = {}
    obj[data] = transformData(giftCatalogueData.body)[data]
    console.log("filtered object in getRange data", obj)
    setDisplayContent(obj)
  }
  

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "flex-start",
        width: "100%",
        backgroundColor: secondaryThemeColor,
        height: "100%",
      }}
    >
      {error && (
        <ErrorModal
          modalClose={modalClose}
          message={message}
          openModal={error}
        ></ErrorModal>
      )}
      {success && (
        <MessageModal
          modalClose={modalClose}
          message={message}
          openModal={success}
        ></MessageModal>
      )}
      <View
        style={{
          alignItems: "center",
          justifyContent: "flex-start",
          flexDirection: "row",
          width: "100%",
          marginTop: 10,
          height: "10%",
          marginLeft: 20,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Image
            style={{
              height: 24,
              width: 24,
              resizeMode: "contain",
              marginLeft: 10,
            }}
            source={require("../../../assets/images/blackBack.png")}
          ></Image>
        </TouchableOpacity>
        <View style={{}}>
          <PoppinsTextMedium
            content={t("Rewards")}
            style={{
              marginLeft: 10,
              fontSize: 16,
              position: "absolute",
              left: 0,
              top: -13,
              fontWeight: "700",
              color: "black",
            }}
          ></PoppinsTextMedium>

          <PoppinsTextMedium
            content={`${Math.floor(
              Number(pointBalance)
            )} ${t("pts Available ")}  `}
            style={{
              marginLeft: 10,
              position: "absolute",
              left: 0,
              top: 10,
              fontSize: 13,
              fontWeight: "300",
              color: "black",
            }}
          ></PoppinsTextMedium>
        </View>
      </View>
      <View
        style={{
          height: "90%",
          width: "100%",
          // borderTopRightRadius: 40,
          // borderTopLeftRadius: 40,
          alignItems: "center",
          justifyContent: "flexx-start",
          backgroundColor: "white",
        }}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            backgroundColor: "#EFF6FC",
            width: "100%",
            borderTopRightRadius: 40,
            borderTopLeftRadius: 40,
            paddingBottom: 20,
          }}
        >
          {giftCatalogueData && (
            <View
              style={{
                width: "100%",
                alignItems: "center",
                justifyContent: "flex-start",
                flexDirection: "row",
                marginTop: 20,
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                  height: 40,
                  width: "60%",
                  backgroundColor: "white",
                  borderRadius: 20,
                  marginLeft: 20,
                }}
              >
                <Icon
                  style={{ position: "absolute", left: 10 }}
                  name="magnifying-glass"
                  size={30}
                  color={ternaryThemeColor}
                ></Icon>
                <TextInput
                  style={{ marginLeft: 20, width: "70%", color: "black" }}
                  placeholder="Type Product Name"
                  value={search}
                  onChangeText={(text) => {
                    handleSearch(text);
                  }}
                ></TextInput>
              </View>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: 20,
                  bottom: 4,
                }}
              >
                <PoppinsTextMedium
                  content={t("Filter By Points")}
                  style={{
                    fontSize: 11,
                    fontWeight: "700",
                    color: "black",
                  }}
                ></PoppinsTextMedium>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#EEEEEE",
                    height: 34,
                    width: 100,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: "#00000029",
                    flexDirection: "row",
                  }}
                  onPress={() => {
                    setShowCategoriesOptions(!showCategoriesOption);
                  }}
                >
                  <PoppinsTextMedium
                    content={`${t(initailRange)}`}
                    style={{
                      fontSize: 11,
                      fontWeight: "600",
                      color: "black",
                    }}
                  ></PoppinsTextMedium>
                </TouchableOpacity>
                {showCategoriesOption && (
                  <View
                    style={{ alignItems: "center", justifyContent: "center",marginTop:8 }}
                  >
                    {range.map((item, index) => {
                      return (
                        <TouchableOpacity
                          onPress={()=>{
                            setShowCategoriesOptions(false)
                            getRangeData(item)
                          }}
                          style={{
                            alignItems: "center",
                            justifyContent: "center",
                            height:30,width:80, backgroundColor:'#EEEEEE',
                            borderBottomWidth:1,
                            borderColor:'#00000029'
                            
                          }}
                        >
                          <PoppinsTextMedium
                            content={`${t(item)}`}
                            style={{
                              fontSize: 11,
                              fontWeight: "600",
                              color: "black",
                            }}
                          ></PoppinsTextMedium>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>
              {/* <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: 10,
                }}
              >
                <Image
                  style={{ height: 26, width: 26, resizeMode: "contain" }}
                  source={require("../../../assets/images/settings.png")}
                ></Image>
              </View> */}
            </View>
          )}
        </View>

        {theme == "1" && (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              flexDirection: "row",
              marginTop: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setDisplayContent(giftCatalogueData.body);
                setCart(null);
              }}
              style={{
                height: 70,
                width: 70,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                style={{ height: 40, width: 40, resizeMode: "contain" }}
                source={require("../../../assets/images/categories.png")}
              ></Image>
              <PoppinsTextMedium
                style={{
                  color: "black",
                  fontSize: 14,
                  fontWeight: "600",
                  marginTop: 2,
                }}
                content="All"
              ></PoppinsTextMedium>
            </TouchableOpacity>
            <ScrollView
              showsHorizontalScrollIndicator={false}
              horizontal={true}
            >
              {distinctCategories &&
                distinctCategories.map((item, index) => {
                  return (
                    <Categories
                      key={index}
                      data={item}
                      image={require("../../../assets/images/box.png")}
                    ></Categories>
                  );
                })}
            </ScrollView>
          </View>
        )}
        <View
          style={{
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: theme == "1" ? 300 : 0,
          }}
        >
          {theme == "1" && (
            <PoppinsTextMedium
              style={{
                color: "#171717",
                fontSize: 14,
                fontWeight: "700",
                marginTop: 10,
                marginBottom: 10,
              }}
              content={t("Rewards")}
            ></PoppinsTextMedium>
          )}

          {theme !== "1" && displayContent && (
            <View style={{ width: "100%", marginTop: 0 }}>
              <View
                style={{
                  // opacity: 0.8,
                  alignItems: "center",
                  justifyContent: "center",
                  // borderWidth: 1,
                  // borderColor: ternaryThemeColor,
                  // backgroundColor: "#FFF5EC",
                  width: "90%",
                  alignSelf: "center",

                  // padding: 6,
                }}
              ></View>

              {displayContent && (
                <FlatList
                  data={Object.keys(displayContent)}
                  style={{ width: "100%" }}
                  contentContainerStyle={{ width: "100%", paddingBottom: 200 }}
                  renderItem={({ item, index }) => {
                    console.log("pointasdasdqweqw", displayContent);
                    return (
                      <View key={index} style={styles.categoryContainer}>
                        <View
                          style={{
                            opacity: 1,
                            alignItems: "center",
                            justifyContent: "center",
                            borderWidth: 1,
                            borderColor: "black",
                            borderRadius: 10,
                            backgroundColor: ((userData?.user_type).toLowerCase() == "carpenter" || (userData?.user_type).toLowerCase() == "oem" || (userData?.user_type).toLowerCase() == "directoem" || (userData?.user_type).toLowerCase() == "contractor")  ? "#00A79D" : "#B6202D",
                            width: "94%",
                            padding: 6,
                            marginBottom: 20,
                          }}
                        >
                          <Text style={styles.header}> {"Points "+ item}</Text>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                            alignItems: "flex-start", // Align items at the start of each row
                            justifyContent: "center", // Distribute space evenly between items
                            width: "100%",
                          }}
                        >
                          {displayContent[item].map((gift, index) => {
                            console.log("gift displayed", gift);
                            return (
                              <View
                                style={{
                                  alignItems: "center",
                                  justifyContent: "center",
                                  width: "50%",
                                }}
                              >
                                <RewardsBox
                                  ind={index}
                                  product={gift.name}
                                  category={gift.catalogue_name}
                                  points={gift.points}
                                  image={gift.images[0]}
                                  key={gift.id}
                                  data={gift}
                                  handleSelect={handleAddToCart}
                                  selected={cart && cart.id === gift.id}
                                />
                              </View>
                            );
                          })}
                        </View>
                      </View>
                    );
                  }}
                  keyExtractor={(item) => item.id}
                />
              )}
              {cart && (
                <TouchableOpacity
                  onPress={onContinueClick}
                  style={{
                    alignItems: "center",
                    borderRadius: 10,
                    justifyContent: "center",
                    height: 50,
                    width: "80%",
                    position: "absolute",
                    bottom: 100,
                    left: 50,
                    backgroundColor: "black",
                  }}
                >
                  <PoppinsTextMedium
                    style={{
                      color: "white",
                      fontSize: 18,
                      fontWeight: "700",
                    }}
                    content={t("Process")}
                  />
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "green",
  },
  categoryContainer: {
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
    backgroundColor: "red",
  },
});

export default RedeemGifts;
