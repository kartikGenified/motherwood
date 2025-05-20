import { t } from 'i18next';
import React from 'react';
import { Modal, View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';

const ConfrimationModal = ({
  visible,
  onClose,
  title,
  imageSource,
  leftButtonText,
  rightButtonText,
  onLeftPress,
  onRightPress,
}) => {
    const ternaryThemeColor = useSelector(
        (state) => state.apptheme.ternaryThemeColor
      )
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={{...styles.modalContainer,borderColor:ternaryThemeColor,borderWidth:2, borderRadius:20, }}>
          <Image source={imageSource} style={styles.image} resizeMode="contain" />
          <Text style={styles.title}>{title}</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#C2142C' }]}
              onPress={onLeftPress}
            >
              <Text style={styles.buttonText}>{leftButtonText}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: 'black' }]}
              onPress={onRightPress}
            >
              <Text style={styles.buttonText}>{rightButtonText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:10,
    borderWidth:1,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    paddingBottom:40,
    width: '90%',
    borderRadius: 10,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 120,
    marginBottom: 10,
  },
  title: {
    fontSize: 23,
    color:'#333333',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize:17
  },
});

export default ConfrimationModal;
