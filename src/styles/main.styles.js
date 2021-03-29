import { StyleSheet } from 'react-native';
export default StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        margin: 20,
    },
    background: {
        padding: 15,
        backgroundColor: '#f0f2f5',
        minHeight: '100%'
    },
    content: {
        flex:
            1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
    },
    item: {
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10
    },
    autocompleteContainer: {
        flex: 1,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
        zIndex: 1
    },
    tools: {
        alignItems: 'center',

    },
    inputStyle: {
        borderRadius: 5,
        width: 100,
        borderColor: '#c0c0c0',
        padding: 5,

    },
    subRow: {
        flexDirection: "row"
    },
    Htitle: {
        padding: 5
    },
    Hvalue: {
        padding: 5
    }, Textarea: {
        textAlign: 'center',
        height: 50,
        borderWidth: 2,
        borderColor: '#9E9E9E',
        borderRadius: 20,
        backgroundColor: "#FFFFFF",
        height: 150
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        padding: 5
    },
    avatar2: {
        width: 50,
        height: 50,
        borderRadius: 50,
        padding: 5
    },
    btn_danger: {
        padding: 12,
        borderRadius: 20,
        margin: 5,
        alignItems: 'center',
        width: 150,
        backgroundColor: '#ff0000',
    },
    btn_info: {
        padding: 12,
        borderRadius: 20,
        margin: 5,
        alignItems: 'center',
        width: 150,
        backgroundColor: '#0080ff',
    },
    btn_success: {
        padding: 12,
        borderRadius: 20,
        margin: 5,
        alignItems: 'center',
        width: 150,
        backgroundColor: '#65d728',
    },
    disabledBtn: {
        backgroundColor: 'rgba(3,155,229,0.5)'
    },
    btnTxt: {
        color: '#fff',
        fontSize: 18
    },
    image: {
        marginTop: 20,
        minWidth: 200,
        height: 200,
        resizeMode: 'contain',
        backgroundColor: '#ccc',
    },
    img: {
        flex: 1,
        height: 100,
        margin: 5,
        resizeMode: 'contain',
        borderWidth: 1,
        borderColor: '#eee',
        backgroundColor: '#ccc'
    },
    progressBar: {
        backgroundColor: 'rgb(3, 154, 229)',
        height: 3,
        shadowColor: '#000',
    },
    footer: {
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    title: {
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 5,
        fontWeight: 'bold'
    },


});