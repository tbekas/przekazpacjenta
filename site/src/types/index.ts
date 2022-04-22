export interface PageInfo {
  totalCount: number;
  first: string;
  last: string;
}

export interface Address {
  streetWithNumber: string;
  zipCode: string;
  city: string;
}

export interface GeoPoint {
  lat: number;
  lon: number;
}

export interface Facility {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: Address;
  location: GeoPoint;
  createdAt: string;
}

export interface FacilitiesPage {
  items: Facility[];
  pageInfo: PageInfo;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  createdAt: string;
}

export interface Enrollment {
  id: string;
  facility: Facility;
  approved: boolean;
  expirationAt: string;
  createdAt: string;
}
