import { createSlice } from '@reduxjs/toolkit';

const errorSlice = createSlice({
    name: 'error',
    initialState: {
        isError: false,
        message: '',
        title: '',
        productData: null,
        navigateTo: null,
        params: null,
        isReportable: false,
    },
    reducers: {
        setError: (state, action) => {
            console.log("error modal is called", action)
            state.isError = true;
            state.message = action.payload.message;
            state.title = action.payload.title || 'Error';
            state.productData = action.payload.productData || null;
            state.navigateTo = action.payload.navigateTo || null;
            state.params = action.payload.params || null;
            state.isReportable = action.payload.isReportable || false;
        },
        clearError: (state) => {
            state.isError = false;
            state.message = '';
            state.title = '';
            state.productData = null;
            state.navigateTo = null;
            state.params = null;
            state.isReportable = false;
        },
    },
});

export const { setError, clearError } = errorSlice.actions;
export default errorSlice.reducer;
