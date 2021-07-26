import * as React from 'react';
import { View, Text, Pressable } from 'react-native';
import firebase from '../Firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../styleSheet';
import { Radio } from "native-base"



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

    componentDidMount(){
        this.unsubscribe = this.firestoreRef.onSnapshot(this.getCollection); // get forms from DB once comp has loaded
    }
    componentWillUnmount(){
        this.unsubscribe();
        this.props.setID(0);
    }
    getCollection = (querySnapshot) => {
        const formsArr = [];
        querySnapshot.forEach( (res) => {
            const { FormId, FormTitle, Company, CreatedBy, CreationDate, CreationTime, LastModified, LastModifiedBy, Payload } = res.data().formMetaData; // deconstruct the obj
            formsArr.push({
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


    storeData = async (value, key) => {
        try {
            const jsonValue = JSON.stringify(value); // turn form array into a string
            await AsyncStorage.setItem(key, jsonValue); // store the string
        } catch (e) {
            console.log(`storeData Error ==> ${e}`);
        }
    }
    storeSelectedForm(ID){ // save selected form locally
        let correctForm = this.state.formsArr.filter(x => x.FormId === ID); // filter the formArr to only contain the correct form
        this.storeData(correctForm[0], "@Selected_Form"); // store the correct form in local storeage under the key @Selected_Form
    }


    updateScreen(ID){
        this.setState({ formID: ID })
        this.props.setID(ID); 
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
                <View style={styles.selectionScreenMain}>
                    <Radio.Group 
                        onChange={newValue => this.updateScreen(newValue)} 
                        value={this.state.formID}
                        name="RadioGroup"
                        colorScheme="orange"
                        accessibilityLabel="Please pick a form"
                    >
                    {
                        this.state.formsArr.length > 0 ? this.state.formsArr.map( (item) => {
                            return (
                                <View style={styles.selectionScreenItem}key={item.FormId}>
                                    <Radio value={item.FormId} >{item.FormTitle}</Radio>
                                </View>
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
