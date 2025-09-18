import type { Lead } from "./interfaces";

export const STATUS_OPTIONS: Lead["status"][] = [
  "New",
  "Contacted",
  "Qualified",
  "Converted",
  "Disqualified",
];

export const TABLE_HEADERS = {
  name: { search: true },
  company: { search: true },
  email: { search: true },
  status: { filter: true },
  score: { sort: true },
  action: {},
  "convert lead": {},
};
