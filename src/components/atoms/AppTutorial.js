import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Tooltip from 'react-native-walkthrough-tooltip';
import { useSelector, useDispatch } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { setAlreadyWalkedThrough, setStepId } from '../../../redux/slices/walkThroughSlice';
import { storeData, getData } from '../../utils/mmkvStorage';

const WALKTHROUGH_KEY = 'isAlreadyWalkedThrough';

/**
 * AppTutorial - A reusable tooltip wrapper component for app walkthrough
 * 
 * @param {number} stepNumber - The step number this tooltip should appear on
 * @param {string} content - The text content to display in the tooltip
 * @param {string} placement - Tooltip placement: 'top', 'bottom', 'left', 'right'
 * @param {ReactNode} children - The component to wrap with the tooltip
 * @param {Function} onNext - Optional callback when Next is pressed
 * @param {Function} onSkip - Optional callback when Skip is pressed
 */
const AppTutorial = ({ 
  stepNumber, 
  content, 
  placement = 'bottom', 
  children,
  onNext,
  onSkip 
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const focused = useIsFocused();
  
  const stepId = useSelector((state) => state.walkThrough.stepId);
  const isAlreadyWalkedThrough = useSelector((state) => state.walkThrough.isAlreadyWalkedThrough);
  const ternaryThemeColor = useSelector((state) => state.apptheme.ternaryThemeColor);
  
  const walkThrough = !isAlreadyWalkedThrough;

  // Check MMKV storage for walkthrough status on mount
  useEffect(() => {
    const checkWalkThroughStatus = () => {
      try {
        const value = getData(WALKTHROUGH_KEY);
        if (value === true) {
          dispatch(setAlreadyWalkedThrough(true));
        }
      } catch (error) {
        console.error('Error checking walkthrough status:', error);
      }
    };

    if (focused) {
      checkWalkThroughStatus();
    }
  }, [focused, dispatch]);

  const handleNextStep = () => {
    if (onNext) {
      onNext();
    }
    dispatch(setStepId(stepId + 1));
  };

  const handleSkip = () => {
    try {
      storeData(WALKTHROUGH_KEY, true);
      dispatch(setAlreadyWalkedThrough(true));
      if (onSkip) {
        onSkip();
      }
    } catch (error) {
      console.error('Error storing walkthrough data:', error);
    }
  };

  const handleClose = () => {
    // Just close the tooltip without marking as complete
    dispatch(setAlreadyWalkedThrough(true));
  };

  return (
    <Tooltip
      isVisible={walkThrough && stepId === stepNumber}
      content={
        <View style={styles.tooltipContent}>
          <Text style={styles.tooltipText}>
            {t(content)}
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.skipButton(ternaryThemeColor)]}
              onPress={handleSkip}
            >
              <Text style={styles.buttonText}>{t("Skip")}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.nextButton(ternaryThemeColor)]}
              onPress={handleNextStep}
            >
              <Text style={[styles.buttonText, styles.nextButtonText]}>
                {t("Next")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      }
      placement={placement}
      animated
      onClose={handleClose}
      tooltipStyle={styles.tooltip}
      contentStyle={[styles.tooltipContentStyle, { borderColor: ternaryThemeColor }]}
    >
      {children}
    </Tooltip>
  );
};

const styles = StyleSheet.create({
  tooltipContent: {
    alignItems: 'center',
  },
  tooltipText: {
    color: 'black',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  skipButton: (color) => ({
    backgroundColor: color,
    marginRight: 12,
  }),
  nextButton: (color) => ({
    backgroundColor: color,
  }),
  buttonText: {
    color: 'white',
  },
  nextButtonText: {
    fontWeight: 'bold',
  },
  tooltip: {
    borderRadius: 30,
  },
  tooltipContentStyle: {
    backgroundColor: 'white',
    minHeight: 100,
    borderWidth: 2,
    borderRadius: 10,
  },
});

export default AppTutorial;
