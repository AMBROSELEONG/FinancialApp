import {
  View,
  StatusBar,
  Image,
  Text,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
} from 'react-native';
import {WelcomeCss} from '../objects/commonCss';
import MainContainer from '../components/MainContainer';
import React, {useRef, useEffect, useCallback, useState} from 'react';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import SignIn from './SignIn';
import SignUp from './SignUp';
import i18n from '../language/language';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {darkWelcome} from '../objects/darkCss';
import Toast from 'react-native-toast-message';

const STORAGE_KEY = '@app_language';
const Welcome = () => {
  const navigation = useNavigation();
  const Anim = useRef(new Animated.Value(100)).current;

  const [locale, setLocale] = React.useState(i18n.locale);
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

  const loadLanguage = async () => {
    try {
      const language = await AsyncStorage.getItem(STORAGE_KEY);
      if (language) {
        i18n.locale = language;
        setLocale(language);
      }
    } catch (error) {
      ErrorToast(i18n.t('Fail-Load-Language'));
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
    await Promise.all([loadLanguage(), loadTheme()]);
    Animated.parallel([
      Animated.timing(Anim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setLoading(false);
    });
  };

  useFocusEffect(
    useCallback(() => {
      initialize();
    }, []),
  );

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
      <StatusBar backgroundColor={isDark ? '#000' : '#fff'} />
      <View style={isDark ? darkWelcome.Container : WelcomeCss.Container}>
        <Animated.View style={{transform: [{translateY: Anim}]}}>
          <Image
            style={WelcomeCss.Logo}
            source={require('../assets/Logo.png')}
          />
        </Animated.View>

        <Animated.View style={{transform: [{translateY: Anim}]}}>
          <TouchableOpacity
            style={WelcomeCss.Login}
            onPress={() => navigation.navigate(SignIn as never)}>
            <Text style={WelcomeCss.BtnText}>{i18n.t('Welcome.Login')}</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={{transform: [{translateY: Anim}]}}>
          <TouchableOpacity
            style={WelcomeCss.SignUp}
            onPress={() => navigation.navigate(SignUp as never)}>
            <Text style={[WelcomeCss.BtnText, {color: '#000'}]}>
              {i18n.t('Welcome.Sign-Up')}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </MainContainer>
  );
};

export default Welcome;
