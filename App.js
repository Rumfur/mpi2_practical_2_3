import * as React from 'react';
import { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';

// You can import from local files
import AssetExample from './components/AssetExample';

// or any pure javascript modules available in npm
import { Card, Button, Dialog, Portal, Provider } from 'react-native-paper';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';


export default function App() {
   const [latitude, setLatitude] = useState(57.538900);
   const [longitude, setLongitude] = useState(25.425727);
   const [data, setData] = useState('');
  const [visible, setVisible] = React.useState(false);
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);
   const API_KEY ='';
   const apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;
   useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }
      let { coords } = await Location.getCurrentPositionAsync({});
      setLatitude(coords.latitude);
      setLongitude(coords.longitude);
    })();  }, []);

    const getWeather = async () => {
     try {
      const response = await fetch(
        apiURL,
      );
      const json = await response.json();
      setData(json.main.temp);
      
      showDialog();
    } catch (error) {
      alert(error);
      console.error(error);
    }
};
  return (
    <View style={styles.container}>
      <Card>
          <MapView  style={styles.map}
          showsUserLocation
          showsCompass
          initialRegion={{
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          />
          <View  style={styles.button}>
            <Button 
            icon="map"
            mode="contained"
              onPress = {() => 
                getWeather()
              }>
              showWeather
            </Button>
          </View>
          <Provider> 
            <View>
              <Portal>
                <Dialog visible={visible}>
                  <Dialog.Title>Alert</Dialog.Title>
                  <Dialog.Content>
                    <Text variant="bodyMedium">{data} C</Text>
                  </Dialog.Content>
                  <Dialog.Actions>
                    <Button onPress={hideDialog}>Done</Button>
                  </Dialog.Actions>
                </Dialog>
              </Portal>
            </View>
          </Provider>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  button:{
    position: 'absolute',
    top: 10,
    paddingTop: Constants.statusBarHeight,
    left: 20,
    width: '50%',
    height: 140,
  },
});