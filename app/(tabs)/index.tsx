import { Image, StyleSheet, Platform, View ,Text, Button} from 'react-native';
import React,{useState,useEffect, useRef} from "react";

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import * as Location from 'expo-location';
import MapView, { Marker, Polyline } from 'react-native-maps';
// import haversine from 'haversine-distance'

export default function HomeScreen() {
const [location,setLocation] = useState(null);
const [errorMsg,setErrorMsg] = useState("");
const [tracking,setTracking] = useState(false);
const [route,setRoute] = useState([]);
const totalDistanceRef = useRef(0);
const [displayedDistance,setDisplayedDistance]=useState(0);

useEffect(()=>{
  const requestPermissionsAndGetlocation=  async ()=>{
    let {status} = await Location.requestForegroundPermissionsAsync();//obtenemos ubicacion actual
    if(status !== 'granted'){
      setErrorMsg('Permisson to access location was denied');
      return;
    }
    try{
      let initialLocation = await Location.getCurrentPositionAsync({});
      //console.log("*****************************************************************************************")

      //console.log("initial location value kabutops", initialLocation)
    // let initialLocation2  = {"coords": {"accuracy": 100, "altitude": 222.00001525878906, "altitudeAccuracy": 45.057647705078125, "heading": 0, "latitude": -32.9893789, "longitude": -71.5260976, "speed": 0}, "mocked": false, "timestamp": 1740192117096}
      //Totus:
     // let initialLocation2  = {"coords": {"accuracy": 100, "altitude": 222.00001525878906, "altitudeAccuracy": 45.057647705078125, "heading": 0, "latitude": -32.99648984086277, "longitude": -71.51254098716142, "speed": 0}, "mocked": false, "timestamp": 1740192117096}
      // console.log("initial location value omastar", initialLocation)
      // console.log("*****************************************************************************************")
     
      setLocation(initialLocation.coords);
      console.log("Ubicacion inicial obtenida:",initialLocation.coords);
      console.log("*****************************************************************************************")

    }catch(error:any){
      setErrorMsg('Error obteniendo ubic inicial: ${error.message}');
      console.error("Error obteniendo ubic inicial:;",error.message);
    }
  };
  requestPermissionsAndGetlocation();
//Fin Useffect
},[]);

useEffect(()=>{
  let subscription=null;
if (tracking){
  console.log("entro a tracking")
    const startLocationUpdates=async ()=>{
      subscription=await Location.watchPositionAsync(
      {  
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
        distanceInterval: 5,
      },
      (newLocation)=>{
        //Newlocation parece ser una palabra reservada para usar el emulador o algo

        //Codigo anterior: inicio
      //  console.log("new location es (metagros)",  newLocation)

        //test borrar:
         let newLocationZ=  {"coords": {"accuracy": 100, "altitude": 222.00001525878906, "altitudeAccuracy": 45.057647705078125, "heading": 0, "latitude": -32.99648984086277, "longitude": -71.51254098716142, "speed": 0}, "mocked": false, "timestamp": 1740192117096}
         const newCoords = newLocationZ.coords;
         //fin test borrar

       // const newCoords = newLocation.coords;
        console.log("Nueva ubicacion Recibida: zamazenta", newCoords);
                //Codigo anterior: fin

        //ini Asignamos al totus como nueva locacion:
        // const newCoords  = {"coords": {"accuracy": 100, "altitude": 222.00001525878906, "altitudeAccuracy": 45.057647705078125, "heading": 0, "latitude": -32.99648984086277, "longitude": -71.51254098716142, "speed": 0}, "mocked": false, "timestamp": 1740192117096}
        // console.log("Nueva ubicacion Recibida:", newCoords);
        // //fin Asignamos al totus como nueva locacion:

        setRoute((prevRoute)=>{
          let newDistance = 0 ;
          if (prevRoute.length>0){
            const lastCoords = prevRoute[prevRoute.length-1];
            const distance = haversine(lastCoords,newCoords);//Haversine es una formula para caluclar distancia mas corta entre dos puntos
            console.log("Distancia entre ubicaciones");

            if (distance>2){
              newDistance = totalDistanceRef.current + distance;
              totalDistanceRef.current = newDistance;
              console.log("Distancia acumulada:",totalDistanceRef.current)
            }else{
              console.log("Distancia menor a 2m,no se actualiza distancia total.")
              newDistance = totalDistanceRef.current;
            }
          }else{
            console.log("Primera ubicacion.inicializando distancia");
            newDistance=0;
          }
          //Actualiza el estado displayeDistance aqui
          setDisplayedDistance(newDistance);
          return [...prevRoute,newCoords];
        });
        setLocation(newCoords);
       }  
      );
    };


startLocationUpdates();
console.log("Tracking Iniciado");
}else{
  if (subscription){
    subscription.remove();
    console.log("Subscripcion de ubicacion removida");
  }
}

return ()=>{
  if(subscription){
    subscription.remove();
    console.log("subscripcion de ubicacion removida");
  }
 };
 //Fin use effect    
},[tracking]);


const haversine = (coord1,coord2) =>{
  const toRad = (angle) => (angle * Math.PI)/100;
  const R = 6371000;
  const dLat = toRad(coord2.latitude - coord1.latitude);
  const dLon = toRad(coord2.longitude - coord1.longitude);
  const lat1 = toRad(coord1.latitude);
  const lat2 = toRad(coord2.latitude);

  const a= 
  Math.sin(dLat/2) * Math.sin(dLat/2)+
  Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  
  return R * c;
};

const handleToggleTracking = () => {
  if (!tracking){
    //Resetea la distancia al iniciar el tracking
    totalDistanceRef.current=0;
    setDisplayedDistance(0);
    setRoute([]);
    console.log("Tracking iniciado, distancia reseteada a 0");
  }else{
    console.log("Tracking detenido.");
  }

  setTracking(!tracking);
  console.log("boton de tracking presionado, tracking:",!tracking)

}




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
       }}
      >

       <Marker coordinate={location} title="Estoy aqui"/>
       {route.length > 1 &&(
        <Polyline coordinates={route} strokeWidth={4} strokeColor="blue"/>
       )}
        
       </MapView>

       <View >
        <Button 
          title={tracking? "Detener recorrido" : "Iniciar Recorrido"}
          onPress={handleToggleTracking}
          color={tracking?"red":"green"}
        />
       </View>


       <View >
        <Text >
          Distancia recorrida: {displayedDistance.toFixed(2)} m/{" "}
          {(displayedDistance/1000).toFixed(2)} km
        </Text>
       </View>


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
