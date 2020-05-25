import React, { Component } from 'react'
import { ActivityIndicator, View } from 'react-native'

export class Loading extends Component {
    render() {
        return (
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                alignContent: 'center',
            }}>
                <ActivityIndicator size='large' />
            </View>
        )
    }
}

export default Loading
