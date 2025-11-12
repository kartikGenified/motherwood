import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV({
  id: 'app-storage'
});

// Store data
export const storeData = (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    storage.set(key, jsonValue);
    console.log("MMKV storeData", key);
  } catch (e) {
    console.warn("Error in storing data to MMKV for key ", key, e);
  }
};

// Get data
export const getData = (key) => {
  try {
    const jsonValue = storage.getString(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.warn("Error in fetching data from MMKV for key ", key, e);
    return null;
  }
};

// Remove value
export const removeValue = (key) => {
  try {
    storage.delete(key);
    console.log(`Removed key ${key} from MMKV`);
  } catch (e) {
    console.log(`Error in removing the key ${key} from MMKV`, e);
  }
};

// Clear all data
export const clearAll = () => {
  try {
    storage.clearAll();
    console.log('Cleared all MMKV storage');
  } catch (e) {
    console.log('Error clearing MMKV storage', e);
  }
};

// Get all keys
export const getAllKeys = () => {
  try {
    return storage.getAllKeys();
  } catch (e) {
    console.log('Error getting all keys from MMKV', e);
    return [];
  }
};
