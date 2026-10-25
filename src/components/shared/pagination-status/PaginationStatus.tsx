import { FaSpinner } from "react-icons/fa6";
import AppButton from "../app-button/AppButton";

interface PaginationStatusProps {
  hasMorePages: boolean;
  currentPageNum: number;
  /** omit when the API cannot tell (identity requests) */
  totalPages?: number;
  isLoading: boolean;
  hasError: boolean;
  handleLoadMore: () => void;
  itemsCount: number;
  errorMessage?: string;
  noun?: string;
}

export default function PaginationStatus({
  hasMorePages,
  currentPageNum,
  totalPages,
  isLoading,
  hasError,
  handleLoadMore,
  itemsCount,
  errorMessage,
  noun = "items",
}: PaginationStatusProps) {
  return (
    <div className="mt-10 flex flex-col items-center gap-4">
      {/* Error */}
      {hasError && (
        <p className="text-red-500 dark:text-red-300 text-sm font-medium text-center">
          {errorMessage || "Something went wrong. Please try again."}
        </p>
      )}

      {/* Load More */}
      {hasMorePages && (
        <AppButton
          onClick={handleLoadMore}
          disabled={isLoading}
          className="px-8 py-6 bg-main-color text-white font-semibold rounded-lg hover:bg-main-color/90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <FaSpinner className="animate-spin" />
              <span>Loading</span>
            </>
          ) : (
            <span>Load More</span>
          )}
        </AppButton>
      )}

      {/* End of list */}
      {!hasMorePages && itemsCount > 0 && (
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-muted">
            <span className="text-muted-foreground text-lg">✓</span>
          </div>
          <p className="text-muted-foreground text-sm font-medium">
            You’ve reached the end
          </p>
          <p className="text-muted-foreground/70 text-xs">No more {noun} to display</p>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && itemsCount === 0 && !hasError && (
        <p className="text-muted-foreground/70 text-sm">No data available</p>
      )}

      {/* Pagination info */}
      {itemsCount > 0 && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-4 py-2 rounded-full border border-border">
          <span className="font-medium text-foreground">Page {currentPageNum}</span>
          {totalPages ? (
            <>
              <span className="text-muted-foreground/70">/</span>
              <span>{totalPages}</span>
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}
