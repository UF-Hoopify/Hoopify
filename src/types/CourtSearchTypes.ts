export interface Court {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
  available: number;
}

export interface CourtDetails extends Court {
  photos?: string[];
  rating?: number;
  totalRatings?: number;
  isOpenNow?: boolean;
  closingTime?: string;
}
