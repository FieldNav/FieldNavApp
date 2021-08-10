import { StyleSheet } from 'react-native';

export default styles = StyleSheet.create({
    main: {
        margin: 10,
        paddingBottom: 120
    },
    itemWrapper: {
        margin: 10
    },
    itemTitle: {
        fontWeight: "bold",
        marginBottom: 10,
        fontSize: 20
    },
    input: {
        borderWidth: 1,
        borderColor: "#2782B6"
    },
    checkBox: {
        borderBottomWidth: 1,
        borderBottomColor: "#A9A9A9",
        textAlign: "left"
    },
    radio: {
        borderWidth: 1,
        borderRadius: 25,
        borderColor: "#2782B6",
        padding: 5,
        margin: 5 
    },
    radioText: {
        color: "#2782B6",
    },
    imageOuterWrapper: {
        flexDirection: "row", 
        flexWrap: "wrap"
    },
    mapPage: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        //backgroundColor: '#F5FCFF'
    },
        mapContainer: {
        height: 200,
        width: 200,
        backgroundColor: 'tomato'
    },
    map: {
        flex: 1
    }
    
})