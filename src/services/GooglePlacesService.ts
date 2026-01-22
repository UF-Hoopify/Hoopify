import { Region } from "react-native-maps";
import { Court } from "../types/CourtSearchTypes";

const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_KEY ?? "";

interface GooglePlace {
  id: string;
  displayName?: { text: string };
  location: { latitude: number; longitude: number };
  formattedAddress?: string;
}

interface GooglePlacesResponse {
  places?: GooglePlace[];
}

export async function searchNearbyCourts(
  region: Region,
  signal?: AbortSignal
): Promise<Court[]> {
  if (!GOOGLE_API_KEY) {
    console.error("API Key is missing. Check .env file.");
    return [];
  }

  const latOffset = region.latitudeDelta / 2;
  const lngOffset = region.longitudeDelta / 2;

  const low = {
    latitude: region.latitude - latOffset,
    longitude: region.longitude - lngOffset,
  };

  const high = {
    latitude: region.latitude + latOffset,
    longitude: region.longitude + lngOffset,
  };

  try {
    const response = await fetch(
      "https://places.googleapis.com/v1/places:searchText",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": GOOGLE_API_KEY,
          "X-Goog-FieldMask":
            "places.id,places.displayName,places.location,places.formattedAddress",
        },
        body: JSON.stringify({
          textQuery: "basketball court",
          locationRestriction: {
            rectangle: {
              low: low,
              high: high,
            },
          },
          maxResultCount: 20,
        }),
        signal,
      }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error("Google Places API error:", response.status, text);
      return [];
    }

    const data: GooglePlacesResponse = await response.json();

    if (!data.places || data.places.length === 0) {
      return [];
    }

    return data.places.slice(0, 20).map((place) => ({
      id: place.id,
      name: place.displayName?.text ?? "Unknown Court",
      lat: place.location.latitude,
      lng: place.location.longitude,
      address: place.formattedAddress ?? "",
      available: 0,
    }));
  } catch (error) {
    if ((error as Error).name === "AbortError") {
      return [];
    }
    console.error("Places fetch failed:", error);
    return [];
  }
}
