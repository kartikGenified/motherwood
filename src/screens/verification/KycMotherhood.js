import React from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Touchable } from 'react-native';
import { useSelector } from 'react-redux';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import { useTranslation } from 'react-i18next';

const KycMotherhood = ({navigation}) => {

    const { t } = useTranslation();

    const ternaryThemeColor = useSelector(
        (state) => state.apptheme.ternaryThemeColor
      )
        
    
      const secondaryThemeColor = useSelector(
        (state) => state.apptheme.secondaryThemeColor
      );
      const userData = useSelector((state) => state.appusersdata.userData);


      const KycComp=(props)=>{
        const image = props.image
        const title = props.title
        const verified = props.verified

        return(
            <TouchableOpacity style={{borderWidth:1,borderColor:'#DDDDDD',borderRadius:10,height:70,width:'80%',alignItems:'center', justifyContent:'center',flexDirection:'row'}}>
                <View style={{height:60, width:60, borderRadius:30, alignItems:'center', justifyContent:'center'}}>
                <Image
          style={{ height: 38, width:38, resizeMode: "contain" }}
          source={image}
        ></Image> 
                </View>
                <PoppinsTextMedium
            content={t(title)}
            style={{
              marginLeft: 10,
              fontSize: 20,
              fontWeight: "700",
              color: "black",
            }}
          ></PoppinsTextMedium>
          <Image
          style={{ height: 38, width:38, resizeMode: "contain", marginLeft:20 }}
          source={verified ? require('../../../assets/images/verifiedKyc.png') : require('../../../assets/images/notVerifiedKyc.png')}
        ></Image> 
            </TouchableOpacity>
        )
      }

    return (
        <View style={{ width: "100%",  }}>
        <View
          style={{
            alignItems: "center",
            justifyContent: "flex-start",
            flexDirection: "row",
            width: "100%",
            height: 60,
            backgroundColor: secondaryThemeColor
          }}
        >
          <TouchableOpacity
          style={{marginLeft:10}}
            onPress={() => {
              navigation.navigate("Dashboard");
            }}
          >
            <Image
              style={{ height: 24, width: 24, resizeMode: "contain" }}
              source={require("../../../assets/images/blackBack.png")}
            ></Image>
          </TouchableOpacity>
          <PoppinsTextMedium
            content={t("KYC")}
            style={{
              marginLeft: 10,
              fontSize: 18,
              fontWeight: "600",
              color: "black",
            }}
          ></PoppinsTextMedium>
        </View>
        <View style={{alignItems:'center',justifyContent:'center'}}>
        <Image
              style={{ height: 240, width: 240, resizeMode: "contain" }}
              source={require("../../../assets/images/kyclogo.png")}
            ></Image>
             <PoppinsTextMedium
            content={t("Complete Your KYC")}
            style={{
              marginLeft: 10,
              fontSize: 22,
              fontWeight: "800",
              color: "black",
            }}
          ></PoppinsTextMedium>
        </View>
        <KycComp title="Aadhaar KYC"></KycComp>
       
        </View>
    );
}

const styles = StyleSheet.create({})

export default KycMotherhood;
