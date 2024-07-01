import AsyncStorage from '@react-native-async-storage/async-storage';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import MainContainer from '../components/MainContainer';
import {Dimensions, StatusBar, View, ActivityIndicator} from 'react-native';
import {Text} from 'react-native-paper';
import i18n from '../language/language';
import Toast from 'react-native-toast-message';

const ThemeChange = () => {
  const navigation = useNavigation();
  const showToast = (message: any) => {
    Toast.show({
      type: 'error',
      text1: message,
      visibilityTime: 3000,
    });
  };
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    (async () => {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme) {
        setIsDark(savedTheme === 'dark');
      }
    })();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      showToast(i18n.t('SettingPage.Darkmode'));
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'CustomDrawer'}],
        }),
      );
    }, 3000);

    return () => clearTimeout(timer); 
  }, [navigation]);
  
  return (
    <MainContainer>
      <StatusBar backgroundColor={isDark ? '#000' : '#fff'} />
      <View style={{flex: 1, backgroundColor: isDark ? '#000' : '#fff'}}>
        <View
          style={{
            alignSelf: 'center',
            marginVertical: (Dimensions.get('screen').height / 100) * 40,
          }}>
          <ActivityIndicator size={80} color={isDark ? '#fff' : '#000000'} />
          <Text
            style={{
              color: isDark ? '#fff' : '#000',
              fontSize: 20,
              fontWeight: 'bold',
            }}>
            {i18n.t('ThemeChange.Text')}
          </Text>
        </View>
      </View>
    </MainContainer>
  );
};

export default ThemeChange;
