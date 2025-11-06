import React from 'react';
import {View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import { useSelector } from 'react-redux';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import { useTranslation } from 'react-i18next';
import TopHeader from '@/components/topBar/TopHeader';

const ReportIssue = ({navigation}) => {
    const ternaryThemeColor = useSelector(
        state => state.apptheme.ternaryThemeColor,
    ) ? useSelector(state => state.apptheme.ternaryThemeColor) : 'grey';
    
    const { t } = useTranslation();
    
    return (
        <View
      style={{
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        backgroundColor: ternaryThemeColor,
        height: '100%',
      }}>
      <TopHeader title={t("Report And Issue")} />
      <View
          style={{
            borderTopRightRadius: 30,
            borderTopLeftRadius: 30,
            backgroundColor: 'white',
            marginTop: 10,
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            paddingBottom:40
          }}>

        </View>
        </View>

    );
}

const styles = StyleSheet.create({})

export default ReportIssue;
