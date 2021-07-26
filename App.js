import * as React from 'react';
import { View, Text, Button } from 'react-native';
// navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// Screens
import SelectionScreen from './Components/SelectionScreen/selectionScreen';
import FormScreen from './Components/Form/formScreen';

import { NativeBaseProvider } from 'native-base';

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
  return (
    <View>
      {/* this screen will contain the contents of the selected form <FormScreen ID={ID} /> */}
      <FormScreen ID={ID} />
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}


const Stack = createStackNavigator();

export default function App() {
  const [formID, setFormID] = React.useState(0);

  return (
    <NativeBaseProvider>
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
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  )
}


/*
const Stack = createStackNavigator();

export default function App2() {
  const [formID, setFormID] = React.useState(0);

  return (
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
      </Stack.Navigator>
    </NavigationContainer>
  )
}
*/