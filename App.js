import * as React from 'react';
import { View, Text, Button } from 'react-native';
// navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// Screens
import SelectionScreen from './Components/SelectionScreen/selectionScreen';
import FormScreen from './Components/Form/formScreen';
import SubmittionScreen from './Components/SubmittionScreen/submittionScreen';

import { NativeBaseProvider, extendTheme } from 'native-base';

import {LogBox} from 'react-native'
LogBox.ignoreAllLogs();





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



function goToSelectionScreen({ route, navigation }) {
  const [ID, setID] = React.useState(0);
  return (
    <View>
      {/* this screen will contain all forms in the DB */}
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
  const { ID } = route.params;
  const [response, setResponse] = React.useState({});
  return (
    <View>
      <Button title="Submit Form" onPress={() => navigation.navigate('Submittion Screen', {response: response})} />
      {/* this screen will contain the contents of the selected form <FormScreen ID={ID} /> */}
      <FormScreen ID={ID} setResponse={setResponse}/>
      <Button title="Go back" onPress={() => navigation.goBack()} />
      
    </View>
  );
}


function goToSubmissionScreen({ route, navigation }) {
  const { response } = route.params
  return (
    <View>
      <SubmittionScreen data={response}/>
    </View>
  )
}


const Stack = createStackNavigator();

export default function App() {

  const theme = extendTheme({
    components: {
      Input: {
        baseStyle: {
          borderColor: 'primary.400',
        }
      },
      /*Checkbox: {
        baseStyle: {
          borderColor: 'primary.400',
          borderRadius: 'lg'
        }
      }*/
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