import React from 'react';
import {
  Keyboard,
  Text,
  View,
  Image,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../routers/navigationParams';
import {Images} from '../configs/images';
import {useDispatch} from 'react-redux';
import {useState, useEffect} from 'react';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {Google_Map_Api_Key} from '@env';
import {background} from 'native-base/lib/typescript/theme/styled-system';
import {setDestination, setOrigin} from '../redux/reducers';
import ItemCustom from '../component/ItemCustom';

type FindScreenProps = NativeStackScreenProps<RootStackParamList, 'Find'>;

const FindScreen: React.FC<FindScreenProps> = ({navigation}) => {
  const dispatch = useDispatch();
  const [textvalue, changetext] = useState('');

  return (
    <KeyboardAvoidingView
      className="h-screen w-full"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View className="relative  h-[90%] w-[95%] mt-2">
        <GooglePlacesAutocomplete
          placeholder="Search"
          styles={{
            container: {
              flex: 0,
              margin: 10,
              height: '80%',
              paddingLeft: 10,
            },

            textInput: {
              fontSize: 18,
              paddingLeft: '10%',
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
              marginTop: '20%',
              width: '100%',
            },
          }}
          onPress={(data, details = null) => {
            dispatch(
              setDestination({
                location: details?.geometry.location,
                description: data.description,
              }),
            );

            navigation.navigate('Book');
          }}
          enablePoweredByContainer={false}
          fetchDetails={true}
          query={{
            key: 'AIzaSyCOv0UiRLIxv-IbgnzKGZWJu5BBL-R91gg',
            language: 'en',
          }}
          minLength={2}
          debounce={200}
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
        <View className="absolute top-12 left-4 mt-4 flex flex-row items-start justify-between w-[95%]">
          <Text className="font-semibold">Recent places</Text>
          <Text className="text-[#F4BE05] font-semibold">Clear All</Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default FindScreen;
