import * as React from 'react';
import { View, Button, ScrollView, Image } from 'react-native';
// Libraries
import MapboxGL from '@react-native-mapbox-gl/maps';
import { TextArea, Stack, Input, Radio, Checkbox, Heading, Text, VStack } from "native-base";
import DatePicker from 'react-native-date-picker';
import ImagePicker from "react-native-customized-image-picker";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as NetInfo  from '@react-native-community/netinfo';
import clone from 'just-clone';
// MISC
import styles from './formScreenStyles';
import firebase from '../Firebase/firestore';

/*
Problem with getting form from local storage is that I need to make a deep copy of it in state and I only
know how to make a shallow copy. Becasue of this, the payload array becomes undefined
https://stackoverflow.com/questions/43638938/updating-an-object-with-setstate-in-react
im using the npm library just-clone (https://www.npmjs.com/package/just-clone) as a work around but i'd like to not use a lib for this 
*/
MapboxGL.setAccessToken('sk.eyJ1IjoiemJldWNsZXIiLCJhIjoiY2tyeTB0dHh2MGE2cTJvcXg2bzM0aHhmdCJ9.M6Y3E5EmYxr0HNjFgQrbdw'); // MapBox API Key


class FormScreen extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            form: {
                formMetaData: "" // this is a structure that we will put the locallly stored form into
            },
            isLoading: true,

            formContents: {} // this state object will contain all the data the user has entered
        }
    }

    getForm = () => {
        const firestoreRef = firebase.firestore().collection('Forms'); // get collection from DB
        const queryRef = firestoreRef.where('formMetaData.FormId', '==', this.props.ID); // filter to get selected form
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

    unsubscribe = null;
    componentDidMount(){
        unsubscribe = NetInfo.addEventListener(state => { // this alows us to constantly check the status of the network of the phone
            let connected = state.type
            if (connected) {
                console.log("online");
                this.getForm(); // get form from database
            } else {
                console.log("offline");
                this.getData(); // get form from local storage
            }   
        });
    }

    componentDidUpdate() { // everytime the state updates send it to the submit screen
        this.props.setResponse(this.state.formContents) // I feel like there should be a better way to do this but I couldnt think of anything else
    }

    componentWillUnmount() {
        // Unsubscribe
        if (unsubscribe != null) unsubscribe() // unsub from the network listener
    }


    getData = async () => {
        try {
            const value = await AsyncStorage.getItem('@Selected_Form');
            console.log(value)
            if (value !== null) {
                let val = JSON.parse(value); // turn string into obj
                const savedForm = clone(val);  // deep clone object
                this.setState( prevState => ({
                    form: {
                        ...prevState.form,
                        formMetaData: savedForm,
                    }
                }))
                this.setState({isLoading: false});
            }
        } catch (e) {
            console.log(`getData error ==> ${e}`);
        }
    }

    // styling for the map data
    layerStyles = { 
        singlePoint: {
          circleColor: 'green',
          circleOpacity: 0.84,
          circleStrokeWidth: 2,
          circleStrokeColor: 'white',
          circleRadius: 5,
          circlePitchAlignment: 'map',
        },
      
        clusteredPoints: {
          circlePitchAlignment: 'map',
      
          circleColor: [
            'step',
            ['get', 'point_count'],
            '#51bbd6',
            100,
            '#f1f075',
            750,
            '#f28cb1',
          ],
      
          circleRadius: ['step', ['get', 'point_count'], 20, 100, 30, 750, 40],
      
          circleOpacity: 0.84,
          circleStrokeWidth: 2,
          circleStrokeColor: 'white',
        },
      
        clusterCount: {
          textField: '{point_count}',
          textSize: 12,
          textPitchAlignment: 'map',
        },
    }
    //////////////////////////
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
                <View style={styles.main}>
                    <ScrollView>
                    <Heading style={{marginBottom: 10}}>
                        {this.state.form.formMetaData.FormTitle}
                    </Heading>


                    {
                        this.state.form.formMetaData.Payload.length > 0 ? this.state.form.formMetaData.Payload.map( (item) => {
                            const { formItemType, itemId, label, name, required } = item; // this is the form element object being deconstructed into it's fields 

                            switch(formItemType) {
                                case "lgText":
                                    return (
                                        <View style={styles.itemWrapper} key={itemId}>
                                            <Text style={styles.itemTitle}>{label}{" "}{required ==! "true" ? "(optional)" : ""}</Text>
                                            <Stack space={4} w="90%">
                                                <TextArea 
                                                    style={styles.input}
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
                                        <View style={styles.itemWrapper} key={itemId}>
                                            <Text style={styles.itemTitle}>{label}{" "}{required ==! "true" ? "(optional)" : ""}</Text>
                                            <Stack space={4} w="90%">
                                                <Input
                                                    style={styles.input}                                                    
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
                                        <View style={styles.itemWrapper} key={itemId}>
                                            <Text style={styles.itemTitle}>{label}{" "}{required ==! "true" ? "(optional)" : ""}</Text>
                                            <Stack space={4} w="90%">
                                                <Input 
                                                    style={styles.input}
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
                                        <View style={styles.itemWrapper} key={itemId}>
                                            <Text style={styles.itemTitle}>{label}{" "}{required ==! "true" ? "(optional)" : ""}</Text>
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
                                                    (item.items.length > 0 || item.items !== undefined) ? item.items.map( (ele, index) => {
                                                        return (
                                                            <VStack alignItems="flex-start" style={styles.radio} w="90%" key={ele+index}>
                                                                <Radio 
                                                                    my={1} 
                                                                    value={ele}
                                                                    accessibilityLabel="This is a radio button"
                                                                > 
                                                                    <Text style={styles.radioText}>  {ele}</Text>
                                                                </Radio>
                                                            </VStack>
                                                        )
                                                    }) : <Text>Error loading items.</Text>
                                                }
                                                </Radio.Group>
                                            </Stack>
                                        </View>
                                    )

                                case "checkboxGroup":
                                    return (
                                        <View style={styles.itemWrapper} key={itemId}>
                                        <Text style={styles.itemTitle}>{label}{" "}{required ==! "true" ? "(optional)" : ""}</Text>
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
                                                    (item.items.length > 0 || item.items !== undefined) ? item.items.map( (ele, index) => {
                                                        return (
                                                            <VStack alignItems="flex-start" style={styles.checkBox} w="90%" key={ele+index}>
                                                                <Checkbox 
                                                                    accessibilityLabel="This is a dummy radio"
                                                                    my={1} 
                                                                    value={ele}
                                                                > {ele} </Checkbox>
                                                            </VStack>
                                                        )
                                                    }) : <Text>Error loading items.</Text>
                                                }
                                            </Checkbox.Group>
                                        </Stack>
                                        </View>
                                    )
                                
                                case "date":
                                    return (
                                        <View style={styles.itemWrapper} key={itemId}>
                                            <Text style={styles.itemTitle}>{label}{" "}{required ==! "true" ? "(optional)" : ""}</Text>
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
                                        <View style={styles.itemWrapper} key={itemId}>
                                            <Text style={styles.itemTitle}>{label}{" "}{required ==! "true" ? "(optional)" : ""}</Text>
                                            <Stack space={4} w="90%">
                                                <Button title="Select Image" 
                                                    onPress={() => {
                                                        ImagePicker.openPicker({includeBase64: true, multiple: true}).then(image => {
                                                            let updated = clone(this.state.formContents)
                                                            updated[label] = image
                                                            this.setState({ formContents: updated }) 
                                                    })}}/>
                                                <View style={styles.imageOuterWrapper}>
                                                    {
                                                        this.state.formContents[label] !== undefined ? this.state.formContents[label].map( photo => {
                                                            // make the base64 data compatable with the Image component
                                                            const base64Image = 'data:image/png;base64,'+photo.data 
                                                            return (
                                                                <View style={{margin: 5}} key={photo.path}>
                                                                    <Image 
                                                                        source={{
                                                                            uri: base64Image
                                                                        }}
                                                                        style={{height: 90, width: 90}}
                                                                    />  
                                                                </View>    
                                                            )
                                                        })  : <Text>No images to show </Text>
                                                    }
                                                </View>
                                            </Stack>
                                        </View>
                                    )

                                    case "map":
                                        handlePress = (e) => {
                                            //console.log(e)
                                            const coordinates = [e.coordinates.latitude, e.coordinates.longitude]
                                            const mag = e.features[0].properties.mag
                                            const title = e.features[0].properties.title
                                            let updated = clone(this.state.formContents)
                                            updated[label+" Latitude"] = coordinates[0]
                                            updated[label+" Longitude"] = coordinates[1]
                                            updated[label+" Magnitude"] = mag
                                            updated[label+" Title"] = title
                                            this.setState({ formContents: updated })
                                        }
                                        return (
                                            <View>
                                                <Text style={styles.itemTitle}>{label}{" "}{required ==! "true" ? "(optional)" : ""}</Text>
                                                <View style={styles.mapPage}>
                                                    {/*<Button title="Increase Zoom" />
                                                    <Button title="Decrease Zoom" /> */}
                                                    <View style={styles.mapContainer}>

                                                        <MapboxGL.MapView
                                                            style={styles.map}
                                                            styleURL={MapboxGL.StyleURL.Dark}>
                        
                                                            <MapboxGL.Camera
                                                                zoomLevel={5}
                                                                pitch={45}
                                                                centerCoordinate={[-87.637596, 41.940403]}
                                                                showUserLocation={true}
                                                            />

                                                            <MapboxGL.UserLocation 
                                                                visible={true} 
                                                                onPress={e => console.log(`onPress ${e}`)} 
                                                                onUpdate={e => console.log(e)}
                                                            />

                                                            <MapboxGL.ShapeSource
                                                                id="earthquakes"
                                                                cluster
                                                                //clusterRadius={50}
                                                                //clusterMaxZoom={14}
                                                                url="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
                                                                //shape={parks}
                                                                onPress={handlePress}
                                                            >

                                                                <MapboxGL.SymbolLayer
                                                                    id="pointCount"
                                                                    style={this.layerStyles.clusterCount}
                                                                />

                                                                <MapboxGL.CircleLayer
                                                                    id="clusteredPoints"
                                                                    belowLayerID="pointCount"
                                                                    filter={['has', 'point_count']}
                                                                    style={this.layerStyles.clusteredPoints}
                                                                />

                                                                <MapboxGL.CircleLayer
                                                                    id="singlePoint"
                                                                    filter={['!', ['has', 'point_count']]}
                                                                    style={this.layerStyles.singlePoint}
                                                                />

                                                            </MapboxGL.ShapeSource>
                                                        </MapboxGL.MapView>
                                                    </View>
                                                </View>
                                                <View style={styles.itemWrapper}>
                                                    <Stack space={4} w="90%">
                                                        <Text></Text>
                                                        <Text style={styles.itemTitle}>Coordinates</Text>
                                                        <Text>Latitude:</Text>
                                                        <Input 
                                                            style={styles.input}
                                                            //keyboardType="numeric"
                                                            value={JSON.stringify(this.state.formContents[label+" Latitude"])}
                                                            onChangeText={ (text) => {
                                                                let updated = clone(this.state.formContents)
                                                                updated[label+" Latitude"] = parseFloat(text)
                                                                this.setState({ formContents: updated })
                                                            }}
                                                        />
                                                        <Text>Longitude:</Text>
                                                        <Input 
                                                            style={styles.input}
                                                            value={JSON.stringify(this.state.formContents[label+" Longitude"])}
                                                            onChangeText={ (text) => {
                                                                let updated = clone(this.state.formContents)
                                                                updated[label+" Longitude"] = parseFloat(text)
                                                                this.setState({ formContents: updated })   
                                                            }}
                                                        />
                                                        <Text>Properties</Text>
                                                        <Text>Magnitude: {this.state.formContents[label+" Magnitude"]}</Text>
                                                        <Text>Title: {this.state.formContents[label+" Title"]}</Text>
                                                    </Stack>
                                                </View>
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
                </View>
            )

        }
    }
}

export default FormScreen;