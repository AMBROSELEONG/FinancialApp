import {
  View,
  StatusBar,
  Image,
  Text,
  TouchableOpacity,
  Animated,
} from 'react-native';
import {WelcomeCss} from '../objects/commonCss';
import MainContainer from '../components/MainContainer';
import React, {useRef, useEffect, useCallback} from 'react';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import SignIn from './SignIn';
import SignUp from './SignUp';
import i18n from '../language/language';
import AsyncStorage from '@react-native-async-storage/async-storage';
const STORAGE_KEY = '@app_language';
const Welcome = () => {
  const navigation = useNavigation();
  const Anim = useRef(new Animated.Value(100)).current;

  const [locale, setLocale] = React.useState(i18n.locale);

  useFocusEffect(
    React.useCallback(() => {
      setLocale(i18n.locale);
    }, []),
  );

  const loadLanguage = async () => {
    try {
      const language = await AsyncStorage.getItem(STORAGE_KEY);
      if (language) {
        i18n.locale = language;
        setLocale(language);
      }
    } catch (error) {
      console.error('Failed to load language', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadLanguage();
    }, []),
  );

  useEffect(() => {
    Animated.parallel([
      Animated.timing(Anim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [Anim]);

  return (
    <MainContainer>
      <StatusBar backgroundColor="#FFFFFF" />
      <View style={WelcomeCss.Container}>
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
