import { Region } from "react-native-maps";
import { Court, CourtDetails } from "../types/CourtSearchTypes";

const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_KEY ?? "";

interface GooglePlace {
  id: string;
  displayName?: { text: string };
  location: { latitude: number; longitude: number };
  formattedAddress?: string;
  rating?: number;
  userRatingCount?: number;
  photos?: {
    name: string;
    widthPx: number;
    heightPx: number;
    authorAttributions?: {
      displayName: string;
      uri: string;
      photoUri: string;
    }[];
  }[];
}

interface GooglePlacesResponse {
  places?: GooglePlace[];
}

const getPhotoUrl = (photoReference: string) => {
  return `https://places.googleapis.com/v1/${photoReference}/media?maxHeightPx=400&maxWidthPx=400&key=${GOOGLE_API_KEY}`;
};

// UPDATED: Added 'query' parameter to allow text search
export async function searchNearbyCourts(
  region: Region,
  query: string = "basketball court",
  signal?: AbortSignal,
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
            "places.id,places.displayName,places.location,places.formattedAddress,places.photos,places.rating,places.userRatingCount",
        },
        body: JSON.stringify({
          textQuery: query,
          locationRestriction: {
            rectangle: {
              low: low,
              high: high,
            },
          },
          maxResultCount: 10,
        }),
        signal,
      },
    );

    if (!response.ok) {
      return [];
    }

    const data: GooglePlacesResponse = await response.json();

    if (!data.places || data.places.length === 0) {
      return [];
    }

    return data.places.map((place) => ({
      id: place.id,
      name: place.displayName?.text ?? "Unknown Court",
      lat: place.location.latitude,
      lng: place.location.longitude,
      address: place.formattedAddress ?? "",
      available: 0,
      rating: place.rating,
      totalRatings: place.userRatingCount,
      photos: place.photos
        ? place.photos.slice(0, 3).map((p) => getPhotoUrl(p.name))
        : [],
    }));
  } catch (error) {
    if ((error as Error).name === "AbortError") return [];
    console.error("Places fetch failed:", error);
    return [];
  }
}

export async function fetchCourtDetails(
  placeId: string,
): Promise<CourtDetails | null> {
  if (!GOOGLE_API_KEY) return null;

  try {
    const response = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": GOOGLE_API_KEY,
          "X-Goog-FieldMask":
            "id,displayName,location,formattedAddress,photos,rating,userRatingCount,currentOpeningHours,regularOpeningHours",
        },
      },
    );

    const data = await response.json();

    const isOpen = data.currentOpeningHours?.openNow ?? false;
    const closingTime = isOpen ? "Open" : "Closed";
    const photoUrls =
      data.photos?.slice(0, 3).map((p: any) => getPhotoUrl(p.name)) || [];

    return {
      id: data.id,
      name: data.displayName?.text ?? "Unknown Court",
      lat: data.location.latitude,
      lng: data.location.longitude,
      address: data.formattedAddress ?? "",
      available: 0,
      photos: photoUrls,
      rating: data.rating ?? null,
      totalRatings: data.userRatingCount ?? 0,
      isOpenNow:
        data.currentOpeningHours?.openNow ??
        data.regularOpeningHours?.openNow ??
        false,
      hours: data.regularOpeningHours?.weekdayDescriptions ?? [],
    };
  } catch (error) {
    console.error("Failed to fetch court details:", error);
    return null;
  }
}
