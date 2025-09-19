import type {
  GetOpportunitiesOptions,
  GetOpportunitiesResponse,
  IOpportunity,
} from '../util/interfaces';
import opportunities from './opportunities.json';

const OPPORTUNITIES_STORAGE_KEY = 'opportunitiesData';

/**
 * Initializes the opportunities data. It first tries to load from localStorage.
 * If no data is found in localStorage, it falls back to the static JSON file
 * and then saves this initial data to localStorage for future sessions.
 */
const initializeOpportunities = (): IOpportunity[] => {
  try {
    const storedOpportunities = localStorage.getItem(OPPORTUNITIES_STORAGE_KEY);
    if (storedOpportunities) {
      return JSON.parse(storedOpportunities);
    }
  } catch (error) {
    console.error('Error reading from localStorage:', error);
  }

  const initialData: IOpportunity[] = [...(opportunities as IOpportunity[])];

  try {
    localStorage.setItem(OPPORTUNITIES_STORAGE_KEY, JSON.stringify(initialData));
  } catch (error) {
    console.error('Error writing to localStorage:', error);
  }
  return initialData;
};

let opportunitiesData: IOpportunity[] = initializeOpportunities();

const saveOpportunitiesToStorage = (data: IOpportunity[]) => {
  localStorage.setItem(OPPORTUNITIES_STORAGE_KEY, JSON.stringify(data));
};

/**
 * READ: Retrieves all opportunities, with optional filtering and sorting.
 * @param options - An object with optional filters and sorting parameters.
 */
export const getOpportunities = (
  options: GetOpportunitiesOptions = {},
): Promise<GetOpportunitiesResponse> => {
  return new Promise(resolve => {
    const randomTimeout = Math.random() * 500 + 500;

    setTimeout(() => {
      const { filters, sorting, pagination } = options;
      let result = [...opportunitiesData];

      if (filters) {
        const nameRegex = filters.name ? new RegExp(filters.name, 'i') : null;
        const accountNameRegex = filters.accountName
          ? new RegExp(filters.accountName, 'i')
          : null;

        result = result.filter(
          opportunity =>
            (!nameRegex || nameRegex.test(opportunity.name)) &&
            (!accountNameRegex ||
              accountNameRegex.test(opportunity.accountName)) &&
            (!filters.stage || opportunity.stage === filters.stage),
        );
      }
      if (sorting?.amount) {
        const direction = sorting.amount === 'asc' ? 1 : -1;
        result.sort((a, b) => ((a.amount ?? 0) - (b.amount ?? 0)) * direction);
      }

      const total = result.length;

      if (pagination) {
        const { page, limit } = pagination;
        const start = (page - 1) * limit;
        result = result.slice(start, start + limit);
      }

      resolve({ opportunities: result, total });
    }, randomTimeout);
  });
};

/**
 * UPDATE: Modifies an existing opportunity by its ID.
 * @param id - The ID of the opportunity to update.
 * @param updates - An object with the properties to update.
 */
export const updateOpportunity = (
  id: string,
  updates: Partial<Omit<IOpportunity, 'id'>>,
): IOpportunity | undefined => {
  const opportunityIndex = opportunitiesData.findIndex(
    opportunity => opportunity.id === id,
  );
  if (opportunityIndex === -1) return undefined;

  const tempOpportunities = [...opportunitiesData];
  const updatedOpportunity = {
    ...opportunitiesData[opportunityIndex],
    ...updates,
  };
  tempOpportunities[opportunityIndex] = updatedOpportunity;
  opportunitiesData = tempOpportunities;

  saveOpportunitiesToStorage(opportunitiesData);
  return updatedOpportunity;
};
