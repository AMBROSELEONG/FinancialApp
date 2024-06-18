import React, {useState} from 'react';
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
  useWindowDimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {css, walletCss} from '../objects/commonCss';
import {TabBar, TabView, SceneMap, TabBarProps} from 'react-native-tab-view';
import {DataTable} from 'react-native-paper';
import {ScrollView} from 'react-native-gesture-handler';
import EWalletIncome from './EWalletIncome';
import EWalletSpend from './EWalletSpend';

const FirstRoute = () => {
  const [items] = React.useState([
    {
      key: 1,
      type: 'Cupcake',
      income: 356,
      date: '2021-01-01',
    },
    {
      key: 2,
      type: 'Eclair',
      income: 262,
      date: '2021-01-02',
    },
    {
      key: 3,
      type: 'Frozen yogurt',
      income: 159,
      date: '2021-01-03',
    },
    {
      key: 4,
      type: 'Gingerbread',
      income: 305,
      date: '2021-01-04',
    },
    {
      key: 1,
      type: 'Cupcake',
      income: 356,
      date: '2021-01-01',
    },
    {
      key: 2,
      type: 'Eclair',
      income: 262,
      date: '2021-01-02',
    },
    {
      key: 3,
      type: 'Frozen yogurt',
      income: 159,
      date: '2021-01-03',
    },
    {
      key: 4,
      type: 'Gingerbread',
      income: 305,
      date: '2021-01-04',
    },
    {
      key: 1,
      type: 'Cupcake',
      income: 356,
      date: '2021-01-01',
    },
    {
      key: 2,
      type: 'Eclair',
      income: 262,
      date: '2021-01-02',
    },
    {
      key: 3,
      type: 'Frozen yogurt',
      income: 159,
      date: '2021-01-03',
    },
    {
      key: 4,
      type: 'Gingerbread',
      income: 305,
      date: '2021-01-04',
    },
  ]);

  return (
    <View style={walletCss.TabBackground}>
      <ScrollView>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Type</DataTable.Title>
            <DataTable.Title style={walletCss.cell}>
              Income (RM)
            </DataTable.Title>
            <DataTable.Title style={walletCss.cell}>Date</DataTable.Title>
          </DataTable.Header>

          {items.map((item, index) => (
            <DataTable.Row
              key={item.key}
              style={
                index % 2 === 0 ? walletCss.evenRowIncome : walletCss.oddRow
              }>
              <DataTable.Cell>{item.type}</DataTable.Cell>
              <DataTable.Cell style={walletCss.cell}>
                {item.income}
              </DataTable.Cell>
              <DataTable.Cell style={walletCss.cell}>
                {item.date}
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </ScrollView>
    </View>
  );
};

const SecondRoute = () => {
  const [items] = React.useState([
    {
      key: 1,
      type: 'Cupcake',
      income: 356,
      date: '2021-01-01',
    },
    {
      key: 2,
      type: 'Eclair',
      income: 262,
      date: '2021-01-02',
    },
    {
      key: 3,
      type: 'Frozen yogurt',
      income: 159,
      date: '2021-01-03',
    },
    {
      key: 4,
      type: 'Gingerbread',
      income: 305,
      date: '2021-01-04',
    },
    {
      key: 1,
      type: 'Cupcake',
      income: 356,
      date: '2021-01-01',
    },
    {
      key: 2,
      type: 'Eclair',
      income: 262,
      date: '2021-01-02',
    },
    {
      key: 3,
      type: 'Frozen yogurt',
      income: 159,
      date: '2021-01-03',
    },
    {
      key: 4,
      type: 'Gingerbread',
      income: 305,
      date: '2021-01-04',
    },
    {
      key: 1,
      type: 'Cupcake',
      income: 356,
      date: '2021-01-01',
    },
    {
      key: 2,
      type: 'Eclair',
      income: 262,
      date: '2021-01-02',
    },
    {
      key: 3,
      type: 'Frozen yogurt',
      income: 159,
      date: '2021-01-03',
    },
    {
      key: 4,
      type: 'Gingerbread',
      income: 305,
      date: '2021-01-04',
    },
  ]);

  return (
    <View style={walletCss.TabBackground}>
      <ScrollView>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Type</DataTable.Title>
            <DataTable.Title style={walletCss.cell}>
              Income (RM)
            </DataTable.Title>
            <DataTable.Title style={walletCss.cell}>Date</DataTable.Title>
          </DataTable.Header>

          {items.map((item, index) => (
            <DataTable.Row
              key={item.key}
              style={
                index % 2 === 0 ? walletCss.evenRowSpend : walletCss.oddRow
              }>
              <DataTable.Cell>{item.type}</DataTable.Cell>
              <DataTable.Cell style={walletCss.cell}>
                {item.income}
              </DataTable.Cell>
              <DataTable.Cell style={walletCss.cell}>
                {item.date}
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </ScrollView>
    </View>
  );
};

const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
});

const Ewallet = () => {
  const navigation = useNavigation();
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'first', title: 'Income History'},
    {key: 'second', title: 'Spend History'},
  ]);

  type Route = {
    key: string;
    title: string;
  };

  const renderTabBar = (props: TabBarProps<Route>) => (
    <TabBar
      {...props}
      indicatorStyle={{backgroundColor: '#000'}}
      inactiveColor="#999999"
      style={{backgroundColor: '#fff'}}
      activeColor="#000"
    />
  );

  return (
    <MainContainer>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <StatusBar
          animated={true}
          backgroundColor="#3490DE"
          barStyle={'dark-content'}
        />
        <View style={[css.mainView, {backgroundColor: '#3490DE'}]}>
          <TouchableOpacity
            style={{paddingLeft: 20}}
            onPress={() => {
              navigation.dispatch(DrawerActions.openDrawer());
            }}>
            <Ionicons name="menu" size={30} color={'#fff'} />
          </TouchableOpacity>
          <View style={css.HeaderView}>
            <Text style={[css.PageName, {color: '#fff'}]}>E-Wallet</Text>
          </View>
        </View>
        <View style={walletCss.container}>
          <View style={walletCss.header}>
            <Text style={walletCss.balanceText}>Balance</Text>
            <Text style={walletCss.balance}>RM 100.00</Text>
            <View style={walletCss.positionContainer}>
              <TouchableOpacity style={walletCss.button} onPress={()=> navigation.navigate(EWalletIncome as never)}>
                <Image
                  source={require('../assets/income.png')}
                  style={walletCss.icon}></Image>
                <Text style={walletCss.text}>Income</Text>
              </TouchableOpacity>
              <TouchableOpacity style={walletCss.button} onPress={()=> navigation.navigate(EWalletSpend as never)}>
                <Image
                  source={require('../assets/spend.png')}
                  style={walletCss.icon}></Image>
                <Text style={walletCss.text}>Spend</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={walletCss.body}>
            <TabView
              navigationState={{index, routes}}
              renderScene={renderScene}
              onIndexChange={setIndex}
              initialLayout={{width: layout.width}}
              renderTabBar={renderTabBar}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </MainContainer>
  );
};

export default Ewallet;
