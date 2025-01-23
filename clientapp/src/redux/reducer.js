const initialState = {};

function Reducer(state = initialState, action) {
  switch (action.type) {
    case "DEMO":
      return { ...state };
    default:
      return state;
  }
}

export default Reducer;
