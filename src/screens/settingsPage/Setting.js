import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import Delete from "react-native-vector-icons/AntDesign";
import Check from 'react-native-vector-icons/Entypo';
import VersionCheck from "react-native-version-check";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedLanguage } from "../../../redux/slices/appLanguageSlice";
import PoppinsTextLeftMedium from "../../components/electrons/customFonts/PoppinsTextLeftMedium";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import DeleteModal from "../../components/modals/DeleteModal";
import SocialBottomBar from "../../components/socialBar/SocialBottomBar";
import { removeCachingLogic } from "../../utils/removeCachingLogic";
import i18n from "../common/i18n";


const languageMap = {
        "Hindi-हिंदी": 'ar',
        "English-English": "en"
      }
const Setting = ({ navigation }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);



  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  );
  const currentVersion = VersionCheck.getCurrentVersion();

  const deleteID = () => {
    setShowDeleteModal(!showDeleteModal);
  };

  const hideModal = () => {
    setShowDeleteModal(false);
  };


  const LanguageBar = () => {
    const [selected, setSelected] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState()
    const {languages, selectedLanguage} = useSelector(state => state.appLanguage)
    console.log("languages inside the application", languages, selectedLanguage)

    useEffect(() => {
      AsyncStorage.getItem('selectedLanguage').then(language => {
        if (language) {
          const index = languages.findIndex(lang => languageMap[lang] === language);
          if (index !== -1) {
            setSelectedIndex(index);
            setSelected(true);
          }
        }
      });
    }, [])

    const dispatch = useDispatch()


    const handleLanguageChange = async(language) => {
      i18n.changeLanguage(languageMap[language] || 'en');
      dispatch(setSelectedLanguage(language))
      await AsyncStorage.setItem('selectedLanguage', languageMap[language] || 'en')
    }

    return (
      <View style={{ width: '90%', margin: 4 }}>
        <PoppinsTextLeftMedium content="Select Language" style={{ color: '#716C6C', fontSize: 14, fontWeight: '700' }}></PoppinsTextLeftMedium>

        <FlatList
          data={languages}
          renderItem={({ item, index }) => {
            return (
              <View key={index} style={{ width: '100%', borderBottomWidth: 0.6, borderColor: 'grey', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginTop: 10, paddingBottom: 10, height: 50 }}>
                <PoppinsTextLeftMedium content={item?.split?.('-')[0]} style={{ color: 'grey', fontSize: 12, position: 'absolute', left: 10 }}></PoppinsTextLeftMedium>
                <TouchableOpacity onPress={() => {
                  setSelected(!selected)
                  setSelectedIndex(index)
                  handleLanguageChange(item)
                }} style={{ alignItems: 'center', justifyContent: 'center', height: 20, width: 20, borderWidth: 1, borderColor: "#B6202D", backgroundColor: selectedIndex == index ? "#B6202D" : "white", position: 'absolute', right: 20 }}>
                  {selectedIndex == index && <Check size={16} color={"white"} name="check"></Check>}
                </TouchableOpacity>
              </View>
            )

          }}
          keyExtractor={item => item.id}
        />

      </View>
    )
  }

  return (
    <View style={{ height: '100%', width: '100%', backgroundColor: '#FFF8E7', alignItems: 'center', justifyContent: 'flex-start' }}>
      <View
        style={{
          alignItems: "center",
          justifyContent: "flex-start",
          flexDirection: "row",
          width: "100%",
          marginTop: 10,
          height: 30,
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
        <PoppinsTextMedium
          content="Settings"
          style={{
            marginLeft: 10,
            fontSize: 16,
            fontWeight: "700",
            color: "black",
          }}
        ></PoppinsTextMedium>

        {showDeleteModal && (
          <DeleteModal
            hideModal={hideModal}
            modalVisible={showDeleteModal}
          ></DeleteModal>
        )}

        <TouchableOpacity
          onPress={() => {
            deleteID();
          }}
          style={{
            height: 30,
            width: 30,
            borderRadius: 15,
            backgroundColor: "white",
            borderWidth: 1,
            borderColor: ternaryThemeColor,
            alignItems: "center",
            justifyContent: "center",
            position: 'absolute',
            right: 30,

          }}
        >
          <Delete
            name="delete"
            size={18}
            color={ternaryThemeColor}
          ></Delete>
        </TouchableOpacity>
      </View>

      <View style={{ alignItems: 'center', justifyContent: 'center', width: '100%', marginTop: 20}}>
        <LanguageBar/>
        <View style={{ width: '90%', alignItems: 'center', justifyContent: 'space-between', height: 50, flexDirection: 'row', marginTop: 10 }}>
          <TouchableOpacity onPress={() => {
            const handleLogout = async () => {
              try {
                await AsyncStorage.removeItem("loginData");
                await AsyncStorage.removeItem("storedBanner");
                await AsyncStorage.removeItem("userMpin");

                navigation.reset({ index: "0", routes: [{ name: "OtpLogin" }] });
              } catch (e) {
                console.log("error deleting loginData", e);
              }
            };
            handleLogout()
            removeCachingLogic()
          }} style={{ height: 40, width: 100, backgroundColor: "#B6202D", borderRadius: 30, alignItems: "center", justifyContent: 'center' }}>
            <PoppinsTextMedium
              content="Log Out"
              style={{
                marginLeft: 10,
                fontSize: 13,
                fontWeight: "700",
                color: "white",
              }}
            ></PoppinsTextMedium>
          </TouchableOpacity>

          <PoppinsTextMedium
            content={`Version : ${currentVersion}`}
            style={{
              color: "black",
              fontSize: 12,
            }}
          ></PoppinsTextMedium>
        </View>

      </View>

      <SocialBottomBar ></SocialBottomBar>
    </View>
  );
}

const styles = StyleSheet.create({})

export default Setting;
