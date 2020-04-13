const Auth = () => {
  const TOKEN_KEY = "duocun_admin_token";

  return {
    login: token => {
      window.localStorage.setItem(TOKEN_KEY, token);
    },
    logout: () => {
      window.localStorage.removeItem(TOKEN_KEY);
      window.location.href = "/admin/login";
    },
    isAuthenticated: () => {
      return !!window.localStorage.getItem(TOKEN_KEY);
    },
    getAuthToken: () => {
      return window.localStorage.getItem(TOKEN_KEY);
    }
  };
};

export default Auth();
