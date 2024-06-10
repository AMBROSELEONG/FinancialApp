import MainContainer from '../components/MainContainer';
import {useNavigation, DrawerActions} from '@react-navigation/native';
import {
  KeyboardAvoidingView,
  StatusBar,
  View,
  Text,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {css, languageCss} from '../objects/commonCss';
import {useState} from 'react';
const Language = () => {
  const navigation = useNavigation();
  const [selectedLanguage, setSelectedLanguage] = useState('EN'); 

  return (
    <MainContainer>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <StatusBar
          animated={true}
          backgroundColor="#fff"
          barStyle={'dark-content'}
        />
        <View style={css.mainView}>
          <TouchableOpacity
            style={{paddingLeft: 20}}
            onPress={() => {
              navigation.goBack();
            }}>
            <Ionicons name="arrow-back" size={30} color={'#000'} />
          </TouchableOpacity>
          <View style={css.HeaderView}>
            <Text style={css.PageName}>Change Language</Text>
          </View>
        </View>
        <View style={languageCss.container}>
          <TouchableOpacity style={languageCss.languageContainer}>
            <Text style={languageCss.text}>English</Text>
            {selectedLanguage === 'EN' && (
              <Image
                source={require('../assets/tick.png')}
                style={languageCss.tick}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity style={languageCss.languageContainer}>
            <Text style={languageCss.text}>Bahasa Melayu</Text>
            {selectedLanguage === 'BM' && (
              <Image
                source={require('../assets/tick.png')}
                style={languageCss.tick}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity style={languageCss.languageContainer}>
            <Text style={languageCss.text}>中文</Text>
            {selectedLanguage === 'CN' && (
              <Image
                source={require('../assets/tick.png')}
                style={languageCss.tick}
              />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </MainContainer>
  );
};

export default Language;
