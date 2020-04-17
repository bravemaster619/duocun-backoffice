import ApiService from "services/api/ApiService";

export default {
  getAttribute: id => {
    return ApiService.v2().get(`admin/attributes/${id}`);
  },
  saveAttribute: model => {
    if (!model.id) {
      model.id = "new";
    }
    return ApiService.v2().post(`admin/attributes/${model.id}`, model);
  }
};
