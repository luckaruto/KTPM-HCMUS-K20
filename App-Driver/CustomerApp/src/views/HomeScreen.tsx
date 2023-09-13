import React, {useRef} from 'react';
import {
  Text,
  View,
  Image,
  TextInput,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {Google_Map_Api_Key} from '@env';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../routers/navigationParams';
import {Images} from '../configs/images';
import {useState, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {setLoading, showMessage} from './../redux/reducers';
import {Button} from 'native-base';
import {setOrigin} from './../redux/reducers';
import {useSelector} from 'react-redux';
import {selectorigin} from './../redux/reducers';
import {LocationService} from '../services/location/LocationService';
import {SocketIOClient} from '../socket';
import {StatusColor} from '../component/Overlay/SlideMessage';
import {LoginHandler} from '../designPattern/chain';
import useCustomNavigation from '../hooks/useCustomNavigation';
import Geolocation from '@react-native-community/geolocation';
import {User} from '../appData/user/User';
import {selectStep} from './../redux/reducers';

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  const dispatch = useDispatch();
  const navigate = useCustomNavigation();
  const step = useSelector(selectStep);
  const socket = SocketIOClient.getInstance();

  const loginHandler = new LoginHandler();
  const [stateTurnOff, setStateTurnOff] = React.useState(false);
  const [locationStatus, setLocationStatus] = useState('');
  const driverinfo = User.getInstance().information;

  useEffect(() => {
    socket.emitJoinRoom(driverinfo.tel);
  }, []);

  useEffect(() => {
    // Check if the user is logged in using the LoginHandler
    !loginHandler.handle() && navigate.replace('Welcome');
  }, []);
  React.useEffect(() => {
    if (step.name == 'pick up') {
      navigation.navigate('MapBook');
    }
    if (step.name == 'cancel trip') {
      navigation.navigate('MapBook');
    }
    if (step.name == 'bending') {
      navigation.navigate('MapBook');
    }
  }, [step]);

  let watchID: number | null = null;

  useEffect(() => {
    const requestLocationPermission = async () => {
      console.log('request Location');
      if (Platform.OS === 'ios') {
        getOneTimeLocation();
        subscribeLocationLocation();
      } else {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Access Required',
              message: 'This App needs to Access your location',
              buttonPositive: 'OK',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            getOneTimeLocation();
            subscribeLocationLocation();
          } else {
            setLocationStatus('Permission Denied');
          }
        } catch (err) {
          console.warn(err);
        }
      }
    };

    requestLocationPermission();

    return () => {
      if (watchID !== null) {
        Geolocation.clearWatch(watchID);
      }
    };
  }, []);

  React.useEffect(() => {
    if (step.name == 'pick up') {
      navigation.navigate('MapBook');
    }
  }, [step]);

  const getOneTimeLocation = () => {
    setLocationStatus('Getting Location ...');
    Geolocation.getCurrentPosition(
      //Will give you the current location
      position => {
        console.log('get position success');
        setLocationStatus('You are Here');
        const currentLongitude = position.coords.longitude;
        //getting the Longitude from the location json
        const currentLatitude = position.coords.latitude;
        //getting the Latitude from the location json
        console.log(position);
        const currentDescription = JSON.stringify(
          position.coords.altitudeAccuracy,
        );

        dispatch(
          setOrigin({
            location: {lat: currentLatitude, lng: currentLongitude},
          }),
        );
      },
      error => {
        setLocationStatus(error.message);
        console.log(error.message);
      },
      {enableHighAccuracy: false, timeout: 60000, maximumAge: 1000},
    );
  };

  const subscribeLocationLocation = () => {
    const watchID = Geolocation.watchPosition(
      position => {
        setLocationStatus('You are Here');
        //Will give you the location on location change
        console.log(position);
        const currentLongitude = position.coords.longitude;

        const currentLatitude = position.coords.latitude;

        dispatch(
          setOrigin({
            location: {lat: currentLatitude, lng: currentLongitude},
          }),
        );

        socket.emitSendUpdateLocation({
          driverinfo: driverinfo.tel,
          lat: currentLatitude,
          lng: currentLongitude,
        });
      },
      error => {
        setLocationStatus(error.message);
      },
      {enableHighAccuracy: false, maximumAge: 1000},
    );
  };

  const mapRef = useRef(null);
  const origin = useSelector(selectorigin);
  useEffect(() => {
    if (!origin) {
      return;
    }
    socket.emitSendUpdateLocation({
      driverinfo: driverinfo.tel,
      lat: origin?.location.lat,
      lng: origin?.location.lng,
    });
    if (mapRef.current) {
      (mapRef.current as any).fitToSuppliedMarkers(['origin'], {
        edgePadding: {top: 50, right: 50, bottom: 50, left: 50},
      });
    }
  }, [origin]);
  return (
    <View className="relative h-full w-full">
      {origin != null && (
        <MapView
          ref={mapRef}
          className=" absolute w-full h-full"
          initialRegion={{
            latitude: origin.location.lat,
            longitude: origin.location.lat,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}>
          <Marker
            coordinate={{
              latitude: origin.location.lat,
              longitude: origin.location.lng,
            }}
            title="Your location"
            description={origin.description}
            identifier="origin"
          />
        </MapView>
      )}
      {stateTurnOff && (
        <View className="bg-[#9b9b9b83] bg-opacity-[100%] h-full w-full"></View>
      )}

      <View className=" top-4 absolute h-[10%] w-[100%] flex items-center mb-[20%] ">
        <View className="w-[90%] flex flex-row items-center justify-end gap-2">
          <Button
            className={` bg-[#2ab54f]`}
            onPress={() => {
              socket.emitSendUpdateLocation({
                driverinfo: driverinfo.tel,
                lat: origin?.location.lat,
                lng: origin?.location.lng,
              });
              setStateTurnOff(false);
              navigate.navigate('Book');
            }}>
            <Text className="text-white text-xs">TurnOn</Text>
          </Button>
          <Button
            className=" bg-red-500 "
            onPress={() => {
              socket.emitSendUpdateLocation({
                driverinfo: driverinfo.tel,
                lat: 0,
                lng: 0,
              });
              setStateTurnOff(true);
              console.log(Google_Map_Api_Key);
            }}>
            <Text className="text-white text-xs">TurnOff</Text>
          </Button>
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;
