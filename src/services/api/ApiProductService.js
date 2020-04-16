import ApiService from "services/api/ApiService";
import { buildPaginationQuery } from "helper/index";
export default {
  getProductList: (page, pageSize) => {
    return ApiService.v2().get("admin/Products", {
      query: buildPaginationQuery(page, pageSize)
    });
  }
};
