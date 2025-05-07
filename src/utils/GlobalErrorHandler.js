import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ErrorModal from '../components/modals/ErrorModal'; // Your modal component
import { clearError } from '../../redux/slices/errorSlice';

const GlobalErrorHandler = () => {
    const dispatch = useDispatch();
    const {
        isError,
        message,
        title,
        productData,
        navigateTo,
        params,
        isReportable,
    } = useSelector((state) => state.error);
   

    const handleClose = () => {
        dispatch(clearError());
    };

    return (
        <ErrorModal
            openModal={isError}
            modalClose={handleClose}
            message={message}
            title={title}
            productData={productData}
            navigateTo={navigateTo}
            params={params}
            isReportable={isReportable}
        />
    );
};

export default GlobalErrorHandler;
