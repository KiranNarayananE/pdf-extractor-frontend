import { createSlice } from "@reduxjs/toolkit";

export const userAuth = createSlice({
    name: "User",
    initialState: {
        Token: null,
    },
    reducers: {
        userLogin(state, action) {
            state.Token = action.payload.token;
            
        },
        userLogout(state, action) {
            state.Token = "";
        },
    },
});
export const { userLogin, userLogout } = userAuth.actions;
export default userAuth.reducer;