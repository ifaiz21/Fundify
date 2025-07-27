// src/features/kycSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    formData: {
        fullName: "",
        dateOfBirth: "",
        address: "",
        idNumber: "",
        documentType: "",
        email: "",
        phoneNumber: "",
    },
};

const kycSlice = createSlice({
    name: 'kyc',
    initialState,
    reducers: {
        updateKycFormData: (state, action) => {
            state.formData = { ...state.formData, ...action.payload };
        },
        clearKycData: (state) => {
            state.formData = initialState.formData;
        },
    },
});

export const { updateKycFormData, clearKycData } = kycSlice.actions;

export default kycSlice.reducer;
