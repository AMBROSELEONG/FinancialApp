import {
  View,
  StatusBar,
  Image,
  Text,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Alert,
} from 'react-native';
import MainContainer from '../components/MainContainer';
import {SignInCss} from '../objects/commonCss';
import {TextInput, HelperText} from 'react-native-paper';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import React, {useRef, useEffect, useState} from 'react';
import SignIn from './SignIn';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFetchBlob from 'rn-fetch-blob';
import {UrlAccess} from '../objects/url';
import i18n from '../language/language';
import Toast from 'react-native-toast-message';

const SignUp = () => {
  const navigation = useNavigation();

  const [locale, setLocale] = React.useState(i18n.locale);

  useFocusEffect(
    React.useCallback(() => {
      setLocale(i18n.locale);
    }, []),
  );

  const theme = {
    roundness: 20, // Set the border radius here
    colors: {
      primary: '#000', // Active outline color
      outline: '#808080', // Outline color
    },
  };

  const Anim = useRef(new Animated.Value(100)).current;
  const Anim1 = useRef(new Animated.Value(110)).current;
  const Anim2 = useRef(new Animated.Value(120)).current;
  const Anim3 = useRef(new Animated.Value(130)).current;
  const Anim4 = useRef(new Animated.Value(140)).current;
  const Anim5 = useRef(new Animated.Value(150)).current;
  const Anim6 = useRef(new Animated.Value(160)).current;

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
      Animated.timing(Anim3, {
        toValue: 0,
        duration: 650,
        useNativeDriver: true,
      }),
      Animated.timing(Anim4, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(Anim5, {
        toValue: 0,
        duration: 750,
        useNativeDriver: true,
      }),
      Animated.timing(Anim6, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [Anim, Anim1, Anim2, Anim3, Anim4, Anim5, Anim6]);

  const [Username, setUsername] = useState('');
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [ConfirmPassword, setConfirmPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [hidePass, setHidePass] = useState(true);
  const [UserNameDuplication, setUserNameDuplication] = useState(false);
  const [EmailDuplication, setEmailDuplication] = useState(false);

  const checkEmailFormat = (Email: any) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(Email);
  };

  const checkPasswordFormat = (Password: any) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
    return passwordRegex.test(Password);
  };

  const checkUserNameDuplication = (Username: any) => {
    try {
      RNFetchBlob.config({trusty: true})
        .fetch(
          'POST',
          UrlAccess.Url + 'User/CheckUserName',
          {'Content-Type': 'application/json'},
          JSON.stringify({
            userName: Username,
          }),
        )
        .then(response => response.json())
        .then(json => {
          if (json && json.success) {
            setUserNameDuplication(true);
          } else {
            setUserNameDuplication(false);
          }
        });
    } catch (error) {
      return error;
    }
  };

  const checkEmailDuplication = (Email: any) => {
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
            setEmailDuplication(true);
          } else {
            setEmailDuplication(false);
          }
        });
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    if (Username.trim() !== '') {
      checkUserNameDuplication(Username);
    }
    if (Email.trim() !== '') {
      checkEmailDuplication(Email);
    }
  }, [Username, Email]);

  const Verify = async () => {
    let valid = true;

    if (Username.trim() === '') {
      setUsernameError(i18n.t('SignUp.Username-Empty'));
      valid = false;
    } else {
      if (UserNameDuplication === false) {
        setUsernameError(i18n.t('SignUp.Username-Duplication'));
        valid = false;
      } else {
        setUsernameError('');
      }
    }

    if (Email.trim() === '') {
      setEmailError(i18n.t('SignUp.Email-Empty'));
      valid = false;
    } else if (!checkEmailFormat(Email)) {
      setEmailError(i18n.t('SignUp.Email-Format'));
      valid = false;
    } else {
      if (EmailDuplication === false) {
        setEmailError(i18n.t('SignUp.Email-Duplication'));
        valid = false;
      } else {
        setEmailError('');
      }
    }

    if (Password.trim() === '') {
      setPasswordError(i18n.t('SignUp.Password-Empty'));
      valid = false;
    } else if (!checkPasswordFormat(Password)) {
      setPasswordError(i18n.t('SignUp.Password-Format'));
      valid = false;
    } else if (Password !== ConfirmPassword) {
      setPasswordError(i18n.t('SignUp.Password-Match'));
      valid = false;
    } else {
      setPasswordError('');
    }

    if (valid) {
      AsyncStorage.setItem('Email', Email);
      AsyncStorage.setItem('UserName', Username);
      AsyncStorage.setItem('Password', Password);
      try {
        RNFetchBlob.config({trusty: true}).fetch(
          'POST',
          UrlAccess.Url + 'OTP/SendOTP',
          {'Content-Type': 'application/json'},
          JSON.stringify({
            email: Email,
          }),
        );
        Alert.prompt(i18n.t('SignUp.Send-OTP-Successful'));
        navigation.navigate(Verify as never);
      } catch (error) {
        Alert.prompt(i18n.t('SignUp.Send-OTP-Unsuccessful'));
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
            <Text style={SignInCss.Title}>{i18n.t('SignUp.Sign-Up')}</Text>
            <Text style={SignInCss.Content}>
              {i18n.t('SignUp.Credentials')}
            </Text>
          </Animated.View>

          <Animated.View style={{transform: [{translateY: Anim2}]}}>
            <TextInput
              label={i18n.t('SignUp.Username')}
              mode="outlined"
              style={SignInCss.Input}
              placeholder={i18n.t('SignUp.Username-Placeholder')}
              theme={theme}
              onChangeText={text => setUsername(text)}
            />
            {usernameError !== '' && (
              <HelperText type="error" style={SignInCss.InputError}>
                {usernameError}
              </HelperText>
            )}
          </Animated.View>

          <Animated.View style={{transform: [{translateY: Anim3}]}}>
            <TextInput
              label={i18n.t('SignUp.Email')}
              mode="outlined"
              style={SignInCss.Input}
              placeholder={i18n.t('SignUp.Email-Placeholder')}
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
            <TextInput
              label={i18n.t('SignUp.Password')}
              mode="outlined"
              style={SignInCss.Input}
              placeholder={i18n.t('SignUp.Password-Placeholder')}
              theme={theme}
              onChangeText={text => setPassword(text)}
              autoCapitalize="none"
              secureTextEntry={hidePass ? true : false}
              right={
                <TextInput.Icon
                  icon={hidePass ? 'eye-off' : 'eye'}
                  onPress={() => setHidePass(!hidePass)}
                />
              }
            />
            {passwordError !== '' && (
              <HelperText type="error" style={SignInCss.InputError}>
                {passwordError}
              </HelperText>
            )}
          </Animated.View>

          <Animated.View style={{transform: [{translateY: Anim5}]}}>
            <TextInput
              label={i18n.t('SignUp.Confirm-Password')}
              mode="outlined"
              style={[
                SignInCss.Input,
                {marginBottom: (Dimensions.get('screen').height / 100) * 5},
              ]}
              placeholder={i18n.t('SignUp.Confirm-Password-Placeholder')}
              theme={theme}
              autoCapitalize="none"
              secureTextEntry={hidePass ? true : false}
              onChangeText={text => setConfirmPassword(text)}
              right={
                <TextInput.Icon
                  icon={hidePass ? 'eye-off' : 'eye'}
                  onPress={() => setHidePass(!hidePass)}
                />
              }
            />
          </Animated.View>

          <Animated.View style={{transform: [{translateY: Anim6}]}}>
            <TouchableOpacity
              style={SignInCss.LoginButton}
              onPress={() => Verify()}>
              <Text style={SignInCss.BtnText}>{i18n.t('SignUp.Register')}</Text>
            </TouchableOpacity>
          </Animated.View>

          <Text style={SignInCss.SignUp}>
            {i18n.t('SignUp.Already-Have-Account')}
            <Text
              style={{color: '#3490DE'}}
              onPress={() => navigation.navigate(SignIn as never)}>
              {i18n.t('SignUp.Sign-In')}
            </Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </MainContainer>
  );
};

export default SignUp;
