import React from 'react';
import { View, Text, Image } from 'react-native';
// MISC
import styles from '../../styleSheet';





class SubmittionScreen extends React.Component{
    constructor(props){
        super(props);
        this.state = {}
    }



    render(){
        var keyArr = Object.keys(this.props.data)
        var valuesArr = Object.values(this.props.data)

        
        return (
            <View style={styles.formMain}>
                <Text style={styles.formTitleText}>Results of Form</Text>
                <View>
                    {
                        keyArr.length > 0 ? keyArr.map( (item, index) => {
                            const title = JSON.stringify(item).replace("\"", '').replace("\"", ''); // remove double quotes from string

                            if (Array.isArray(valuesArr[index])) {
                                if (valuesArr[index][0].data !== undefined) { // if value is the array of photos
                                    return (
                                        <View>
                                            <Text style={styles.formLabelText}>{title}</Text>
                                            {
                                                valuesArr[index].map( photo => {
                                                    return (
                                                        <Image 
                                                            source={{
                                                                uri: 'data:image/png;base64,'+photo.data
                                                            }}
                                                            key={photo.path}
                                                            style={{height: 100, width: 100}}
                                                        />  
                                                    )
                                                }) 
                                            }
                                        </View>
                                    )
                                } 
                                else { // if value is checkboxes
                                    return (
                                        <View>
                                            <Text style={styles.formLabelText}>{title}</Text>
                                            {
                                                valuesArr[index].map( ele => {
                                                    return (
                                                        <Text>{ele}</Text>
                                                    )                   
                                                })
                                            }
                                        </View>
                                    )

                                }
                            } else {
                                return (
                                    <View>
                                        <Text style={styles.formLabelText}>{title}</Text>
                                        <Text>{JSON.stringify(valuesArr[index]).replace("\"", '').replace("\"", '')}</Text>
                                    </View>
                                )
                            }      
                        }) : <Text>No data to display</Text>
                    }
                </View>
            </View>
        )
    }
}

export default SubmittionScreen;