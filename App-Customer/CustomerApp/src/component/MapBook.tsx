import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useRef, useEffect} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../routers/navigationParams';
import MapView, {Marker} from 'react-native-maps';
import {useSelector} from 'react-redux';
import {
  selectdestination,
  selectorigin,
  selectStep,
  selectLocationDriver,
  setLocationDriver,
} from '../redux/reducers';
import MapViewDirections from 'react-native-maps-directions';
import {Google_Map_Api_Key} from '@env';
import {useNavigation} from '@react-navigation/native';
import {Button} from 'native-base';
import {useDispatch} from 'react-redux';
import {showMessage} from '../redux/reducers';
import {setStep} from '../redux/reducers';
import useCustomNavigation from '../hooks/useCustomNavigation';

import {Images} from '../configs/images';
import myTheme from './../configs/Theme';
import {StatusColor} from './Overlay/SlideMessage';
import {SocketIOClient} from '../socket';

const MapBook = () => {
  const origin = useSelector(selectorigin);
  const destination = useSelector(selectdestination);
  const locationDriver = useSelector(selectLocationDriver);
  const mapRef = useRef(null);
  const navigation = useCustomNavigation();
  const dispatch = useDispatch();
  const step = useSelector(selectStep);
  const socket = SocketIOClient.getInstance();

  useEffect(() => {
    if (!origin && !destination) {
      return;
    }
    if (mapRef.current) {
      (mapRef.current as any).fitToSuppliedMarkers(
        ['origin', 'destination', 'locationDriver'],
        {
          edgePadding: {top: 50, right: 50, bottom: 50, left: 50},
        },
      );
    }
  }, [origin, destination, locationDriver, step]);

  React.useEffect(() => {
    if (step.name == 'cancel trip') {
      dispatch(showMessage(StatusColor.info, 'Trip cancelled'));
      socket.onListenDriversLocation(data => {
        dispatch(setLocationDriver(data));
      });
    }
    if (step.name == 'drop off') {
      navigation.navigate('Home');
      dispatch(showMessage(StatusColor.success, 'Trip success'));
      dispatch(setLocationDriver(null));
    }
  }, [step]);
  return (
    <View className="relative">
      <MapView
        ref={mapRef}
        className="flex w-full h-[100%]"
        initialRegion={{
          latitude: origin.location.lat,
          longitude: origin.location.lng,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}>
        {step.name == 'pick up' ? (
          <>
            {destination?.location && (
              <Marker
                coordinate={{
                  latitude: destination.location.lat,
                  longitude: destination.location.lng,
                }}
                title="your goal"
                description={destination.description}
                identifier="destination"
              />
            )}
            {locationDriver && (
              <Marker
                coordinate={{
                  latitude: locationDriver.location.lat,
                  longitude: locationDriver.location.lng,
                }} // Set default latitude and longitude
                title="location driver"
                identifier="locationDriver"
                image={Images.CarMarker}
              />
            )}
            {destination && locationDriver?.name && (
              <MapViewDirections
                destination={{
                  latitude: destination.location.lat,
                  longitude: destination.location.lng,
                }}
                origin={{
                  latitude: locationDriver.location.lat,
                  longitude: locationDriver.location.lng,
                }}
                apikey="AIzaSyCOv0UiRLIxv-IbgnzKGZWJu5BBL-R91gg"
                strokeWidth={3}
                strokeColor={myTheme.colors.blue[500]}
              />
            )}
          </>
        ) : (
          <>
            {origin?.location && (
              <Marker
                coordinate={{
                  latitude: origin.location.lat,
                  longitude: origin.location.lng,
                }}
                title="your location"
                description={origin.description}
                identifier="origin"
              />
            )}
            {/* {destination?.location && (
        <Marker
          coordinate={{
            latitude: destination.location.lat,
            longitude: destination.location.lng,
          }}
          title="your goal"
          description={destination.description}
          identifier="destination"
        />
      )} */}
            {locationDriver &&
              (locationDriver?.name ? (
                <Marker
                  coordinate={{
                    latitude: locationDriver.location.lat,
                    longitude: locationDriver.location.lng,
                  }} // Set default latitude and longitude
                  title="location driver"
                  identifier="locationDriver"
                  image={Images.CarMarker}
                />
              ) : (
                Object.values(locationDriver).map(
                  (value: any, index: number) => (
                    <Marker
                      key={`driver-${index}`}
                      coordinate={{
                        latitude: value.lat,
                        longitude: value.lng,
                      }}
                      title="location driver"
                      identifier="locationDriver"
                      image={Images.CarMarker}
                    />
                  ),
                )
              ))}

            {origin && locationDriver?.name && (
              <MapViewDirections
                destination={{
                  latitude: origin.location.lat,
                  longitude: origin.location.lng,
                }}
                origin={{
                  latitude: locationDriver.location.lat,
                  longitude: locationDriver.location.lng,
                }}
                apikey="AIzaSyCOv0UiRLIxv-IbgnzKGZWJu5BBL-R91gg"
                strokeWidth={3}
                strokeColor={myTheme.colors.blue[500]}
              />
            )}
          </>
        )}
      </MapView>
      {!locationDriver?.name && (
        <View className=" absolute top-[50%] h-[20%] w-full flex flex-col items-center ">
          <ActivityIndicator size="large" color="#007aff" />
          <Text>Finding Driver...</Text>
        </View>
      )}
    </View>
  );
};

export default MapBook;
