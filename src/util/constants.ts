import type { Lead } from "./interfaces";

export const STATUS_OPTIONS: Lead["status"][] = [
  "New",
  "Contacted",
  "Qualified",
  "Converted",
  "Disqualified",
];

export const TABLE_HEADERS = [
  "name",
  "company",
  "email",
  "status",
  "score",
  "action",
  "convert lead"
];