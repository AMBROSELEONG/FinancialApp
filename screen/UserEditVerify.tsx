import {
  View,
  StatusBar,
  Image,
  TouchableOpacity,
  Text,
  TextInput,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  Alert,
  Modal,
} from 'react-native';
import MainContainer from '../components/MainContainer';
import {VerifyCss} from '../objects/commonCss';
import React, {useEffect, useRef, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {StackParamList} from './StackPatamList';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFetchBlob from 'rn-fetch-blob';
import {UrlAccess} from '../objects/url';
import UserEdit from './UserEdit';

type OTPInputProps = {
  length: number;
  value: string[];
  disabled: boolean;
  onChange(value: Array<string>): void;
};

type VerifyScreenProps = NativeStackScreenProps<
  StackParamList,
  'UserEditVerify'
>;

const UserEditVerify: React.FC<VerifyScreenProps & OTPInputProps> = ({
  length,
  value,
  disabled,
  onChange,
  navigation,
}) => {
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const onChangeValue = (text: string, index: number) => {
    const newValue = value.map((item, valueIndex) => {
      if (valueIndex === index) {
        return text;
      }

      return item;
    });

    onChange(newValue);
  };

  const handleChange = (text: string, index: number) => {
    const sanitizedText = text.replace(/[^0-9]/g, '');
    onChangeValue(text, index);

    if (sanitizedText.length !== 0) {
      return inputRefs?.current[index + 1]?.focus();
    }

    return inputRefs?.current[index - 1]?.focus();
  };

  const handleBackspace = (
    event: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) => {
    const {nativeEvent} = event;

    if (nativeEvent.key === 'Backspace') {
      handleChange('', index);
    }
  };

  const [modalVisible, setModalVisible] = useState(false);
  const handleVerify = () => {
    const isValid = value.every(char => /^[0-9]$/.test(char));

    if (isValid) {
      const OTP = value.join('');
      console.log(Email, OTP);
      try {
        RNFetchBlob.config({trusty: true})
          .fetch(
            'POST',
            UrlAccess.Url + 'OTP/VerifyOTP',
            {'Content-Type': 'application/json'},
            JSON.stringify({
              email: Email,
              otp: OTP,
            }),
          )
          .then(response => response.json())
          .then(json => {
            if (json && json.success) {
              setModalVisible(true);
              AsyncStorage.removeItem('Email');
              AsyncStorage.removeItem('UserName');
              AsyncStorage.removeItem('Password');
            } else {
              Alert.alert('Your Verify Code is not correct');
            }
          });
      } catch (error) {
        Alert.alert('Verify Unsuccessful');
      }
    } else {
      Alert.prompt(
        'Invalid input: OTP should contain only numeric characters without spaces or symbols.',
      );
    }
  };

  const [Username, setUsername] = useState('');
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem('Email');
        const storedUsername = await AsyncStorage.getItem('UserName');
        const storedPassword = await AsyncStorage.getItem('Password');
        const storedUserID = await AsyncStorage.getItem('UserID');
        if (
          storedEmail !== null &&
          storedUsername !== null &&
          storedPassword !== null &&
          storedUserID !== null
        ) {
          setEmail(storedEmail);
          setUsername(storedUsername);
          setPassword(storedPassword);
          setUserId(parseInt(storedUserID));
        }
      } catch (error) {
        console.error('Failed to load email from AsyncStorage', error);
      }
    };

    getData();
  }, []);

  const EditData = () => {
    try {
      RNFetchBlob.config({trusty: true})
        .fetch(
          'POST',
          UrlAccess.Url + 'User/UpdateUserData',
          {'Content-Type': 'application/json'},
          JSON.stringify({
            userId: userId,
            userName: Username,
            email: Email,
            password: Password,
          }),
        )
        .then(response => response.json())
        .then(json => {
          if (json && json.success) {
            navigation.navigate(UserEdit as never);
            console.log('Data insert successful');
          } else {
            Alert.alert('Data insert error');
          }
        });
    } catch (error) {}
  };

  const resend = () => {
    try {
      RNFetchBlob.config({trusty: true}).fetch(
        'POST',
        UrlAccess.Url + 'OTP/SendOTP',
        {'Content-Type': 'application/json'},
        JSON.stringify({
          email: Email,
        }),
      );
      Alert.prompt('Send OTP Successful');
      navigation.navigate(UserEditVerify as never);
    } catch (error) {
      Alert.prompt('Send OTP Unsuccessful');
    }
  };

  const [countdown, setCountdown] = useState(60);
  const [showResend, setShowResend] = useState(false);

  const handleResend = () => {
    setCountdown(60);
    setShowResend(false);
    resend();
  };

  useEffect(() => {
    let interval: any;
    if (countdown === 0) {
      setShowResend(true);
    } else {
      interval = setInterval(() => {
        setCountdown(countdown - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [countdown]);

  return (
    <MainContainer>
      <StatusBar backgroundColor="#FFFFFF" />
      <View style={VerifyCss.Container}>
        <TouchableOpacity
          style={[VerifyCss.Back, {margin: 20}]}
          onPress={() => navigation.goBack()}>
          <Image
            source={require('../assets/arrow.png')}
            style={VerifyCss.Back}
          />
        </TouchableOpacity>

        <Text style={VerifyCss.Title}>Verification</Text>
        <Text style={VerifyCss.SubTitle}>Code sent to {Email} </Text>
        <Text style={VerifyCss.SubTitle}>
          Please Enter the Verification Code{' '}
        </Text>

        <Image source={require('../assets/Verify.png')} style={VerifyCss.img} />
        <View style={VerifyCss.Pin}>
          {[...new Array(length)].map((item, index) => (
            <TextInput
              ref={ref => (inputRefs.current[index] = ref)}
              key={index}
              maxLength={1}
              contextMenuHidden
              selectTextOnFocus
              editable={!disabled}
              style={VerifyCss.Input}
              keyboardType="decimal-pad"
              testID={`OTPInput-${index}`}
              onChangeText={text => handleChange(text, index)}
              onKeyPress={event => handleBackspace(event, index)}
            />
          ))}
        </View>
        {countdown > 0 && (
          <Text style={[VerifyCss.resend, {color: '#000'}]}>
            {countdown} seconds remaining
          </Text>
        )}
        {showResend && (
          <Text style={VerifyCss.resend} onPress={handleResend}>
            Resend code
          </Text>
        )}
        <TouchableOpacity style={VerifyCss.Btn} onPress={handleVerify}>
          <Text style={VerifyCss.font}>VERIFY</Text>
        </TouchableOpacity>
      </View>
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={VerifyCss.ModalView}>
          <View style={VerifyCss.ModalContainer}>
            <Image
              source={require('../assets/successful.png')}
              style={{alignSelf: 'center', marginTop: 30}}
            />
            <Text style={VerifyCss.TextModal}>Edit Data Successful</Text>
            <TouchableOpacity
              style={VerifyCss.ButtonModal}
              onPress={() => {
                EditData();
              }}>
              <Text style={VerifyCss.ButtonText}>Save Data</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </MainContainer>
  );
};

export default UserEditVerify;
