export interface GetLeadsOptions {
  filters?: {
    status?: Lead['status'];
    email?: string;
    name?: string;
    company?: string;
  };
  sorting?: {
    score?: 'asc' | 'desc';
  };
  pagination?: {
    page: number;
    limit: number;
  };
}

/**
 * Defines the structure of a Lead object for type safety.
 */
export interface Lead {
  id: number;
  name: string;
  company: string;
  email: string;
  source: string;
  score: 'hot' | 'medium' | 'high' | 'low';
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'disqualified';
}

export interface GetLeadsResponse {
  leads: Lead[];
  total: number;
}


export type SortOptions = 'asc' | 'desc' | "unsorted";