import { AppSyncResolverHandler } from "aws-lambda";
import { db } from "../database"

export const handler: AppSyncResolverHandler<FacilitiesParams,FacilitiesPage> = async (event) => {
  const facilities = await db
    .selectFrom("facility")
    .selectAll()
    .limit(event.arguments.limit)
    .execute();

  const items = facilities.map(({name, email, phoneNumber, streetWithNumber, zipCode, city}) => ({
    location: {
      lat: 12.345,
      lon: 67.890,
    },
    name,
    email,
    phoneNumber,
    address: {
      streetWithNumber,
      zipCode,
      city
    }
  }));

  const pageInfo = {
    totalCount: items.length,
    first: "",
    last: "",
  }

  return {
    items,
    pageInfo
  }
};
