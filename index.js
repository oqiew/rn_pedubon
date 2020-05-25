/**
 * @format
 */

import { AppRegistry, YellowBox } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import { Provider } from 'react-redux';
import configureStore from './src/configureStore';
import React, { Component } from 'react'

YellowBox.ignoreWarnings([
    'Warning:', 'Setting', 'Possible', 'Require cycle', 'Setting a timer', 'Remote'
]);
const store = configureStore();
class ReduxApp extends Component {
    render() {
        return (
            <Provider store={store}>
                <App />
            </Provider>
        )
    }

}
AppRegistry.registerComponent(appName, () => ReduxApp);

