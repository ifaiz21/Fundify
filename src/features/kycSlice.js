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
    documents: {
        frontIdFile: null,
        backIdFile: null,
    },
};

const kycSlice = createSlice({
    name: 'kyc',
    initialState,
    reducers: {
        updateKycFormData: (state, action) => {
            state.formData = { ...state.formData, ...action.payload };
        },
        updateKycDocument: (state, action) => {
            const { fileType, file } = action.payload; // fileType hoga 'frontIdFile' ya 'backIdFile'
            state.documents[fileType] = file;
        },
        clearKycData: (state) => {
            state.formData = initialState.formData;
            state.documents = initialState.documents;
        },
    },
});

export const { updateKycFormData, updateKycDocument ,clearKycData } = kycSlice.actions;

export default kycSlice.reducer;
