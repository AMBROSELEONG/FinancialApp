import MainContainer from '../components/MainContainer';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {
  KeyboardAvoidingView,
  StatusBar,
  View,
  Text,
  TouchableOpacity,
  Platform,
  Image,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {css, userEditCss} from '../objects/commonCss';
import {TextInput, HelperText} from 'react-native-paper';
import React, {useEffect, useState} from 'react';
import RNFetchBlob from 'rn-fetch-blob';
import {UrlAccess} from '../objects/url';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserEditVerify from './UserEditVerify';
import i18n from '../language/language';
import Toast from 'react-native-toast-message';
import {darkUserEdit} from '../objects/darkCss';

const UserEdit = () => {
  const navigation = useNavigation();
  const [Username, setUsername] = useState('');
  const [OriUsername, setOriUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [Email, setEmail] = useState('');
  const [OriEmail, setOriEmail] = useState('');
  const [password, setPassword] = useState('');
  const [comfirmPassword, setConfirmPassword] = useState('');
  const [hidePass, setHidePass] = useState(true);
  const [UserNameDuplication, setUserNameDuplication] = useState(false);
  const [EmailDuplication, setEmailDuplication] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [locale, setLocale] = React.useState(i18n.locale);
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
    colors: {
      primary: '#000', // Active outline color
      outline: '#808080', // Outline color
    },
  };

  const darkTheme = {
    colors: {
      primary: '#3490DE', // Active outline color
      outline: '#808080', // Outline color
    },
  };

  useFocusEffect(
    React.useCallback(() => {
      setLocale(i18n.locale);
    }, []),
  );

  const fetchUsername = async () => {
    try {
      const storedUserID = await AsyncStorage.getItem('UserID');
      if (storedUserID !== null) {
        setUserId(storedUserID);
      }
    } catch (error) {
      ErrorToast(i18n.t('SettingPage.Failed-Load-Username'));
    }
  };

  const fetchData = async (userId: any) => {
    try {
      const response = await RNFetchBlob.config({trusty: true}).fetch(
        'GET',
        `${UrlAccess.Url}User/GetUserData?userId=${userId}`,
        {'Content-Type': 'application/json'},
      );

      const json = await response.json();

      if (json.success) {
        setEmail(json.userData.email);
        setOriEmail(json.userData.email);
        setPassword(json.userData.password);
        setUsername(json.userData.userName);
        setOriUsername(json.userData.userName);
      } else {
        ErrorToast(i18n.t('SettingPage.Failed-Fetch-Data'));
      }
    } catch (error) {
      ErrorToast(i18n.t('SettingPage.Error-Fetch'));
    }
  };

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);

      try {
        const [savedTheme, storedUserID] = await Promise.all([
          AsyncStorage.getItem('theme'),
          AsyncStorage.getItem('UserID'),
        ]);

        if (savedTheme) {
          setIsDark(savedTheme === 'dark');
        }

        if (storedUserID) {
          setUserId(storedUserID);
          await fetchData(storedUserID);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    initialize();
  }, []);

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
    if (Username.trim() !== '' && Username !== OriUsername) {
      checkUserNameDuplication(Username);
    }
    if (Email.trim() !== '' && Email !== OriEmail) {
      checkEmailDuplication(Email);
    }
  }, [Username, Email]);

  const Verify = async () => {
    let valid = true;

    if (Username.trim() === '') {
      setUsernameError(i18n.t('EditPage.Username-Empty'));
      valid = false;
    } else {
      if (UserNameDuplication === false && Username !== OriUsername) {
        setUsernameError(i18n.t('EditPage.Username-Duplication'));
        valid = false;
      } else {
        setUsernameError('');
      }
    }

    if (Email.trim() === '') {
      setEmailError(i18n.t('EditPage.Email-Empty'));
      valid = false;
    } else if (!checkEmailFormat(Email)) {
      setEmailError(i18n.t('EditPage.Email-Format'));
      valid = false;
    } else {
      if (Email !== OriEmail) {
        if (EmailDuplication === false) {
          setEmailError(i18n.t('EditPage.Email-Duplication'));
          valid = false;
        } else {
          setEmailError('');
        }
      } else {
        setEmailError('');
      }
    }

    if (password.trim() === '' && comfirmPassword.trim() === '') {
      setPasswordError(i18n.t('EditPage.Password-Empty'));
      valid = false;
    } else if (!checkPasswordFormat(password)) {
      setPasswordError(i18n.t('EditPage.Password-Format'));
      valid = false;
    } else if (password !== comfirmPassword) {
      setPasswordError(i18n.t('EditPage.Password-Match'));
      valid = false;
    } else {
      setPasswordError('');
    }

    if (valid) {
      AsyncStorage.setItem('Email', Email);
      AsyncStorage.setItem('UserName', Username);
      AsyncStorage.setItem('Password', password);
      console.log(Username, Email, password, comfirmPassword);
      try {
        RNFetchBlob.config({trusty: true}).fetch(
          'POST',
          UrlAccess.Url + 'OTP/SendOTP',
          {'Content-Type': 'application/json'},
          JSON.stringify({
            email: Email,
          }),
        );
        SuccessToast(i18n.t('SignUp.Send-OTP-Successful'));
        navigation.navigate(UserEditVerify as never);
      } catch (error) {
        ErrorToast(i18n.t('SignUp.Send-OTP-Unsuccessful'));
      }
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
        <StatusBar
          animated={true}
          backgroundColor={isDark ? '#000' : '#3490DE'}
          barStyle={'dark-content'}
        />

        <View
          style={[
            css.mainView,
            {backgroundColor: isDark ? '#000' : '#3490DE'},
          ]}>
          <TouchableOpacity
            style={{paddingLeft: 20}}
            onPress={() => {
              navigation.goBack();
            }}>
            <Ionicons name="arrow-back" size={30} color={'#fff'} />
          </TouchableOpacity>
          <View style={css.HeaderView}>
            <Text style={[css.PageName, {color: '#fff'}]}>
              {i18n.t('EditPage.Edit-Profile')}
            </Text>
          </View>
        </View>

        <View style={isDark ? darkUserEdit.container : userEditCss.container}>
          <View style={isDark ? darkUserEdit.header : userEditCss.header}>
            <View
              style={
                isDark
                  ? darkUserEdit.imageContainer
                  : userEditCss.imageContainer
              }>
              <Image
                source={require('../assets/User.png')}
                style={userEditCss.image}
              />
            </View>
          </View>
          <View>
            <Text style={isDark ? darkUserEdit.Title : userEditCss.Title}>
              {i18n.t('EditPage.User-Info')}
            </Text>
            <TextInput
              label={i18n.t('EditPage.Username')}
              mode="outlined"
              style={isDark ? darkUserEdit.Input : userEditCss.Input}
              placeholder={i18n.t('EditPage.Username-Placeholder')}
              theme={isDark ? darkTheme : theme}
              value={Username}
              onChangeText={text => setUsername(text)}
              textColor={isDark ? '#fff' : '#000'}
            />
            {usernameError !== '' && (
              <HelperText type="error" style={userEditCss.InputError}>
                {usernameError}
              </HelperText>
            )}

            <TextInput
              label={i18n.t('EditPage.Email')}
              mode="outlined"
              style={isDark ? darkUserEdit.Input : userEditCss.Input}
              placeholder={i18n.t('EditPage.Email-Placeholder')}
              theme={isDark ? darkTheme : theme}
              value={Email}
              onChangeText={text => setEmail(text)}
              textColor={isDark ? '#fff' : '#000'}
            />
            {emailError !== '' && (
              <HelperText type="error" style={userEditCss.InputError}>
                {emailError}
              </HelperText>
            )}

            <TextInput
              label={i18n.t('EditPage.Password')}
              mode="outlined"
              style={isDark ? darkUserEdit.Input : userEditCss.Input}
              placeholder={i18n.t('EditPage.Password-Placeholder')}
              theme={isDark ? darkTheme : theme}
              value={password}
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
              <HelperText type="error" style={userEditCss.InputError}>
                {passwordError}
              </HelperText>
            )}

            <TextInput
              label={i18n.t('EditPage.Confirm-Password')}
              mode="outlined"
              style={isDark ? darkUserEdit.Input : userEditCss.Input}
              placeholder={i18n.t('EditPage.Confirm-Password-Placeholder')}
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
          </View>
          <TouchableOpacity style={userEditCss.Button} onPress={() => Verify()}>
            <Text style={userEditCss.ButtonText}>
              {i18n.t('EditPage.Save-Change')}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </MainContainer>
  );
};

export default UserEdit;
