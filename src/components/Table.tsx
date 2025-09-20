import { useCallback, useEffect, useState } from "react";
import type { SortOptions } from "../util/interfaces";
import { Icon } from "./Icon";
import { DEFAULT_SORT } from "../util/constants";
import { TableNav } from "./TableNav";
import { SlideOver } from "./SlideOver";

type FetchDataResponse<T> = {
  [key: string]: T[] | number;
  total: number;
};

export type FetchDataOptions = {
  filters?: Record<string, unknown>;
  sorting?: Record<string, "asc" | "desc">;
  pagination?: {
    page: number;
    limit: number;
  };
};

type FetchDataFunction<T, U extends FetchDataOptions> = (
  options: U
) => Promise<FetchDataResponse<T>>;

interface TableProps<T, U extends FetchDataOptions> {
  fetchData: FetchDataFunction<T, U>;
  dataKey: string;
  renderRow: (
    item: T,
    onRowClick: () => void,
    onUpdate: () => void
  ) => React.ReactNode;
  TableHeadComponent: React.ComponentType<{
    onFilterChange: (field: string, value: string) => void;
    onSortChange: (field: SortOptions) => void;
    filters: Record<string, unknown>;
    sorting: SortOptions;
  }>;
  renderSlideOverContent?: (
    item: T,
    onUpdate: () => void,
    onClose: () => void
  ) => React.ReactNode;
  itemsPerPage: number;
  noDataMessage: string;
  sortKey: string;
  slideOverTitle?: string;
  rootFilter?: U;
}

export const Table = <T, U extends FetchDataOptions>({
  fetchData,
  dataKey,
  renderRow,
  TableHeadComponent,
  renderSlideOverContent,
  itemsPerPage,
  noDataMessage,
  sortKey,
  slideOverTitle,
  rootFilter,
}: TableProps<T, U>) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const storageKey = `tableState-${dataKey}`;

  const getInitialState = () => {
    try {
      const savedState = localStorage.getItem(storageKey);
      if (savedState) {
        const parsed = JSON.parse(savedState);
        return {
          filters: parsed.filters || {},
          sorting: parsed.sorting || DEFAULT_SORT,
          page: parsed.page || 1,
        };
      }
    } catch (error) {
      console.error('Error reading from localStorage', error);
    }
    return {
      filters: {},
      sorting: DEFAULT_SORT,
      page: 1,
    };
  };

  const [initialState] = useState(getInitialState);

  const [filters, setFilters] = useState<Record<string, unknown>>(
    initialState.filters,
  );
  const [sorting, setSorting] = useState<SortOptions>(initialState.sorting);
  const [page, setPage] = useState(initialState.page);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);

  useEffect(() => {
    try {
      const stateToSave = JSON.stringify({ filters, sorting, page });
      localStorage.setItem(storageKey, stateToSave);
    } catch (error) {
      console.error('Error writing to localStorage', error);
    }
  }, [filters, sorting, page, storageKey]);

  const fetchDataCallback = useCallback(async () => {
    setLoading(true);
    const options = {
      ...rootFilter,
      filters: {
        ...rootFilter?.filters,
        ...filters,
      },
      pagination: {
        page,
        limit: itemsPerPage,
      },
    } as U;

    if (sorting !== DEFAULT_SORT) {
      options.sorting = { [sortKey]: sorting };
    }

    const response = fetchData(options);

    response
      .then((response) => {
        setData(response[dataKey] as T[]);
        setTotalItems(response.total);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });

    if (!data) {
      setLoading(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    rootFilter,
    filters,
    page,
    itemsPerPage,
    sorting,
    fetchData,
    sortKey,
    dataKey,
  ]);

  useEffect(() => {
    fetchDataCallback();
  }, [fetchDataCallback]);

  const handleFilterChange = useCallback((field: string, value: string) => {
    setPage(1);
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value,
    }));
  }, []);

  const handleSortChange = (sort: SortOptions) => {
    setPage(1);
    setSorting(sort);
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleNextPage = () => page < totalPages && setPage(page + 1);
  const handlePrevPage = () => page > 1 && setPage(page - 1);

  return (
    <div className={`w-full rounded-lg box-border overflow-hidden`}>
      <div className="w-full overflow-auto ">
        <table className="w-full divide-gray-200">
          <TableHeadComponent
            onFilterChange={handleFilterChange}
            onSortChange={handleSortChange}
            filters={filters}
            sorting={sorting}
          />
          {!loading && (
            <tbody className="w-full divide-y divide-gray-700">
              {data.map((item) =>
                renderRow(item, fetchDataCallback, () => setSelectedItem(item))
              )}
            </tbody>
          )}
        </table>
      </div>

      {loading && (
        <div className="w-full h-52 flex flex-col items-center justify-center border-1 border-gray-200 rounded-b-lg text-gray-400">
          <Icon id="loading" size={40} className="animate-spin" />
          <p className="mt-4 uppercase text-sm">Loading...</p>
        </div>
      )}
      {!loading && !data.length && (
        <div className="w-full h-52 flex flex-col items-center justify-center border-1 border-gray-200 rounded-b-lg text-gray-400">
          <p>{noDataMessage}</p>
        </div>
      )}
      {!loading && totalPages > 1 && (
        <TableNav
          page={page}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onNextPage={handleNextPage}
          onPrevPage={handlePrevPage}
        />
      )}
      {slideOverTitle && renderSlideOverContent && (
        <SlideOver
          isOpen={selectedItem !== null}
          onClose={() => setSelectedItem(null)}
          title={slideOverTitle}
        >
          {selectedItem &&
            renderSlideOverContent(selectedItem, fetchDataCallback, () =>
              setSelectedItem(null)
            )}
        </SlideOver>
      )}
    </div>
  );
};
