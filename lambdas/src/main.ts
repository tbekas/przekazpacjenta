import { AppSyncResolverHandler } from "aws-lambda";

type FacilitiesParams = {
  after: string,
  limit: number
}

type Facility = {
  name: string,
  address: Address,
  location: GeoPoint
}

type Address = {
  streetWithNumber: string,
  zipCode: string,
  city: string
}

type GeoPoint = {
  lat: number,
  lon: number
}

export const handler: AppSyncResolverHandler<FacilitiesParams, Facility[]> = async (event) => {
  console.log(event)
  return [
    {
      name: "Some Facility",
      address: {
        streetWithNumber: "Some street",
        zipCode: "12-345",
        city: "Poznań"
      },
      location: {
        lat: 12.345,
        lon: 23.456
      }
    }
  ]
}
