import { isRejectedWithValue } from '@reduxjs/toolkit';
import { setError } from '../slices/errorSlice';

const errorMiddleware = ({ dispatch }) => (next) => (action) => {
    if (isRejectedWithValue(action)) {

        console.log("handled error in between",action )
        dispatch(
            setError({
                message: action.payload?.data?.message || 'An unexpected error occurred.',
                title: 'Error',
                productData: action.meta?.arg || null,
                navigateTo: 'Home', // Example navigation
                params: null,
                isReportable: true, // Toggle this based on conditions
            })
        );
    }
    return next(action);
};

export default errorMiddleware;
