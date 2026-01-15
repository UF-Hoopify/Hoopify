export interface Court {
  id: string;
  name: string;
  lat: number;
  lng: number;
  available: number;
}

export const MOCK_COURTS: Court[] = [
  {
    id: "1",
    name: "Student Recreation Center",
    lat: 29.6501204,
    lng: -82.3561299,
    available: 12,
  },
  {
    id: "2",
    name: "West Side Park",
    lat: 29.6501288,
    lng: -82.3552862,
    available: 5,
  },
  {
    id: "3",
    name: "Stephen O'Connell Center",
    lat: 29.6494276,
    lng: -82.3560391,
    available: 0,
  },
];
