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
import {useNavigation} from '@react-navigation/native';
import React, {useRef, useEffect, useState} from 'react';
import SignIn from './SignIn';
import Verify from './Verify';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFetchBlob from 'rn-fetch-blob';

const SignUp = () => {
  const navigation = useNavigation();

  // 输入框设计
  const theme = {
    roundness: 20, // Set the border radius here
    colors: {
      primary: '#000', // Active outline color
      outline: '#808080', // Outline color
    },
  };

  // 动画效果
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

  const checkEmailFormat = (Email: any) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(Email);
  };

  const checkPasswordFormat = (Password: any) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(Password);
  };

  // 输入数据验证
  const Verify = async () => {
    let valid = true;

    if (Username.trim() === '') {
      setUsernameError('Username cannot be empty');
      valid = false;
    } else {
      setUsernameError('');
    }

    if (Email.trim() === '') {
      setEmailError('Email cannot be empty');
      valid = false;
    } else if (!checkEmailFormat(Email)) {
      setEmailError('Invalid email format');
      valid = false;
    } else {
      setEmailError('');
    }

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
          'https://172.16.36.117:5072/api/OTP/SendOTP',
          {'Content-Type': 'application/json'},
          JSON.stringify({
            email: Email,
          }),
        );
        Alert.prompt('Send OTP Successful');
        navigation.navigate(Verify as never);
      } catch (error) {
        Alert.prompt('Send OTP Unsuccessful');
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
            <Text style={SignInCss.Title}>Sign Up</Text>
            <Text style={SignInCss.Content}>
              Enter your credentials for sign up
            </Text>
          </Animated.View>

          <Animated.View style={{transform: [{translateY: Anim2}]}}>
            <TextInput
              label="User Name"
              mode="outlined"
              style={SignInCss.Input}
              placeholder="Please Enter Your Username"
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
              label="Email"
              mode="outlined"
              style={SignInCss.Input}
              placeholder="Please Enter Your Email"
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
            {passwordError !== '' && (
              <HelperText type="error" style={SignInCss.InputError}>
                {passwordError}
              </HelperText>
            )}
          </Animated.View>

          <Animated.View style={{transform: [{translateY: Anim5}]}}>
            <TextInput
              label="Confirm Password"
              mode="outlined"
              style={[
                SignInCss.Input,
                {marginBottom: (Dimensions.get('screen').height / 100) * 5},
              ]}
              placeholder="Please Enter Your Password"
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
              <Text style={SignInCss.BtnText}>REGISTER</Text>
            </TouchableOpacity>
          </Animated.View>

          <Text style={SignInCss.SignUp}>
            Already Have an Account?{' '}
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

export default SignUp;
