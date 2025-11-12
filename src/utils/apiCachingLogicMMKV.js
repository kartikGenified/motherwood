import { storeData, getData, removeValue } from "./mmkvStorage";
import { apiFetchingInterval } from "./apiFetchingInterval";

/**
 * API Caching Logic using MMKV
 * @param {string} key - The cache key for the API data
 * @returns {Promise<any>} - Returns cached data if valid, null if cache expired or doesn't exist
 */
export const apiCachingLogic = async (key) => {
  console.log("calling apiCachingLogic MMKV", key);
  
  try {
    const lastFetchedTime = getData("lastFetchedTime");
    console.log("lastFetchedTime in apiCachingLogic MMKV", lastFetchedTime);
    
    if (lastFetchedTime != null) {
      const timeDiff = new Date().getTime() - lastFetchedTime;
      console.log(
        "api caching MMKV lastfetchedtime not null",
        new Date().getTime(),
        lastFetchedTime,
        timeDiff,
        apiFetchingInterval
      );
      
      if (timeDiff > apiFetchingInterval) {
        // Cache expired - call API
        console.log("caching time exceeded MMKV");
        storeData("lastFetchedTime", new Date().getTime());
        return null;
      } else {
        // Check for cached data
        const data = getData(key);
        console.log("caching time did not exceed MMKV", data ? "data exists" : "no data", key);
        
        if (data != null) {
          return data;
        } else {
          // No cached data - call API
          storeData("lastFetchedTime", new Date().getTime());
          return null;
        }
      }
    } else {
      // First time - call API
      console.log(
        "api caching MMKV - first fetch",
        new Date().getTime(),
        apiFetchingInterval
      );
      storeData("lastFetchedTime", new Date().getTime());
      return null;
    }
  } catch (error) {
    console.error("Error in apiCachingLogic MMKV:", error);
    return null;
  }
};

/**
 * Store API response data with MMKV
 * @param {string} key - The cache key
 * @param {any} value - The data to cache
 */
export const storeApiData = (key, value) => {
  try {
    storeData(key, value);
    console.log("Stored API data in MMKV:", key);
  } catch (error) {
    console.error("Error storing API data in MMKV:", error);
  }
};

/**
 * Get cached API data
 * @param {string} key - The cache key
 * @returns {any} - The cached data or null
 */
export const getCachedApiData = (key) => {
  try {
    return getData(key);
  } catch (error) {
    console.error("Error getting cached API data from MMKV:", error);
    return null;
  }
};

/**
 * Invalidate cache for a specific key
 * @param {string} key - The cache key to invalidate
 */
export const invalidateCache = (key) => {
  try {
    removeValue(key);
    console.log("Invalidated cache for key:", key);
  } catch (error) {
    console.error("Error invalidating cache:", error);
  }
};

/**
 * Reset cache timestamp to force API refresh on next call
 */
export const resetCacheTimestamp = () => {
  try {
    removeValue("lastFetchedTime");
    console.log("Reset cache timestamp");
  } catch (error) {
    console.error("Error resetting cache timestamp:", error);
  }
};
