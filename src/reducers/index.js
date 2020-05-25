import { combineReducers } from "redux";
import fetchReducer from "./fetchReducer";

// ตัวรวม deducer
console.log('combineReducers success..')
export default combineReducers({ fetchReducer, });