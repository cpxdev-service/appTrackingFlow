const initialState = {
  mainload: false,
  login: localStorage.getItem("isAdmin") !== null,
};

function Reducer(state = initialState, action) {
  switch (action.type) {
    case "SET_MAINLOAD":
      return { ...state, mainload: action.payload };
    case "SET_LOGIN":
      return { ...state, login: action.payload };
    default:
      return state;
  }
}

export default Reducer;
