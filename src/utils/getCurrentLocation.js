import Geolocation from "@react-native-community/geolocation";
import { GoogleMapsKey } from "@env";

export const getCurrentLocation = async () => {
  try {
    // Step 1: Get coordinates
    const location = await new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true });
    });

    const { latitude: lat, longitude: lon } = location.coords;
    console.log("Latitude:", lat, "Longitude:", lon);

    // Step 2: Fetch reverse geocoding data
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${GoogleMapsKey}`;
    const response = await fetch(url);
    const json = await response.json();

    console.log("Location data returned:", json);

    // Default JSON structure (preserved)
    let locationJson = {
      lat,
      lon,
      address: "N/A",
      postcode: "N/A",
      country: "N/A",
      state: "N/A",
      district: "N/A",
      city: "N/A",
    };

    // Step 3: If we have standard results, extract from them
    if (json.results && json.results.length > 0) {
      const firstResult = json.results[0];
      const formattedAddress = firstResult.formatted_address || "N/A";
      const addressComponents = firstResult.address_components || [];

      locationJson.address = formattedAddress;

      addressComponents.forEach((component) => {
        if (component.types.includes("postal_code")) {
          locationJson.postcode = component.long_name;
        } else if (component.types.includes("country")) {
          locationJson.country = component.long_name;
        } else if (component.types.includes("administrative_area_level_1")) {
          locationJson.state = component.long_name;
        } else if (component.types.includes("administrative_area_level_3")) {
          locationJson.district = component.long_name;
        } else if (component.types.includes("locality")) {
          locationJson.city = component.long_name;
        }
      });
    }

    // Step 4: Fallback – use compound_code if no address was found
    if (
      (!json.results || json.results.length === 0 || locationJson.address === "N/A") &&
      json.plus_code &&
      json.plus_code.compound_code
    ) {
      const compoundCode = json.plus_code.compound_code;
      // Compound code example: "7J5R+4C Paris, France"
      const parts = compoundCode.split(" ");
      const readablePart = parts.slice(1).join(" ").trim();

      locationJson.address = readablePart || "N/A";

      // Try to extract possible city/country clues
      const [maybeCity, maybeCountry] = readablePart.split(",").map((x) => x.trim());
      if (maybeCity && !locationJson.city) locationJson.city = maybeCity;
      if (maybeCountry && !locationJson.country) locationJson.country = maybeCountry;
    }

    console.log("Location Details:", locationJson);
    return locationJson;
  } catch (error) {
    console.error("Error getting location or address:", error);

    // Always return the same structure
    return {
      lat: "N/A",
      lon: "N/A",
      address: "N/A",
      postcode: "N/A",
      country: "N/A",
      state: "N/A",
      district: "N/A",
      city: "N/A",
    };
  }
};