import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        token: '',
        data: {
            image: ''
        }
    },
    reducers: {
        setUserDetails: (state = initialState, action) => {
            state.token = action.payload.token
            state.data = action.payload.user
        },
        updateUserDetails: (state = initialState, action) => {
            state.data = action.payload.user
        },
        updateUserImage: (state = initialState, action) => {
            state.data.image = action.payload.image;
        },
        updateUser: (state = initialState, action) => {
            state.data.fullName = action.payload.fullName;
            state.data.firstName = action.payload.firstName;
            state.data.middleName = action.payload.middleName;
            state.data.lastName = action.payload.lastName;
        },
        updateUserType: (state = initialState, action) => {
            state.data.type = action.payload.type;
            state.data.companyDetails = action.payload.companyDetails;
        },
        updateResume: (state = initialState, action) => {
            state.data.resume = action.payload.resume;
        },
        resetUser: (state) => {
            state.token = '';
            state.data = '';
        },

    }
})
// Action creators are generated for each case reducer function
export const { setUserDetails, resetUser, updateUserDetails, updateUserImage, updateUser, updateUserType, updateResume } = userSlice.actions
export default userSlice.reducer


