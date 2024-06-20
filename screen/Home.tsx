import {useState, useEffect, useCallback} from 'react';
import MainContainer from '../components/MainContainer';
import {
  useNavigation,
  DrawerActions,
  useFocusEffect,
  useIsFocused,
} from '@react-navigation/native';
import {
  KeyboardAvoidingView,
  StatusBar,
  View,
  Text,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {css, homeCss} from '../objects/commonCss';
import {ScrollView} from 'react-native-gesture-handler';
import {LineChart} from 'react-native-gifted-charts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFetchBlob from 'rn-fetch-blob';
import {UrlAccess} from '../objects/url';

const Home = () => {
  const navigation = useNavigation();
  const [currentDate, setCurrentDate] = useState('');
  const [UserName, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    setLoading(true);
    const fetchUsername = async () => {
      try {
        const storedUserID = await AsyncStorage.getItem('UserID');
        if (storedUserID !== null) {
          setUserId(storedUserID);
        }
      } catch (error) {
        console.error('Failed to load username from AsyncStorage', error);
      }
    };
    fetchUsername();
  }, []);

  useEffect(() => {
    setLoading(true);
    if (userId) {
      const fetchData = async () => {
        try {
          const response = await RNFetchBlob.config({trusty: true}).fetch(
            'GET',
            `${UrlAccess.Url}User/GetUserData?userId=${userId}`,
            {'Content-Type': 'application/json'},
          );

          const json = await response.json();

          if (json.success) {
            setUsername(json.userData.userName);
            setLoading(false);
          } else {
            console.log('Failed to fetch user data');
          }
        } catch (error) {
          console.error('Error fetching user data', error);
        }
      };
      fetchData();
    }
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      if (isFocused && userId) {
        setLoading(true);
        const fetchData = async () => {
          try {
            const response = await RNFetchBlob.config({trusty: true}).fetch(
              'GET',
              `${UrlAccess.Url}User/GetUserData?userId=${userId}`,
              {'Content-Type': 'application/json'},
            );

            const json = await response.json();

            if (json.success) {
              setUsername(json.userData.userName);
            } else {
              console.log('Failed to fetch user data');
            }
          } catch (error) {
            console.error('Error fetching user data', error);
          } finally {
            setLoading(false);
          }
        };
        fetchData();
      }
    }, [isFocused, userId]),
  );

  useEffect(() => {
    const updateDate = () => {
      const date = new Date();
      const day = date.getDate();
      const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();
      setCurrentDate(`${day} ${month} ${year}`);
    };

    updateDate(); // Set the initial date
    const interval = setInterval(updateDate, 24 * 60 * 60 * 1000); // Update every 24 hours

    return () => clearInterval(interval); // Clean up interval on component unmount
  }, []);

  const data = [
    {value: 50, label: '9/6'},
    {value: 30, label: '8/6'},
    {value: 70, label: '7/6'},
    {value: 40, label: '6/6'},
    {value: 90, label: '5/6'},
    {value: 20, label: '4/6'},
    {value: 60, label: '3/6'},
  ];
  const screenWidth = (Dimensions.get('window').width / 100) * 70;

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
        <ScrollView>
          <View style={css.mainView}>
            <TouchableOpacity
              style={{paddingLeft: 20}}
              onPress={() => {
                navigation.dispatch(DrawerActions.openDrawer());
              }}>
              <Ionicons name="menu" size={30} color={'#000'} />
            </TouchableOpacity>
            <View style={css.HeaderView}>
              <Text style={css.PageName}>Home</Text>
            </View>
          </View>
          <View style={homeCss.container}>
            <Text style={homeCss.welcome}>Welcome Back</Text>
            <Text style={homeCss.user}>{UserName}</Text>
            <View style={homeCss.dateContainer}>
              <Text style={homeCss.date}>{currentDate}</Text>
            </View>
            <View style={homeCss.spendContainer}>
              <Text style={homeCss.spend}>Spending over the past 7 days</Text>
              <View style={homeCss.chartContainer}>
                <LineChart
                  data={data}
                  width={screenWidth}
                  height={180}
                  color="#1E90FF"
                  thickness={1}
                  hideDataPoints={false}
                  dataPointsColor="#FF6347"
                  showVerticalLines={true}
                  verticalLinesColor="#E0E0E0"
                  showValuesAsDataPointsText
                  xAxisLabelTextStyle={homeCss.xAxisLabel}
                />
              </View>
              <Text style={homeCss.totalText}>Total Spending Today</Text>
              <Text style={homeCss.total}>RM 150.00</Text>
            </View>
            <View style={[homeCss.spendContainer, {marginBottom: 30}]}>
              <Text style={homeCss.spend}>Increase in the past 7 days</Text>
              <View style={homeCss.chartContainer}>
                <LineChart
                  data={data}
                  width={screenWidth}
                  height={180}
                  color="#1E90FF"
                  thickness={1}
                  hideDataPoints={false}
                  dataPointsColor="#FF6347"
                  showVerticalLines={true}
                  verticalLinesColor="#E0E0E0"
                  showValuesAsDataPointsText
                  xAxisLabelTextStyle={homeCss.xAxisLabel}
                />
              </View>
              <Text style={homeCss.totalText}>Total Increase Today</Text>
              <Text style={homeCss.total}>RM 150.00</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </MainContainer>
  );
};

export default Home;
