import type { GetLeadsOptions, GetLeadsResponse, Lead } from "../util/interfaces";
import leads from "./leads.json";

const LEADS_STORAGE_KEY = "leadsData";

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

  const initialData: Lead[] = [...(leads as Lead[])];

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

const scoreValues: Record<Lead["score"], number> = {
  hot: 4,
  high: 3,
  medium: 2,
  low: 1,
};

/**
 * READ: Retrieves all leads, with optional filtering and sorting.
 * @param options - An object with optional filters and sorting parameters.
 */
export const getLeads = (options: GetLeadsOptions = {}): Promise<GetLeadsResponse> => {
  return new Promise((resolve) => {
    const randomTimeout = Math.random() * 500 + 500;

    setTimeout(() => {
      const { filters, sorting, pagination } = options;
      let result = [...leadsData];

      console.log(filters)

      if (filters) {
        const nameRegex = filters.name
          ? new RegExp(filters.name.toLocaleLowerCase())
          : null;
        const emailRegex = filters.email
          ? new RegExp(filters.email.toLocaleLowerCase())
          : null;
        const companyRegex = filters.company
          ? new RegExp(filters.company.toLocaleLowerCase())
          : null;

        result = result.filter(
          (lead) =>
            (!nameRegex || nameRegex.test(lead.name.toLocaleLowerCase())) &&
            (!emailRegex || emailRegex.test(lead.email.toLocaleLowerCase())) &&
            (!companyRegex ||
              companyRegex.test(lead.company.toLocaleLowerCase())) &&
            (!filters.status || lead.status === filters.status)
        );
      }
      if (sorting?.score) {
        const direction = sorting.score === "asc" ? 1 : -1;
        result.sort(
          (a, b) => (scoreValues[a.score] - scoreValues[b.score]) * direction
        );
      }

      const total = result.length;

      if (pagination) {
        const { page, limit } = pagination;
        const start = (page - 1) * limit;
        const end = start + limit;
        result = result.slice(start, end);
      }

      resolve({ leads: result, total });
    }, randomTimeout);
  });
};

/**
 * UPDATE: Modifies an existing lead by its ID.
 * @param id - The ID of the lead to update.
 * @param updates - An object with the properties to update.
 */
export const updateLead = (
  id: number,
  updates: Partial<Omit<Lead, "id">>
): Lead | undefined => {
  const leadIndex = leadsData.findIndex((lead) => lead.id === id);
  if (leadIndex === -1) return undefined;

  const tempLeads = [...leadsData];
  const updatedLead = { ...leadsData[leadIndex], ...updates };
  tempLeads[leadIndex] = updatedLead;
  leadsData = tempLeads;

  saveLeadsToStorage(leadsData);
  return updatedLead;
};
