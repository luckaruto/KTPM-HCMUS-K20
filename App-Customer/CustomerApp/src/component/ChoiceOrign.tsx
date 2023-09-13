import {View, Text, Image} from 'react-native';
import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../routers/navigationParams';
import {Images} from '../configs/images';
import {useDispatch} from 'react-redux';
import {useState, useEffect} from 'react';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {Google_Map_Api_Key} from '@env';
import {Button} from 'native-base';
import {useNavigation} from '@react-navigation/native';

import {setDestination, setOrigin, setStep} from '../redux/reducers';
import ItemCustom from './ItemCustom';
import {selectStep} from '../redux/reducers';
import {useSelector} from 'react-redux';

const ChoiceOrign = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const Step = useSelector(selectStep);

  return (
    <View className="h-[50%] w-full flex flex-col items-center">
      <View className="relative  h-[100%] w-[90%] mt-2">
        <View className=" absolute bottom-0 w-full h-[20%] flex justify-center items-center">
          <Button
            onPress={() => {
              dispatch(
                setStep({
                  name: 'Success location',
                }),
              );
            }}
            className="bg-[#EDAE10] w-[50%]">
            Choice this location
          </Button>
        </View>

        <GooglePlacesAutocomplete
          placeholder="Choice your location"
          styles={{
            container: {
              margin: 10,
              height: '80%',
            },

            textInput: {
              fontSize: 18,
              paddingLeft: '15%',
              backgroundColor: '#FFF1B166',
              borderRadius: 10,
              borderStyle: 'solid',
              borderWidth: 2,
              borderColor: '#414141',
            },
            row: {
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: 'center',
              width: '100%',
            },
            listView: {
              width: '100%',
            },
          }}
          onPress={(data, details = null) => {
            console.log(details?.geometry.location);
            dispatch(
              setOrigin({
                location: details?.geometry.location,
                description: data.description,
              }),
            );
          }}
          enablePoweredByContainer={false}
          fetchDetails={true}
          query={{
            key: 'AIzaSyCOv0UiRLIxv-IbgnzKGZWJu5BBL-R91gg',
            language: 'en',
          }}
          minLength={2}
          debounce={400}
          isRowScrollable={false}
          renderRow={rowData => {
            const title = rowData.structured_formatting.main_text;
            const address = rowData.structured_formatting.secondary_text;
            const time =
              rowData.structured_formatting.secondary_text_matched_substrings;
            return <ItemCustom title={title} address={address} time={title} />;
          }}
          nearbyPlacesAPI="GooglePlacesSearch"
        />

        <View className=" absolute top-5 left-0 ml-3 flex items-start justify-center pl-3 pointer-events-none ">
          <Image source={Images.map}></Image>
        </View>
      </View>
    </View>
  );
};

export default ChoiceOrign;
