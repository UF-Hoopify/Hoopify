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

export type GameFormat = "1v1" | "2v2" | "3v3" | "4v4" | "5v5";
export type GameVisibility = "public" | "private";
export type Competitiveness = "casual" | "moderate" | "competitive";
export type GameState =
  | "open"
  | "full"
  | "in_progress"
  | "completed"
  | "cancelled";
export type PlayerStatus = "confirmed" | "pending" | "declined";
export type PlayerTeam = "home" | "away" | "unassigned";

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

export interface GamePlayer {
  status: PlayerStatus;
  team: PlayerTeam;
  lastStatusSwitchedTime: Timestamp;
  displayName: string;
  profilePic: string;
}

export interface CourtServerGame {
  id: string;
  courtServerId: string;
  creatorId: string;
  createdAt: Timestamp;

  meetupTime: Timestamp;
  endingTime: Timestamp;
  courtDescriptor: string;
  format: GameFormat;
  visibility: GameVisibility;
  competitiveness: Competitiveness;
  status: GameState;
  description: string;

  invitedUserIds: string[];

  players: Record<string, GamePlayer>;
}

// TODO: implement for Chat feature
export interface ChatMessageDocument {}

// TODO: implement for Reviews feature
export interface ReviewDocument {}
