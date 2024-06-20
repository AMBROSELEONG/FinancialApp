import {
  View,
  StatusBar,
  Image,
  Text,
  TouchableOpacity,
  Animated,
  Alert,
  KeyboardAvoidingView,
  Platform,
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

const ForgotPassword = () => {
  const navigation = useNavigation();
  const theme = {
    roundness: 20, // Set the border radius here
    colors: {
      primary: '#000', // Active outline color
      outline: '#808080', // Outline color
    },
  };

  const [locale, setLocale] = React.useState(i18n.locale);

  useFocusEffect(
    React.useCallback(() => {
      setLocale(i18n.locale);
    }, []),
  );

  const showToast = (message: any) => {
    Toast.show({
      type: 'error',
      text1: message,
      visibilityTime: 3000,
    });
  };

  const Anim = useRef(new Animated.Value(100)).current;
  const Anim1 = useRef(new Animated.Value(110)).current;
  const Anim2 = useRef(new Animated.Value(120)).current;
  const Anim4 = useRef(new Animated.Value(130)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(Anim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(Anim1, {
        toValue: 0,
        duration: 550,
        useNativeDriver: true,
      }),
      Animated.timing(Anim2, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(Anim4, {
        toValue: 0,
        duration: 650,
        useNativeDriver: true,
      }),
    ]).start();
  }, [Anim, Anim1, Anim2, Anim4]);

  const [Email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const [CheckEmail, setCheckEmail] = useState(false);

  const checkEmail = (Email: any) => {
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
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    if (Email.trim() !== '') {
      checkEmail(Email);
    }
  }, [Email]);

  const Verify = () => {
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
        showToast(i18n.t('ForgotPassword.Send-OTP-Successful'));
        navigation.navigate(ResetVerify as never);
      } catch (error) {
        showToast(i18n.t('ForgotPassword.Send-OTP-Unsuccessful'));
      }
    }
  };
  return (
    <MainContainer>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <StatusBar backgroundColor="#FFFFFF" />
        <View style={SignInCss.container}>
          <Animated.View style={{transform: [{translateY: Anim}]}}>
            <Image
              style={SignInCss.Logo}
              source={require('../assets/Logo.png')}
            />
          </Animated.View>

          <Animated.View style={{transform: [{translateY: Anim1}]}}>
            <Text style={SignInCss.Title}>
              {i18n.t('ForgotPassword.Forgot-Password')}
            </Text>
            <Text style={SignInCss.Content}>
              {i18n.t('ForgotPassword.Credentials')}
            </Text>
          </Animated.View>

          <Animated.View style={{transform: [{translateY: Anim2}]}}>
            <TextInput
              label={i18n.t('ForgotPassword.Email')}
              mode="outlined"
              style={SignInCss.Input}
              placeholder={i18n.t('ForgotPassword.Email-Placeholder')}
              theme={theme}
              onChangeText={text => setEmail(text)}
            />
            {emailError !== '' && (
              <HelperText type="error" style={SignInCss.InputError}>
                {emailError}
              </HelperText>
            )}
          </Animated.View>

          <Animated.View style={{transform: [{translateY: Anim4}]}}>
            <TouchableOpacity style={SignInCss.Send} onPress={() => Verify()}>
              <Text style={SignInCss.BtnText}>
                {i18n.t('ForgotPassword.Send')}
              </Text>
            </TouchableOpacity>
          </Animated.View>

          <Text style={SignInCss.SignUp}>
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
