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
  ActivityIndicator,
} from 'react-native';
import MainContainer from '../components/MainContainer';
import {SignInCss} from '../objects/commonCss';
import {TextInput, HelperText} from 'react-native-paper';
import {
  CommonActions,
  useNavigation,
  useFocusEffect,
} from '@react-navigation/native';
import React, {useRef, useEffect, useState} from 'react';
import SignUp from './SignUp';
import RNFetchBlob from 'rn-fetch-blob';
import {UrlAccess} from '../objects/url';
import ForgotPassword from './ForgotPassword';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../language/language';
import Toast from 'react-native-toast-message';
import ReactNativeBiometrics, {Biometrics} from 'react-native-biometrics';
import {darkSignIn} from '../objects/darkCss';

const SignIn = () => {
  const navigation = useNavigation();
  const [locale, setLocale] = React.useState(i18n.locale);
  const [userId, setUserId] = useState('');
  const [isFingerEnabled, setFingerIsEnabled] = useState(false);
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [Invalid, setInvalid] = useState(false);
  const [hidePass, setHidePass] = useState(true);
  const [UserID, setUserID] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [Username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDark, setIsDark] = useState(false);

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

  const Anim = useRef(new Animated.Value(100)).current;
  const Anim1 = useRef(new Animated.Value(110)).current;
  const Anim2 = useRef(new Animated.Value(120)).current;
  const Anim3 = useRef(new Animated.Value(130)).current;
  const Anim4 = useRef(new Animated.Value(140)).current;
  const Anim5 = useRef(new Animated.Value(150)).current;
  const Anim6 = useRef(new Animated.Value(160)).current;

  useFocusEffect(
    React.useCallback(() => {
      setLocale(i18n.locale);
    }, []),
  );

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

  const loadFingerPrint = async () => {
    try {
      const storedUserID = await AsyncStorage.getItem('UserID');
      if (storedUserID) {
        setUserId(storedUserID);
        await isEnabledFingerPrint(storedUserID);
      }
    } catch (error) {
      ErrorToast(i18n.t('Fail-Load-UserID'));
    }
  };

  const isEnabledFingerPrint = async (userId: any) => {
    try {
      const response = await RNFetchBlob.config({trusty: true}).fetch(
        'GET',
        `${UrlAccess.Url}User/GetFingerPrint?userId=${userId}`,
        {'Content-Type': 'application/json'},
      );

      const data = await response.json();
      if (data.success) {
        setFingerIsEnabled(data.userData.fingerPrint);
      } else {
        ErrorToast(i18n.t('SignIn.Fail-Fetch-Fingerprint'));
      }
    } catch (error) {
      ErrorToast(i18n.t('SignIn.Fetch-Fingerprint-Error'));
    }
  };

  const initialize = async () => {
    setLoading(true);
    await Promise.all([loadTheme(), loadFingerPrint()]);
    Animated.parallel([
      Animated.timing(Anim, {toValue: 0, duration: 500, useNativeDriver: true}),
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
    ]).start(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    initialize();
  }, []);

  const SignIn = async () => {
    setLoading(true);
    try {
      const response = await RNFetchBlob.config({trusty: true}).fetch(
        'POST',
        `${UrlAccess.Url}User/SignIn`,
        {'Content-Type': 'application/json'},
        JSON.stringify({
          email: Email,
          password: Password,
        }),
      );
      const json = await response.json();
      if (json.success) {
        const {userID, userName} = json;
        setUserID(userID);
        setUsername(userName);
        await AsyncStorage.setItem('UserID', userID.toString());
        await AsyncStorage.setItem('UserName', userName);
        await AsyncStorage.setItem('Email', Email);
        await AsyncStorage.setItem('Password', Password);
        SuccessToast(i18n.t('SignIn.Successful'));
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'CustomDrawer'}],
          }),
        );
      } else {
        setInvalid(true);
      }
    } catch (error) {
      ErrorToast(i18n.t('SignIn.Sign-In-Error'));
    } finally {
      setLoading(false);
    }
  };

  const Verify = () => {
    setLoading(true);
    let valid = true;

    if (Email.trim() === '') {
      setEmailError(i18n.t('SignIn.Email-Empty'));
      valid = false;
    } else {
      setEmailError('');
    }

    if (Password.trim() === '') {
      setPasswordError(i18n.t('SignIn.Password-Empty'));
      valid = false;
    } else {
      setPasswordError('');
    }

    if (valid) {
      AsyncStorage.setItem('Email', Email);
      SignIn();
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const rnBiometrics = new ReactNativeBiometrics();
  const handleFingerprint = async () => {
    try {
      const resultObject = await rnBiometrics.simplePrompt({
        promptMessage: 'Sign In',
      });
      const {success} = resultObject;
      if (success) {
        setLoading(true);
        await getUserData(userId);
      }
    } catch (error) {
      ErrorToast(i18n.t("SignIn.Error-Handle-Fingerprint"));
    }
  };

  const getUserData = async (userId: any) => {
    try {
      const response = await RNFetchBlob.config({trusty: true}).fetch(
        'GET',
        `${UrlAccess.Url}User/GetSignInData?userId=${userId}`,
        {'Content-Type': 'application/json'},
      );

      const data = await response.json();
      if (data.success) {
        const email = data.userData.email;
        const password = data.userData.password;
        await autoSignIn(email, password);
      } else {
        ErrorToast(i18n.t("Fail-Load-Data"));
      }
    } catch (error) {
      ErrorToast(i18n.t("Fail-Load-Data"));
    } finally {
      setLoading(false);
    }
  };

  const autoSignIn = async (email: any, password: any) => {
    setLoading(true);
    try {
      RNFetchBlob.config({trusty: true})
        .fetch(
          'POST',
          UrlAccess.Url + 'User/SignIn',
          {'Content-Type': 'application/json'},
          JSON.stringify({
            email: email,
            password: password,
          }),
        )
        .then(response => response.json())
        .then(json => {
          if (json.success) {
            const {userID, userName} = json;
            setUserID(userID);
            setUsername(userName);
            AsyncStorage.setItem('UserID', userID.toString());
            AsyncStorage.setItem('UserName', userName);
            AsyncStorage.setItem('Email', Email);
            AsyncStorage.setItem('Password', Password);
            SuccessToast(i18n.t('SignIn.Successful'));
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'CustomDrawer'}],
              }),
            );
          } else {
            setInvalid(true);
          }
        });
    } catch (error) {
      ErrorToast(i18n.t('SignIn.Sign-In-Error'));
    } finally {
      setLoading(false);
    }
  };

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
          <Animated.View style={{transform: [{translateY: Anim}]}}>
            <Image
              style={SignInCss.Logo}
              source={require('../assets/Logo.png')}
            />
          </Animated.View>

          <Animated.View style={{transform: [{translateY: Anim1}]}}>
            <Text style={isDark ? darkSignIn.Title : SignInCss.Title}>
              {i18n.t('SignIn.Sign-In')}
            </Text>
            <Text style={isDark ? darkSignIn.Content : SignInCss.Content}>
              {i18n.t('SignIn.Credentials')}
            </Text>
          </Animated.View>

          <Animated.View style={{transform: [{translateY: Anim2}]}}>
            <TextInput
              label={i18n.t('SignIn.Email')}
              mode="outlined"
              style={isDark ? darkSignIn.Input : SignInCss.Input}
              placeholder={i18n.t('SignIn.Email-Placeholder')}
              theme={isDark ? darkTheme : theme}
              onChangeText={text => setEmail(text)}
              textColor={isDark ? '#fff' : '#000'}
            />
            {emailError !== '' && (
              <HelperText type="error" style={SignInCss.InputError}>
                {emailError}
              </HelperText>
            )}
          </Animated.View>

          <Animated.View style={{transform: [{translateY: Anim3}]}}>
            <TextInput
              label={i18n.t('SignIn.Password')}
              mode="outlined"
              style={isDark ? darkSignIn.Input : SignInCss.Input}
              placeholder={i18n.t('SignIn.Password-Placeholder')}
              theme={isDark ? darkTheme : theme}
              onChangeText={text => setPassword(text)}
              autoCapitalize="none"
              secureTextEntry={hidePass ? true : false}
              textColor={isDark ? '#fff' : '#000'}
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
            {Invalid == true && (
              <HelperText type="error" style={SignInCss.InputError}>
                {i18n.t('SignIn.Invalid')}
              </HelperText>
            )}

            <Text
              style={SignInCss.Forgot}
              onPress={() => navigation.navigate(ForgotPassword as never)}>
              {i18n.t('SignIn.Forgot')}
            </Text>
          </Animated.View>
          <Animated.View style={{transform: [{translateY: Anim4}]}}>
            <TouchableOpacity
              style={SignInCss.LoginButton}
              onPress={() => Verify()}>
              <Text style={SignInCss.BtnText}>{i18n.t('SignIn.Sign')}</Text>
            </TouchableOpacity>
          </Animated.View>

          {isFingerEnabled ? (
            <View>
              <Animated.View style={{transform: [{translateY: Anim5}]}}>
                <View style={SignInCss.Other}>
                  <View style={SignInCss.Line}></View>
                  <Text style={SignInCss.Or}>{i18n.t('SignIn.Or')}</Text>
                  <View style={SignInCss.Line}></View>
                </View>
              </Animated.View>

              <Animated.View style={{transform: [{translateY: Anim6}]}}>
                <TouchableOpacity
                  style={SignInCss.Finger}
                  onPress={() => handleFingerprint()}>
                  <Image
                    style={SignInCss.Finger}
                    source={
                      isDark
                        ? require('../assets/whitefingerprint.png')
                        : require('../assets/fingerprint.png')
                    }
                  />
                </TouchableOpacity>
              </Animated.View>
            </View>
          ) : (
            <View></View>
          )}

          <Text style={isDark ? darkSignIn.SignUp : SignInCss.SignUp}>
            {i18n.t('SignIn.Dont-Have-Account')}
            <Text
              style={{color: '#3490DE'}}
              onPress={() => navigation.navigate(SignUp as never)}>
              {i18n.t('SignIn.Sign-Up')}
            </Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </MainContainer>
  );
};

export default SignIn;
