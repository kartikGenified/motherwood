import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  Text,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import PoppinsTextLeftMedium from '../../components/electrons/customFonts/PoppinsTextLeftMedium';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import useContacts from '../../hooks/customHooks/useContacts';
import TopHeader from '@/components/topBar/TopHeader';
import Close from 'react-native-vector-icons/Ionicons';


const SelectContact = ({ navigation, route }) => {
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState('');
  const { contacts, status, loading, error, requestPermission } = useContacts();
  
  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  ) || '#FFB533';

  // Function to clean phone number - remove +, spaces, and country codes like 91
  const cleanPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return '';
    
    let cleaned = phoneNumber.replace(/\D/g, '');
    
    if (cleaned.startsWith('91') && cleaned.length > 10) {
      cleaned = cleaned.substring(2);
    }
    
    if (cleaned.length > 10) {
      cleaned = cleaned.slice(-10);
    }
    
    return cleaned;
  };

  // Filter and search contacts
  const filteredContacts = useMemo(() => {
    if (!contacts || contacts.length === 0) return [];
    
    // Filter contacts that have at least one phone number
    const contactsWithPhones = contacts.filter(contact => 
      contact.phoneNumbers && contact.phoneNumbers.length > 0
    );
    
    if (!searchText.trim()) {
      return contactsWithPhones;
    }
    


    // Search by name or phone number
    const searchLower = searchText.toLowerCase().trim();
    return contactsWithPhones.filter(contact => {
      const nameMatch = contact.displayName && 
        contact.displayName.toLowerCase().includes(searchLower);
      return nameMatch ;
    });
  }, [contacts, searchText]);

  // Handle contact selection
  const handleContactSelect = (contact) => {
    if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
      // Get the first phone number and clean it
      const phoneNumber = cleanPhoneNumber(contact.phoneNumbers[0].number);
      
      
      // Navigate back to PointsTransfer with the selected phone number
      if (route.params?.onContactSelect) {
        route.params.onContactSelect(phoneNumber);
      }
      navigation.goBack();
    }
  };

  // Handle permission request
  const handleRequestPermission = async () => {
    await requestPermission();
  };

  // Render contact item
  const renderContactItem = ({ item }) => {
    const phoneNumber = item.phoneNumbers && item.phoneNumbers.length > 0 
      ? cleanPhoneNumber(item.phoneNumbers[0].number) 
      : '';
    
    return (
      <TouchableOpacity
        style={styles.contactItem}
        onPress={() => handleContactSelect(item)}
      >
        <View style={styles.contactInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {item.displayName ? item.displayName.charAt(0).toUpperCase() : '?'}
            </Text>
          </View>
          <View style={styles.contactDetails}>
            <PoppinsTextLeftMedium
              style={styles.contactName}
              content={item.displayName || 'Unknown'}
            />
            <PoppinsTextLeftMedium
              style={styles.contactPhone}
              content={phoneNumber || 'No phone number'}
            />
          </View>
        </View>
        <Image
          style={styles.selectIcon}
          source={require('../../../assets/images/blackBack.png')}
        />
      </TouchableOpacity>
    );
  };

  // Render permission denied state
  if (status === 'denied') {
    return (
      <View style={styles.container}>
        <TopHeader title={t('Select Contact')} />

        {/* <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              style={styles.backIcon}
              source={require('../../../assets/images/blackBack.png')}
            />
          </TouchableOpacity>
          <PoppinsTextMedium
            content={t('Select Contact')}
            style={styles.headerTitle}
          />
        </View> */}

        
        <View style={styles.permissionContainer}>
          <PoppinsTextMedium
            style={styles.permissionText}
            content={t('Contact permission is required to select contacts')}
          />
          <TouchableOpacity
            style={[styles.permissionButton, { backgroundColor: ternaryThemeColor }]}
            onPress={handleRequestPermission}
          >
            <PoppinsTextMedium
              style={styles.permissionButtonText}
              content={t('Grant Permission')}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container}>
      {/* Header */}
      <TopHeader title={t('Select Contact')} />


      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Image
          style={styles.searchIcon}
          source={require('../../../assets/images/search.png')}
        />
        <TextInput
          style={styles.searchInput}
          placeholder={t('Search contacts...')}
          placeholderTextColor="#808080"
          value={searchText}
          onChangeText={setSearchText}
        />
        {searchText.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => setSearchText('')}
          >
            {/* <Image
              style={styles.clearIcon}
              source={require('../../../assets/images/cancel.png')}
            /> */}
            <Close  name="close" size={20}  />
          </TouchableOpacity>
        )}
      </View>

      {/* Loading State */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={ternaryThemeColor} />
          <PoppinsTextMedium
            style={styles.loadingText}
            content={t('Loading contacts...')}
          />
        </View>
      )}

      {/* Error State */}
      {error && (
        <View style={styles.errorContainer}>
          <PoppinsTextMedium
            style={styles.errorText}
            content={t('Failed to load contacts')}
          />
        </View>
      )}

      {/* Contacts List */}
      {!loading && !error && (
        <FlatList
          data={filteredContacts}
          renderItem={renderContactItem}
          keyExtractor={(item, index) => `${item.recordID || index}`}
          style={styles.contactsList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <PoppinsTextMedium
                style={styles.emptyText}
                content={
                  searchText.trim() 
                    ? t('No contacts found') 
                    : t('No contacts available')
                }
              />
            </View>
          }
        />
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backIcon: {
    height: 24,
    width: 24,
    resizeMode: 'contain',
  },
  headerTitle: {
    marginLeft: 16,
    fontSize: 18,
    fontWeight: '600',
    color: '#171717',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    paddingHorizontal: 16,
    height: 50,
  },
  searchIcon: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
    tintColor: '#808080',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: 'black',
  },
  clearButton: {
    padding: 4,
  },
  clearIcon: {
    height: 16,
    width: 16,
    resizeMode: 'contain',
    tintColor: '#808080',
  },
  contactsList: {
    flex: 1,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  contactDetails: {
    marginLeft: 12,
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'black',
  },
  contactPhone: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  selectIcon: {
    height: 16,
    width: 16,
    resizeMode: 'contain',
    transform: [{ rotate: '180deg' }],
    tintColor: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  permissionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  permissionButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});

export default SelectContact;
