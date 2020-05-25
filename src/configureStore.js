import { compose, createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import reducer from './reducers';
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export default () => {
    let store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)))
    return store;
}