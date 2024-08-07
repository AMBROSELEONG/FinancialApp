import {
  View,
  StatusBar,
  Image,
  Text,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import MainContainer from '../components/MainContainer';
import {SignInCss} from '../objects/commonCss';
import {TextInput, HelperText} from 'react-native-paper';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useRef, useEffect, useState} from 'react';
import RNFetchBlob from 'rn-fetch-blob';
import {UrlAccess} from '../objects/url';
import SignIn from './SignIn';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../language/language';
import Toast from 'react-native-toast-message';
import {darkSignIn} from '../objects/darkCss';

const ResetPassword = () => {
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

  const Anim = useRef(new Animated.Value(100)).current;
  const Anim1 = useRef(new Animated.Value(110)).current;
  const Anim2 = useRef(new Animated.Value(120)).current;
  const Anim3 = useRef(new Animated.Value(130)).current;
  const Anim4 = useRef(new Animated.Value(140)).current;

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
    ]).start();
  }, [Anim, Anim1, Anim2, Anim3, Anim4]);

  const [Password, setPassword] = useState('');
  const [ConfirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [Invalid, setInvalid] = useState(false);
  const [hidePass, setHidePass] = useState(true);
  const [Email, setEmail] = useState('');
  const [isDark, setIsDark] = useState(false);
  const [loading, setLoading] = useState(false);

  const checkPasswordFormat = (Password: any) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
    return passwordRegex.test(Password);
  };

  const getData = async () => {
    try {
      const storedEmail = await AsyncStorage.getItem('Email');
      if (storedEmail !== null) {
        setEmail(storedEmail);
      } else {
        ErrorToast(i18n.t('ResetPassword.Error'));
      }
    } catch (error) {
      ErrorToast(i18n.t('ResetPassword.Failed-Load-Email'));
    }
  };

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
      await Promise.all([loadTheme(), getData()]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  const Verify = () => {
    setLoading(true);
    try {
      let valid = true;

      if (Password.trim() === '') {
        setPasswordError(i18n.t('ResetPassword.Password-Empty'));
        valid = false;
      } else if (!checkPasswordFormat(Password)) {
        setPasswordError(i18n.t('ResetPassword.Password-Format'));
        valid = false;
      } else if (Password !== ConfirmPassword) {
        setPasswordError(i18n.t('ResetPassword.Password-Match'));
        valid = false;
      } else {
        setPasswordError('');
      }

      if (valid) {
        try {
          RNFetchBlob.config({trusty: true})
            .fetch(
              'POST',
              UrlAccess.Url + 'User/Reset',
              {'Content-Type': 'application/json'},
              JSON.stringify({
                email: Email,
                password: Password,
              }),
            )
            .then(response => response.json())
            .then(json => {
              if (json.success) {
                Alert.alert(
                  i18n.t('ResetPassword.Password-Successful'),
                  i18n.t('ResetPassword.Reset-Successful'),
                  [
                    {
                      text: 'OK',
                      onPress: () => navigation.navigate(SignIn as never),
                    },
                  ],
                );
              } else {
                setInvalid(true);
              }
            });
        } catch (error) {
          ErrorToast(i18n.t('ResetPassword.Reset-Password-Error'));
        }
      }
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
        <StatusBar backgroundColor={isDark ? '#000' : '#FFFFFF'} />
        <View style={isDark ? darkSignIn.container : SignInCss.container}>
          <Animated.View style={{transform: [{translateY: Anim}]}}>
            <Image
              style={SignInCss.Logo}
              source={require('../assets/Logo.png')}
            />
          </Animated.View>

          <Animated.View style={{transform: [{translateY: Anim1}]}}>
            <Text style={isDark ? darkSignIn.Title : SignInCss.Title}>
              {i18n.t('ResetPassword.Reset-Password')}
            </Text>
            <Text style={isDark ? darkSignIn.Content : SignInCss.Content}>
              {i18n.t('ResetPassword.Enter-Password')}
            </Text>
          </Animated.View>

          <Animated.View style={{transform: [{translateY: Anim2}]}}>
            <TextInput
              label={i18n.t('ResetPassword.Password')}
              mode="outlined"
              style={isDark ? darkSignIn.Input : SignInCss.Input}
              placeholder={i18n.t('ResetPassword.Password-Placeholder')}
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
          </Animated.View>

          <Animated.View style={{transform: [{translateY: Anim3}]}}>
            <TextInput
              label={i18n.t('ResetPassword.Confirm-Password')}
              mode="outlined"
              style={isDark ? darkSignIn.Input : SignInCss.Input}
              placeholder={i18n.t('ResetPassword.Confirm-Password-Placeholder')}
              theme={isDark ? darkTheme : theme}
              onChangeText={text => setConfirmPassword(text)}
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
          </Animated.View>
          <Animated.View style={{transform: [{translateY: Anim4}]}}>
            <TouchableOpacity style={SignInCss.Reset} onPress={() => Verify()}>
              <Text style={SignInCss.BtnText}>
                {i18n.t('ResetPassword.Reset')}
              </Text>
            </TouchableOpacity>
          </Animated.View>

          <Text style={isDark ? darkSignIn.SignUp : SignInCss.SignUp}>
            {i18n.t('ResetPassword.Remember')}
            <Text
              style={{color: '#3490DE'}}
              onPress={() => navigation.navigate(SignIn as never)}>
              {i18n.t('ResetPassword.Sign-In')}
            </Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </MainContainer>
  );
};

export default ResetPassword;
