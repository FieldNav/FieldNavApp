# FieldNav Form Viewer React Native App

## Overview
The Form Viewer app allows an inspector to render and complete forms built by their supervisors. This can be done offline and online.

---

## Installation
1. Make sure that `npm` and `node.js` are installed globally on your system
2. Follow the `React Natve CLI Quickstart` section from the [React Native Documentation](https://reactnative.dev/docs/environment-setup) 
	- DO NOT USE EXPO
	- I used macOS for my development OS and IOS as my target OS
3. Go to github and download the code from [this repo](https://github.com/zbeucler2018/FieldNavApp)
4. Once the code has downloaded, `cd` into that directory and type `npm install`
	- This will download all the needed libraries for the project
	- This also might take a while
	- Once this is completed, then there should be a `node_modules` folder 
	- If the `node_modules` folder is not there after `npm install`, then run this command: `npm install react-native-reanimated react-native-gesture-handler react-native-screens react-native-safe-area-context @react-native-community/masked-view @react-navigation/native @react-navigation/stack @react-native-async-storage/async-storage native-base react-native-svg styled-components styled-system @react-native-community/netinfo firebase just-clone react-native-date-picker react-native-customized-image-picker @react-native-mapbox-gl/maps`
5. Once completed, use this command `cd ios && pod install && cd ..` or `npx pod-install`
	- This command links all the native code from the libraries we are using to the React Native app
6. Once completed, use the command `npx run ios` to start the app
	> ### Important
	> - If you are on a macOS machine with an M1 chip, this command will not  work due to the MapBox library.
	> - To run the app, you must use xcode in rosetta to run the app
	> - Once you have modified xcode to use rosetta, then use xcode to cd into the app and run the app from there

---

## Screens
As of right now, the app has four screens (`Home`, `Selection`, `Form`, `Submit`), each with a specific task

### Home Screen
- This is the screen that the app first opens on. 
- The purpose for this screen is to greet the user and to take them to the `Selection` screen

The code for this screen can be found in the `App.js` file

### Selection Screen
- The purpose of this screen is to display all the forms that the user can select from
- Then, the screen will bring the user to the `Form` screen

The code for this screen can be found in `/Components/SelectionScreen`

### Form Screen
- The purpoose of this screen is to render the selected form and to record the responses
- If the user has network, the component will query the firebase cloud DB using the `formId` of the selected form
	- This makes sure that any updates to the form are rendered 
- If the user is not connected to a network, then the screen renders the selected form that is stored in local storage

The code for this screen can be found in `/Components/Form`

### Submit Screen
- The purpose of this screen isfor the user to review the information they entered before they submit the form
- From this screen, the user should be able to go back into the `Form` screen and edit their responses if needed. As well as submit the form to it's final database

The code for this screen can be found in `/Components/SubmittionScreen`

---

## Components
- `<App />`
- `<SelectionScreen />`
- `<FormScreen />`
- `<SubmittionScreen />` 

---

## Libraries and their uses
### React Navigation
- This library is what controls the navigation from one screen to another
- It also allows us to pass certain information (like form IDs) from one screen to another
- Most of the code for this library is in `App.js`
- Read more about this library [here](https://reactnavigation.org/)
### Async Storage
- This library allows us to store strings in the local storage of the device
- Read more about this library [here](https://react-native-async-storage.github.io/async-storage/docs/install/)
### Native Base
- This is the UI library used in the app
- Since React Native doesn't have many components out-of-the-box, Native Base allows us to use complete and nice looking components
- Some of the components used are Textareas, Inputs, Radio Buttons, and Checkboxes
	- Evertime a radio button or checkbox is rendered, there is a huge accessability warning that starts with this `  If you do not provide children, you must specify an aria-label for accessibility `. I have looked everywhere for a solution but it I couldn't find anything
- Read more about this library [here](https://nativebase.io/)
### NetInfo
- This library is used to get the network information of the device
- This library allows us to check if the phone has any connection to a network
- Read more about this library [here](https://github.com/react-native-netinfo/react-native-netinfo)
### Firebase
- The database used for this app is the firebase firestore database
- The code for the initalization can be found in `/Components/Firebase`
- Read more about Firestore [here](https://firebase.google.com/docs/firestore)
- Right now, the app uses the [Firebase JS SDK](https://firebase.google.com/docs/reference/js), but I would eventually want to move to this open-source [React Native SDK](https://rnfirebase.io/)
- By the time someone other than me is going to help develop this app, you must create your own Firebase Firestore database
- Replace my initalization code with your new code in `Components/Firebase/firestore.js`
- Read more about the Firebase JS SDK [here](https://www.npmjs.com/package/firebase)
### Just-Clone
- This library is used to deep copy complex data structures simply.
- A lot of the important data stored as state in the app are complex objects
- Since it is bad practice to modify state directly, I use this library to make a copy of the complex state object, and then I modify the compy. Once I've finished modifying the copy, I replace the previous state with the modified copy
	```javascript
	// EX: In the Input tag in the 'text' case in /Components/Form/formScreen.js
	onChangeText={ (text) => {
        	let updated = clone(this.state.formContents) // copy state
            updated[label] = text			// modify the copy
            this.setState({ formContents: updated }) // replace old state with modified copy
        }}
	```
- Read more about this library [here](https://www.npmjs.com/package/just-clone)
### React Native Date Picker
- This library is used to add the functionality of having a responsive date picker in the app
- The following piece of code is required for the library to work correctly
	- In `/ios/Podfile` add this line 
	```ruby
	pod 'react-native-date-picker', :path => '../node_modules/react-native-date-picker'
	```
- Read more about this library [here](https://github.com/henninghall/react-native-date-picker)
### React Native Customized Image Picker
- This library is used to add the functionality to select phtotos from the user's camera roll to add to the form
- The following pieces of code are required for the library to work correctly
	- In `ios/{ whatever-the-app-name-is }/info.plist` add these lines for IOS permissions
	 	```xml
		<key>NSCameraUsageDescription</key>
		<string>This app requires permission to use your camera</string>
		<key>NSLocationWhenInUseUsageDescription</key>
		<string>This app requires permission to see your location</string>
		<key>NSPhotoLibraryAddUsageDescription</key>
		<string>This app requires permission to your photo roll</string>
		<key>NSPhotoLibraryUsageDescription</key>
		<string>This app requires permission to your photo roll</string>
		```
	- In `/android/app/src/main/AndroidManifest.xml` add these lines of code for Android permissions
		```xml
		<uses-permission android:name="android.permission.CAMERA" />
		<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
		<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
		```
- Read more about the library [here](https://github.com/shijingsh/react-native-customized-image-picker)
### MapBox
- This library allows us to use GIS information and to render an interactive map in a form
- This library reqires it's own API Key which can be aquired by creating a free account on MapBox's [offical website](https://www.mapbox.com/)
- The library is an unoffical React Native SDK, however the library has a great community and support
- The folowing pieces of code are required for the library to work correctly
	- In `/ios/Podfile` add this line in the `post_install` loop
	```ruby
	post_install do |installer|
    	$RNMBGL.post_install(installer)
    	... other post install hooks
  	end
	```
	- I also needed to add this loop as well
	```ruby
	pre_install do |installer|
    	$RNMBGL.pre_install(installer)
    	... other pre install hooks
  	end
	```
- Read more about the library [here](https://github.com/react-native-mapbox-gl/maps)

---

## Controlled Components
One big rule I tried to stick by when creating this app is to make sure that all my components that take user input are controlled. There is a great section of the [React documentation](https://reactjs.org/docs/forms.html#controlled-components) that explains this. Even though this is React Native, the principals still apply.

Since all the components that take user input (AKA Form Elements) are controlled, then we must dynammically add fields to the state when a Form Element is added to a form. I did this by using this ideology:
```javascript
<Input
	onChange={ (data) => {
		let updated = clone(this.state.formContents) // formContents is the object that we are storing the user's data in
		updated[label] = data // this line populates a field in the formContents object with the data entered by the user. 'label' is the label created by the form builder 
		this.setState({ formContents: updated }) // update the formContents state object
	}}
	value={this.state.formContents[label]} // this line makes sure that the value of the Input tag is always the same as the value in formContents
>
```

---

## TODO
- [  ] Potentially switch from React Navigation to React Router for a neater way to pass data from screen to screen
- [  ] Make the submit screen a table so the UI isnt so bare
	- [potentially good library](https://www.npmjs.com/package/react-native-table-component)
- [  ] Switch from Firebase JS SDK to the [React Native SDK](https://rnfirebase.io/) becasue of the RN SDK's offline persistance functionality
- [  ] Improve the UI of the select screen
- [  ] Change the code in the 'map' case into it's own component so the 'map' case isnt so long
	- Maybe make every case it's own component?
- [  ] Add functionality that will check for required fields that are not filled out when submitted

---

## Links / Resources
- https://dev.to/andyrewlee/cheat-sheet-for-updating-objects-and-arrays-in-react-state-48np
- https://reactnavigation.org/
- https://react-native-async-storage.github.io/async-storage/docs/install/
- https://nativebase.io/
- https://github.com/react-native-netinfo/react-native-netinfo
- https://programmingwithmosh.com/react-native/network-connection-in-your-react-native-app/
- https://www.npmjs.com/package/firebase
- https://www.npmjs.com/package/just-clone
- https://github.com/henninghall/react-native-date-picker
- https://github.com/shijingsh/react-native-customized-image-picker

---

### IOS Simulator MISC notes
- `I/O > keyboard > connect hardware keyboard` to toggle macOS or IOS keyboard