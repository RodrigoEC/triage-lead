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

// In a real app, this would be a database. For this demo, we're using an
// in-memory array initialized with data from the JSON file.
let leadsData: Lead[] = [...leads];

/**
 * READ: Retrieves all leads.
 */
export const getLeads = (): Lead[] => {
  return leadsData;
};

/**
 * CREATE: Adds a new lead to the dataset.
 * @param newLeadData - The lead data to add, without an 'id'.
 */
export const createLead = (newLeadData: Omit<Lead, 'id'>): Lead => {
  const newId = leadsData.length > 0 ? Math.max(...leadsData.map(l => l.id)) + 1 : 1;
  const newLead: Lead = { id: newId, ...newLeadData };
  leadsData.push(newLead);
  return newLead;
};

/**
 * UPDATE: Modifies an existing lead by its ID.
 * @param id - The ID of the lead to update.
 * @param updates - An object with the properties to update.
 */
export const updateLead = (id: number, updates: Partial<Omit<Lead, 'id'>>): Lead | undefined => {
  const leadIndex = leadsData.findIndex(lead => lead.id === id);
  if (leadIndex === -1) return undefined;

  const updatedLead = { ...leadsData[leadIndex], ...updates };
  leadsData[leadIndex] = updatedLead;
  return updatedLead;
};

/**
 * DELETE: Removes a lead from the dataset by its ID.
 * @param id - The ID of the lead to delete.
 */
export const deleteLead = (id: number): boolean => {
  const initialLength = leadsData.length;
  leadsData = leadsData.filter(lead => lead.id !== id);
  return leadsData.length < initialLength;
};
