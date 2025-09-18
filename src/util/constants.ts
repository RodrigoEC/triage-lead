import type { Lead } from "../api";

export const STATUS_OPTIONS: Lead["status"][] = [
  "New",
  "Contacted",
  "Qualified",
  "Converted",
  "Disqualified",
];