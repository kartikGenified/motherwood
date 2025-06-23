import React,{useEffect, useState} from 'react';
import {View, StyleSheet,TouchableOpacity,Image} from 'react-native';
import PoppinsTextMedium from '../electrons/customFonts/PoppinsTextMedium';
import { SvgUri } from 'react-native-svg';
import { useIsFocused } from '@react-navigation/native';
import Dashboard from '../../screens/dashboard/Dashboard';
import { useTranslation } from 'react-i18next';
import { useSelector,useDispatch } from 'react-redux';
import { setPrimaryThemeColor, setSecondaryThemeColor, setTernaryThemeColor } from '../../../redux/slices/appThemeSlice';


const SelectUserBox = (props) => {
    const [boxColor, setBoxColor] = useState('white')
    const focused = useIsFocused()
    const {t} = useTranslation()
    const ternaryThemeColor = useSelector(
        state => state.apptheme.ternaryThemeColor,
      )
    const image = props.image
    // const image = 'https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/atom.svg'
    // console.log(image)
    const color = props.color
    const otpLogin = props.otpLogin
    const mobile= props.mobile
    const dispatch = useDispatch()
    // const passwordLogin = props.passwordLogin
    // const autoApproval = props.autoApproval
    const manualApproval = props.manualApproval
    const registrationRequired = props.registrationRequired
    console.log("Select user props",props)

    useEffect(()=>{
        setBoxColor("white")
        if((props.content).toLowerCase() == 'contractor' || (props.content).toLowerCase() == 'carpenter' || (props.content).toLowerCase() == 'oem' || (props.content).toLowerCase() == 'directoem')
      {
        dispatch(setTernaryThemeColor("#F0F8F6"))
        dispatch(setSecondaryThemeColor("#00A79D"))
      }
      else{
        dispatch(setTernaryThemeColor("#B6202D"))
        dispatch(setSecondaryThemeColor("#FFF8E7"))
      }
    },[focused])
   
        
    
          
   
    const checkRegistrationRequired=()=>{
        setBoxColor(color)
        setTimeout(() => {
            if(registrationRequired.includes(props.content))
        {
            checkApprovalFlow(true)
            console.log("registration required")
        }
        else{
            checkApprovalFlow(false)
            console.log("registration not required")

        }
        }, 400);
        
    }

    const checkApprovalFlow=(registrationRequired)=>{
        if(manualApproval.includes(props.content))
        {
            handleNavigation(true,registrationRequired)
        }
        else{
            handleNavigation(false,registrationRequired)
        }
        
    }

    const handleNavigation=(needsApproval,registrationRequired)=>{

        props.navigation.navigate("BasicInfo",{ needsApproval: needsApproval, userType: props.content, userId: props.id,navigatingFrom:"OtpLogin", mobile:mobile })
        console.log("Needs Approval",needsApproval)
        // if(otpLogin.includes(props.content)
        // ){
        //     props.navigation.navigate('VerifyOtp',{needsApproval:needsApproval, userType:props.content, userId:props.id,registrationRequired:registrationRequired})
        // }
        // else{
        //     props.navigation.navigate('VerifyOtp',{needsApproval:needsApproval, userType:props.content, userId:props.id,registrationRequired:registrationRequired})
        // console.log("Password Login",props.content,props.id,registrationRequired,needsApproval)
        // }

    }

    return (
        <TouchableOpacity onPress={()=>{
            checkRegistrationRequired()
        }} style={{...styles.container,backgroundColor:boxColor,borderColor:"#00A79D"}}>
            
            {image && <View style={{borderRadius:45,backgroundColor:"white",alignItems:"center",justifyContent:'center'}}>
            <Image source={{uri:image}} style={styles.image}></Image>
            {/* <SvgUri width={'100%'} height={'100%'} uri={image}></SvgUri> */}
            
            </View>}

            
            <PoppinsTextMedium style={{color:'black',marginTop:10,fontSize:12,fontWeight:'800'}} content ={(props.content).toUpperCase() == "CARPENTER" ? t("CARPENTER") : (props.content).toUpperCase() == "CONTRACTOR" ? t("CONTRACTOR") : (props.content).toUpperCase() == "FABRICATOR" ? t("FABRICATOR") : props.content.toUpperCase() == "DEALER" ? t("DEALER") : props.content.toUpperCase() == "SALES" ? t("SALES") : props.content.toUpperCase() }></PoppinsTextMedium>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container:{
        height:120,
        width:100,
        alignItems:"center",
        justifyContent:"center",
        margin:10,
        elevation:4,
        borderRadius:10,
        borderWidth:0.8,

       
    },
    image:{
        height:70,
        width:70,
        marginBottom:8,resizeMode:'contain'
       
        
    }
})

export default SelectUserBox;
