import {
  View,
  StatusBar,
  Image,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import MainContainer from '../components/MainContainer';
import {SignInCss} from '../objects/commonCss';
import {TextInput, HelperText} from 'react-native-paper';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useRef, useEffect, useState} from 'react';
import RNFetchBlob from 'rn-fetch-blob';
import {UrlAccess} from '../objects/url';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ResetVerify from './ResetVerify';
import i18n from '../language/language';
import SignIn from './SignIn';
import Toast from 'react-native-toast-message';
import {darkSignIn} from '../objects/darkCss';

const ForgotPassword = () => {
  const navigation = useNavigation();
  const theme = {
    roundness: 20, // Set the border radius here
    colors: {
      primary: '#000', // Active outline color
      outline: '#808080', // Outline color
    },
  };

  const darkTheme = {
    roundness: 20, // Set the border radius here
    colors: {
      primary: '#3490DE', // Active outline color
      outline: '#808080', // Outline color
    },
  };

  const [locale, setLocale] = React.useState(i18n.locale);

  useFocusEffect(
    React.useCallback(() => {
      setLocale(i18n.locale);
    }, []),
  );

  const ErrorToast = (message: any) => {
    Toast.show({
      type: 'error',
      text1: message,
      visibilityTime: 3000,
    });
  };

  const SuccessToast = (message: any) => {
    Toast.show({
      type: 'success',
      text1: message,
      visibilityTime: 3000,
    });
  };

  const [Email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [CheckEmail, setCheckEmail] = useState(false);
  const [loading, setLoading] = useState(false);

  const checkEmail = (Email: any) => {
    setLoading(true);
    try {
      RNFetchBlob.config({trusty: true})
        .fetch(
          'POST',
          UrlAccess.Url + 'User/CheckEmail',
          {'Content-Type': 'application/json'},
          JSON.stringify({
            email: Email,
          }),
        )
        .then(response => response.json())
        .then(json => {
          if (json && json.success) {
            setCheckEmail(true);
          } else {
            setCheckEmail(false);
          }
        });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (Email.trim() !== '') {
      checkEmail(Email);
    }
  }, [Email]);

  const Verify = () => {
    setLoading(true);
    try {
      let valid = true;

      if (Email.trim() === '') {
        setEmailError(i18n.t('ForgotPassword.Email-Empty'));
        valid = false;
      } else {
        if (CheckEmail === true) {
          setEmailError(i18n.t('ForgotPassword.Email-Find'));
          valid = false;
        } else {
          setEmailError('');
        }
      }

      if (valid) {
        AsyncStorage.setItem('Email', Email);
        try {
          RNFetchBlob.config({trusty: true}).fetch(
            'POST',
            UrlAccess.Url + 'OTP/SendOTP',
            {'Content-Type': 'application/json'},
            JSON.stringify({
              email: Email,
            }),
          );
          SuccessToast(i18n.t('ForgotPassword.Send-OTP-Successful'));
          navigation.navigate(ResetVerify as never);
        } catch (error) {
          ErrorToast(i18n.t('ForgotPassword.Send-OTP-Unsuccessful'));
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const [isDark, setIsDark] = useState(false);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme) {
        setIsDark(savedTheme === 'dark');
      }
    } catch (error) {
      ErrorToast(i18n.t('Fail-Load-Theme'));
    }
  };

  const initialize = async () => {
    setLoading(true);
    try {
      await Promise.all([loadTheme()]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: isDark ? '#000' : '#fff',
        }}>
        <ActivityIndicator size="large" color={isDark ? '#fff' : '#000'} />
      </View>
    );
  }

  return (
    <MainContainer>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <StatusBar backgroundColor={isDark ? '#000' : '#fff'} />
        <View style={isDark ? darkSignIn.container : SignInCss.container}>
          <Image
            style={SignInCss.Logo}
            source={require('../assets/Logo.png')}
          />

          <Text style={isDark ? darkSignIn.Title : SignInCss.Title}>
            {i18n.t('ForgotPassword.Forgot-Password')}
          </Text>
          <Text style={isDark ? darkSignIn.Content : SignInCss.Content}>
            {i18n.t('ForgotPassword.Credentials')}
          </Text>

          <TextInput
            label={i18n.t('ForgotPassword.Email')}
            mode="outlined"
            style={isDark ? darkSignIn.Input : SignInCss.Input}
            placeholder={i18n.t('ForgotPassword.Email-Placeholder')}
            theme={isDark ? darkTheme : theme}
            onChangeText={text => setEmail(text)}
            textColor={isDark ? '#fff' : '#000'}
            value={Email}
          />
          {emailError !== '' && (
            <HelperText type="error" style={SignInCss.InputError}>
              {emailError}
            </HelperText>
          )}

          <TouchableOpacity style={SignInCss.Send} onPress={() => Verify()}>
            <Text style={SignInCss.BtnText}>
              {i18n.t('ForgotPassword.Send')}
            </Text>
          </TouchableOpacity>

          <Text style={isDark ? darkSignIn.SignUp : SignInCss.SignUp}>
            {i18n.t('ForgotPassword.Remember-Password')}
            <Text
              style={{color: '#3490DE'}}
              onPress={() => navigation.navigate(SignIn as never)}>
              {i18n.t('ForgotPassword.Sign-In')}
            </Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </MainContainer>
  );
};

export default ForgotPassword;
