import { Enrollment } from "../graphql/dto";
import { toAWSDateTime } from "../graphql/helpers";
import { EnrollmentRow } from "../database/schema/enrollment-table";

export function toEnrollmentDto({id, approved, createdAt, expirationAt}: EnrollmentRow): Omit<Enrollment, 'facility'> {
  return {
    id,
    approved,
    expirationAt: toAWSDateTime(expirationAt),
    createdAt: toAWSDateTime(createdAt),
  }
}
