import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React, {useRef, useEffect} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../routers/navigationParams';
import MapView, {Marker} from 'react-native-maps';
import {useSelector} from 'react-redux';
import {selectdestination, selectorigin, selectStep} from '../redux/reducers';
import MapViewDirections from 'react-native-maps-directions';
import {Google_Map_Api_Key} from '@env';
import {useNavigation} from '@react-navigation/native';
import {Button} from 'native-base';
import {useDispatch} from 'react-redux';
import {setStep} from '../redux/reducers';

import {Images} from '../configs/images';
import myTheme from './../configs/Theme';

const Map = () => {
  const origin = useSelector(selectorigin);
  const destination = useSelector(selectdestination);
  const mapRef = useRef(null);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const Step = useSelector(selectStep);
  useEffect(() => {
    if (!origin && !destination) {
      return;
    }
    if (mapRef.current) {
      (mapRef.current as any).fitToSuppliedMarkers(['origin', 'destination'], {
        edgePadding: {top: 50, right: 50, bottom: 50, left: 50},
      });
    }
  }, [origin, destination]);
  return (
    <MapView
      ref={mapRef}
      className="flex w-full h-[50%]"
      initialRegion={{
        latitude: origin.location.lat,
        longitude: origin.location.lng,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }}>
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
      {origin && destination && (
        <MapViewDirections
          origin={{
            latitude: origin.location.lat,
            longitude: origin.location.lng,
          }}
          destination={destination.description}
          apikey="AIzaSyCOv0UiRLIxv-IbgnzKGZWJu5BBL-R91gg"
          strokeWidth={3}
          strokeColor={myTheme.colors.secondary[500]}
        />
      )}

      {/* <TouchableOpacity
        onPress={() => {
          dispatch(
            setStep({
              name: 'Not Success location',
            }),
          );
          navigation.goBack();
        }}
        className="flex flex-row w-[20%] h-[15%] ">
        <View className=" flex flex-row justify-start items-center ml-3">
          <Image source={Images.angle}></Image>
          <Text className="text-bold">Back</Text>
        </View>
      </TouchableOpacity> */}
    </MapView>
  );
};

export default Map;
