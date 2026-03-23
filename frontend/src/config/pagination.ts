/** Posts per page — keep in sync with backend default (adsController DEFAULT_PAGE_SIZE). */
export const POSTS_PER_PAGE = 6;

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};
