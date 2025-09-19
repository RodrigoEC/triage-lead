import type { Lead } from "./interfaces";

export const STATUS_OPTIONS: Lead["status"][] = [
  "new",
  "contacted",
  "qualified",
  "converted",
  "disqualified",
];


export const SORT_OPTIONS = ["asc", "desc", "none"];

export const DEFAULT_STATUS = "all";

export const DEFAULT_SORT = "none";