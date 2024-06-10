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
} from 'react-native';
import MainContainer from '../components/MainContainer';
import {SignInCss} from '../objects/commonCss';
import {TextInput, HelperText} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import Welcome from './Welcome';
import React, {useRef, useEffect, useState} from 'react';
import SignUp from './SignUp';
import RNFetchBlob from 'rn-fetch-blob';
import {UrlAccess} from '../objects/url';
import ForgotPassword from './ForgotPassword';
import SignIn from './SignIn';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ResetPassword = () => {
  const navigation = useNavigation();
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

  const checkPasswordFormat = (Password: any) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
    return passwordRegex.test(Password);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem('Email');
        if (storedEmail !== null) {
          setEmail(storedEmail);
        } else {
          console.log('error');
        }
      } catch (error) {
        console.error('Failed to load email from AsyncStorage', error);
      }
    };
    getData();
  }, []);

  const Verify = () => {
    let valid = true;

    if (Password.trim() === '') {
      setPasswordError('Password cannot be empty');
      valid = false;
    } else if (!checkPasswordFormat(Password)) {
      setPasswordError(
        'Password must contain upper and lower case letters, numbers, and symbols',
      );
      valid = false;
    } else if (Password !== ConfirmPassword) {
      setPasswordError('No match with confirm password');
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
                'Password Reset Successful',
                'Your Password Reset Successful! Please go to login to test your new password ',
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
        console.log(error);
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
            <Text style={SignInCss.Title}>Reset Password</Text>
            <Text style={SignInCss.Content}>Enter your new password</Text>
          </Animated.View>

          <Animated.View style={{transform: [{translateY: Anim2}]}}>
            <TextInput
              label="Password"
              mode="outlined"
              style={SignInCss.Input}
              placeholder="Please Enter Your Password"
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
          </Animated.View>

          <Animated.View style={{transform: [{translateY: Anim3}]}}>
            <TextInput
              label="Confirm Password"
              mode="outlined"
              style={SignInCss.Input}
              placeholder="Please Enter Your Confirm Password"
              theme={theme}
              onChangeText={text => setConfirmPassword(text)}
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
          <Animated.View style={{transform: [{translateY: Anim4}]}}>
            <TouchableOpacity style={SignInCss.Reset} onPress={() => Verify()}>
              <Text style={SignInCss.BtnText}>Reset</Text>
            </TouchableOpacity>
          </Animated.View>

          <Text style={SignInCss.SignUp}>
            Remember Password?
            <Text
              style={{color: '#3490DE'}}
              onPress={() => navigation.navigate(SignIn as never)}>
              Sign In
            </Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </MainContainer>
  );
};

export default ResetPassword;
