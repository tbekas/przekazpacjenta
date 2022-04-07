type FacilitiesParams = {
  query?: string;
  after?: string;
  before?: string;
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

type PageInfo = {
  totalCount: number;
  first: string;
  last: string;
}

type Facility = {
  name: string;
  address: Address;
  location: GeoPoint;
};

type FacilitiesPage = {
  items: Facility[];
  pageInfo: PageInfo;
}
