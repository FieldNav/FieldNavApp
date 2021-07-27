import * as React from 'react';
import { View, Text, Button, ScrollView, Image, TextInput } from 'react-native';
import styles from '../../styleSheet';

import { TextArea, Stack, Input, Radio, Checkbox } from "native-base";
import DatePicker from 'react-native-date-picker';
import ImagePicker from "react-native-customized-image-picker";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as NetInfo  from '@react-native-community/netinfo';
import firebase from '../Firebase/firestore';
import clone from 'just-clone';

/*=============================================*/

/*
Problem with getting form from local storage is that I need to make a deep copy of it in state and I only
know how to mkae a shallow copy. Becasue of this, the payload array becomes undefined
https://stackoverflow.com/questions/43638938/updating-an-object-with-setstate-in-react
im using the npm library just-clone (https://www.npmjs.com/package/just-clone) as a work around but i'd like to not use a lib for this 
*/


class FormScreen extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            form: {
                formMetaData: ""
            },
            isLoading: true,

            formContents: {}
        }
    }

    getNetworkInfo = () => {
        NetInfo.fetch().then( state => {
            return state.isConnected;
        })
    }

    getForm = () => {
        const firestoreRef = firebase.firestore().collection('Forms'); // get collection from DB
        const queryRef = firestoreRef.where('formMetaData.FormId', '==', this.props.ID); // get selected form
        queryRef.get().then( (querySnapshot) => {
            const matchedDocs = querySnapshot.size; // total forms that match ID
            if (matchedDocs) {
                querySnapshot.docs.forEach( doc => {
                    this.setState({ 
                        form: doc.data(),  // set form state as selected form
                        isLoading: false // update loading
                    });
                });
            } else { console.log("No documents matched the query"); }
          });
    }

    componentDidMount(){
        //let connectionAvailable = this.getNetworkInfo(); // needs to be async but isnt for some reason
        let connectionAvailable = true
        if (connectionAvailable === true){
            this.getForm()

            
        } else { // no network connection so get form from storage
            console.log("disconnected");
            this.getData();
            this.setState({isLoading: false});
        }
    }


    getData = async () => {
        try {
            const value = await AsyncStorage.getItem('@Selected_Form');
            if (value !== null) {
                let val = JSON.parse(value); // turn string into obj
                const savedForm = clone(val);  // deep clone object
                this.setState( prevState => ({
                    form: {
                        ...prevState.form,
                        formMetaData: savedForm,
                    }
                }))
            }
        } catch (e) {
            console.log(`getData error ==> ${e}`);
        }
    }



    render() {

        if (this.state.isLoading) {
            return (
                <View>
                    <Text>Form is loading...</Text>
                </View>
            )
        }
        else if (this.state.form.formMetaData === undefined) {
            return (
                <View>
                    <Text>Error loading form</Text>
                </View>
            )
        }
        else {
            return (
                <View style={styles.formMain}>
                    <ScrollView>
                    <View style={styles.formTitleView} >
                        <Text style={styles.formTitleText}>{this.state.form.formMetaData.FormTitle}</Text>
                    </View>
                    <Text>{JSON.stringify(this.state.formContents, null, 4)}</Text>


                    {
                        this.state.form.formMetaData.Payload.length > 0 ? this.state.form.formMetaData.Payload.map( (item) => {
                            const { formItemType, itemId, label, name, required } = item; // this is the form element object being deconstructed into it's fields 

                            switch(formItemType) {
                                case "lgText":
                                    return (
                                        <View style={styles.formItemView} key={itemId}>
                                            <Text style={styles.formLabelText}>{label}{" "}{required === "true" ? "(required)" : ""}</Text>
                                            <Stack space={4} w="90%">
                                                <TextArea 
                                                    h={20} 
                                                    placeholder="Enter Text Here" 
                                                    onChangeText={ (text) => {
                                                        let updated = clone(this.state.formContents)
                                                        updated[label] = text
                                                        this.setState({ formContents: updated })
                                                    }}
                                                    value={this.state.formContents[label]}
                                                />
                                            </Stack>
                                        </View>
                                    )
                                
                                case "text":
                                    return (
                                        <View style={styles.formItemView} key={itemId}>
                                            <Text style={styles.formLabelText}>{label}{" "}{required === "true" ? "(required)" : ""}</Text>
                                            <Stack space={4} w="90%">
                                                <Input
                                                    placeholder="Enter Text Here" 
                                                    onChangeText={ (text) => {
                                                        let updated = clone(this.state.formContents)
                                                        updated[label] = text
                                                        this.setState({ formContents: updated })
                                                    }}
                                                    value={this.state.formContents[label]}
                                                />
                                            </Stack>
                                        </View>
                                    )

                                case "number":
                                    return (
                                        <View style={styles.formItemView} key={itemId}>
                                            <Text style={styles.formLabelText}>{label}{" "}{required === "true" ? "(required)" : ""}</Text>
                                            <Stack space={4} w="90%">
                                                <Input 
                                                    placeholder="Enter value Here"
                                                    keyboardType="numeric"
                                                    onChangeText={ (text) => {
                                                        let updated = clone(this.state.formContents)
                                                        updated[label] = text
                                                        this.setState({ formContents: updated })
                                                    }}
                                                    value={this.state.formContents[label]}
                                                />
                                            </Stack>
                                        </View>
                                    )

                                case "radioBtnGroup":
                                    return (
                                        <View style={styles.formItemView} key={itemId}>
                                            <Text style={styles.formLabelText}>{label}{" "}{required === "true" ? "(required)" : ""}</Text>
                                            <Stack space={4} w="90%">
                                                <Radio.Group 
                                                    accessibilityLabel="Please pick a radio button" 
                                                    onChange={ (value) => {
                                                        let updated = clone(this.state.formContents)
                                                        updated[label] = value
                                                        this.setState({ formContents: updated })
                                                    }}
                                                    value={this.state.formContents[label]}
                                                >
                                                {
                                                    (item.items.length > 0 || item.items !== undefined) ? item.items.map( ele => {
                                                        return (
                                                            <Radio 
                                                                my={1} 
                                                                value={ele}
                                                                accessibilityLabel="This is a dummy checkbox"
                                                                > {ele} </Radio>
                                                        )
                                                    }) : <Text>Error loading items.</Text>
                                                }
                                                </Radio.Group>
                                            </Stack>
                                        </View>
                                    )

                                case "checkboxGroup":
                                    return (
                                        <View style={styles.formItemView} key={itemId}>
                                        <Text style={styles.formLabelText}>{label}{" "}{required === "true" ? "(required)" : ""}</Text>
                                        <Stack space={4} w="90%">
                                            <Checkbox.Group 
                                                accessibilityLabel="Please pick a checkbox"
                                                onChange={ (values) => {
                                                    let updated = clone(this.state.formContents)
                                                    updated[label] = values
                                                    this.setState({ formContents: updated}) }
                                                }
                                                value={this.state.formContents[label]}
                                            >
                                                {
                                                    (item.items.length > 0 || item.items !== undefined) ? item.items.map( ele => {
                                                        return (
                                                            <Checkbox my={1} value={ele}> {ele} </Checkbox>
                                                        )
                                                    }) : <Text>Error loading items.</Text>
                                                }
                                            </Checkbox.Group>
                                        </Stack>
                                        </View>
                                    )
                                
                                case "date":
                                    return (
                                        <View style={styles.formItemView} key={itemId}>
                                            <Text style={styles.formLabelText}>{label}{" "}{required === "true" ? "(required)" : ""}</Text>
                                            <Stack space={4} w="90%">
                                                <DatePicker
                                                    locale='en'
                                                    onDateChange={ (date) =>  {
                                                        let updated = clone(this.state.formContents)
                                                        updated[label] = date
                                                        this.setState({ formContents: updated }) }
                                                    }
                                                    date={ this.state.formContents[label] === undefined ? new Date() : this.state.formContents[label]  }
                                                />
                                            </Stack>
                                        </View>
                                    )

                                case "photo":
                                    return (
                                        <View style={styles.formItemView} key={itemId}>
                                            <Text style={styles.formLabelText}>{label}{" "}{required === "true" ? "(required)" : ""}</Text>
                                            <Stack space={4} w="90%">
                                                <Button title="Select Image" 
                                                    onPress={() => {
                                                        ImagePicker.openPicker({includeBase64: true, multiple: true}).then(image => {
                                                            let updated = clone(this.state.formContents)
                                                            updated[label] = image
                                                            this.setState({ formContents: updated }) 
                                                    })}}/>
                                            {
                                                this.state[label] !== undefined ? this.state[label].map( photo => {
                                                    const base64Image = 'data:image/png;base64,'+photo.data
                                                    return (
                                                        <Image 
                                                            source={{
                                                                uri: base64Image
                                                            }}
                                                            style={{height: 100, width: 100}}
                                                        />      
                                                    )
                                                })  : <Text>No images to show </Text>
                                            }
                                            </Stack>
                                        </View>

                                    )

                                default: 
                                    return (
                                        <View key={itemId}>
                                            <Text>Unknown form item</Text>
                                        </View>
                                    )



                            }
                        }) : <Text>Error loading contents of the form</Text>
                    
                    }

                </ScrollView>
                <Text>{console.log(this.state.formContents["Tools used"])}</Text>
                </View>
            )

        }
    }
}

export default FormScreen;