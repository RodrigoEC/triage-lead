export type FetchDataResponse<T> = {
  [key: string]: T[] | number;
  total: number;
};

export type FetchDataOptions = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filters?: Record<string, any>;
  sorting?: Record<string, 'asc' | 'desc'>;
  pagination?: {
    page: number;
    limit: number;
  };
};
