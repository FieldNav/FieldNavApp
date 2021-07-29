# NPM Packages
-  npm install react-native-reanimated react-native-gesture-handler react-native-screens react-native-safe-area-context @react-native-community/masked-view @react-navigation/native @react-navigation/stack @react-native-async-storage/async-storage native-base react-native-svg styled-components styled-system @react-native-community/netinfo firebase just-clone react-native-date-picker react-native-customized-image-picker

# Notes
- after installing packages, run `cd ios && pod install && cd .. && npx pod-install` to link packages 
    - this allows us to use native ios code
## Date picker
 - need to add `pod 'react-native-date-picker', :path => '../node_modules/react-native-date-picker'` to the podfile
 ## Image Picker
 - go into `ios/app-name/info.plist` and add below for IOS permissions
 ```
	<key>NSCameraUsageDescription</key>
	<string>1</string>
	<key>NSLocationWhenInUseUsageDescription</key>
	<string></string>
	<key>NSPhotoLibraryAddUsageDescription</key>
	<string>1</string>
	<key>NSPhotoLibraryUsageDescription</key>
	<string>1</string>
```
- then go into `/android/app/src/main/AndroidManifest.xml` and add below for Android permissions
```
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
```


# Links / Resources
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



# IOS Simulator notes
- `I/O > keyboard > connect hardware keyboard` to toggle macos or ios keyboard