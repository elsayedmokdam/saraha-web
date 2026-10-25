/** Every successful response of the API: `successResponse({ res, data, message, status })` */
export interface ApiResponse<T = undefined> {
  message: string;
  status: number;
  data: T;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/** Shape returned by the API's `find()` / `aggregate()` repository helpers */
export interface Paginated<T> {
  count: number;
  data: T[];
  meta: PaginationMeta;
}

export interface PaginationParams {
  page?: string;
  limit?: string;
}
