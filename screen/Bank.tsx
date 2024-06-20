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
  FlatList,
  Modal,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {bankCss, css} from '../objects/commonCss';
import {TextInput, HelperText} from 'react-native-paper';
import {SelectList} from 'react-native-dropdown-select-list';
import BankDetail from './BankDetail';

const Bank = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [Total, setTotal] = useState('');
  const [TotalError, setTotalError] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');

  const theme = {
    roundness: 10, // Set the border radius here
    colors: {
      primary: '#000', // Active outline color
      outline: '#808080', // Outline color
    },
  };

  const selectType = [
    {key: '1', value: 'Wages/Salary'},
    {key: '2', value: 'Bonuses'},
    {key: '3', value: 'Investment Income'},
    {key: '4', value: 'Interest Income'},
    {key: '5', value: 'Rental Income'},
    {key: '6', value: 'Self-Employment Income'},
    {key: '7', value: 'Gifts'},
    {key: '8', value: 'Bank Transfer'},
    {key: '9', value: 'Other Income'},
  ];

  const DATA = [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      bank: 'First Item',
      balance: 'RM 200',
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      bank: 'Second Item',
      balance: 'RM 200',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      bank: 'Third Item',
      balance: 'RM 200',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      bank: 'Four Item',
      balance: 'RM 200',
    },
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      bank: 'First Item',
      balance: 'RM 200',
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      bank: 'Second Item',
      balance: 'RM 200',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      bank: 'Third Item',
      balance: 'RM 200',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      bank: 'Four Item',
      balance: 'RM 200',
    },
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      bank: 'First Item',
      balance: 'RM 200',
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      bank: 'Second Item',
      balance: 'RM 200',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      bank: 'Third Item',
      balance: 'RM 200',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      bank: 'Four Item',
      balance: 'RM 200',
    },
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      bank: 'First Item',
      balance: 'RM 200',
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      bank: 'Second Item',
      balance: 'RM 200',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      bank: 'Third Item',
      balance: 'RM 200',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      bank: 'Four Item',
      balance: 'RM 250',
    },
  ];

  type ItemProps = {id: string; bank: string; balance: string};

  const Item = ({id, bank, balance}: ItemProps) => (
    <TouchableOpacity
      style={bankCss.listContainer}
      onPress={() => {
        console.log(id);
        navigation.navigate(BankDetail as never);
      }}>
      <Text style={bankCss.bank}>{bank}</Text>
      <Text style={bankCss.balance}>{balance}</Text>
    </TouchableOpacity>
  );

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
              navigation.dispatch(DrawerActions.openDrawer());
            }}>
            <Ionicons name="menu" size={30} color={'#000'} />
          </TouchableOpacity>
          <View style={css.HeaderView}>
            <Text style={css.PageName}>Bank</Text>
          </View>
        </View>
        <TouchableOpacity
          style={bankCss.addButton}
          onPress={() => setModalVisible(!modalVisible)}>
          <Ionicons
            name="add-circle-outline"
            size={40}
            color={'#000'}
            style={bankCss.addIcon}
          />
        </TouchableOpacity>

        {/**Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}>
          <View style={bankCss.ModalContainer}>
            <View style={bankCss.ModalView}>
              <TouchableOpacity
                style={bankCss.ButtonClose}
                onPress={() => setModalVisible(!modalVisible)}>
                <Ionicons name="close" size={30} color={'#999999'} />
              </TouchableOpacity>
              <Text style={bankCss.ModalTitle}>Add Bank</Text>
              <Text style={bankCss.label}>Bank Name</Text>
              <SelectList
                setSelected={(text: string) => setSelectedType(text)}
                data={selectType}
                save="value"
                boxStyles={bankCss.Input}
                inputStyles={{color: '#000'}}
                dropdownStyles={bankCss.Input}
                dropdownTextStyles={{color: '#000'}}
                search={false}
                placeholder={'Select the Bank'}
                maxHeight={100}
              />

              <Text style={bankCss.label}>Initial Balance</Text>
              <TextInput
                mode="outlined"
                style={bankCss.Input}
                placeholder="Please Enter Initial Balance"
                theme={theme}
                onChangeText={text => setTotal(text)}
              />
              {TotalError !== '' && (
                <HelperText type="error" style={bankCss.InputError}>
                  {TotalError}
                </HelperText>
              )}

              <TouchableOpacity style={bankCss.SaveButton}>
                <Text style={bankCss.SaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <FlatList
          data={DATA}
          renderItem={({item}) => (
            <Item id={item.id} bank={item.bank} balance={item.balance} />
          )}
          keyExtractor={item => item.id}
          scrollEnabled={true}
        />
      </KeyboardAvoidingView>
    </MainContainer>
  );
};

export default Bank;
