// BirthdayModal.js
import React, { useRef, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, Pressable, Image } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { useSelector } from 'react-redux';
const BirthdayModal = ({ visible, onClose, userName }) => {
  const confettiRef = useRef(null);

  useEffect(() => {
    if (visible && confettiRef.current) {
      confettiRef.current.start();
    }
  }, [visible]);

  const userData = useSelector(state => state.appusersdata.userData)

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.modal}>
          <ConfettiCannon
            count={100}
            origin={{ x: -10, y: 0 }}
            autoStart
            fadeOut
            explosionSpeed={350}
            fallSpeed={3000}
          />

          <Image
            source={require('../../../assets/images/cake.jpeg')} // Use your own birthday image here
            style={styles.image}
          />
          <Text style={styles.title}>🎉 Happy Birthday, {userData.name}! 🎉</Text>
          <Text style={styles.message}>Wishing you a day filled with love, joy, and confetti!</Text>

          <Pressable onPress={onClose} style={styles.button}>
            <Text style={styles.buttonText}>Thank You!</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default BirthdayModal;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff69b4',
    textAlign: 'center',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#ff69b4',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
