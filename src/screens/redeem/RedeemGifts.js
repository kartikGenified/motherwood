import React, { useEffect, useRef, useState } from "react";
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
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import { useDispatch, useSelector } from "react-redux";
import Icon from "react-native-vector-icons/Entypo";
import Plus from "react-native-vector-icons/Entypo";
import { theme } from "../../utils/HandleClientSetup";
import Minus from "react-native-vector-icons/Entypo";
import LinearGradient from "react-native-linear-gradient";
import { useFetchGiftCatalogueforRedeemGiftMutation } from "../../apiServices/gifts/GiftApi";
import { useFetchUserPointsMutation } from "../../apiServices/workflow/rewards/GetPointsApi";
import * as Keychain from "react-native-keychain";
import ErrorModal from "../../components/modals/ErrorModal";
import MessageModal from "../../components/modals/MessageModal";
import { useTranslation } from "react-i18next";
import CheckIcon from "react-native-vector-icons/AntDesign";
import SocialBottomBar from "../../components/socialBar/SocialBottomBar";

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

  // console.log("selectedGift", selectedGift);

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
        // console.log("Credentials successfully loaded for user " + credentials.username);
        const token = credentials.username;
        const params = { userId: userId, token: token };
        userPointFunc(params);

        fetchGiftCatalogue({
          token: token,
          type: "2",
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
      // console.log("giftCatalogueData", JSON.stringify(giftCatalogueData));

      const reconstructedData = transformData(giftCatalogueData.body);
      // console.log("reconstructedData", JSON.stringify(reconstructedData));
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
      // console.log("userPointData", userPointData);
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

  // useEffect(() => {
  //   console.log("cart ready to go", cart);
  // }, [cart]);

  // Filtering function
  const filterDataByRange = (data, selectedRange) => {
    // console.log("Selected Range:", selectedRange);

    if (!selectedRange || selectedRange === "all" || selectedRange === "All") {
      return { ...data, body: data.body }; // Return all data if "All" is selected
    }

    // Split the range string and parse min and max values directly
    const [min, max] = selectedRange.split(" - ").map(Number);
    // console.log("Parsed Range:", { min, max });

    // Filter data based on points within the selected range
    const filteredBody = data.body.filter(
      (item) => item.points >= min && item.points <= max
    );

    // console.log("Filtered Data:", filteredBody); // Log the filtered result

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
    // console.log("transformed data", data);
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
    // console.log("transforming data", JSON.stringify(transformed));

    return transformed;
  };
  // console.log("ternaryThemeColor", ternaryThemeColor);
 
 

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
        style={styles.categoryItem}
      >
        <View
          style={[styles.categoryItemIcon, { backgroundColor: secondaryThemeColor }]}
        >
          <Image
            style={styles.categoryItemImage}
            source={image}
          />
        </View>
        <PoppinsTextMedium
          style={styles.categoryText}
          content={data}
        />
      </TouchableOpacity>
    );
  };
  const addItemToCart = (data, operation, count) => {
    let tempCount = 0;
    let temp = cart;
    // console.log("data", data);
    if (cart.length <= 1) {
      if (operation === "plus") {
        temp.push(data);
        setCart(temp);
      } else {
        // setPointBalance(pointBalance+Number(data.points))
        const tempcart = [...cart];
        // console.log("Deleted the data from cart", tempcart);
        for (var i = 0; i < tempcart.length; i++) {
          if (tempcart[i].id === data.id) {
            tempCount++;
            if (tempCount === 1) {
              tempcart.splice(i, 1);
            }
          }
        }
        // console.log("tempCart after deletion", tempcart);

        setCart(tempcart);
      }
    } else {
      alert("You can redeem one gift at a time");
    }

    // console.log("cart updated", cart);
  };

  const handleAddToCart = (gift) => {
    // console.log("GiftCart", gift);
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
      // console.log("selected state", selected);
      setChecked(selected);
    }, [selected]);

    const handlePress = () => {
      setChecked(!checked);
      props.handleSelect(data);
    };

    const changeCounter = (operation) => {
      // console.log(pointBalance, "tempPoints", tempPoints, data.points);
      if (operation === "plus") {
        // console.log(Number(pointBalance), Number(data.points));
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
      <View style={styles.rewardBox}>
        {theme == "1" ? (
          <TouchableOpacity
            onPress={() => {
              // console.log("Pressed");
            }}
            style={styles.rewardBoxTheme1}
          >
            <View
              style={[styles.theme1Header, { backgroundColor: secondaryThemeColor }]}
            >
              <View style={styles.theme1ImageContainer}>
                <Image
                  style={styles.theme1Image}
                  source={{ uri: image }}
                />
              </View>
              <LinearGradient
                style={styles.theme1PointsBadge}
                colors={["#FF9100", "#E4C52B"]}
              >
                <Image
                  style={styles.theme1CoinIcon}
                  source={require("../../../assets/images/coin.png")}
                />
                <PoppinsTextMedium
                  style={styles.theme1PointsText}
                  content={`Points : ${points}`}
                />
              </LinearGradient>
              <View style={styles.theme1Controls}>
                <TouchableOpacity
                  onPress={() => {
                    if (count > 0) {
                      changeCounter("minus");
                    }
                  }}
                >
                  <Minus name="minus" color="black" size={24} />
                </TouchableOpacity>

                <View style={styles.theme1Counter}>
                  <PoppinsTextMedium
                    style={styles.theme1CounterText}
                    content={count}
                  />
                </View>
                <TouchableOpacity
                  onPress={() => {
                    changeCounter("plus");
                  }}
                >
                  <Plus name="plus" color="black" size={20} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.theme1Details}>
              <PoppinsTextMedium
                style={styles.theme1ProductName}
                content={product}
              />

              <PoppinsTextMedium
                style={styles.theme1Category}
                content={category}
              />
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.rewardBoxTheme2}>
            {checked && (
              <TouchableOpacity
                onPress={() => {}}
                style={styles.checkIcon}
              >
                <CheckIcon
                  name="checkcircle"
                  color="#6eef6c"
                  size={24}
                />
              </TouchableOpacity>
            )}

            <View style={styles.rewardImageContainer}>
              <Image
                style={styles.rewardImage}
                source={{ uri: image }}
              />
              <View style={styles.rewardDetailsContainer}>
                <PoppinsTextMedium
                  style={styles.productName}
                  content={product}
                />
                <PoppinsTextMedium
                  style={[styles.brandName, { color: ternaryThemeColor }]}
                  content={`Brand : ${data.brand}`}
                />
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

            <View style={styles.addButtonContainer}>
              <TouchableOpacity
                onPress={() => {
                  handlePress();
                }}
                style={styles.addButton}
              >
                <PoppinsTextMedium
                  content="ADD"
                  style={styles.addButtonText}
                />
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
      // console.log("search Output is", searchOutput)
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

      // console.log("Search Results:", tempData);

      // Update the display content with the transformed search output
      setDisplayContent(tempData);
    }
  };

  
  const getRangeData=(data)=>{
    // console.log("range data", data, displayContent)
    const obj = {}
    obj[data] = transformData(giftCatalogueData.body)[data]
    // console.log("filtered object in getRange data", obj)
    setDisplayContent(obj)
  }
  

  return (
    <View
      style={[styles.mainContainer, { backgroundColor: secondaryThemeColor }]}
    >
      {/* <ScrollView 
      contentContainerStyle={{alignItems: "center",
      justifyContent: "flex-start",}}
       style={{
        width: "100%",
        backgroundColor: secondaryThemeColor,}}> */}
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
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Image
            style={styles.backButton}
            source={require("../../../assets/images/blackBack.png")}
          />
        </TouchableOpacity>
        <View>
          <PoppinsTextMedium
            content={t("Rewards")}
            style={styles.headerTitle}
          />
        </View>
        <View style={styles.walletContainer}>
          <PoppinsTextMedium
            content={"Your Wallet Points"}
            style={styles.walletTitle}
          />
          <View style={styles.walletPointsRow}>
            <Image style={styles.coinIcon} source={require('../../../assets/images/coin.png')} />
            <PoppinsTextMedium
              content={`${Math.floor(Number(pointBalance))} `}
              style={styles.walletPoints}
            />
          </View>
        </View>
        
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.searchFilterContainer}>
          {giftCatalogueData && (
            <View style={styles.searchRow}>
              <View style={styles.searchContainer}>
                <Icon
                  style={styles.searchIcon}
                  name="magnifying-glass"
                  size={30}
                  color={ternaryThemeColor}
                />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Type Product Name"
                  value={search}
                  onChangeText={(text) => {
                    handleSearch(text);
                  }}
                />
              </View>
              <View style={styles.filterContainer}>
                <PoppinsTextMedium
                  content={t("Filter By Points")}
                  style={styles.filterLabel}
                />
                <TouchableOpacity
                  style={styles.filterButton}
                  onPress={() => {
                    setShowCategoriesOptions(!showCategoriesOption);
                  }}
                >
                  <PoppinsTextMedium
                    content={`${t(initailRange)}`}
                    style={styles.filterButtonText}
                  />
                </TouchableOpacity>
                {showCategoriesOption && (
                  <View style={styles.filterDropdown}>
                    {range.map((item, index) => {
                      return (
                        <TouchableOpacity
                          key={index}
                          onPress={()=>{
                            setShowCategoriesOptions(false)
                            getRangeData(item)
                          }}
                          style={styles.filterDropdownItem}
                        >
                          <PoppinsTextMedium
                            content={`${t(item)}`}
                            style={styles.filterButtonText}
                          />
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
          <View style={styles.categoriesContainer}>
            <TouchableOpacity
              onPress={() => {
                setDisplayContent(giftCatalogueData.body);
                setCart(null);
              }}
              style={styles.categoryButton}
            >
              <Image
                style={styles.categoryIcon}
                source={require("../../../assets/images/categories.png")}
              />
              <PoppinsTextMedium
                style={styles.categoryText}
                content="All"
              />
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
                    />
                  );
                })}
            </ScrollView>
          </View>
        )}
        <View style={[styles.rewardsContainer, { paddingBottom: theme == "1" ? 300 : 0 }]}>
          {theme == "1" && (
            <PoppinsTextMedium
              style={styles.rewardsTitle}
              content={t("Rewards")}
            />
          )}

          {theme !== "1" && displayContent && (
            <View style={styles.flatListContainer}>

              {displayContent && (
                <FlatList
                  data={Object.keys(displayContent)}
                  style={{ width: "100%",height:'90%'}}
                  contentContainerStyle={{ width: "100%", paddingBottom:0 }}
                  renderItem={({ item, index }) => {
                    // console.log("displayContent points", displayContent);
                    return (
                      <View key={index} style={styles.categoryContainer}>
                        <View
                          style={[
                            styles.categoryHeader,
                            {
                              backgroundColor: ((userData?.user_type).toLowerCase() == "carpenter" || (userData?.user_type).toLowerCase() == "oem" || (userData?.user_type).toLowerCase() == "directoem" || (userData?.user_type).toLowerCase() == "contractor")  ? "#00A79D" : "#B6202D",
                            }
                          ]}
                        >
                          <Text style={styles.header}> {"Points "+ item}</Text>
                        </View>
                        <View style={styles.giftsRow}>
                          {displayContent[item].map((gift, index) => {
                            // console.log("gift displayed", gift);
                            return (
                              <View
                                key={gift.id}
                                style={styles.giftItemContainer}
                              >
                                <RewardsBox
                                  ind={index}
                                  product={gift.name}
                                  category={gift.catalogue_name}
                                  points={gift.points}
                                  image={gift.images[0]}
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
              
            </View>
          )}
        </View>
      </View>
      {cart && (
                <View style={styles.processButtonContainer}>
                <TouchableOpacity
                  onPress={onContinueClick}
                  style={styles.processButton}
                >
                  <PoppinsTextMedium
                    style={styles.processButtonText}
                    content={t("Process")}
                  />
                </TouchableOpacity>
                </View>
              )}
      <SocialBottomBar showRelative={true}></SocialBottomBar>
      {/* </ScrollView> */}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    height: "100%",
  },
  headerContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    width: "100%",
    marginTop: 10,
    height: "10%",
    marginLeft: 20,
  },
  backButton: {
    height: 24,
    width: 24,
    resizeMode: "contain",
    marginLeft: 10,
  },
  headerTitle: {
    marginLeft: 10,
    fontSize: 16,
    position: "absolute",
    left: 0,
    top: -13,
    fontWeight: "700",
    color: "black",
  },
  walletContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: 20,
    top: 20,
  },
  walletTitle: {
    marginLeft: 10,
    fontSize: 13,
    fontWeight: "700",
    color: "black",
  },
  walletPointsRow: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  coinIcon: {
    height: 20,
    width: 20,
    resizeMode: "contain",
  },
  walletPoints: {
    marginLeft: 10,
    fontSize: 17,
    fontWeight: "700",
    color: "black",
  },
  contentContainer: {
    height: "80%",
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  searchFilterContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: "white",
    width: "100%",
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    paddingBottom: 20,
  },
  searchRow: {
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    marginTop: 20,
  },
  searchContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    height: 40,
    width: "60%",
    backgroundColor: "white",
    borderRadius: 20,
    marginLeft: 20,
    borderWidth: 0.4,
    borderColor: "#DDDDDD",
  },
  searchIcon: {
    position: "absolute",
    left: 10,
  },
  searchInput: {
    marginLeft: 20,
    width: "70%",
    color: "black",
  },
  filterContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 20,
    bottom: 4,
  },
  filterLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "black",
  },
  filterButton: {
    backgroundColor: "#EEEEEE",
    height: 34,
    width: 100,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#00000029",
    flexDirection: "row",
  },
  filterButtonText: {
    fontSize: 11,
    fontWeight: "600",
    color: "black",
  },
  filterDropdown: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  filterDropdownItem: {
    alignItems: "center",
    justifyContent: "center",
    height: 30,
    width: 80,
    backgroundColor: "#EEEEEE",
    borderBottomWidth: 1,
    borderColor: "#00000029",
  },
  categoriesContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    flexDirection: "row",
    marginTop: 10,
  },
  categoryButton: {
    height: 70,
    width: 70,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryIcon: {
    height: 40,
    width: 40,
    resizeMode: "contain",
  },
  categoryText: {
    color: "black",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 2,
  },
  categoryItem: {
    marginLeft: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryItemIcon: {
    height: 40,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 35,
    marginLeft: 0,
  },
  categoryItemImage: {
    height: 30,
    width: 30,
    resizeMode: "contain",
  },
  rewardsContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 0,
  },
  rewardsTitle: {
    color: "#171717",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 10,
  },
  flatListContainer: {
    width: "100%",
    marginTop: 0,
  },
  categoryContainer: {
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  categoryHeader: {
    opacity: 1,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    width: "94%",
    padding: 6,
    marginBottom: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  giftsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    justifyContent: "center",
    width: "100%",
  },
  giftItemContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "50%",
  },
  rewardBox: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    backgroundColor: "#fff",
    marginTop: 20,
  },
  rewardBoxTheme1: {
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
  },
  rewardBoxTheme2: {
    width: "80%",
    height: 240,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#DDDDDD",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 10,
  },
  checkIcon: {
    zIndex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: 8,
    top: 8,
  },
  rewardImageContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    height: "80%",
    marginBottom: 4,
  },
  rewardImage: {
    height: "64%",
    width: "100%",
    resizeMode: "contain",
    zIndex: 0,
  },
  rewardDetailsContainer: {
    height: "26%",
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  productName: {
    color: "#494949",
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 4,
  },
  brandName: {
    fontSize: 11,
    fontWeight: "bold",
    textAlign: "center",
  },
  addButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: "20%",
    width: "100%",
  },
  addButton: {
    height: 40,
    width: "80%",
    backgroundColor: "black",
    borderRadius: 20,
    marginTop: 10,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  processButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "10%",
  },
  processButton: {
    alignItems: "center",
    borderRadius: 30,
    justifyContent: "center",
    height: 50,
    width: "60%",
    backgroundColor: "black",
  },
  processButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
  // Theme 1 specific styles
  theme1Header: {
    height: "40%",
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
  },
  theme1ImageContainer: {
    height: 50,
    width: 50,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.4,
    borderColor: "#DDDDDD",
    backgroundColor: "white",
    marginLeft: 20,
    top: 14,
  },
  theme1Image: {
    height: 40,
    width: 40,
    resizeMode: "contain",
  },
  theme1PointsBadge: {
    height: 30,
    padding: 4,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderRadius: 4,
    position: "absolute",
    right: 80,
  },
  theme1CoinIcon: {
    height: 20,
    width: 20,
    resizeMode: "contain",
  },
  theme1PointsText: {
    fontSize: 12,
    color: "white",
    fontWeight: "700",
    marginLeft: 10,
  },
  theme1Controls: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    position: "absolute",
    right: 10,
  },
  theme1Counter: {
    height: 24,
    width: 20,
    backgroundColor: "white",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  theme1CounterText: {
    color: "black",
    fontSize: 14,
    fontWeight: "700",
  },
  theme1Details: {
    height: "60%",
    alignItems: "flex-start",
    justifyContent: "center",
    marginTop: 4,
    width: "90%",
  },
  theme1ProductName: {
    color: "black",
    fontSize: 13,
    width: "90%",
    marginLeft: 4,
  },
  theme1Category: {
    color: "#919191",
    fontSize: 13,
    width: "90%",
  },
});

export default RedeemGifts;
