export default function authReducer(state = { isAuthorized: false }, action) {
  switch (action.type) {
    case "SIGN_IN":
      return {
        ...state,
        isAuthorized: true
      };
    case "SIGN_OUT":
      return {
        ...state,
        isAuthorized: false
      };
    default:
      return state;
  }
}
