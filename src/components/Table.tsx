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
  const [filters, setFilters] = useState<Record<string, unknown>>({});
  const [sorting, setSorting] = useState<SortOptions>(DEFAULT_SORT);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);

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

    const response = await fetchData(options);
    setData(response[dataKey] as T[]);
    setTotalItems(response.total);
    setLoading(false);
  }, [
    filters,
    rootFilter,
    sorting,
    page,
    fetchData,
    dataKey,
    itemsPerPage,
    sortKey,
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
      <div className="w-full overflow-scroll ">
        <table className="w-full divide-gray-200">
          <TableHeadComponent
            onFilterChange={handleFilterChange}
            onSortChange={handleSortChange}
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
