import * as React from 'react';
import { View, Text, Button } from 'react-native';
// navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// Screens
import SelectionScreen from './Components/SelectionScreen/selectionScreen';
import FormScreen from './Components/Form/formScreen';
import SubmittionScreen from './Components/SubmittionScreen/submittionScreen';
// Libraries
import { NativeBaseProvider, extendTheme } from 'native-base';





/******* These are functions for navigation ************/
function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Press Below to start</Text>
      <Button
        title="Go to Form Selection"
        onPress={() => navigation.navigate('Form Selection Screen')}
      />
    </View>
  );
}

function goToSelectionScreen({ navigation }) {
  const [ID, setID] = React.useState(0); 
  // this is how we pass the ID of the form from the selection screen to the form screen
  // once the ID has been passed, we can use that ID to sync the selected form with the 
  // firebase database
  return (
    <View>
      {/* 
        This logic makes the 'go to form' button appear.
        The onPress function sends the ID of the selected form to the Form Screen
      */}
      {
        ID !== 0 && 
        <Button
          title="Go to Form"
          onPress={() => navigation.navigate('Form Screen', {ID: ID})} 
        />
      }
      <SelectionScreen setID={setID}/>
    </View>
  );
}

function goToFormScreen({ route, navigation }) {
  const { ID } = route.params; // get the ID from the selection screen
  const [response, setResponse] = React.useState({}); // this state object will contain the data entered into the form by the user. We then send that data to the submit screen
  return (
    <View>
      <Button title="Submit Form" onPress={() => navigation.navigate('Submittion Screen', {response: response})} />
      <FormScreen ID={ID} setResponse={setResponse}/>
      <Button title="Go back" onPress={() => navigation.goBack()} />
      
    </View>
  );
}

function goToSubmissionScreen({ route }) {
  // the response is the data that was entered by the user into the form
  // we then pass that data to the submit screen to display
  const { response } = route.params 
  return (
    <View>
      <SubmittionScreen data={response}/> 
    </View>
  )
}
/************************************************************ */

const Stack = createStackNavigator();

export default function App() {

  const theme = extendTheme({
    components: {
      Input: {
        baseStyle: {
          borderColor: 'primary.400',
        }
      }
    },
  });

  return (
    <NativeBaseProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options={{ title: "FieldNav Form App" }}
          />
          <Stack.Screen
            name="Form Selection Screen"
            component={goToSelectionScreen}

          />
          <Stack.Screen
            name="Form Screen"
            component={goToFormScreen}
          />
          <Stack.Screen
            name="Submittion Screen"
            component={goToSubmissionScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  )
}