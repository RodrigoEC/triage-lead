import type { FetchDataOptions, FetchDataResponse } from "./types";

export interface GetLeadsOptions extends FetchDataOptions {
  filters?: {
    status?: ILead["status"];
    email?: string;
    name?: string;
    company?: string;
  };
  sorting?: {
    score?: "asc" | "desc";
  };
  pagination?: {
    page: number;
    limit: number;
  };
}

/**
 * Defines the structure of a Lead object for type safety.
 */
export interface ILead {
  id: number;
  name: string;
  company: string;
  email: string;
  source: string;
  score: number;
  status: "new" | "contacted" | "qualified" | "converted" | "disqualified";
}

export interface GetLeadsResponse extends FetchDataResponse<ILead> {
  leads: ILead[];
  total: number;
}

export interface GetOpportunitiesOptions extends FetchDataOptions {
  filters?: {
    stage?: IOpportunity["stage"];
    name?: string;
    accountName?: string;
  };
  sorting?: {
    amount?: "asc" | "desc";
  };
  pagination?: {
    page: number;
    limit: number;
  };
}

export interface IOpportunity {
  id: string;
  name: string;
  stage:
    | "Prospecting"
    | "Proposal Sent"
    | "Negotiation"
    | "Closed Won"
    | "Closed Lost";
  amount: number | null;
  accountName: string;
}

export interface GetOpportunitiesResponse
  extends FetchDataResponse<IOpportunity> {
  opportunities: IOpportunity[];
  total: number;
}

export type SortOptions = "asc" | "desc" | "unsorted";
