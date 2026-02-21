export interface Court {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
  available: number;
  photos?: string[];
  rating?: number;
  totalRatings?: number;
}

export interface CourtDetails extends Court {
  photos?: string[];
  rating?: number;
  totalRatings?: number;
  isOpenNow?: boolean;
  hours?: string[];
}
