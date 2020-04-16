import queryString from "query-string";

export const getQueryParam = (location, key) => {
  if (location.search) {
    const parsed = queryString.parse(location.search);
    if (parsed[key]) {
      return parsed[key];
    } else {
      return "";
    }
  } else {
    return "";
  }
};

/**
 * @param {int} page needs to start from zero
 * @param {int} pageSize
 * @param {object} condition
 * @param {Array} fields
 * @returns string
 */
export const buildPaginationQuery = (
  page = 0,
  pageSize = 10,
  condition = {},
  fields = []
) => {
  const query = {
    where: condition,
    options: {
      limit: pageSize,
      skip: page * pageSize
    }
  };
  if (fields && fields.length) {
    const projection = {};
    fields.forEach(field => {
      projection[field] = true;
    });
    query.options.projection = projection;
  }
  return JSON.stringify(query);
};
