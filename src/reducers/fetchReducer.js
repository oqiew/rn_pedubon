import { FETCHING_DATA, FETCHING_DATA_FAILURE, FETCHING_DATA_SUCCESS, } from '../constans'
const initialState = {
    user: [],
    isFetching: false,
    isError: false,
    page: ''
}

export default (state = initialState, { type, payload }) => {
    switch (type) {

        case FETCHING_DATA:
            return { ...state, isFetching: true, user: [], isLogin: false }
        case FETCHING_DATA_SUCCESS:
            return { ...state, isFetching: false, user: payload, }
        case FETCHING_DATA_FAILURE:
            return { ...state, isFetching: false, isError: true }
        default:
            return state
    }
}
