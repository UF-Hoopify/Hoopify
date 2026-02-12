import { GeoPoint, Timestamp } from "firebase/firestore";

interface CourtDocument {
  id: string; // The Google Place ID )
  name: string; //"Rucker Park"
  address: string;
  coordinates: GeoPoint;
  geohash?: string;

  photos: {
    url: string;
    source: "google" | "user";
    attribution?: string;
  }[];

  /*
    TODO: need data to back this up 
      - surface_condition: good | fair | poor
      - traction_rating: 0–5 (higher is better)
      - shock_absorption_present: boolean 
      - rim_type: breakaway | standard
      - backboard_material: glass | acrylic | steel
      - net_type: chain | nylon | none
  */
  metadata: {
    court_type: "indoor" | "outdoor";
    surface: "concrete" | "asphalt" | "wood" | "sport_court";
    rim_quality: "single" | "double" | "breakaway";
    net_type: "chain" | "nylon" | "none";
    lighting: boolean;
  };
  active_game_count: number;
  last_updated: Timestamp;
}
