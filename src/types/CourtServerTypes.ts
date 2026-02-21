import { GeoPoint, Timestamp } from "firebase/firestore";

export type CourtType = "indoor" | "outdoor";
export type SurfaceType =
  | "concrete"
  | "asphalt"
  | "wood"
  | "sport_court"
  | "unknown";
export type RimQuality = "single" | "double" | "breakaway" | "unknown";
export type NetType = "chain" | "nylon" | "polyester" | "none" | "unknown";
export type LightingLevel = "none" | "low" | "medium" | "high";

export interface CourtDocument {
  id: string;

  // --- GOOGLE PLACES DATA ---
  name: string;
  address: string;
  location: GeoPoint;
  photos: string[];
  rating_google: number;
  total_ratings_google: number;
  opening_hours?: string[];
  is_open_now: boolean;

  // --- HOOPIFY RICH DATA ---
  court_type: CourtType;
  surface: SurfaceType;
  rim_quality: RimQuality;
  net_type: NetType;
  lighting: LightingLevel;
  court_count: number;

  // --- LIVE STATUS ---
  active_player_count: number;
  last_activity_at?: Timestamp;
}

// TODO: implement for Games feature
export interface GameDocument {
  id: string;
}

// TODO: implement for Chat feature
export interface ChatMessageDocument {}

// TODO: implement for Reviews feature
export interface ReviewDocument {}
