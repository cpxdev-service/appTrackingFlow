const initialState = {
  mainload: false
};

function Reducer(state = initialState, action) {
  switch (action.type) {
    case "SET_MAINLOAD":
      return { ...state, mainload: action.payload };
    default:
      return state;
  }
}

export default Reducer;
