import { Image, StyleSheet, Platform, View ,Text} from 'react-native';
import React,{useState,useEffect} from "react";

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

export default function HomeScreen() {
const [location,setLocation] = useState(null);
const [errorMsg,setErrorMsg] = useState("");

useEffect(()=>{
  let subscription:any;

  (async ()=>{
    let {status} = await Location.requestForegroundPermissionsAsync();//obtenemos ubicacion actual
    if(status !== 'granted'){
      setErrorMsg('Permisson to access location was denied');
      return;
    }

    //Subscribirse a cambios de ubicacion
    subscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 10000, // Actualizar cada 10 segundos
        distanceInterval: 10,// Tambien actualizar si se mueve al menos 10 metros
      },
      (newLocation:any)=>{
        setLocation(newLocation.coords);
      }
    );
  })();


  //Limpiar la subscripcion cuando el componente se desmonte
  return()=>{
    if (subscription){
      subscription.remove();
    }
  };
//Fin Useffect
},[]);

if (errorMsg!=""){
  return(
    <View style={styles.container}>
      <Text>{errorMsg}</Text>
    </View>
  );
}

if (!location){
  return(
    <View style={styles.container}>
      <Text>Loading Location...</Text>
    </View>
  )
}


  return (
    <View style={styles.container}>
       <MapView style={styles.map}
       region={{
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
       }}>
        <Marker
        coordinate={{
          latitude: location.latitude,
          longitude:location.longitude,
        }}
        title="Estoy Aquix"
        />
        
       </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
