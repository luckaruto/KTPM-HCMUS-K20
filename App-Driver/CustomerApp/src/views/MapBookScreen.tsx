import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../routers/navigationParams';

import MapBook from '../component/MapBook';
import ChoiceOrign from '../component/ChoiceOrign';
import FlatListCar from '../component/FlatListCar';
import {useSelector} from 'react-redux';
import {selectStep, selectorigin} from '../redux/reducers';
import {Images} from '../configs/images';
import {useDispatch} from 'react-redux';
import {selectLocationCustomer} from '../redux/reducers';
import {setStep} from '../redux/reducers';
import {Button} from 'native-base';
import {Divider} from 'native-base';
import {Google_Map_Api_Key} from '@env';
import {SocketIOClient} from '../socket';
import NotifyInformationCustomer from '../component/NotifyInformationCustomer';

type MapBookScreenProps = NativeStackScreenProps<RootStackParamList, 'MapBook'>;
const MapBookScreen: React.FC<MapBookScreenProps> = ({navigation}) => {
  const [selectedId, setSelectedId] = useState<string>();
  const step = useSelector(selectStep);
  const origin = useSelector(selectorigin);
  const socket = SocketIOClient.getInstance();
  const locationCustomer = useSelector(selectLocationCustomer);
  const [Notify, SetNotify] = useState({
    notify: false,
    name: '',
    telephonenumber: '',
  });

  React.useEffect(() => {
    if (locationCustomer.Customer?.name) {
      SetNotify(() => ({
        notify: true,
        name: locationCustomer?.Customer.name,
        telephonenumber: locationCustomer?.Customer.id,
      }));
    }
  }, [locationCustomer]);

  React.useEffect(() => {
    socket.onListenCancelFromCustomer(data => {
      dispatch(setStep({name: data}));
      navigation.navigate('Book');
    });
  }, []);

  const dispatch = useDispatch();
  return (
    <View className="relative h-full w-full">
      <MapBook />
      {/* <TouchableOpacity
        onPress={() => {
          dispatch(
            setStep({
              name: 'Not Success location',
            }),
          );
          navigation.goBack();
        }}
        className=" absolute flex flex-row w-[20%] h-[10%] ">
        <View className=" flex flex-row justify-start items-center ml-3">
          <Image source={Images.angle}></Image>
          <Text className="text-bold">Back</Text>
        </View>
      </TouchableOpacity> */}
      <View className="absolute bottom-3 w-full h-[20%] items-center">
        <NotifyInformationCustomer
          customerName={Notify.name}
          telephonenumber={Notify.telephonenumber}
        />
      </View>
    </View>
  );
};

export default MapBookScreen;
