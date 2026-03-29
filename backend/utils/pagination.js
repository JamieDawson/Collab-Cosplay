/** Shared pagination for ads list endpoints (matches frontend POSTS_PER_PAGE default). */

const DEFAULT_PAGE_SIZE = 6;
const MAX_PAGE_SIZE = 50;

/** Parse ?page= & ?limit= from Express req.query */
function parsePagination(req, defaultLimit = DEFAULT_PAGE_SIZE) {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  let limit = parseInt(req.query.limit, 10);
  if (Number.isNaN(limit) || limit < 1) limit = defaultLimit;
  limit = Math.min(MAX_PAGE_SIZE, limit);
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

module.exports = {
  parsePagination,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
};
