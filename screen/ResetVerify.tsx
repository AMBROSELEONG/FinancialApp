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
} from 'react-native';
import MainContainer from '../components/MainContainer';
import {VerifyCss} from '../objects/commonCss';
import React, {useEffect, useRef, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {StackParamList} from './StackPatamList';
import SignIn from './SignIn';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFetchBlob from 'rn-fetch-blob';
import {UrlAccess} from '../objects/url';
import ResetPassword from './ResetPassword';
import Toast from 'react-native-toast-message';
import i18n from '../language/language';
import {useFocusEffect} from '@react-navigation/native';

type OTPInputProps = {
  length: number;
  value: string[];
  disabled: boolean;
  onChange(value: Array<string>): void;
};

type VerifyScreenProps = NativeStackScreenProps<StackParamList, 'ResetVerify'>;

const ResetVerify: React.FC<VerifyScreenProps & OTPInputProps> = ({
  length,
  value,
  disabled,
  onChange,
  navigation,
}) => {
  const showToast = (message: any) => {
    Toast.show({
      type: 'error',
      text1: message,
      visibilityTime: 3000,
    });
  };

  const [locale, setLocale] = React.useState(i18n.locale);
  useFocusEffect(
    React.useCallback(() => {
      setLocale(i18n.locale);
    }, []),
  );

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
              AsyncStorage.setItem('Email', Email);
              navigation.navigate(ResetPassword as never);
            } else {
              showToast(i18n.t('UserEditVerify.Not-Correct'));
            }
          });
      } catch (error) {
        showToast(i18n.t('UserEditVerify.Verify-Unsuccessful'));
      }
    } else {
      showToast(i18n.t('UserEditVerify.Invalid-Input'));
    }
  };

  const [Email, setEmail] = useState('');
  useEffect(() => {
    const getData = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem('Email');
        if (storedEmail !== null) {
          setEmail(storedEmail);
        }
      } catch (error) {
        showToast(i18n.t('UserEditVerify.Failed-Load-Email'));
      }
    };

    getData();
  }, []);

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
      showToast(i18n.t('UserEditVerify.Send-OTP-Successful'));
      AsyncStorage.setItem('Email', Email);
      navigation.navigate(ResetVerify as never);
    } catch (error) {
      showToast(i18n.t('UserEditVerify.Send-OTP-Unsuccessful'));
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

        <Text style={VerifyCss.Title}>
          {i18n.t('UserEditVerify.Verification')}
        </Text>
        <Text style={VerifyCss.SubTitle}>
          {i18n.t('UserEditVerify.Send-To')} {Email}{' '}
        </Text>
        <Text style={VerifyCss.SubTitle}>
          {i18n.t('UserEditVerify.Please-Enter')}
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
            {countdown} {i18n.t('UserEditVerify.Seconds-Remaining')}
          </Text>
        )}
        {showResend && (
          <Text style={VerifyCss.resend} onPress={handleResend}>
            {i18n.t('UserEditVerify.Resend')}
          </Text>
        )}
      
        <TouchableOpacity style={VerifyCss.Btn} onPress={handleVerify}>
          <Text style={VerifyCss.font}>{i18n.t('UserEditVerify.Verify')}</Text>
        </TouchableOpacity>
      </View>
    </MainContainer>
  );
};

export default ResetVerify;
