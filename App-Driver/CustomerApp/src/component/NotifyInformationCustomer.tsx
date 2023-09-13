import {Text, View, Image} from 'react-native';
import React, {Component} from 'react';
import {Images} from '../configs/images';
import {Button} from 'native-base';
import {useDispatch} from 'react-redux';
import {setLocationCustomer, setStep, showMessage} from '../redux/reducers';
import {selectStep, selectRideId} from '../redux/reducers';
import {useSelector} from 'react-redux';
import {SocketIOClient} from '../socket';
import {SOCKET} from '../socket/constants';
import useCustomNavigation from '../hooks/useCustomNavigation';
import {User} from '../appData/user/User';
import {RideService} from '../services/ride/RideService';
import {StatusColor} from './Overlay/SlideMessage';

type ItemProps = {
  customerName: string;
  telephonenumber: string;
};

const NotifyInformationCustomer = ({
  customerName,
  telephonenumber,
}: ItemProps) => {
  const socket = SocketIOClient.getInstance();
  const dispatch = useDispatch();
  const user = User.getInstance().information;
  const step = useSelector(selectStep);
  const rideId = useSelector(selectRideId);
  const navigate = useCustomNavigation();
  React.useEffect(() => {}, [step]);
  return (
    <View className="py-2 flex flex-col w-[90%] h-[90%] bg-white rounded-xl items-center">
      <View className=" w-[100%] h-[70%]   flex flex-row items-center">
        <Image source={Images.profile} className="ml-2 h-[90%] w-[60px]" />
        <View className="gap-2 ml-1 flex flex-col h-full w-  ">
          <Text className="font-extrabold text-[#6f6868] text-xl">
            {customerName}
          </Text>
          <Text className="font-semibold text-[#454242] text-md">
            {telephonenumber}
          </Text>
        </View>
      </View>
      <View className=" mb-3 flex flex-row h-[40%] w-[90%] rounded-md justify-center gap-3">
        <Button
          className="w-[30%] text-center  bg-red-500 h-[80%]"
          onPress={async () => {
            dispatch(setStep({name: 'cancel trip'}));
            socket.emitCancelTrip({
              customerId: telephonenumber,
              driverId: user.tel,
            });

            try {
              const {message} = await RideService.cancelRide(rideId);

              dispatch(showMessage(StatusColor.success, message));
            } catch (e) {
              dispatch(showMessage(StatusColor.error, e));
            }

            navigate.navigate('Home');
            dispatch(setLocationCustomer(null));
          }}>
          <Text className="text-white h-full text-xs">Cancel Trip</Text>
        </Button>
        {step?.name === 'pick up' && (
          <Button
            className="w-[30%] text-center  bg-green-500 h-[80%]"
            onPress={async () => {
              dispatch(setStep({name: 'drop off'}));
              socket.emitSuccessTrip({
                customerId: telephonenumber,
                driverId: user.tel,
              });
              try {
                const {message} = await RideService.completeRide(rideId);

                dispatch(showMessage(StatusColor.success, message));
              } catch (e) {
                dispatch(showMessage(StatusColor.error, e));
              }
              navigate.navigate('Home');
            }}>
            <Text className="text-white h-full text-xs">drop off</Text>
          </Button>
        )}
        {step?.name === 'bending' && (
          <Button
            className="w-[30%] text-center  bg-green-500 h-[80%]"
            onPress={() => {
              dispatch(setStep({name: 'pick up'}));
              socket.emitPickCustomer({
                customerId: telephonenumber,
                driverId: user.tel,
              });
            }}>
            <Text className="text-white h-full text-xs">pick up</Text>
          </Button>
        )}
      </View>
    </View>
  );
};
export default NotifyInformationCustomer;
