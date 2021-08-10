import * as React from 'react';
import { View, Text } from 'react-native';
// Libraries
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Radio, VStack } from 'native-base';
// MISC
import styles from './selectionScreenStyles';
import firebase from '../Firebase/firestore';



class SelectionScreen extends React.Component {
    constructor(props){
        super(props);
        this.firestoreRef = firebase.firestore().collection('Forms');
        this.state = {
            isLoading: true,
            formsArr: [],
            formID: "",
        }
    };

    componentDidMount(){ // subscribe to the Firebase DB when the component has loaded
        this.unsubscribe = this.firestoreRef.onSnapshot(this.getCollection); 
    }
    componentWillUnmount(){
        this.unsubscribe(); // unsubscribe from the DB when the component is unloaded
        this.props.setID(0); // this makes the 'go to form' button disapear so it isn't rendered on the next screen
    }

    getCollection = (querySnapshot) => {
        const formsArr = [];
        querySnapshot.forEach( (res) => {
            const { FormId, FormTitle, Company, CreatedBy, CreationDate, CreationTime, LastModified, LastModifiedBy, Payload } = res.data().formMetaData; // deconstruct the obj
            formsArr.push({ // update formsArr with the forms from the DB
                FormId: FormId,
                FormTitle: FormTitle,
                Company: Company,
                CreatedBy: CreatedBy,
                CreationDate: CreationDate,
                CreationTime: CreationTime,
                LastModified: LastModified,
                LastModifiedBy: LastModifiedBy, 
                Payload: Payload
            });
        });
        this.setState({
            formsArr,
            isLoading: false,
        }); 
    }

    updateScreen(ID){
        this.setState({ formID: ID })
        this.props.setID(ID); // allow the button to appear
        this.storeSelectedForm(ID); // store the selected form in local storage
    }
    
    storeSelectedForm(ID){ // save selected form locally
        let correctForm = this.state.formsArr.filter(x => x.FormId === ID); // filter the formArr to only contain the correct form
        this.storeData(correctForm[0], "@Selected_Form"); // store the correct form in local storeage under the key @Selected_Form
    }

    storeData = async (value, key) => {
        try {
            const jsonValue = JSON.stringify(value); // turn form array into a string
            await AsyncStorage.setItem(key, jsonValue); // store the string
        } catch (e) {
            console.log(`storeData Error ==> ${e}`);
        }
    }




    render(){
        if (this.state.isLoading) {
            return (
                <View>
                    <Text>Forms Are Loading...</Text>
                </View>
            );
        } else {
            return (
                <View style={styles.main}>
                    <Text>Please select a form below</Text>
                    <Radio.Group 
                        onChange={newValue => this.updateScreen(newValue)} // update the ID of the selected form
                        value={this.state.formID} // make sure that this radio button group is a controlled component
                        name="RadioGroup"
                        colorScheme="orange"
                        accessibilityLabel="Please pick a form"
                    >
                    {
                        this.state.formsArr.length > 0 ? this.state.formsArr.map( (item) => {
                            return (
                                <VStack alignItems="flex-start" key={item.FormId}  style={styles.itemWrapper}>
                                    <View style={{padding: 10}}>
                                        <Radio value={item.FormId}>{item.FormTitle}</Radio>
                                    </View>
                                </VStack>
                            )
                        }) : <Text>No forms found</Text>
                    }
                    </Radio.Group>

                </View>
            )
        }
    }

}

export default SelectionScreen;
