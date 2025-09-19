import type { ILead } from "./interfaces";

export const STATUS_OPTIONS: ILead["status"][] = [
  "new",
  "contacted",
  "qualified",
  "converted",
  "disqualified",
];

export const DEFAULT_SORT = "unsorted";

export const SORT_OPTIONS = ["asc", "desc", DEFAULT_SORT];

export const DEFAULT_STATUS = "all";

export const LEADS_PER_PAGE = 10;
