import { RefreshControl, ScrollView, StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState, useEffect } from 'react'
import TopHeader from '@/components/topBar/TopHeader';
import Loader from './Loader';
import SocialBottomBar from '../socialBar/SocialBottomBar';
import ErrorModal from '../modals/ErrorModal';
import AlertModal from '../modals/AlertModal';



const BackUi = (props) => {
  const {
    scrollable,
    title,
    onBackPress,
    onRefresh,
    style,
    loading,
    refreshing: externalRefreshing,
    setRefreshing: externalSetRefreshing,
    errorMessage,
    alertMessage,
    keyboardAvoidingEnabled = false,
    keyboardBehavior,
    keyboardVerticalOffset,
    scrollContentContainerStyle,
  } = props;

  const [internalRefreshing, setInternalRefreshing] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);

  const refreshing = externalRefreshing !== undefined ? externalRefreshing : internalRefreshing;

  // Listen for errorMessage changes and show modal
  useEffect(() => {
    if (errorMessage) {
      setShowErrorModal(true);
    }
  }, [errorMessage]);

  // Listen for alertMessage changes and show modal
  useEffect(() => {
    if (alertMessage) {
      setShowAlertModal(true);
    }
  }, [alertMessage]);

  const handleModalClose = () => {
    setShowErrorModal(false);
  };

  const handleAlertClose = () => {
    setShowAlertModal(false);
  };

  const handleRefresh = async () => {
    if (!onRefresh) return;

    if (externalSetRefreshing) {
      await onRefresh();
    } else {
      setInternalRefreshing(true);
      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh error:', error);
      }
      setTimeout(() => {
        setInternalRefreshing(false);
      }, 1000);
    }
  };

  const KAVProps = {
    behavior: keyboardBehavior || (Platform.OS === 'ios' ? 'padding' : 'height'),
    keyboardVerticalOffset: keyboardVerticalOffset ? keyboardVerticalOffset : (Platform.OS === 'ios' ? 0 : 20),
    style: { flex: 1 },
  };

  if (scrollable || onRefresh) {
    return (
      <View style={[styles.container, style]}>


        {showErrorModal && (
          <ErrorModal
            modalClose={handleModalClose}
            message={errorMessage}
            openModal={showErrorModal}
          />
        )}
        {showAlertModal && (
          <AlertModal
            modalClose={handleAlertClose}
            message={alertMessage}
            openModal={showAlertModal}
          />
        )}
        { title && <TopHeader
          title={title}
          onBackPress={onBackPress}
        />}
        {keyboardAvoidingEnabled ? (
          <KeyboardAvoidingView {...KAVProps}>
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={[styles.scrollContent, scrollContentContainerStyle]}
              refreshControl={
                onRefresh ? (
                  <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                ) : undefined
              }
            >



              {loading ? <Loader loading={loading} /> : props.children}
            </ScrollView>
          </KeyboardAvoidingView>
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[styles.scrollContent, scrollContentContainerStyle]}
            refreshControl={
              onRefresh ? (
                <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
              ) : undefined
            }
          >
            {loading ? <Loader loading={loading} /> : props.children}
          </ScrollView>
        )}
        <SocialBottomBar showRelative={true}/>
      </View>
    )
  }

  return (
    <View style={[styles.container, style]}>
      {showErrorModal && (
        <ErrorModal
          modalClose={handleModalClose}
          message={errorMessage}
          openModal={showErrorModal}
        />
      )}
      {showAlertModal && (
        <AlertModal
          modalClose={handleAlertClose}
          message={alertMessage}
          openModal={showAlertModal}
        />
      )}
      { title && <TopHeader
        title={title}
        onBackPress={onBackPress}
      />}
      {keyboardAvoidingEnabled ? (
        <KeyboardAvoidingView {...KAVProps}>
          { loading  ? (
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <Loader loading={true} />
            </View>
          ) : (
            props.children
          )}
        </KeyboardAvoidingView>
      ) : (
        <>
          { loading  ? (
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <Loader loading={true} />
            </View>
          ) : (
            props.children
          )}
        </>
      )}
      <SocialBottomBar backgroundColor={'white'}/>
    </View>
  )
}

export default BackUi

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    height: '100%',
  },
  scrollView: {
    flex: 1,
    height: '100%',
  },
  scrollContent: {
    // flexGrow: 1,
  },
})