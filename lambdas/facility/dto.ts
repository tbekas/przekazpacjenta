type FacilitiesParams = {
  after: string;
  limit: number;
};

type Address = {
  streetWithNumber: string;
  zipCode: string;
  city: string;
};

type GeoPoint = {
  lat: number;
  lon: number;
};

type Facility = {
  name: string;
  address: Address;
  location: GeoPoint;
};
