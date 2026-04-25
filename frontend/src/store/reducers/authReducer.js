const initialState = {
  isLoggedIn: false,
  user: null,
  role: null, // 'user' or 'admin'
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isLoggedIn: true,
        user: action.payload,
        role: action.payload.role,
      };
    case 'LOGOUT':
      return {
        ...state,
        isLoggedIn: false,
        user: null,
        role: null,
      };
    default:
      return state;
  }
};

export default authReducer;