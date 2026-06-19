export type ApiListResponse<T> = {
  count: number;
  results: T[];
  next?: string | null;
  previous?: string | null;
};

export type ApiError = {
  detail: string;
  code?: string;
};

export type ApiSuccessResponse<T> = {
  data: T;
};
