const paginationParameters = ['page', 'limit', 'sortBy', 'order', 'search', 'q'];

function parseInteger(value, fallback) {
  if (value === undefined) return fallback;
  if (!/^\d+$/.test(String(value))) return null;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) ? parsed : null;
}

function readListOptions(query, { sortFields, filterFields, defaultSort, maxLimit = 100 }) {
  const page = parseInteger(query.page, 1);
  const limit = parseInteger(query.limit, 50);
  if (!page || page < 1) return { error: 'Page must be a positive integer.' };
  if (!limit || limit < 1 || limit > maxLimit) {
    return { error: `Limit must be an integer between 1 and ${maxLimit}.` };
  }

  const sortBy = query.sortBy === undefined ? defaultSort : String(query.sortBy);
  if (!Object.hasOwn(sortFields, sortBy)) return { error: 'Unsupported sort field.' };

  const order = query.order === undefined ? 'desc' : String(query.order).toLowerCase();
  if (order !== 'asc' && order !== 'desc') return { error: 'Order must be asc or desc.' };

  const rawSearch = query.search === undefined ? query.q : query.search;
  if (rawSearch !== undefined && typeof rawSearch !== 'string') {
    return { error: 'Search must be text.' };
  }
  const search = String(rawSearch || '').trim();
  if (search.length > 100) return { error: 'Search must be at most 100 characters.' };

  const filters = {};
  for (const parameter of Object.keys(filterFields)) {
    if (query[parameter] === undefined) continue;
    if (typeof query[parameter] !== 'string' || query[parameter].length > 100) {
      return { error: `${parameter} must be text of at most 100 characters.` };
    }
    if (query[parameter].trim()) filters[parameter] = query[parameter].trim().toLowerCase();
  }

  return {
    value: {
      page,
      limit,
      sortBy,
      order,
      search: search.toLowerCase(),
      filters,
      requested: paginationParameters.some((parameter) => query[parameter] !== undefined) ||
        Object.keys(filterFields).some((parameter) => query[parameter] !== undefined),
    },
  };
}

function fieldValue(item, fields) {
  for (const field of fields) {
    if (item[field] !== undefined && item[field] !== null) return item[field];
  }
  return '';
}

function compareValues(left, right) {
  if (left instanceof Date && right instanceof Date) return left - right;
  return String(left).localeCompare(String(right), undefined, { numeric: true, sensitivity: 'base' });
}

function applyListQuery(items, query, configuration) {
  const options = readListOptions(query, configuration);
  if (options.error) return options;
  const { value } = options;
  if (!value.requested) return { data: items, requested: false };

  const filtered = items.filter((item) => {
    for (const [parameter, expected] of Object.entries(value.filters)) {
      const fields = configuration.filterFields[parameter];
      if (!fields.some((field) => String(item[field] ?? '').toLowerCase() === expected)) return false;
    }
    if (value.search && !configuration.searchFields.some((field) => (
      String(item[field] ?? '').toLowerCase().includes(value.search)
    ))) return false;
    return true;
  });

  const direction = value.order === 'asc' ? 1 : -1;
  const sortFields = configuration.sortFields[value.sortBy];
  filtered.sort((left, right) => direction * compareValues(
    fieldValue(left, sortFields),
    fieldValue(right, sortFields),
  ));

  const offset = (value.page - 1) * value.limit;
  if (!Number.isSafeInteger(offset)) return { error: 'Page is too large.' };
  return {
    data: filtered.slice(offset, offset + value.limit),
    requested: true,
    pagination: {
      page: value.page,
      limit: value.limit,
      totalItems: filtered.length,
      totalPages: Math.ceil(filtered.length / value.limit),
      hasNextPage: offset + value.limit < filtered.length,
      hasPreviousPage: value.page > 1,
    },
  };
}

module.exports = { applyListQuery };