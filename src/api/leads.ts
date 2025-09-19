import type { GetLeadsOptions, GetLeadsResponse, ILead, IOpportunity } from "../util/interfaces";
import leads from "./leads.json";
import { createOpportunity } from "./opportunities";

const LEADS_STORAGE_KEY = "leadsData";

/**
 * Initializes the leads data. It first tries to load from localStorage.
 * If no data is found in localStorage, it falls back to the static JSON file
 * and then saves this initial data to localStorage for future sessions.
 */
const initializeLeads = (): ILead[] => {
  try {
    const storedLeads = localStorage.getItem(LEADS_STORAGE_KEY);
    if (storedLeads) {
      return JSON.parse(storedLeads);
    }
  } catch (error) {
    console.error("Error reading from localStorage:", error);
  }

  const initialData: ILead[] = [...(leads as ILead[])];

  try {
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(initialData));
  } catch (error) {
    console.error("Error writing to localStorage:", error);
  }
  return initialData;
};

let leadsData: ILead[] = initializeLeads();

const saveLeadsToStorage = (data: ILead[]) => {
  localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(data));
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
        result.sort((a, b) => (a.score - b.score) * direction);
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
  updates: Partial<Omit<ILead, "id">>
): ILead | undefined => {
  const leadIndex = leadsData.findIndex((lead) => lead.id === id);
  if (leadIndex === -1) return undefined;

  const tempLeads = [...leadsData];
  const updatedLead = { ...leadsData[leadIndex], ...updates };
  tempLeads[leadIndex] = updatedLead;
  leadsData = tempLeads;

  saveLeadsToStorage(leadsData);
  return updatedLead;
};

/**
 * CONVERT: Converts a lead to an opportunity.
 * @param lead - The lead to convert.
 */
export const convertLead = (lead: ILead): IOpportunity => {
  updateLead(lead.id, { status: "converted" });

  const newOpportunity = createOpportunity({
    name: lead.name,
    accountName: lead.company,
    stage: "Prospecting",
    amount: null,
  });

  return newOpportunity;
};
