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

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../routers/navigationParams';
import {Images} from '../configs/images';
import {useState, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {setLoading, showMessage} from './../redux/reducers';
import {Button} from 'native-base';
import {setOrigin} from './../redux/reducers';

import {selectorigin} from './../redux/reducers';
import {LocationService} from '../services/location/LocationService';
import {StatusColor} from '../component/Overlay/SlideMessage';
import {SocketIOClient} from '../socket';
import {User} from '../appData/user/User';
import {LoginHandler} from '../designPattern/chain';
import useCustomNavigation from '../hooks/useCustomNavigation';
import {useSelector} from 'react-redux';
import {selectStep} from './../redux/reducers';

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  const dispatch = useDispatch();
  const step = useSelector(selectStep);
  const socket = SocketIOClient.getInstance();
  const navigate = useCustomNavigation();
  const loginHandler = new LoginHandler();

  useEffect(() => {
    // Check if the user is logged in using the LoginHandler
    !loginHandler.handle() && navigate.replace('Welcome');
  }, []);

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'ios') {
        getLocation();
      } else {
        // For Android
        // Request location permission using PermissionsAndroid API
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
            getLocation();
          } else {
            dispatch(showMessage(StatusColor.error, 'Permission Denied'));
          }
        } catch (err) {
          console.warn(err);
        }
      }
    };

    const getLocation = async () => {
      try {
        dispatch(setLoading(true));
        const position = await LocationService.getMyLocation();
        const currentLongitude = position.coords.longitude;
        const currentLatitude = position.coords.latitude;

        dispatch(
          setOrigin({
            location: {lat: currentLatitude, lng: currentLongitude},
          }),
        );
        dispatch(setLoading(false));
      } catch (err) {
        dispatch(showMessage(StatusColor.error, err));
      } finally {
        dispatch(setLoading(false));
      }
    };

    requestLocationPermission();
  }, [dispatch]);

  const mapRef = useRef(null);
  const origin = useSelector(selectorigin);

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

  return (
    <View className="relative h-full w-full">
      {origin != null && (
        <MapView
          ref={mapRef}
          className=" absolute w-full h-full"
          initialRegion={{
            latitude: origin.location.lat,
            longitude: origin.location.lng,
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

      <View className=" bottom-0  absolute h-[20%]  w-full">
        <View className="flex flex-col items-center justify-end h-full w-full ">
          <View className="flex flex-col items-center justify-start bg-[#FFFBE7] border-2 border-[#F3BD06] rounded-[15px] h-[95%] w-[90%] mb-7 ">
            <View className="relative  h-[30%] w-[95%] mt-2">
              <TextInput
                className="absolute pl-[15%]  bg-[#FFFBE7] border-2 border-[#F3BD06] rounded-[10px] h-full w-full "
                editable
                onPressIn={() => {
                  navigation.navigate('Find');
                }}
                placeholder="Where are you go"
              />
              <View className=" absolute inset-y-0 left-0 flex items-start justify-center pl-3 pointer-events-none ">
                <Image source={Images.iconfind}></Image>
              </View>
            </View>
            <Button
              className="my-2 rounded-[10px] px-5 h-[40px] w-[30%] "
              onPress={() => {
                console.log(User.getInstance().information);
              }}>
              <Text className="text-white text-xs">Comfirm</Text>
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;
