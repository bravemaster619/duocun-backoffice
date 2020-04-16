import ApiService from "services/api/ApiService";
import { buildPaginationQuery } from "helper/index";
export default {
  getProductList: (page, pageSize, search = "") => {
    let query = {};
    if (!search) {
      query.query = buildPaginationQuery(page, pageSize);
    } else {
      const condition = {
        name: {
          $regex: search
        }
      };
      query.query = buildPaginationQuery(page, pageSize, condition);
    }
    return ApiService.v2().get("admin/Products", query);
  }
};
