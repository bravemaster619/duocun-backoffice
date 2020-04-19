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
  fields = [],
  sort = []
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
  if (sort && sort.length) {
    query.options.sort = sort;
  }
  return JSON.stringify(query);
};

export const treefyAttributeData = flatData => {
  const treeData = [];
  flatData.forEach(data => {
    const dataInTree = treeData.find(
      treeData => treeData.attrIdx === data.attrIdx
    );
    if (dataInTree) {
      if (dataInTree.valIndices) {
        dataInTree.valIndices.push(data.valIdx);
      } else {
        dataInTree.valIndices = [data.valIdx];
      }
    } else {
      treeData.push({
        attrIdx: data.attrIdx,
        valIndices: [data.valIdx]
      });
    }
  });
  return treeData;
};