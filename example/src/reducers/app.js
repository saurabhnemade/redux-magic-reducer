const INITIAL_STATE = {
    app_a: "a",
    app_b: "b"
};

const Reducer = (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case "GLOBAL_CHANGE_ACTION":
            return {
                ...state,
                globalChangeAction: 'executed'
            };
        default: {
            return state;
        }
    }
};

export default Reducer;
