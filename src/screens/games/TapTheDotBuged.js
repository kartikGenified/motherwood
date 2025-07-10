import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  Text,
  Alert,
  Animated,
  Easing,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { incrementScore, resetScore } from '../../../redux/slices/tapGameSlice';
import Sound from 'react-native-sound';

const DOT_SIZE = 60;
const GAME_DURATION = 30;

const TapTheDot = () => {
  const dispatch = useDispatch();
  const score = useSelector((state) => state.tapGame.score);

  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameRunning, setGameRunning] = useState(false);
  const [gameAreaSize, setGameAreaSize] = useState({ width: 0, height: 0 });

  const [count, setCount] = useState(3);
  const [showCountdown, setShowCountdown] = useState(false);
  const countdownScale = useRef(new Animated.Value(1)).current;

  const animatedX = useRef(new Animated.Value(0)).current;
  const animatedY = useRef(new Animated.Value(0)).current;
  const animatedScale = useRef(new Animated.Value(1)).current;
  const timerRef = useRef(null);
  const scoreRef = useRef(score);

  const soundRef = useRef(null);

  console.log('animatedX:', animatedX.__getValue());
console.log('animatedY:', animatedY.__getValue());
console.log('animatedScale:', animatedScale.__getValue());

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  useEffect(() => {
    Sound.setCategory('Playback');

    const sound = new Sound('sound1.wav', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.warn('Failed to load the sound', error);
        return;
      }
      soundRef.current = sound;
    });

    return () => {
      if (soundRef.current) {
        soundRef.current.release();
      }
    };
  }, []);

  const getAnimationDuration = () => {
    if (timeLeft > 20) return 400;
    if (timeLeft > 10) return 250;
    return 150;
  };

  const previousPosition = useRef({ x: 0, y: 0 });

  const generateRandomPosition = () => {
    if (!gameAreaSize.width || !gameAreaSize.height) return Promise.resolve();

    const maxX = gameAreaSize.width - DOT_SIZE;
    const maxY = gameAreaSize.height - DOT_SIZE;

    let newX, newY;
    const minDistance = Math.min(gameAreaSize.width, gameAreaSize.height) * 0.4;

    let attempts = 0;
    do {
      newX = Math.random() * maxX;
      newY = Math.random() * maxY;
      const dx = newX - previousPosition.current.x;
      const dy = newY - previousPosition.current.y;
      if (Math.sqrt(dx * dx + dy * dy) >= minDistance) break;
      attempts++;
    } while (attempts < 10);

    previousPosition.current = { x: newX, y: newY };

    return new Promise((resolve) => {
      Animated.parallel([
        Animated.timing(animatedX, {
          toValue: newX,
          duration: getAnimationDuration(),
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
        }),
        Animated.timing(animatedY, {
          toValue: newY,
          duration: getAnimationDuration(),
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
        }),
      ]).start(() => resolve());
    });
  };

  const handleDotPress = () => {
    if (soundRef.current) {
      soundRef.current.stop(() => {
        soundRef.current.play((success) => {
          if (!success) {
            console.warn('Sound playback failed');
          }
        });
      });
    }

    dispatch(incrementScore());

    Animated.sequence([
      Animated.timing(animatedScale, {
        toValue: 0.7,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(animatedScale, {
        toValue: 1,
        duration: 200,
        easing: Easing.bounce,
        useNativeDriver: true,
      }),
    ]).start();

    generateRandomPosition();
  };

  const countdownSequence = () => {
    // Set initial dot position here so it appears right after countdown
    if (gameAreaSize.width && gameAreaSize.height) {
      const initialX = Math.random() * (gameAreaSize.width - DOT_SIZE);
      const initialY = Math.random() * (gameAreaSize.height - DOT_SIZE);
      animatedX.setValue(initialX);
      animatedY.setValue(initialY);
      previousPosition.current = { x: initialX, y: initialY };
    }

    setShowCountdown(true);
    let current = 3;

    const animate = () => {
      setCount(current);
      countdownScale.setValue(0.5);

      Animated.timing(countdownScale, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }).start(() => {
        if (current > 1) {
          current -= 1;
          animate();
        } else {
          setShowCountdown(false);
          setGameRunning(true);
        }
      });
    };

    animate();
  };

  const startGame = () => {
    if (gameAreaSize.width === 0 || gameAreaSize.height === 0) {
      Alert.alert('Please wait for the game area to load.');
      return;
    }
    dispatch(resetScore());
    setTimeLeft(GAME_DURATION);
    setGameRunning(true);

    countdownSequence();
  };

  useEffect(() => {
    if (!gameRunning) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setGameRunning(false);
          Alert.alert('Game Over', `Your Score: ${scoreRef.current}`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [gameRunning]);

  const onGameAreaLayout = (event) => {
    const { width, height } = event.nativeEvent.layout;
    setGameAreaSize({ width, height });
  };

  // Removed the previous useEffect for initial position when gameRunning changed
  // since we now set initial position at countdown start

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎯 Tap the Dot</Text>

      <View style={styles.infoRow}>
        <Text style={styles.infoText}>Time: {timeLeft}s</Text>
        <Text style={styles.infoText}>Score: {score}</Text>
      </View>

      {!gameRunning && !showCountdown && (
        <Pressable onPress={startGame} style={styles.startButton}>
          <Text style={styles.startButtonText}>Start Game</Text>
        </Pressable>
      )}

      <View style={styles.gameArea} onLayout={onGameAreaLayout}>
        {gameRunning && (
          <Animated.View
            style={[
              styles.dot,
              {
                transform: [
                  { translateX: animatedX },
                  { translateY: animatedY },
                  { scale: animatedScale },
                ],
              },
            ]}
          >
            <Pressable
              onPress={handleDotPress}
              style={styles.dotPressable}
              android_ripple={{ color: 'red', radius: DOT_SIZE / 2 }}
            />
          </Animated.View>
        )}
        {showCountdown && (
          <View style={styles.countdownOverlay}>
            <Animated.Text
              style={[
                styles.countdownText,
                {
                  transform: [{ scale: countdownScale }],
                },
              ]}
            >
              {count === 1 ? 'Go!' : count}
            </Animated.Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f5fa',
    alignItems: 'center',
    paddingTop: 50,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 10,
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 15,
  },
  infoText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#444',
  },
  startButton: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  startButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  gameArea: {
    width: '95%',
    height: '75%',
    maxWidth: 500,
    maxHeight: 600,
    borderWidth: 4,
    borderColor: '#3366FF',
    borderRadius: 12,
    backgroundColor: '#fff',
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    position: 'absolute',
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: '#FF4081',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
    zIndex: 20, // add this
  },
  dotPressable: {
    width: '100%',
    height: '100%',
    borderRadius: DOT_SIZE / 2,
  },
  countdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  countdownText: {
    fontSize: 96,
    fontWeight: '900',
    color: '#fff',
  },
});

export default TapTheDot;
