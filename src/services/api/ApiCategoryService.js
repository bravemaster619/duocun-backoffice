import ApiService from "services/api/ApiService";
import { buildPaginationQuery } from "helper";

export default {
  getCategoryList: (page, pageSize, parentId = "", sort = []) => {
    const query = {};
    if (parentId) {
      query.query = buildPaginationQuery(
        page,
        pageSize,
        {
          parentId
        },
        [],
        sort
      );
    } else {
      query.query = buildPaginationQuery(page, pageSize, {}, [], sort);
    }
    return ApiService.v2().get("admin/categories", query);
  },
  getCategoryTree: () => {
    return ApiService.v2().get("admin/categories/category-tree");
  },
  saveCategory: model => {
    if (!model.id) {
      model._id ? (model.id = model._id) : (model.id = "new");
    }
    return ApiService.v2().post(`admin/categories/${model.id}`, model);
  },
  getCategory: id => {
    return ApiService.v2().get(`admin/categories/${id}`);
  },
  removeCategory: id => {
    return ApiService.v2().delete(`admin/categories/${id}`);
  }
};
