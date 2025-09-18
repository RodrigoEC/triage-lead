import leads from './leads.json';

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

const LEADS_STORAGE_KEY = 'leadsData';

/**
 * Initializes the leads data. It first tries to load from localStorage.
 * If no data is found in localStorage, it falls back to the static JSON file
 * and then saves this initial data to localStorage for future sessions.
 */
const initializeLeads = (): Lead[] => {
  try {
    const storedLeads = localStorage.getItem(LEADS_STORAGE_KEY);
    if (storedLeads) {
      return JSON.parse(storedLeads);
    }
  } catch (error) {
    console.error("Error reading from localStorage:", error);
  }

  const initialData: Lead[]= [...leads as Lead[]];

  try {
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(initialData));
  } catch (error) {
    console.error("Error writing to localStorage:", error);
  }
  return initialData;
};

let leadsData: Lead[] = initializeLeads();

const saveLeadsToStorage = (data: Lead[]) => {
  localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(data));
};

interface GetLeadsOptions {
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

const scoreValues: Record<Lead['score'], number> = {
  Hot: 4,
  High: 3,
  Medium: 2,
  Low: 1,
};

/**
 * READ: Retrieves all leads, with optional filtering and sorting.
 * @param options - An object with optional filters and sorting parameters.
 */
export const getLeads = (options: GetLeadsOptions = {}): Lead[] => {
  const { filters, sorting } = options;
  let result = [...leadsData];

  if (filters) {
    const nameRegex = filters.name ? new RegExp(filters.name) : null
    const emailRegex = filters.email ? new RegExp(filters.email) : null
    const companyRegex = filters.company ? new RegExp(filters.company) : null

    result = result.filter(lead =>
      (!nameRegex || nameRegex.test(lead.name)) &&
      (!emailRegex || emailRegex.test(lead.email)) &&
      (!companyRegex || companyRegex.test(lead.company)) &&
      (!filters.status || lead.status === filters.status)
    );
  }

  if (sorting?.score) {
    const direction = sorting.score === 'asc' ? 1 : -1;
    result.sort((a, b) => (scoreValues[a.score] - scoreValues[b.score]) * direction);
  }

  return result;
};

/**
 * UPDATE: Modifies an existing lead by its ID.
 * @param id - The ID of the lead to update.
 * @param updates - An object with the properties to update.
 */
export const updateLead = (id: number, updates: Partial<Omit<Lead, 'id'>>): Lead | undefined => {
  const leadIndex = leadsData.findIndex(lead => lead.id === id);
  if (leadIndex === -1) return undefined;

  const tempLeads = [...leadsData];
  const updatedLead = { ...leadsData[leadIndex], ...updates };
  tempLeads[leadIndex] = updatedLead;
  leadsData = tempLeads;

  saveLeadsToStorage(leadsData);
  return updatedLead;
};
