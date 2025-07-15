import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiFetchingInterval } from "./apiFetchingInterval";

export const storeData = async (key, value) => {
  console.log("storedata asyncStorageFunction",key,value)
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    // saving error
    console.warn("Error in storing data to async storage for key ", key, e);
  }
};

export const removeValue = async (key) => {
  try {
    await AsyncStorage.removeItem(key)
  } catch(e) {
    // remove error
    console.log(`Error in removing the key ${key} from async storage`)
  }

  console.log('Done.')
}

export const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    // error reading value
    console.warn("Error in fetching data from async storage for key ", key, e);
  }
};

export const apiCachingLogic = async (key) => {
  console.log("calling apiCachingLogic",key);
  const lastFetchedTime = await getData("lastFetchedTime");
  console.log("lastFetchedTime in apiCachingLogic", lastFetchedTime);
  if (lastFetchedTime != null) {
    console.log(
      "api caching lastfetchedtime not null",
      new Date().getTime(),
      lastFetchedTime,
      new Date().getTime() - lastFetchedTime,
      apiFetchingInterval
    );
    if (new Date() - lastFetchedTime > apiFetchingInterval) {
      // call api
      console.log("caching time exceeded");
      storeData("lastFetchedTime", new Date().getTime());
      return null;
    } else {
      // check for cached data
      const data = await getData(key)
      console.log("caching time did not exceed",data,key);

      if( data!=null)
      {
        return data;
      }
      else
      {
      storeData("lastFetchedTime", new Date().getTime());
      return null;
      }
    }
  } else {
    console.log(
      "api caching",
      new Date().getTime(),
      lastFetchedTime,
      apiFetchingInterval
    );
    storeData("lastFetchedTime", new Date().getTime());
    return null;
    // call api and set lastFetchedTime as the current time
  }
};
