import { Facility } from "../graphql/dto";
import { toAWSDateTime } from "../graphql/helpers";
import { FacilityRow } from "../database/schema/facility-table";

export function toFacilityDto({streetWithNumber, zipCode, city, createdAt, ...rest}: FacilityRow): Facility {
  return {
    ...rest,
    location: {
      lat: 12.345,
      lon: 67.890,
    },
    address: {
      streetWithNumber,
      zipCode,
      city
    },
    createdAt: toAWSDateTime(createdAt),
  }
}
