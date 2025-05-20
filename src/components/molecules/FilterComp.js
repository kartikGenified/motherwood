import React, { useEffect, useRef, useState } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  FlatList
} from "react-native";

const FilterComp = (props) => {
    const categories = props.categories
    const [showOptions, setShowOptions] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("Select Category");
    console.log("categories in filter comp", categories)
    const handleSelect = (category) => {
      setSelectedCategory(category);
      props.setSelected(category)
      setShowOptions(false); // Hide dropdown after selection
    };
  
    return (
      <View style={{ width: "100%", alignItems: "center", marginTop: 30, flexDirection:'row' }}>
        <View style={{alignItems:'center',justifyContent:'center',flexDirection:'row',marginLeft:10}}>
            <Image style={{height:20,width:20}} resizeMode='contain' source={require('../../../assets/images/settings.png')}></Image>
            <Text style={{ fontSize: 16, color: "#2B2B2B", marginLeft:10,fontWeight:'500' }}>Filter By</Text>
        </View>
        {/* Dropdown Button */}
        <View style={{width: 200,position:'absolute',right:10}}>
        <TouchableOpacity
          onPress={() => {
            setShowOptions(!showOptions)
            console.log("categories setShowOptions",categories)
          }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: 200,
            borderWidth: 1,
            borderColor: "#DDDDDD",
            borderRadius: 20,
            padding: 4,
            backgroundColor: "white",
            
          }}
        >
          <Text style={{ fontSize: 16, color: "#2B2B2B" }}>{selectedCategory}</Text>
          <Image
            source={require("../../../assets/images/arrowDown.png")} // Replace with your arrow image
            style={{ width: 12, height: 12 }}
          />
        </TouchableOpacity>
  
        {/* Dropdown List */}
        {showOptions && (
          <View
            style={{
              zIndex:1,
              position: "absolute",
              top: 50,
              width: 200,
              backgroundColor: "white",
              borderWidth: 1,
              borderColor: "#DDDDDD",
              borderRadius: 10,
              padding: 10,
              elevation: 5, // Android shadow
              shadowColor: "#000", // iOS shadow
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
            }}
          >
            <FlatList
              contentContainerStyle={{width:'100%'}}
              data={categories}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (

                <TouchableOpacity style={{width:'100%',margin:2}} onPress={() => handleSelect(item)}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#2B2B2B",
                      
                    }}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
        </View>
      </View>
    );
  };

  export default FilterComp