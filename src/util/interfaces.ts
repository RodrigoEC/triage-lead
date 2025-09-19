export interface GetLeadsOptions {
  filters?: {
    status?: ILead['status'];
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
export interface ILead {
  id: number;
  name: string;
  company: string;
  email: string;
  source: string;
  score: number;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'disqualified';
}

export interface GetLeadsResponse {
  leads: ILead[];
  total: number;
}


export type SortOptions = 'asc' | 'desc' | "unsorted";