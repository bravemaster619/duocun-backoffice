import ApiService from "services/api/ApiService";

export default {
  login: (username, password) => {
    return ApiService.v1().post(
      "Accounts/login",
      {
        username,
        password
      },
      false
    );
  },
  getCurrentUser: tokenId => {
    return ApiService.v1().get("Accounts/current", {
      tokenId
    });
  }
};
