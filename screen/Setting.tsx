import {useState} from 'react';
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
  Switch,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {css, settingCss} from '../objects/commonCss';
import Language from './Language';

const Setting = () => {
  const navigation = useNavigation();
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  return (
    <MainContainer>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <StatusBar
          animated={true}
          backgroundColor="#F9F9F9"
          barStyle={'dark-content'}
        />
        <View style={[css.mainView, {backgroundColor: '#F9F9F9'}]}>
          <TouchableOpacity
            style={{paddingLeft: 20}}
            onPress={() => {
              navigation.dispatch(DrawerActions.openDrawer());
            }}>
            <Ionicons name="menu" size={30} color={'#000'} />
          </TouchableOpacity>
          <View style={css.HeaderView}>
            <Text style={css.PageName}>Setting</Text>
          </View>
        </View>
        <View style={settingCss.container}>
          <View style={settingCss.UserContainer}>
            <Image
              source={require('../assets/User.png')}
              style={[settingCss.UserImage]}
            />
            <View style={settingCss.UserInfoContainer}>
              <Text style={settingCss.UserName}>Anonymous</Text>
              <Text style={settingCss.Email}>Email</Text>
            </View>
          </View>
          <View style={settingCss.EditContainer}>
            <View style={{flexDirection: 'row'}}>
              <Image
                source={require('../assets/edit.png')}
                style={[settingCss.EditIcon]}
              />
              <View style={settingCss.TextContainer}>
                <Text style={settingCss.text}>Edit Profile</Text>
              </View>
            </View>
            <TouchableOpacity style={settingCss.EditButton}>
              <Text style={settingCss.ButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={settingCss.PrefenceContainer}>
            <Text style={settingCss.PrefenceText}>Prefences</Text>
            <TouchableOpacity style={settingCss.FunctionContainer} onPress={()=> navigation.navigate(Language as never)}>
              <View style={{flexDirection: 'row'}}>
                <Ionicons
                  name="language"
                  size={30}
                  color={'#000'}
                  style={[settingCss.EditIcon, {borderWidth: 0}]}
                />
                <View style={settingCss.TextContainer}>
                  <Text style={settingCss.text}>Language</Text>
                </View>
              </View>
              <View style={settingCss.ClickIcon}>
                <FontAwesome5 name="angle-right" size={30} color={'#000'} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={settingCss.FunctionContainer}>
              <View style={{flexDirection: 'row'}}>
                <MaterialCommunityIcons
                  name="theme-light-dark"
                  size={30}
                  color={'#000'}
                  style={[settingCss.EditIcon, {borderWidth: 0}]}
                />
                <View style={settingCss.TextContainer}>
                  <Text style={settingCss.text}>Dark Mode</Text>
                </View>
              </View>
              <View style={settingCss.ClickIcon}>
                <Switch
                  trackColor={{false: '#81b0ff', true: '#767577'}}
                  thumbColor={isEnabled ? '#f4f3f4' : '#f5dd4b'}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitch}
                  value={isEnabled}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </MainContainer>
  );
};

export default Setting;
