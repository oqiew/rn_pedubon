// functions
import { FETCHING_DATA, FETCHING_DATA_FAILURE, FETCHING_DATA_SUCCESS, } from '../constans'
import Firebase from '../../Firebase';
import { isEmptyValue } from '../Components/Methods'
export const setStageToScuccess = (payload) => ({
    type: FETCHING_DATA_SUCCESS,
    payload
})
export const setStageToFetching = (payload) => ({
    type: FETCHING_DATA,
})
export const setStageToFailure = (payload) => ({
    type: FETCHING_DATA_FAILURE,
})


export const fetch_user = (data) => {
    return (dispatch) => {
        dispatch(setStageToFetching());
        if (!isEmptyValue(data.User_ID)) {
            dispatch(setStageToScuccess(data));
        } else {
            dispatch(setStageToFetching());
        }

    }
}

