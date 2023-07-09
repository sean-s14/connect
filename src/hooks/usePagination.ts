import useSWRInfinite, { SWRInfiniteConfiguration } from "swr/infinite";

export default function usePagination<T>(
  url: string,
  limit: number = 10,
  fetcher: (url: string) => Promise<T[]> = (url) =>
    fetch(url).then((r) => r.json()),
  options?: SWRInfiniteConfiguration
) {
  const getKey = (pageIndex: number, previousPageData: T[]) => {
    if (previousPageData && !previousPageData.length) return null;
    if (url.includes("?")) return `${url}&page=${pageIndex + 1}&limit=${limit}`;
    return `${url}?page=${pageIndex + 1}&limit=${limit}`;
  };

  const { data, error, size, setSize, mutate, isLoading, isValidating } =
    useSWRInfinite<T[]>(getKey, fetcher, options);

  const flattenedData = data?.flat();

  const isLoadingMore =
    size > 0 && data && typeof data[size - 1] === "undefined";

  const hasReachedEnd = data && data[data.length - 1]?.length < limit;

  return {
    data,
    flattenedData,
    error,
    size,
    setSize,
    mutate,
    isLoading,
    isValidating,
    isLoadingMore,
    hasReachedEnd,
  };
}
