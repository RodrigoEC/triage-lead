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
  score: 'Hot' | 'Medium' | 'High' | 'Low';
  status: 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Disqualified';
}